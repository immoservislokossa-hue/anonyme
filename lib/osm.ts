// Recherche de centres de santé et de pharmacies avec OpenStreetMap : gratuite, sans clé ni carte bancaire.
// Overpass cherche les lieux autour d'un point, Nominatim transforme un nom de lieu en point.
// Ces services publics sont tenus par des bénévoles : on limite les appels, on met les réponses en cache,
// et on s'identifie avec un User-Agent, comme le demandent leurs règles d'usage.

import { distanceKm, type Centre, type Origin, type PlaceKind } from "@/lib/places";

const OVERPASS_ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE_ENDPOINT = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "Alviosa/0.1 (service d'information en santé, prototype)";
const RADIUS_METERS = 15_000;
const MAX_RESULTS = 10;
const TIMEOUT_MS = 12_000;
const CACHE_TTL_MS = 10 * 60_000;
const CACHE_MAX_ENTRIES = 300;

type Cached<T> = { value: T; expiresAt: number };
const overpassCache = new Map<string, Cached<unknown>>();
const geocodeCache = new Map<string, Cached<Origin | null>>();
const reverseCache = new Map<string, Cached<string | null>>();

export function clearOsmCache(): void {
  overpassCache.clear();
  geocodeCache.clear();
  reverseCache.clear();
}

function remember<T>(cache: Map<string, Cached<T>>, key: string, value: T, now: number): void {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { value, expiresAt: now + CACHE_TTL_MS });
}

// Requête Overpass : seuls des nombres validés et des filtres fixes entrent dans le texte.
export function buildOverpassQuery(origin: Origin, kind: PlaceKind, radius: number = RADIUS_METERS): string {
  const around = `(around:${Math.round(radius)},${origin.lat},${origin.lng})`;
  const filters =
    kind === "pharmacie"
      ? [`["amenity"="pharmacy"]`]
      : [`["amenity"~"^(hospital|clinic|doctors|health_post)$"]`, `["healthcare"~"^(hospital|clinic|centre|doctor)$"]`];
  const body = filters.map((filter) => `nwr${filter}${around};`).join("");
  return `[out:json][timeout:15];(${body});out center 80;`;
}

type OsmElement = {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

function addressOf(tags: Record<string, string>): string {
  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  const place = tags["addr:suburb"] ?? tags["addr:neighbourhood"];
  const city = tags["addr:city"] ?? tags["addr:town"] ?? tags["addr:village"];
  return [street, place, city].filter(Boolean).join(", ");
}

export function parseOverpass(json: unknown, origin: Origin, kind: PlaceKind): Centre[] {
  const elements = (json as { elements?: OsmElement[] } | null)?.elements;
  if (!Array.isArray(elements)) return [];

  const fallbackName = kind === "pharmacie" ? "Pharmacie (sans nom sur la carte)" : "Centre de santé (sans nom sur la carte)";
  const seen = new Set<string>();
  const centres: Centre[] = [];

  for (const element of elements) {
    const lat = element.lat ?? element.center?.lat;
    const lng = element.lon ?? element.center?.lon;
    if (!element.type || element.id === undefined || typeof lat !== "number" || typeof lng !== "number") continue;

    const id = `${element.type}/${element.id}`;
    if (seen.has(id)) continue;
    seen.add(id);

    const tags = element.tags ?? {};
    centres.push({
      id,
      nom: tags.name ?? tags["name:fr"] ?? fallbackName,
      adresse: addressOf(tags),
      lat,
      lng,
      telephone: tags.phone ?? tags["contact:phone"] ?? null,
      mapsUrl: `https://www.openstreetmap.org/${id}`,
      itineraireUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      distanceKm: Math.round(distanceKm(origin, { lat, lng }) * 10) / 10,
      source: "osm",
    });
  }

  centres.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  return centres.slice(0, MAX_RESULTS);
}

async function timedFetch(fetchImpl: typeof fetch, url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetchImpl(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Transforme un nom de lieu en point. Renvoie null si Nominatim ne trouve rien.
export async function geocode(query: string, fetchImpl: typeof fetch = fetch, now: number = Date.now()): Promise<Origin | null> {
  const key = query.toLowerCase();
  const hit = geocodeCache.get(key);
  if (hit && hit.expiresAt > now) return hit.value;

  const params = new URLSearchParams({ q: query, format: "json", limit: "1", "accept-language": "fr" });
  const response = await timedFetch(fetchImpl, `${NOMINATIM_ENDPOINT}?${params}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Nominatim a répondu ${response.status}`);

  const results = (await response.json()) as { lat?: string; lon?: string }[];
  const lat = Number(results[0]?.lat);
  const lng = Number(results[0]?.lon);
  const origin = Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;

  remember(geocodeCache, key, origin, now);
  return origin;
}

// Nom lisible d'un point : « quartier, ville ». Sert à interroger un service qui ne cherche que par nom de lieu.
export function labelFromAddress(address: Record<string, string> | undefined): string | null {
  if (!address) return null;
  const local = address.suburb ?? address.neighbourhood ?? address.quarter ?? address.city_district;
  const town = address.city ?? address.town ?? address.village ?? address.municipality ?? address.county;
  const label = [local, town].filter(Boolean).join(", ");
  return label || null;
}

export async function reverseGeocode(
  origin: Origin,
  fetchImpl: typeof fetch = fetch,
  now: number = Date.now(),
): Promise<string | null> {
  const key = `${origin.lat.toFixed(3)},${origin.lng.toFixed(3)}`;
  const hit = reverseCache.get(key);
  if (hit && hit.expiresAt > now) return hit.value;

  const params = new URLSearchParams({
    lat: String(origin.lat),
    lon: String(origin.lng),
    format: "jsonv2",
    zoom: "14",
    "accept-language": "fr",
  });
  const response = await timedFetch(fetchImpl, `${NOMINATIM_REVERSE_ENDPOINT}?${params}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Nominatim a répondu ${response.status}`);

  const data = (await response.json()) as { address?: Record<string, string> };
  const label = labelFromAddress(data.address);

  remember(reverseCache, key, label, now);
  return label;
}

async function queryOverpass(query: string, fetchImpl: typeof fetch): Promise<unknown> {
  let lastError: unknown = new Error("Overpass indisponible");

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await timedFetch(fetchImpl, endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!response.ok) throw new Error(`Overpass a répondu ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function searchOsm(
  input: { origin?: Origin; query?: string; kind?: PlaceKind },
  options: { fetchImpl?: typeof fetch; now?: number } = {},
): Promise<Centre[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? Date.now();
  const kind: PlaceKind = input.kind ?? "centre";

  const origin = input.origin ?? (input.query ? await geocode(input.query, fetchImpl, now) : null);
  if (!origin) return [];

  // Les positions proches (environ 100 m) partagent la même réponse, pour ménager le service public.
  const key = `${kind}:${origin.lat.toFixed(3)},${origin.lng.toFixed(3)}`;
  let json: unknown;
  const hit = overpassCache.get(key);
  if (hit && hit.expiresAt > now) {
    json = hit.value;
  } else {
    json = await queryOverpass(buildOverpassQuery(origin, kind), fetchImpl);
    remember(overpassCache, key, json, now);
  }

  return parseOverpass(json, origin, kind);
}

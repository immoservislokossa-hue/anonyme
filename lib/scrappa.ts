// Recherche de lieux Google Maps via Scrappa (https://scrappa.co), une API tierce qui ne demande pas de carte bancaire
// pour son offre gratuite : 500 crédits par mois, 1 crédit par recherche.
// Seule la recherche par mots est documentée (paramètre « query »). La recherche autour d'une position n'est pas
// utilisée tant que le nom du paramètre de position n'est pas confirmé : elle passe par OpenStreetMap.

import { textQueryFor, type Centre, type PlaceKind } from "@/lib/places";

const ENDPOINT = "https://scrappa.co/api/maps/simple-search";
const TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 24 * 60 * 60_000;
const CACHE_MAX_ENTRIES = 300;
export const DEFAULT_MONTHLY_BUDGET = 400; // marge de sécurité sous les 500 crédits gratuits

// La clé se lit sous le nom standard SCRAPPA_API_KEY, ou sous un nom de la forme SCRAPPA_M…S_API_KEY
// (par exemple SCRAPPA_MAPS_API_KEY). Aucune autre variable n'est lue.
export function scrappaApiKey(env: Record<string, string | undefined>): string | undefined {
  if (env.SCRAPPA_API_KEY) return env.SCRAPPA_API_KEY;
  const name = Object.keys(env).find((key) => /^SCRAPPA_M.*S_API_KEY$/.test(key) && env[key]);
  return name ? env[name] : undefined;
}

type Cached = { centres: Centre[]; expiresAt: number };
const cache = new Map<string, Cached>();
const spent = { month: "", credits: 0 };

export function resetScrappaState(): void {
  cache.clear();
  spent.month = "";
  spent.credits = 0;
}

function monthKey(now: number): string {
  return new Date(now).toISOString().slice(0, 7);
}

// Réserve un crédit si le budget du mois le permet. Le compteur est en mémoire : il est indicatif sur un hébergement
// sans état partagé, et repart à zéro au redémarrage.
export function reserveCredit(budget: number, now: number = Date.now()): boolean {
  const month = monthKey(now);
  if (spent.month !== month) {
    spent.month = month;
    spent.credits = 0;
  }
  if (spent.credits >= budget) return false;
  spent.credits += 1;
  return true;
}

// Deux formes de réponse apparaissent dans la documentation de Scrappa (« items » avec latitude/longitude, ou
// « results » avec coordinates). Les deux sont acceptées, en attendant de vérifier la réponse réelle.
type RawItem = {
  name?: string;
  latitude?: number;
  longitude?: number;
  coordinates?: { lat?: number; lng?: number };
  place_id?: string;
  business_id?: string;
  full_address?: string;
  address?: string;
  phone_numbers?: string[];
  phone?: string;
};

export function parseScrappa(json: unknown): Centre[] {
  const root = json as { items?: RawItem[]; results?: RawItem[] } | null;
  const items = root?.items ?? root?.results;
  if (!Array.isArray(items)) return [];

  const centres: Centre[] = [];
  for (const item of items) {
    const id = item.place_id ?? item.business_id;
    const lat = item.latitude ?? item.coordinates?.lat;
    const lng = item.longitude ?? item.coordinates?.lng;
    if (!id || !item.name || typeof lat !== "number" || typeof lng !== "number") continue;

    centres.push({
      id,
      nom: item.name,
      adresse: item.full_address ?? item.address ?? "",
      lat,
      lng,
      telephone: item.phone_numbers?.[0] ?? item.phone ?? null,
      mapsUrl: item.place_id
        ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(item.place_id)}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      itineraireUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      distanceKm: null,
      source: "scrappa",
    });
  }
  return centres;
}

export class ScrappaBudgetError extends Error {
  constructor() {
    super("Budget Scrappa du mois atteint");
  }
}

export async function searchScrappa(
  input: { query: string; kind?: PlaceKind },
  options: { apiKey: string; budget?: number; fetchImpl?: typeof fetch; now?: number },
): Promise<Centre[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? Date.now();
  const text = textQueryFor(input.kind, input.query);
  const key = text.toLowerCase();

  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) return hit.centres;

  if (!reserveCredit(options.budget ?? DEFAULT_MONTHLY_BUDGET, now)) throw new ScrappaBudgetError();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(`${ENDPOINT}?${new URLSearchParams({ query: text })}`, {
      headers: { "x-api-key": options.apiKey, Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Scrappa a répondu ${response.status}`);

    const centres = parseScrappa(await response.json());

    if (cache.size >= CACHE_MAX_ENTRIES) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(key, { centres, expiresAt: now + CACHE_TTL_MS });
    return centres;
  } finally {
    clearTimeout(timer);
  }
}

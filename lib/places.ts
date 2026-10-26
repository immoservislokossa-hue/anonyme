// Recherche de centres de santé avec Google Places (API « New », Text Search).
// La clé reste sur le serveur. La position n'est ni enregistrée ni journalisée.

export type Origin = { lat: number; lng: number };

// Ce que l'on cherche : un centre de santé ou une pharmacie.
export type PlaceKind = "centre" | "pharmacie";

export function isPlaceKind(value: unknown): value is PlaceKind {
  return value === "centre" || value === "pharmacie";
}

export type Centre = {
  id: string;
  nom: string;
  adresse: string;
  lat: number;
  lng: number;
  telephone: string | null;
  mapsUrl: string;
  itineraireUrl: string;
  distanceKm: number | null;
  source: "google" | "scrappa";
};

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.nationalPhoneNumber",
  "places.googleMapsUri",
].join(",");
const SEARCH_RADIUS_METERS = 15_000;
const MAX_RESULTS = 10;
const TIMEOUT_MS = 10_000;

export function isValidOrigin(lat: unknown, lng: unknown): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

// Nettoie le texte saisi : pas de caractères de contrôle, longueur limitée.
export function cleanQuery(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

// Distance à vol d'oiseau, en kilomètres (formule de haversine).
export function distanceKm(a: Origin, b: Origin): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Texte de recherche en français, commun à tous les fournisseurs fondés sur une recherche par mots.
export function textQueryFor(kind: PlaceKind | undefined, query?: string): string {
  const subject = kind === "pharmacie" ? "pharmacie" : "centre de santé";
  return query ? `${subject} ${query}` : subject;
}

export function buildSearchBody(input: { origin?: Origin; query?: string; kind?: PlaceKind }) {
  const body: Record<string, unknown> = {
    textQuery: textQueryFor(input.kind, input.query),
    languageCode: "fr",
    maxResultCount: MAX_RESULTS,
  };

  if (input.origin) {
    body.locationBias = {
      circle: {
        center: { latitude: input.origin.lat, longitude: input.origin.lng },
        radius: SEARCH_RADIUS_METERS,
      },
    };
  }

  return body;
}

type RawPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  nationalPhoneNumber?: string;
  googleMapsUri?: string;
};

export function parsePlaces(json: unknown, origin?: Origin): Centre[] {
  const places = (json as { places?: RawPlace[] } | null)?.places;
  if (!Array.isArray(places)) return [];

  const centres: Centre[] = [];
  for (const place of places) {
    const lat = place.location?.latitude;
    const lng = place.location?.longitude;
    const nom = place.displayName?.text;
    if (!place.id || !nom || typeof lat !== "number" || typeof lng !== "number") continue;

    centres.push({
      id: place.id,
      nom,
      adresse: place.formattedAddress ?? "",
      lat,
      lng,
      telephone: place.nationalPhoneNumber ?? null,
      mapsUrl: place.googleMapsUri ?? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      itineraireUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      distanceKm: origin ? Math.round(distanceKm(origin, { lat, lng }) * 10) / 10 : null,
      source: "google",
    });
  }

  if (origin) centres.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  return centres;
}

export async function searchCentres(
  input: { origin?: Origin; query?: string; kind?: PlaceKind },
  options: { apiKey: string; fetchImpl?: typeof fetch },
): Promise<Centre[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": options.apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(buildSearchBody(input)),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Google Places a répondu ${response.status}`);
    return parsePlaces(await response.json(), input.origin);
  } finally {
    clearTimeout(timer);
  }
}

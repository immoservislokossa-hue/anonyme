import { reverseGeocode, searchOsm } from "@/lib/osm";
import { distanceKm, searchCentres, withCountry, type Centre, type Origin, type PlaceKind } from "@/lib/places";
import { DEFAULT_MONTHLY_BUDGET, searchScrappa } from "@/lib/scrappa";

// Choix des sources de lieux, dans l'ordre d'essai. OpenStreetMap est toujours disponible en dernier recours :
// il ne demande ni clé ni carte bancaire.

export type PlacesProvider = "google" | "scrappa" | "osm";
type Env = Record<string, string | undefined>;
export type SearchInput = { origin?: Origin; query?: string; kind?: PlaceKind };

const MAX_RESULTS = 10;

export function planProviders(env: Env): PlacesProvider[] {
  const forced = env.PLACES_PROVIDER;
  if (forced === "osm") return ["osm"];
  if (forced === "google" && env.GOOGLE_MAPS_API_KEY) return ["google", "osm"];
  if (forced === "scrappa" && env.SCRAPPA_API_KEY) return ["scrappa", "osm"];

  const plan: PlacesProvider[] = [];
  if (env.GOOGLE_MAPS_API_KEY) plan.push("google");
  if (env.SCRAPPA_API_KEY) plan.push("scrappa");
  plan.push("osm");
  return plan;
}

type ScrappaDeps = {
  reverse: (origin: Origin) => Promise<string | null>;
  search: (input: { query: string; kind?: PlaceKind }, apiKey: string, budget: number) => Promise<Centre[]>;
};

const realScrappaDeps: ScrappaDeps = {
  reverse: (origin) => reverseGeocode(origin),
  search: (input, apiKey, budget) => searchScrappa(input, { apiKey, budget }),
};

// Scrappa cherche par nom de lieu. Pour une position, on la transforme d'abord en « quartier, ville »,
// puis on classe les résultats par distance avec leurs coordonnées.
export async function searchScrappaPlaces(
  input: SearchInput,
  env: Env,
  deps: ScrappaDeps = realScrappaDeps,
): Promise<Centre[]> {
  const budget = Number(env.SCRAPPA_MONTHLY_BUDGET) || DEFAULT_MONTHLY_BUDGET;
  let place = input.query ?? "";

  if (input.origin) {
    const label = await deps.reverse(input.origin);
    if (!label) return [];
    place = label;
  }
  if (!place) return [];

  const centres = await deps.search(
    { query: withCountry(place, env.PLACES_COUNTRY), kind: input.kind },
    env.SCRAPPA_API_KEY as string,
    budget,
  );

  const origin = input.origin;
  if (!origin) return centres;

  return centres
    .map((centre) => ({ ...centre, distanceKm: Math.round(distanceKm(origin, centre) * 10) / 10 }))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, MAX_RESULTS);
}

export type Searchers = Record<PlacesProvider, (input: SearchInput, env: Env) => Promise<Centre[]>>;

export const realSearchers: Searchers = {
  google: (input, env) => searchCentres(input, { apiKey: env.GOOGLE_MAPS_API_KEY as string }),
  scrappa: (input, env) => searchScrappaPlaces(input, env),
  osm: (input, env) =>
    searchOsm({ ...input, query: input.query ? withCountry(input.query, env.PLACES_COUNTRY) : undefined }),
};

export type SearchOutcome = { source: PlacesProvider; centres: Centre[] };

// Essaie chaque source dans l'ordre. Une erreur ou une réponse vide passe à la suivante.
// Ne lève une erreur que si toutes les sources ont échoué.
export async function searchWithFallback(
  input: SearchInput,
  env: Env = process.env,
  searchers: Searchers = realSearchers,
): Promise<SearchOutcome> {
  const plan = planProviders(env);
  let answered: SearchOutcome | null = null;
  let lastError: unknown = new Error("Aucune source de lieux disponible");

  for (const provider of plan) {
    try {
      const centres = await searchers[provider](input, env);
      if (centres.length > 0) return { source: provider, centres };
      answered = { source: provider, centres: [] };
    } catch (error) {
      lastError = error;
    }
  }

  if (answered) return answered;
  throw lastError;
}

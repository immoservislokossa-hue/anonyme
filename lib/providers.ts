import { searchOsm } from "@/lib/osm";
import { searchCentres, type Centre, type Origin, type PlaceKind } from "@/lib/places";
import { DEFAULT_MONTHLY_BUDGET, searchScrappa } from "@/lib/scrappa";

// Choix des sources de lieux, dans l'ordre d'essai. OpenStreetMap est toujours disponible en dernier recours :
// il ne demande ni clé ni carte bancaire.

export type PlacesProvider = "google" | "scrappa" | "osm";
type Env = Record<string, string | undefined>;
export type SearchInput = { origin?: Origin; query?: string; kind?: PlaceKind };

export function planProviders(env: Env, hasOrigin: boolean): PlacesProvider[] {
  const forced = env.PLACES_PROVIDER;
  if (forced === "osm") return ["osm"];
  if (forced === "google" && env.GOOGLE_MAPS_API_KEY) return ["google", "osm"];
  if (forced === "scrappa" && env.SCRAPPA_API_KEY && !hasOrigin) return ["scrappa", "osm"];

  const plan: PlacesProvider[] = [];
  if (env.GOOGLE_MAPS_API_KEY) plan.push("google");
  // Scrappa : seule la recherche par mots est utilisée (voir lib/scrappa.ts).
  if (env.SCRAPPA_API_KEY && !hasOrigin) plan.push("scrappa");
  plan.push("osm");
  return plan;
}

export type Searchers = Record<PlacesProvider, (input: SearchInput, env: Env) => Promise<Centre[]>>;

export const realSearchers: Searchers = {
  google: (input, env) => searchCentres(input, { apiKey: env.GOOGLE_MAPS_API_KEY as string }),
  scrappa: (input, env) =>
    searchScrappa(
      { query: input.query ?? "", kind: input.kind },
      { apiKey: env.SCRAPPA_API_KEY as string, budget: Number(env.SCRAPPA_MONTHLY_BUDGET) || DEFAULT_MONTHLY_BUDGET },
    ),
  osm: (input) => searchOsm(input),
};

export type SearchOutcome = { source: PlacesProvider; centres: Centre[] };

// Essaie chaque source dans l'ordre. Une erreur ou une réponse vide passe à la suivante.
// Ne lève une erreur que si toutes les sources ont échoué.
export async function searchWithFallback(
  input: SearchInput,
  env: Env = process.env,
  searchers: Searchers = realSearchers,
): Promise<SearchOutcome> {
  const plan = planProviders(env, input.origin !== undefined);
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

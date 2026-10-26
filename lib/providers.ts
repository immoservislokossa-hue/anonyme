import { distanceKm, searchCentres, type Centre, type Origin, type PlaceKind } from "@/lib/places";
import { DEFAULT_MONTHLY_BUDGET, scrappaApiKey, searchScrappa } from "@/lib/scrappa";

// Choix des sources de lieux, dans l'ordre d'essai : Google (clé officielle) s'il est configuré, puis Scrappa.
// Sans clé, il n'y a aucune source : la page renvoie alors vers les centres partenaires.

export type PlacesProvider = "google" | "scrappa";
type Env = Record<string, string | undefined>;
export type SearchInput = { origin?: Origin; query?: string; kind?: PlaceKind };

// En dessous de ce nombre de résultats, on cherche plus large et on complète avec la source suivante.
export const MIN_RESULTS = 5;
const MAX_RESULTS = 10;
const SAME_PLACE_KM = 0.5;

export function planProviders(env: Env): PlacesProvider[] {
  const forced = env.PLACES_PROVIDER;
  if (forced === "google") return env.GOOGLE_MAPS_API_KEY ? ["google"] : [];
  if (forced === "scrappa") return scrappaApiKey(env) ? ["scrappa"] : [];

  const plan: PlacesProvider[] = [];
  if (env.GOOGLE_MAPS_API_KEY) plan.push("google");
  if (scrappaApiKey(env)) plan.push("scrappa");
  return plan;
}

// Nom réduit à l'essentiel pour reconnaître le même lieu dans deux sources.
function essentialName(name: string): string {
  const ignored = new Set(["centre", "sante", "cs", "csc", "de", "du", "des", "la", "le", "les", "d", "l", "et"]);
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word && !ignored.has(word))
    .join(" ");
}

// Ajoute les lieux de « extra » absents de « primary » : même identifiant, ou même nom à moins de 500 m.
export function mergeCentres(primary: Centre[], extra: Centre[]): Centre[] {
  const merged = [...primary];
  for (const candidate of extra) {
    const name = essentialName(candidate.nom);
    const duplicate = merged.some(
      (known) =>
        known.id === candidate.id || (essentialName(known.nom) === name && distanceKm(known, candidate) < SAME_PLACE_KM),
    );
    if (!duplicate) merged.push(candidate);
  }
  return merged;
}

// Trie par distance quand elle est connue, puis limite le nombre de résultats.
function finalize(centres: Centre[], sortByDistance: boolean): Centre[] {
  const list = sortByDistance
    ? [...centres].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    : centres;
  return list.slice(0, MAX_RESULTS);
}

type ScrappaDeps = {
  search: (input: { query: string; kind?: PlaceKind }, apiKey: string, budget: number) => Promise<Centre[]>;
};

const realScrappaDeps: ScrappaDeps = {
  search: (input, apiKey, budget) => searchScrappa(input, { apiKey, budget }),
};

// « près de » demande à Google une liste de lieux autour d'un endroit, au lieu des lieux dont le nom contient ce mot.
const near = (place: string) => `près de ${place}`;

// Coordonnées écrites telles que Google Maps les comprend dans une recherche (5 décimales, environ 1 m).
export function coordinatesText(origin: Origin): string {
  return `${origin.lat.toFixed(5)},${origin.lng.toFixed(5)}`;
}

// Scrappa cherche par texte. Avec une position, on lui envoie les coordonnées exactes : aucun nom de quartier
// n'est deviné, donc aucune erreur de nom ne peut déplacer la recherche. Les résultats sont classés par distance.
// Avec un nom de lieu saisi, s'il y a peu de résultats, une seconde recherche élargit à la ville (1 crédit de plus).
export async function searchScrappaPlaces(
  input: SearchInput,
  env: Env,
  deps: ScrappaDeps = realScrappaDeps,
): Promise<Centre[]> {
  const budget = Number(env.SCRAPPA_MONTHLY_BUDGET) || DEFAULT_MONTHLY_BUDGET;
  const apiKey = scrappaApiKey(env) as string;
  const origin = input.origin;

  if (origin) {
    const centres = await deps.search({ query: near(coordinatesText(origin)), kind: input.kind }, apiKey, budget);
    return finalize(
      centres.map((centre) => ({ ...centre, distanceKm: Math.round(distanceKm(origin, centre) * 10) / 10 })),
      true,
    );
  }

  const place = input.query ?? "";
  if (!place) return [];

  let centres = await deps.search({ query: near(place), kind: input.kind }, apiKey, budget);

  if (centres.length < MIN_RESULTS && place.includes(",")) {
    const city = place.split(",").slice(1).join(",").trim();
    if (city) {
      try {
        centres = mergeCentres(centres, await deps.search({ query: near(city), kind: input.kind }, apiKey, budget));
      } catch {
        // Budget épuisé ou service occupé : on garde les premiers résultats.
      }
    }
  }

  return centres.slice(0, MAX_RESULTS);
}

export type Searchers = Record<PlacesProvider, (input: SearchInput, env: Env) => Promise<Centre[]>>;

export const realSearchers: Searchers = {
  google: (input, env) => searchCentres(input, { apiKey: env.GOOGLE_MAPS_API_KEY as string }),
  scrappa: (input, env) => searchScrappaPlaces(input, env),
};

export type SearchOutcome = { source: PlacesProvider; centres: Centre[] };

// Essaie chaque source dans l'ordre. Une erreur ou une réponse vide passe à la suivante, et une source qui donne
// peu de résultats est complétée par la suivante, sans doublons.
// Ne lève une erreur que si toutes les sources ont échoué, ou s'il n'y en a aucune.
export async function searchWithFallback(
  input: SearchInput,
  env: Env = process.env,
  searchers: Searchers = realSearchers,
): Promise<SearchOutcome> {
  const plan = planProviders(env);
  let gathered: Centre[] = [];
  let firstSource: PlacesProvider | null = null;
  let lastAnswered: PlacesProvider | null = null;
  let lastError: unknown = new Error("Aucune source de lieux configurée");

  for (const provider of plan) {
    try {
      const centres = await searchers[provider](input, env);
      lastAnswered = provider;
      if (centres.length > 0) {
        gathered = mergeCentres(gathered, centres);
        firstSource ??= provider;
      }
      if (gathered.length >= MIN_RESULTS) break;
    } catch (error) {
      lastError = error;
    }
  }

  if (gathered.length > 0 && firstSource) {
    return { source: firstSource, centres: finalize(gathered, input.origin !== undefined) };
  }
  if (lastAnswered) return { source: lastAnswered, centres: [] };
  throw lastError;
}

import assert from "node:assert/strict";
import { test } from "node:test";
import type { Centre } from "../lib/places";
import {
  mergeCentres,
  MIN_RESULTS,
  MAX_DISTANCE_KM,
  planProviders,
  searchScrappaPlaces,
  searchWithFallback,
  type Searchers,
} from "../lib/providers";

const centre = (id: string, source: Centre["source"], extra: Partial<Centre> = {}): Centre => ({
  id, nom: id, adresse: "", lat: 0, lng: 0, telephone: null, mapsUrl: "", itineraireUrl: "", distanceKm: null, source, ...extra,
});

const many = (prefix: string, source: Centre["source"], count: number): Centre[] =>
  Array.from({ length: count }, (_, i) => centre(`${prefix}${i}`, source, { lat: 6.37 + i * 0.01, lng: 2.39 }));

const both = { GOOGLE_MAPS_API_KEY: "g", SCRAPPA_API_KEY: "s" };

test("sans clé, il n'y a aucune source de lieux", () => {
  assert.deepEqual(planProviders({}), []);
});

test("Scrappa est utilisé pour une position comme pour un nom de lieu", () => {
  assert.deepEqual(planProviders({ SCRAPPA_API_KEY: "k" }), ["scrappa"]);
});

test("une clé nommée SCRAPPA_MAPS_API_KEY active aussi Scrappa", () => {
  assert.deepEqual(planProviders({ SCRAPPA_MAPS_API_KEY: "k" }), ["scrappa"]);
});

test("Google passe avant Scrappa quand les deux clés existent", () => {
  assert.deepEqual(planProviders(both), ["google", "scrappa"]);
});

test("PLACES_PROVIDER force une source, et seulement si sa clé existe", () => {
  assert.deepEqual(planProviders({ ...both, PLACES_PROVIDER: "scrappa" }), ["scrappa"]);
  assert.deepEqual(planProviders({ SCRAPPA_API_KEY: "s", PLACES_PROVIDER: "google" }), []);
});

function searchers(overrides: Partial<Searchers>): Searchers {
  const empty = async () => [] as Centre[];
  return { google: empty, scrappa: empty, ...overrides };
}

test("une erreur de la première source passe à la suivante", async () => {
  const outcome = await searchWithFallback(
    { query: "Parakou" },
    both,
    searchers({
      google: async () => { throw new Error("403"); },
      scrappa: async () => [centre("s1", "scrappa")],
    }),
  );
  assert.equal(outcome.source, "scrappa");
  assert.equal(outcome.centres[0].id, "s1");
});

test("une réponse vide de la première source passe aussi à la suivante", async () => {
  const outcome = await searchWithFallback(
    { query: "Parakou" },
    both,
    searchers({ scrappa: async () => [centre("s1", "scrappa")] }),
  );
  assert.equal(outcome.source, "scrappa");
});

test("une source qui donne assez de résultats n'appelle pas la suivante", async () => {
  let scrappaCalled = false;
  const outcome = await searchWithFallback(
    { query: "Parakou" },
    both,
    searchers({
      google: async () => many("g", "google", MIN_RESULTS),
      scrappa: async () => { scrappaCalled = true; return []; },
    }),
  );
  assert.equal(outcome.source, "google");
  assert.equal(scrappaCalled, false);
});

test("une source qui donne peu de résultats est complétée par la suivante, sans doublons", async () => {
  const outcome = await searchWithFallback(
    { query: "Parakou" },
    both,
    searchers({
      google: async () => [centre("a", "google", { nom: "Centre de santé de Gbegamey", lat: 6.364, lng: 2.41 })],
      scrappa: async () => [
        centre("doublon", "scrappa", { nom: "CS Gbegamey", lat: 6.3641, lng: 2.4101 }),
        centre("autre", "scrappa", { nom: "Dispensaire du Port", lat: 6.35, lng: 2.43 }),
      ],
    }),
  );
  assert.equal(outcome.source, "google");
  const ids = outcome.centres.map((c) => c.id);
  assert.ok(ids.includes("a") && ids.includes("autre"));
  assert.equal(outcome.centres.filter((c) => c.nom.toLowerCase().includes("gbegamey")).length, 1);
});

test("la fusion ignore le même identifiant et le même nom à moins de 500 m, mais garde un lieu lointain du même nom", () => {
  const a = centre("1", "google", { nom: "Pharmacie de la Paix", lat: 6.37, lng: 2.39 });
  const memeId = centre("1", "scrappa", { nom: "Autre nom", lat: 6.5, lng: 2.5 });
  const meme = centre("2", "scrappa", { nom: "Pharmacie Paix", lat: 6.3701, lng: 2.3901 });
  const loin = centre("3", "scrappa", { nom: "Pharmacie de la Paix", lat: 9.33, lng: 2.63 });
  assert.deepEqual(mergeCentres([a], [memeId, meme, loin]).map((c) => c.id), ["1", "3"]);
});

test("sans source, ou si toutes échouent, l'erreur est remontée ; si toutes sont vides, on renvoie une liste vide", async () => {
  await assert.rejects(() => searchWithFallback({ query: "x" }, {}, searchers({})));
  await assert.rejects(() =>
    searchWithFallback({ query: "x" }, { SCRAPPA_API_KEY: "s" }, searchers({ scrappa: async () => { throw new Error("hors ligne"); } })),
  );
  const empty = await searchWithFallback({ query: "x" }, { SCRAPPA_API_KEY: "s" }, searchers({}));
  assert.deepEqual(empty, { source: "scrappa", centres: [] });
});

test("avec une position, le résultat final est trié du plus proche au plus loin", async () => {
  const outcome = await searchWithFallback(
    { origin: { lat: 6.37, lng: 2.39 } },
    { SCRAPPA_API_KEY: "s" },
    searchers({
      scrappa: async () => [
        centre("loin", "scrappa", { nom: "Loin", lat: 6.5, lng: 2.5, distanceKm: 18 }),
        centre("pres", "scrappa", { nom: "Près", lat: 6.371, lng: 2.391, distanceKm: 0.2 }),
      ],
    }),
  );
  assert.deepEqual(outcome.centres.map((c) => c.id), ["pres", "loin"]);
});

const cotonou = { lat: 6.3703, lng: 2.3912 };
const place = (id: string, lat: number, lng: number): Centre => ({ ...centre(id, "scrappa", { nom: id }), lat, lng });
const benin = { country: "Bénin", city: "Cotonou" };

test("une position cherche « près de » la ville du visiteur, et classe par la distance réelle", async () => {
  const queries: string[] = [];
  const found = await searchScrappaPlaces(
    { origin: cotonou, kind: "pharmacie", hint: benin },
    { SCRAPPA_API_KEY: "k" },
    {
      search: async (input) => {
        queries.push(input.query);
        return [place("loin", 6.5, 2.5), place("pres", 6.371, 2.392)];
      },
    },
  );
  assert.deepEqual(queries, ["près de Cotonou, Bénin"]);
  assert.deepEqual(found.map((c) => c.id), ["pres", "loin"]);
  assert.ok((found[0].distanceKm ?? 99) < 1);
});

test("les résultats à plus de 100 km sont écartés (centres d'un autre pays)", async () => {
  const found = await searchScrappaPlaces(
    { origin: cotonou, hint: benin },
    { SCRAPPA_API_KEY: "k" },
    {
      search: async () => [
        place("perpignan", 42.69, 2.9),
        place("saint-denis", 48.93, 2.36),
        place("pres", 6.371, 2.392),
      ],
    },
  );
  assert.deepEqual(found.map((c) => c.id), ["pres"]);
  assert.ok(MAX_DISTANCE_KM <= 100);
});

test("avec le pays seul, la recherche est ancrée sur le pays", async () => {
  const queries: string[] = [];
  await searchScrappaPlaces(
    { origin: cotonou, hint: { country: "Bénin" } },
    { SCRAPPA_API_KEY: "k" },
    { search: async (input) => { queries.push(input.query); return []; } },
  );
  assert.deepEqual(queries, ["près de Bénin"]);
});

test("avec une position mais sans repère géographique, aucune recherche à l'aveugle et aucun crédit dépensé", async () => {
  let called = false;
  const found = await searchScrappaPlaces(
    { origin: cotonou },
    { SCRAPPA_API_KEY: "k" },
    { search: async () => { called = true; return []; } },
  );
  assert.deepEqual(found, []);
  assert.equal(called, false);
});

test("un nom de lieu saisi reçoit le pays, puis la recherche s'élargit à la ville s'il y a peu de résultats", async () => {
  const queries: string[] = [];
  const found = await searchScrappaPlaces(
    { query: "Cadjehoun, Cotonou", kind: "centre", hint: { country: "Bénin" } },
    { SCRAPPA_API_KEY: "k" },
    {
      search: async (input) => {
        queries.push(input.query);
        return input.query === "près de Cadjehoun, Cotonou, Bénin"
          ? [place("a", 6.371, 2.392)]
          : [place("b", 6.5, 2.5), place("a", 6.371, 2.392)];
      },
    },
  );
  assert.deepEqual(queries, ["près de Cadjehoun, Cotonou, Bénin", "près de Cotonou, Bénin"]);
  assert.deepEqual(found.map((c) => c.id), ["a", "b"]);
  assert.equal(found[0].distanceKm, null);
});

test("avec assez de résultats, la recherche élargie n'est pas lancée", async () => {
  let calls = 0;
  await searchScrappaPlaces(
    { query: "Cadjehoun, Cotonou" },
    { SCRAPPA_API_KEY: "k" },
    { search: async () => { calls += 1; return many("p", "scrappa", MIN_RESULTS + 2); } },
  );
  assert.equal(calls, 1);
});

test("si la recherche élargie échoue, les premiers résultats sont conservés", async () => {
  let calls = 0;
  const found = await searchScrappaPlaces(
    { query: "Cadjehoun, Cotonou" },
    { SCRAPPA_API_KEY: "k" },
    {
      search: async () => {
        calls += 1;
        if (calls === 2) throw new Error("budget");
        return [place("a", 6.371, 2.392)];
      },
    },
  );
  assert.deepEqual(found.map((c) => c.id), ["a"]);
});

test("sans position ni nom de lieu, aucun crédit n'est dépensé", async () => {
  let called = false;
  const found = await searchScrappaPlaces({}, { SCRAPPA_API_KEY: "k" }, { search: async () => { called = true; return []; } });
  assert.deepEqual(found, []);
  assert.equal(called, false);
});

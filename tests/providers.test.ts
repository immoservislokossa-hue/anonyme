import assert from "node:assert/strict";
import { test } from "node:test";
import type { Centre } from "../lib/places";
import { planProviders, searchWithFallback, type Searchers } from "../lib/providers";

const centre = (id: string, source: Centre["source"]): Centre => ({
  id, nom: id, adresse: "", lat: 0, lng: 0, telephone: null, mapsUrl: "", itineraireUrl: "", distanceKm: null, source,
});

test("sans clé, seul OpenStreetMap est utilisé", () => {
  assert.deepEqual(planProviders({}, true), ["osm"]);
  assert.deepEqual(planProviders({}, false), ["osm"]);
});

test("Scrappa n'est utilisé que pour une recherche par nom de lieu", () => {
  const env = { SCRAPPA_API_KEY: "k" };
  assert.deepEqual(planProviders(env, false), ["scrappa", "osm"]);
  assert.deepEqual(planProviders(env, true), ["osm"]);
});

test("Google passe avant Scrappa quand les deux clés existent", () => {
  assert.deepEqual(planProviders({ GOOGLE_MAPS_API_KEY: "g", SCRAPPA_API_KEY: "s" }, false), ["google", "scrappa", "osm"]);
  assert.deepEqual(planProviders({ GOOGLE_MAPS_API_KEY: "g", SCRAPPA_API_KEY: "s" }, true), ["google", "osm"]);
});

test("PLACES_PROVIDER=osm ignore les clés", () => {
  assert.deepEqual(planProviders({ PLACES_PROVIDER: "osm", GOOGLE_MAPS_API_KEY: "g" }, false), ["osm"]);
});

function searchers(overrides: Partial<Searchers>): Searchers {
  const empty = async () => [] as Centre[];
  return { google: empty, scrappa: empty, osm: empty, ...overrides };
}

test("une erreur de Scrappa passe à OpenStreetMap", async () => {
  const outcome = await searchWithFallback(
    { query: "Parakou" },
    { SCRAPPA_API_KEY: "k" },
    searchers({
      scrappa: async () => { throw new Error("503"); },
      osm: async () => [centre("osm1", "osm")],
    }),
  );
  assert.equal(outcome.source, "osm");
  assert.equal(outcome.centres[0].id, "osm1");
});

test("une réponse vide de Scrappa passe aussi à OpenStreetMap", async () => {
  const outcome = await searchWithFallback(
    { query: "Parakou" },
    { SCRAPPA_API_KEY: "k" },
    searchers({ osm: async () => [centre("osm1", "osm")] }),
  );
  assert.equal(outcome.source, "osm");
});

test("la première source qui répond est conservée", async () => {
  let osmCalled = false;
  const outcome = await searchWithFallback(
    { query: "Parakou" },
    { SCRAPPA_API_KEY: "k" },
    searchers({
      scrappa: async () => [centre("s1", "scrappa")],
      osm: async () => { osmCalled = true; return []; },
    }),
  );
  assert.equal(outcome.source, "scrappa");
  assert.equal(osmCalled, false);
});

test("si tout échoue, l'erreur est remontée ; si tout est vide, on renvoie une liste vide", async () => {
  await assert.rejects(() =>
    searchWithFallback({ query: "x" }, {}, searchers({ osm: async () => { throw new Error("hors ligne"); } })),
  );
  const empty = await searchWithFallback({ query: "x" }, {}, searchers({}));
  assert.deepEqual(empty, { source: "osm", centres: [] });
});

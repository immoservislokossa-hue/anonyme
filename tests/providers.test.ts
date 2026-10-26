import assert from "node:assert/strict";
import { test } from "node:test";
import type { Centre } from "../lib/places";
import { planProviders, searchScrappaPlaces, searchWithFallback, type Searchers } from "../lib/providers";

const centre = (id: string, source: Centre["source"]): Centre => ({
  id, nom: id, adresse: "", lat: 0, lng: 0, telephone: null, mapsUrl: "", itineraireUrl: "", distanceKm: null, source,
});

test("sans clé, seul OpenStreetMap est utilisé", () => {
  assert.deepEqual(planProviders({}), ["osm"]);
});

test("Scrappa passe avant OpenStreetMap, pour une position comme pour un nom de lieu", () => {
  assert.deepEqual(planProviders({ SCRAPPA_API_KEY: "k" }), ["scrappa", "osm"]);
});

test("Google passe avant Scrappa quand les deux clés existent", () => {
  assert.deepEqual(planProviders({ GOOGLE_MAPS_API_KEY: "g", SCRAPPA_API_KEY: "s" }), ["google", "scrappa", "osm"]);
});

test("PLACES_PROVIDER=osm ignore les clés", () => {
  assert.deepEqual(planProviders({ PLACES_PROVIDER: "osm", GOOGLE_MAPS_API_KEY: "g" }), ["osm"]);
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

const cotonou = { lat: 6.3703, lng: 2.3912 };
const place = (id: string, lat: number, lng: number): Centre => ({ ...centre(id, "scrappa"), lat, lng });

test("une position est transformée en nom de quartier, avec le pays, puis les résultats sont classés par distance", async () => {
  let asked = "";
  const found = await searchScrappaPlaces(
    { origin: cotonou, kind: "pharmacie" },
    { SCRAPPA_API_KEY: "k", PLACES_COUNTRY: "Bénin" },
    {
      reverse: async () => "Cadjehoun, Cotonou",
      search: async (input) => {
        asked = input.query;
        return [place("loin", 6.5, 2.5), place("pres", 6.371, 2.392)];
      },
    },
  );
  assert.equal(asked, "Cadjehoun, Cotonou, Bénin");
  assert.deepEqual(found.map((c) => c.id), ["pres", "loin"]);
  assert.ok((found[0].distanceKm ?? 99) < 1);
});

test("une position sans nom de lieu connu ne dépense aucun crédit Scrappa", async () => {
  let called = false;
  const found = await searchScrappaPlaces(
    { origin: cotonou },
    { SCRAPPA_API_KEY: "k" },
    { reverse: async () => null, search: async () => { called = true; return []; } },
  );
  assert.deepEqual(found, []);
  assert.equal(called, false);
});

test("une recherche par nom garde les résultats tels quels, sans distance", async () => {
  const found = await searchScrappaPlaces(
    { query: "Parakou", kind: "centre" },
    { SCRAPPA_API_KEY: "k" },
    { reverse: async () => null, search: async () => [place("a", 9.33, 2.63)] },
  );
  assert.equal(found[0].distanceKm, null);
});

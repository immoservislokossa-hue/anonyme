import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSearchBody, cleanQuery, distanceKm, isPlaceKind, isValidOrigin, parsePlaces, searchCentres } from "../lib/places";

const origin = { lat: 6.3703, lng: 2.3912 }; // Cotonou

test("une position doit être un couple de nombres dans les bornes", () => {
  assert.equal(isValidOrigin(6.37, 2.39), true);
  assert.equal(isValidOrigin(91, 2), false);
  assert.equal(isValidOrigin(6, 181), false);
  assert.equal(isValidOrigin("6", 2), false);
  assert.equal(isValidOrigin(Number.NaN, 2), false);
});

test("le texte saisi est nettoyé et limité", () => {
  assert.equal(cleanQuery("  Cotonou \n  Cadjehoun "), "Cotonou Cadjehoun");
  assert.equal(cleanQuery("a".repeat(200)).length, 80);
  assert.equal(cleanQuery(42), "");
});

test("la distance à vol d'oiseau est cohérente", () => {
  assert.equal(distanceKm(origin, origin), 0);
  // Environ 111 km par degré de latitude.
  const d = distanceKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 });
  assert.ok(d > 110 && d < 112, String(d));
});

test("la requête biaise la recherche autour de la position", () => {
  const body = buildSearchBody({ origin }) as { textQuery: string; locationBias: { circle: { radius: number } } };
  assert.equal(body.textQuery, "centre de santé");
  assert.equal(body.locationBias.circle.radius, 15000);

  const byName = buildSearchBody({ query: "Parakou" }) as { textQuery: string; locationBias?: unknown };
  assert.equal(byName.textQuery, "centre de santé Parakou");
  assert.equal(byName.locationBias, undefined);
});

test("les résultats sont triés par distance et les lieux incomplets ignorés", () => {
  const json = {
    places: [
      { id: "loin", displayName: { text: "Centre loin" }, location: { latitude: 6.5, longitude: 2.5 } },
      { id: "pres", displayName: { text: "Centre près" }, formattedAddress: "Rue 1", location: { latitude: 6.371, longitude: 2.392 }, nationalPhoneNumber: "01 02 03" },
      { id: "sans-position", displayName: { text: "Incomplet" } },
    ],
  };
  const centres = parsePlaces(json, origin);
  assert.deepEqual(centres.map((c) => c.id), ["pres", "loin"]);
  assert.equal(centres[0].telephone, "01 02 03");
  assert.ok(centres[0].itineraireUrl.includes("destination=6.371,2.392"));
  assert.ok((centres[0].distanceKm ?? 99) < 1);
});

test("la requête Google envoie la clé et le masque de champs", async () => {
  let captured: { url: string; init: RequestInit } | undefined;
  const fakeFetch = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(JSON.stringify({ places: [] }), { status: 200 });
  }) as unknown as typeof fetch;

  const centres = await searchCentres({ origin }, { apiKey: "cle", fetchImpl: fakeFetch });
  assert.deepEqual(centres, []);
  assert.equal(captured?.url, "https://places.googleapis.com/v1/places:searchText");
  const headers = captured?.init.headers as Record<string, string>;
  assert.equal(headers["X-Goog-Api-Key"], "cle");
  assert.ok(headers["X-Goog-FieldMask"].includes("places.displayName"));
});

test("une erreur Google est remontée sans détail", async () => {
  const failing = (async () => new Response("quota", { status: 403 })) as unknown as typeof fetch;
  await assert.rejects(() => searchCentres({ origin }, { apiKey: "k", fetchImpl: failing }));
});

test("la recherche de pharmacies change le texte de la requête", () => {
  const body = buildSearchBody({ origin, kind: "pharmacie" }) as { textQuery: string };
  assert.equal(body.textQuery, "pharmacie");
  const byName = buildSearchBody({ query: "Parakou", kind: "pharmacie" }) as { textQuery: string };
  assert.equal(byName.textQuery, "pharmacie Parakou");
});

test("le type de lieu est validé", () => {
  assert.equal(isPlaceKind("pharmacie"), true);
  assert.equal(isPlaceKind("centre"), true);
  assert.equal(isPlaceKind("hopital"), false);
});

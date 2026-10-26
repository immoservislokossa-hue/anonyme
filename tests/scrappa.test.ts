import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { parseScrappa, reserveCredit, resetScrappaState, scrappaApiKey, searchScrappa } from "../lib/scrappa";

beforeEach(() => resetScrappaState());

const sample = {
  items: [
    {
      name: "Pharmacie de la Paix",
      latitude: 9.3377,
      longitude: 2.6303,
      place_id: "ChIJabc",
      business_id: "0x1:0x2",
      full_address: "Rue 1, Parakou",
      phone_numbers: ["+229 01 02 03 04", "+229 05"],
    },
    { name: "Sans position", place_id: "x" },
    { latitude: 1, longitude: 2, place_id: "sans-nom" },
  ],
};

test("les lieux Scrappa sont convertis, les incomplets ignorés", () => {
  const centres = parseScrappa(sample);
  assert.equal(centres.length, 1);
  assert.equal(centres[0].nom, "Pharmacie de la Paix");
  assert.equal(centres[0].telephone, "+229 01 02 03 04");
  assert.equal(centres[0].source, "scrappa");
  assert.ok(centres[0].mapsUrl.includes("place_id:ChIJabc"));
  assert.ok(centres[0].itineraireUrl.includes("destination=9.3377,2.6303"));
});

test("la requête Scrappa suit le format documenté", async () => {
  let captured: { url: string; init: RequestInit } | undefined;
  const fakeFetch = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(JSON.stringify(sample), { status: 200 });
  }) as unknown as typeof fetch;

  const centres = await searchScrappa({ query: "Parakou", kind: "pharmacie" }, { apiKey: "cle", fetchImpl: fakeFetch });
  assert.equal(centres.length, 1);
  assert.ok(captured?.url.startsWith("https://scrappa.co/api/maps/simple-search?"));
  assert.ok(captured?.url.includes("query=pharmacie+Parakou"));
  const headers = captured?.init.headers as Record<string, string>;
  assert.equal(headers["x-api-key"], "cle");
});

test("une même recherche n'est facturée qu'une fois", async () => {
  let calls = 0;
  const fakeFetch = (async () => {
    calls += 1;
    return new Response(JSON.stringify(sample), { status: 200 });
  }) as unknown as typeof fetch;

  await searchScrappa({ query: "Parakou", kind: "centre" }, { apiKey: "k", fetchImpl: fakeFetch, now: 1000 });
  await searchScrappa({ query: "PARAKOU", kind: "centre" }, { apiKey: "k", fetchImpl: fakeFetch, now: 2000 });
  assert.equal(calls, 1);
});

test("le budget mensuel arrête les appels", async () => {
  assert.equal(reserveCredit(2, Date.UTC(2026, 9, 1)), true);
  assert.equal(reserveCredit(2, Date.UTC(2026, 9, 2)), true);
  assert.equal(reserveCredit(2, Date.UTC(2026, 9, 3)), false);
  // Un nouveau mois remet le compteur à zéro.
  assert.equal(reserveCredit(2, Date.UTC(2026, 10, 1)), true);
});

test("une erreur du service est remontée", async () => {
  const failing = (async () => new Response("{}", { status: 503 })) as unknown as typeof fetch;
  await assert.rejects(() => searchScrappa({ query: "Parakou" }, { apiKey: "k", fetchImpl: failing }));
});

test("l'autre forme de réponse de la documentation est aussi acceptée", () => {
  const centres = parseScrappa({
    success: true,
    results: [
      { name: "Bonanza", business_id: "0x1:0x2", address: "Rue 5", phone: "+49 30 1", coordinates: { lat: 52.5, lng: 13.4 } },
    ],
  });
  assert.equal(centres.length, 1);
  assert.equal(centres[0].adresse, "Rue 5");
  assert.equal(centres[0].telephone, "+49 30 1");
  assert.equal(centres[0].lat, 52.5);
});

test("la clé se lit sous le nom standard ou sous SCRAPPA_M…S_API_KEY, et nulle part ailleurs", () => {
  assert.equal(scrappaApiKey({ SCRAPPA_API_KEY: "a" }), "a");
  assert.equal(scrappaApiKey({ SCRAPPA_MAPS_API_KEY: "b" }), "b");
  assert.equal(scrappaApiKey({ SCRAPPA_API_KEY: "a", SCRAPPA_MAPS_API_KEY: "b" }), "a");
  assert.equal(scrappaApiKey({ SCRAPPA_MONTHLY_BUDGET: "400" }), undefined);
  assert.equal(scrappaApiKey({ OTHER_API_KEY: "x", SCRAPPA_X: "y" }), undefined);
  assert.equal(scrappaApiKey({}), undefined);
});

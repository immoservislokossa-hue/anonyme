import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { buildOverpassQuery, clearOsmCache, geocode, parseOverpass, searchOsm } from "../lib/osm";

const origin = { lat: 6.3703, lng: 2.3912 }; // Cotonou

beforeEach(() => clearOsmCache());

const sampleOverpass = {
  elements: [
    { type: "node", id: 1, lat: 6.5, lon: 2.5, tags: { name: "Centre loin", amenity: "clinic" } },
    { type: "way", id: 2, center: { lat: 6.371, lon: 2.392 }, tags: { name: "Hôpital près", amenity: "hospital", phone: "+229 01 02", "addr:street": "Rue 1", "addr:city": "Cotonou" } },
    { type: "node", id: 3, lat: 6.372, lon: 2.393, tags: { amenity: "doctors" } },
    { type: "way", id: 2, center: { lat: 6.371, lon: 2.392 }, tags: { name: "Doublon" } },
    { type: "node", id: 4, tags: { name: "Sans position" } },
  ],
};

test("la requête Overpass cible les bons types de lieux autour du point", () => {
  const centre = buildOverpassQuery(origin, "centre");
  assert.ok(centre.includes("around:15000,6.3703,2.3912"));
  assert.ok(centre.includes("hospital|clinic|doctors|health_post"));
  assert.ok(centre.startsWith("[out:json]"));

  const pharmacie = buildOverpassQuery(origin, "pharmacie");
  assert.ok(pharmacie.includes('"amenity"="pharmacy"'));
  assert.ok(!pharmacie.includes("hospital"));
});

test("les lieux sont triés par distance, dédoublonnés, et les lieux sans position ignorés", () => {
  const centres = parseOverpass(sampleOverpass, origin, "centre");
  assert.deepEqual(centres.map((c) => c.id), ["way/2", "node/3", "node/1"]);
  assert.equal(centres[0].nom, "Hôpital près");
  assert.equal(centres[0].telephone, "+229 01 02");
  assert.equal(centres[0].adresse, "Rue 1, Cotonou");
  assert.equal(centres[0].source, "osm");
  assert.ok(centres[0].mapsUrl.endsWith("/way/2"));
  assert.ok(centres[0].itineraireUrl.includes("destination=6.371,2.392"));
});

test("un lieu sans nom reçoit un nom par défaut explicite", () => {
  const [sansNom] = parseOverpass({ elements: [{ type: "node", id: 3, lat: 6.372, lon: 2.393, tags: {} }] }, origin, "pharmacie");
  assert.equal(sansNom.nom, "Pharmacie (sans nom sur la carte)");
});

test("un nom de lieu est transformé en point, avec un User-Agent", async () => {
  let captured: { url: string; init: RequestInit } | undefined;
  const fakeFetch = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(JSON.stringify([{ lat: "9.3377", lon: "2.6303" }]), { status: 200 });
  }) as unknown as typeof fetch;

  const point = await geocode("Parakou", fakeFetch);
  assert.deepEqual(point, { lat: 9.3377, lng: 2.6303 });
  assert.ok(captured?.url.startsWith("https://nominatim.openstreetmap.org/search?"));
  const headers = captured?.init.headers as Record<string, string>;
  assert.ok(headers["User-Agent"].startsWith("Alviosa"));
});

test("un lieu introuvable renvoie null", async () => {
  const empty = (async () => new Response("[]", { status: 200 })) as unknown as typeof fetch;
  assert.equal(await geocode("xyzzy", empty), null);
});

test("si le premier serveur Overpass échoue, le second est essayé", async () => {
  const urls: string[] = [];
  const fakeFetch = (async (url: string) => {
    urls.push(url);
    if (urls.length === 1) return new Response("surchargé", { status: 429 });
    return new Response(JSON.stringify(sampleOverpass), { status: 200 });
  }) as unknown as typeof fetch;

  const centres = await searchOsm({ origin, kind: "centre" }, { fetchImpl: fakeFetch });
  assert.equal(urls.length, 2);
  assert.notEqual(urls[0], urls[1]);
  assert.equal(centres[0].id, "way/2");
});

test("deux recherches proches partagent la même réponse mise en cache", async () => {
  let calls = 0;
  const fakeFetch = (async () => {
    calls += 1;
    return new Response(JSON.stringify(sampleOverpass), { status: 200 });
  }) as unknown as typeof fetch;

  await searchOsm({ origin, kind: "centre" }, { fetchImpl: fakeFetch, now: 1000 });
  await searchOsm({ origin: { lat: 6.37031, lng: 2.39121 }, kind: "centre" }, { fetchImpl: fakeFetch, now: 2000 });
  assert.equal(calls, 1);

  // Un autre type de lieu n'utilise pas la même réponse.
  await searchOsm({ origin, kind: "pharmacie" }, { fetchImpl: fakeFetch, now: 3000 });
  assert.equal(calls, 2);
});

test("la recherche par nom de lieu passe par le géocodage", async () => {
  const calls: string[] = [];
  const fakeFetch = (async (url: string) => {
    calls.push(url);
    if (url.includes("nominatim")) return new Response(JSON.stringify([{ lat: "6.37", lon: "2.39" }]), { status: 200 });
    return new Response(JSON.stringify(sampleOverpass), { status: 200 });
  }) as unknown as typeof fetch;

  const centres = await searchOsm({ query: "Cotonou", kind: "centre" }, { fetchImpl: fakeFetch });
  assert.ok(calls[0].includes("nominatim"));
  assert.ok(centres.length > 0);
});

test("un lieu introuvable ne déclenche aucune requête Overpass", async () => {
  let overpassCalls = 0;
  const fakeFetch = (async (url: string) => {
    if (url.includes("nominatim")) return new Response("[]", { status: 200 });
    overpassCalls += 1;
    return new Response("{}", { status: 200 });
  }) as unknown as typeof fetch;

  assert.deepEqual(await searchOsm({ query: "xyzzy" }, { fetchImpl: fakeFetch }), []);
  assert.equal(overpassCalls, 0);
});

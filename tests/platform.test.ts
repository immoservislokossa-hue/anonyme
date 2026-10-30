import assert from "node:assert/strict";
import { test } from "node:test";
import { accessFor, accessFromSession, sessionValue } from "../lib/auth";
import { ESPACES, NAV, brandHref, espaceOf } from "../lib/espaces";
import { PAYS, getPays, isZone, missingFor } from "../lib/pays";
import { createStore } from "../lib/store";

test("les pages se rangent dans le bon espace", () => {
  assert.equal(espaceOf("/"), "jeunes");
  assert.equal(espaceOf("/outils/choisir"), "jeunes");
  assert.equal(espaceOf("/prestataires/consultation"), "prestataires");
  assert.equal(espaceOf("/pro"), "prestataires");
  assert.equal(espaceOf("/pilotage/services"), "pilotage");
  assert.equal(espaceOf("/partenaires"), "pilotage");
  assert.equal(espaceOf("/all"), "plateforme");
});

test("chaque espace a un menu et un logo qui mène à son accueil", () => {
  for (const id of ["jeunes", "prestataires", "pilotage", "plateforme"] as const) {
    assert.ok(NAV[id].length >= 3, id);
    assert.ok(brandHref(id).startsWith("/"));
  }
  assert.equal(ESPACES.length, 3);
});

test("la configuration par pays ne contient aucune valeur inventée", () => {
  assert.equal(PAYS.filter((p) => p.membrePO).length, 9);
  for (const pays of PAYS) {
    assert.equal(pays.numeroUrgence, null, pays.code);
    assert.equal(pays.ligneEcoute, null, pays.code);
    assert.deepEqual(pays.relectureClinique, [], pays.code);
  }
  const benin = getPays("bj");
  assert.equal(benin.zones.length, 12);
  assert.ok(isZone("Mono", benin));
  assert.ok(!isZone("Atlantide", benin));
  assert.ok(missingFor(benin).includes("Relecture clinique signée"));
  assert.ok(missingFor(getPays("tg")).includes("Découpage des zones"));
});

test("accès Pilotage : ouvert en développement sans jeton, fermé en production sans jeton", () => {
  assert.equal(accessFor(undefined, { NODE_ENV: "development" }), "ok");
  assert.equal(accessFor(undefined, { NODE_ENV: "production" }), "missing-config");
  assert.equal(accessFor("x", { PARTNER_TOKEN: "secret" }), "denied");
  assert.equal(accessFor("secret", { PARTNER_TOKEN: "secret" }), "ok");
});

test("la session Pilotage ne contient pas le jeton et n'accepte que la bonne valeur", () => {
  const env = { PARTNER_TOKEN: "secret" };
  const value = sessionValue("secret");
  assert.ok(!value.includes("secret"));
  assert.equal(accessFromSession(value, env), "ok");
  assert.equal(accessFromSession("autre", env), "denied");
  assert.equal(accessFromSession(undefined, env), "denied");
});

test("le stockage en mémoire écrit, lit et met à jour sans mélanger les tables", async () => {
  const store = createStore({});
  assert.equal(store.kind, "memory");
  const a = await store.insert("events", { kind: "question", theme: "methodes" });
  await store.insert("reviews", { serviceId: "s1" });
  assert.equal((await store.list("events")).length, 1);
  assert.equal((await store.list("reviews")).length, 1);
  const updated = await store.update("events", a.id, { theme: "effets" });
  assert.equal(updated?.theme, "effets");
  assert.equal(await store.update("events", "inconnu", {}), null);
});

test("le stockage Supabase envoie la clé en en-tête et aplatit les lignes", async () => {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fake = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify([{ id: "1", tbl: "events", data: { kind: "question" }, at: "2026-10-30T00:00:00Z" }]), { status: 200 });
  }) as unknown as typeof fetch;
  const store = createStore({ SUPABASE_URL: "https://x.supabase.co/", SUPABASE_SERVICE_ROLE_KEY: "KEY" }, fake);
  assert.equal(store.kind, "supabase");
  const rows = await store.list("events");
  assert.equal(rows[0].kind, "question");
  assert.equal(rows[0].id, "1");
  assert.ok(calls[0].url.startsWith("https://x.supabase.co/rest/v1/alviosa_rows?tbl=eq.events"));
  assert.equal((calls[0].init?.headers as Record<string, string>).apikey, "KEY");
});

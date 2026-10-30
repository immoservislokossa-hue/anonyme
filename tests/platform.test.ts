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

test("Supabase : lit au-delà de 1000 lignes, dans l'ordre, et n'envoie Bearer que pour une clé JWT", async () => {
  const all = Array.from({ length: 2300 }, (_, i) => ({ id: `r${i}`, tbl: "events", data: { n: i }, at: `2026-01-01T00:00:${String(i).padStart(5, "0")}` }));
  const seen: { url: string; headers: Record<string, string> }[] = [];
  const fake = (async (url: string, init?: { headers?: Record<string, string> }) => {
    seen.push({ url, headers: init?.headers ?? {} });
    const q = new URL(url);
    const limit = Number(q.searchParams.get("limit"));
    const offset = Number(q.searchParams.get("offset"));
    const desc = [...all].reverse().slice(offset, offset + Math.min(limit, 1000));
    return new Response(JSON.stringify(desc), { status: 200 });
  }) as unknown as typeof fetch;
  const store = createStore({ SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "sb_secret_abc" }, fake);
  const rows = await store.list("events");
  assert.equal(rows.length, 2300);
  assert.equal(rows[0].id, "r0");
  assert.equal(rows[2299].id, "r2299");
  assert.equal(seen[0].headers.Authorization, undefined);
  assert.equal(seen[0].headers.apikey, "sb_secret_abc");
  const jwt = createStore({ SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "eyJabc" }, fake);
  await jwt.list("events", 5);
  assert.equal(seen[seen.length - 1].headers.Authorization, "Bearer eyJabc");
});

test("bon de visite : demande, confirmation unique, mauvais service et expiration", async () => {
  const { findVoucher } = await import("../lib/visits");
  const now = new Date("2026-11-10T10:00:00Z");
  const events = [{ kind: "visite-demande", service: "s1", code: "AB234", besoin: "choisir", at: "2026-11-05T10:00:00Z" }];
  assert.deepEqual(findVoucher(events, "s1", "ab234", now), { status: "ok", besoin: "choisir" });
  assert.equal(findVoucher(events, "s2", "AB234", now).status, "inconnu");
  assert.equal(findVoucher(events, "s1", "ZZZZZ", now).status, "inconnu");
  assert.equal(findVoucher([...events, { kind: "visite-venue", service: "s1", code: "AB234", at: "2026-11-06T10:00:00Z" }], "s1", "AB234", now).status, "deja");
  assert.equal(findVoucher(events, "s1", "AB234", new Date("2026-12-20T10:00:00Z")).status, "inconnu");
});

test("comptes : connexion, rôle pilotage donné seulement par app_metadata, inscription à confirmer", async () => {
  const { authenticate, accountFromToken, accountsEnabled, toAccount } = await import("../lib/account");
  const env = { SUPABASE_URL: "https://x.supabase.co/", SUPABASE_ANON_KEY: "anon" };
  assert.equal(accountsEnabled(env), true);
  assert.equal(accountsEnabled({ SUPABASE_URL: "https://x.supabase.co" }), false);
  const calls: { url: string; headers: Record<string, string> }[] = [];
  const ok = (async (url: string, init?: { headers?: Record<string, string> }) => {
    calls.push({ url, headers: init?.headers ?? {} });
    if (url.includes("/signup")) return new Response(JSON.stringify({ id: "u1", email: "a@b.co" }), { status: 200 });
    if (url.includes("/token")) return new Response(JSON.stringify({ access_token: "T", expires_in: 3600, user: { id: "u1", email: "a@b.co", app_metadata: { role: "pilotage" } } }), { status: 200 });
    return new Response(JSON.stringify({ id: "u2", email: "c@d.co", user_metadata: { role: "pilotage" } }), { status: 200 });
  }) as unknown as typeof fetch;
  const login = await authenticate("connexion", "a@b.co", "motdepasse", env, ok);
  assert.ok(login.ok && login.token === "T" && "account" in login && login.account.role === "pilotage");
  assert.ok(calls[0].url.startsWith("https://x.supabase.co/auth/v1/token"));
  assert.equal(calls[0].headers.apikey, "anon");
  const signup = await authenticate("inscription", "a@b.co", "motdepasse", env, ok);
  assert.ok(signup.ok && signup.token === null);
  assert.equal((await authenticate("connexion", "pas-un-mail", "motdepasse", env, ok)).ok, false);
  assert.equal((await authenticate("connexion", "a@b.co", "court", env, ok)).ok, false);
  // user_metadata (modifiable par la personne) ne donne jamais le rôle pilotage
  const me = await accountFromToken("T", env, ok);
  assert.equal(me?.role, "prestataire");
  assert.equal(toAccount({ id: "1", email: "x@y.z", app_metadata: { role: "admin" } })?.role, "prestataire");
  const refused = (async () => new Response("{}", { status: 400 })) as unknown as typeof fetch;
  const bad = await authenticate("connexion", "a@b.co", "motdepasse", env, refused);
  assert.ok(!bad.ok && bad.error.includes("incorrect"));
  assert.equal(await accountFromToken("T", env, (async () => new Response("{}", { status: 401 })) as unknown as typeof fetch), null);
});

test("rappel de visite : deux événements, alarmes, mode discret sans nom de service ni code", async () => {
  const { visitIcs } = await import("../lib/reminder");
  const now = new Date("2026-11-10T08:00:00Z");
  const open = visitIcs({ date: "2026-11-12", time: "09:30", serviceName: "Centre, Lokossa", code: "AB234", reviewUrl: "https://x.org/orientation/1#donner", neutral: false }, now);
  assert.equal((open.match(/BEGIN:VEVENT/g) ?? []).length, 2);
  assert.ok(open.includes("DTSTART:20261112T093000"));
  assert.ok(open.includes("DTSTART:20261113T180000"));
  assert.ok(open.includes("TRIGGER:-P1D") && open.includes("TRIGGER:-PT2H"));
  assert.ok(open.includes("Centre\\, Lokossa"));
  const quiet = visitIcs({ date: "2026-11-12", time: "09:30", serviceName: "Centre", code: "AB234", reviewUrl: "https://x.org/", neutral: true }, now);
  assert.ok(!quiet.includes("Centre") && !quiet.includes("AB234") || quiet.includes("UID:visite-AB234@alviosa"));
  assert.ok(!quiet.includes("SUMMARY:Visite") && quiet.includes("SUMMARY:Rappel santé"));
});

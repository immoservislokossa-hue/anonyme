import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MIN_REVIEWS,
  clean,
  filterServices,
  isStale,
  latestStock,
  summarizeReviews,
  validateAnswers,
  validateServiceInput,
  type Service,
} from "../lib/services";
import { hashToken, newToken } from "../lib/tokens";

const valid = {
  nom: "Centre de santé de Lokossa",
  type: "centre-sante",
  zone: "Mono",
  commune: "Lokossa",
  telephone: "+229 01 02 03 04",
  methodes: ["pilule", "implants", "inconnue"],
  accueilJeunes: true,
  gratuitJeunes: "oui",
  confidentialite: true,
};

test("une inscription valide est nettoyée : méthodes inconnues retirées, zone vérifiée", () => {
  const out = validateServiceInput(valid);
  assert.ok(out.ok);
  if (out.ok) {
    assert.deepEqual(out.value.methodes, ["pilule", "implants"]);
    assert.equal(out.value.zone, "Mono");
    assert.equal(out.value.gratuitJeunes, "oui");
  }
});

test("une inscription incomplète ou avec une zone inventée est refusée, avec des messages clairs", () => {
  const out = validateServiceInput({ ...valid, nom: "ab", zone: "Atlantide", methodes: [], telephone: "abc" });
  assert.ok(!out.ok);
  if (!out.ok) {
    for (const key of ["nom", "zone", "methodes", "telephone"]) assert.ok(out.errors[key], key);
  }
});

test("le texte saisi perd les caractères de contrôle et les chevrons", () => {
  assert.equal(clean("  <b>Centre</b>\n\tde  santé ", 50), "b Centre /b de santé");
  assert.equal(clean(42, 10), "");
  assert.equal(clean("x".repeat(500), 10).length, 10);
});

test("le jeton de gestion n'est jamais conservé en clair", () => {
  const token = newToken();
  assert.equal(token.length, 32);
  assert.notEqual(hashToken(token), token);
  assert.equal(hashToken(token), hashToken(token));
  assert.notEqual(hashToken(token), hashToken(newToken()));
});

test("les réponses d'un avis : seules les réponses oui/non sont gardées, un avis vide est refusé", () => {
  assert.equal(validateAnswers({}), null);
  assert.equal(validateAnswers({ sansJugement: "oui" }), null);
  assert.deepEqual(validateAnswers({ sansJugement: true, effets: false, intrus: true }), { sansJugement: true, effets: false });
});

test("aucun pourcentage sous le seuil d'anonymat, puis les pourcentages apparaissent", () => {
  const few = Array.from({ length: MIN_REVIEWS - 1 }, () => ({ answers: { sansJugement: true } }));
  const small = summarizeReviews(few);
  assert.equal(small.enough, false);
  assert.equal(small.indicators.sansJugement.pct, null);

  const enough = [...few, { answers: { sansJugement: false } }];
  const ok = summarizeReviews(enough);
  assert.equal(ok.enough, true);
  assert.equal(ok.indicators.sansJugement.pct, 80);
  assert.equal(ok.indicators.effets.pct, null);
});

test("un avis qui ne répond qu'à certaines questions ne fausse pas les autres", () => {
  const reviews = [
    ...Array.from({ length: 5 }, () => ({ answers: { sansJugement: true } })),
    ...Array.from({ length: 2 }, () => ({ answers: { effets: false } })),
  ];
  const s = summarizeReviews(reviews);
  assert.equal(s.indicators.sansJugement.total, 5);
  assert.equal(s.indicators.effets.total, 2);
  assert.equal(s.indicators.effets.pct, null);
});

test("seul le dernier signal de stock compte, et il devient « à confirmer » après 30 jours", () => {
  const signals = [
    { serviceId: "a", methode: "pilule", etat: "rupture", at: "2026-10-01T00:00:00Z" },
    { serviceId: "a", methode: "pilule", etat: "disponible", at: "2026-10-10T00:00:00Z" },
    { serviceId: "a", methode: "implants", etat: "rupture", at: "2026-10-12T00:00:00Z" },
  ] as const;
  const latest = latestStock([...signals]);
  assert.equal(latest.length, 2);
  assert.equal(latest.find((s) => s.methode === "pilule")?.etat, "disponible");
  const rupture = latest.find((s) => s.methode === "implants")!;
  assert.equal(isStale(rupture, new Date("2026-10-30T00:00:00Z")), false);
  assert.equal(isStale(rupture, new Date("2026-12-30T00:00:00Z")), true);
});

test("l'annuaire public ne montre que les services validés et filtre par zone et méthode", () => {
  const base = { ...valid, methodes: ["pilule"], adresse: "", horaires: "", creeLe: "", majLe: "" } as unknown as Service;
  const services: Service[] = [
    { ...base, id: "1", statut: "valide" },
    { ...base, id: "2", statut: "en-attente" },
    { ...base, id: "3", statut: "refuse" },
    { ...base, id: "4", statut: "valide", zone: "Zou", methodes: ["implants"], accueilJeunes: false },
  ];
  assert.deepEqual(filterServices(services, {}).map((s) => s.id), ["1", "4"]);
  assert.deepEqual(filterServices(services, { zone: "Mono" }).map((s) => s.id), ["1"]);
  assert.deepEqual(filterServices(services, { methode: "implants" }).map((s) => s.id), ["4"]);
  assert.deepEqual(filterServices(services, { accueilJeunes: true }).map((s) => s.id), ["1"]);
});

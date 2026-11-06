import assert from "node:assert/strict";
import { test } from "node:test";
import { MIN_CELL, demandeAcces, funnel, type Dataset } from "../lib/analytics";
import { CHOIX, choixLabel, isChoix } from "../lib/visits";

const NOW = new Date("2026-10-30T12:00:00Z");
const empty = (): Dataset => ({ demo: false, events: [], bilans: [], reviews: [], services: [], stock: [], zones: ["Mono"] });
const at = "2026-10-28T10:00:00Z";
const venue = (choix?: string) => ({ kind: "visite-venue", service: "s1", zone: "Mono", at, ...(choix ? { choix } : {}) });

test("le choix libre est facultatif, borné aux méthodes connues, et « aucune » est valable", () => {
  assert.ok(isChoix("aucune"));
  assert.ok(isChoix("implants"));
  assert.ok(isChoix("autre"));
  assert.ok(!isChoix("n'importe quoi"));
  assert.ok(!isChoix(undefined));
  assert.equal(choixLabel("aucune"), "Pas de méthode pour l'instant");
  assert.equal(choixLabel(undefined), "Non noté");
  assert.ok(CHOIX.length >= 12);
});

test("les choix notés sont masqués sous 5 et jamais détaillés par service", () => {
  const ds = empty();
  ds.events = [venue("pilule"), venue("pilule"), venue("aucune"), venue("implants")];
  const small = funnel(ds, NOW);
  assert.equal(small.choix.notes, "<5");
  assert.deepEqual(small.choix.lignes, []);

  ds.events = [...Array.from({ length: 6 }, () => venue("pilule")), ...Array.from({ length: 5 }, () => venue("aucune")), venue("implants"), venue("autre")];
  const big = funnel(ds, NOW);
  assert.equal(big.choix.notes, 13);
  assert.deepEqual(big.choix.lignes.map((l) => l.id), ["pilule", "aucune"], "une méthode sous 5 n'apparaît pas");
  assert.ok(big.choix.lignes.every((l) => l.count >= MIN_CELL));
  assert.ok(!("service" in big.choix.lignes[0]));
});

test("les visites sans choix noté ne comptent pas comme un échec", () => {
  const ds = empty();
  ds.events = Array.from({ length: 7 }, () => venue());
  const f = funnel(ds, NOW);
  assert.equal(f.visites.venues30, 7);
  assert.equal(f.choix.notes, "<5");
});

test("demande ou accès : la lecture ne s'affiche qu'avec assez d'observations", () => {
  const ds = empty();
  assert.equal(demandeAcces(ds, NOW).lecture, null);

  const demande = (n: number) => Array.from({ length: n }, () => ({ kind: "visite-demande", service: "s1", at }));
  ds.events = [...demande(10), ...Array.from({ length: 3 }, () => venue())];
  assert.match(demandeAcces(ds, NOW).lecture ?? "", /accès/i);

  ds.events = Array.from({ length: 30 }, () => ({ kind: "question", at }));
  assert.match(demandeAcces(ds, NOW).lecture ?? "", /demande/i);

  ds.events = [...demande(10), ...Array.from({ length: 9 }, () => venue())];
  assert.match(demandeAcces(ds, NOW).lecture ?? "", /avancent ensemble/);
});

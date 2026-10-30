import assert from "node:assert/strict";
import { test } from "node:test";
import { MIN_CELL, PMA_BASELINE, alerts, coverage, indicatorRows, mask, overview, quality, synthese, themeRanking, toCsv, type Dataset } from "../lib/analytics";
import { demoDataset } from "../lib/demo";

const NOW = new Date("2026-10-30T12:00:00Z");
const empty = (): Dataset => ({ demo: false, events: [], bilans: [], reviews: [], services: [], stock: [], zones: ["Mono", "Zou"] });

test("un tableau de bord vide ne casse rien et n'invente rien", () => {
  const ds = empty();
  const o = overview(ds, NOW);
  assert.equal(o.questions.semaine, "<5");
  assert.equal(o.services.valides, 0);
  assert.deepEqual(themeRanking(ds, NOW), []);
  assert.deepEqual(alerts(ds, NOW), []);
  assert.ok(synthese(ds, NOW).length >= 3);
  assert.equal(quality(ds).enough, false);
});

test("toute valeur sous le seuil est masquée", () => {
  assert.equal(mask(0), "<5");
  assert.equal(mask(MIN_CELL - 1), "<5");
  assert.equal(mask(MIN_CELL), MIN_CELL);
});

test("un thème sous le seuil n'apparaît pas dans le classement", () => {
  const ds = empty();
  ds.events = Array.from({ length: 4 }, () => ({ kind: "question", theme: "rare", at: "2026-10-29T00:00:00Z" }));
  assert.deepEqual(themeRanking(ds, NOW), []);
  ds.events.push({ kind: "question", theme: "rare", at: "2026-10-29T00:00:00Z" });
  assert.equal(themeRanking(ds, NOW)[0].theme, "rare");
});

test("la qualité du conseil exige au moins trois prestataires avant d'afficher un pourcentage", () => {
  const ds = empty();
  const checks = { accueil: 10, ecoute: 10, autresMethodes: 5, effets: 4, oubli: 5, retour: 6, confidentialite: 9, choix: 8 };
  ds.bilans = [{ zone: null, consultations: 10, checks, trainingCompleted: 0, trainingPct: null, at: "2026-10-29T00:00:00Z" }];
  assert.equal(quality(ds).enough, false);
  assert.equal(quality(ds).providerRows[2].pct, null);
  ds.bilans = [ds.bilans[0], { ...ds.bilans[0] }, { ...ds.bilans[0] }];
  const q = quality(ds);
  assert.equal(q.enough, true);
  assert.equal(q.providerRows.find((r) => r.id === "autresMethodes")?.pct, 50);
  assert.equal(q.providerRows.find((r) => r.id === "autresMethodes")?.baseline, PMA_BASELINE.autresMethodes);
});

test("la démonstration est stable, marquée comme telle et ne contient aucun nom réel", () => {
  const a = demoDataset(NOW);
  const b = demoDataset(NOW);
  assert.equal(a.demo, true);
  assert.equal(JSON.stringify(a), JSON.stringify(b));
  assert.ok(a.services.every((s) => s.nom.startsWith("Service de démonstration")));
});

test("la démonstration déclenche les alertes attendues", () => {
  const ds = demoDataset(NOW);
  const list = alerts(ds, NOW);
  const ids = list.map((a) => a.id);
  assert.ok(ids.includes("rupture-Mono-implants"), "rupture implants Mono");
  assert.ok(ids.includes("hausse-effets"), "hausse des questions sur les effets");
  assert.ok(ids.includes("sans-offre-Couffo"), "demande sans offre");
  assert.ok(ids.includes("conseil-effets"), "conseil incomplet sur les effets");
  assert.equal(list[0].niveau, "urgent", "les alertes urgentes passent en premier");
  assert.ok(!ids.some((id) => id.startsWith("rupture-Zou")), "une seule rupture ne déclenche pas d'alerte");
});

test("la couverture par zone indique les méthodes absentes et les ruptures", () => {
  const rows = coverage(demoDataset(NOW), NOW);
  const mono = rows.find((r) => r.zone === "Mono")!;
  assert.ok(mono.services > 0);
  assert.ok(mono.ruptures.some((r) => r.methode === "implants" && r.services === 2));
  const alibori = rows.find((r) => r.zone === "Alibori")!;
  assert.equal(alibori.services, 0);
  assert.deepEqual(alibori.manquantes, []);
});

test("l'export à plat est complet, sans ligne individuelle, et le CSV protège les guillemets", () => {
  const rows = indicatorRows(demoDataset(NOW), NOW);
  assert.ok(rows.length > 20);
  assert.ok(rows.every((r) => r.code.startsWith("ALV_")));
  const csv = toCsv([{ code: "ALV_X", indicateur: 'Avec "guillemets", virgule', zone: "Mono", periode: "2026-10-30", valeur: 5 }]);
  assert.ok(csv.includes('"Avec ""guillemets"", virgule"'));
  assert.ok(csv.split("\n")[0].startsWith("code,indicateur"));
});

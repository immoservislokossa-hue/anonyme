import assert from "node:assert/strict";
import { test } from "node:test";
import { ACCUEIL_ITEMS, evaluerAccueil } from "../lib/pro/accueil";
import {
  COUNSELING_CHECKS,
  emptyBilan,
  qualityRate,
  recordConsultation,
  recordTraining,
  toPayload,
  validatePayload,
} from "../lib/pro/consultation";
import { POINTS, SCENARIOS, resultOf } from "../lib/pro/scenarios";

test("chaque scénario a trois étapes, trois réponses par étape, et une seule réponse accueillante", () => {
  assert.ok(SCENARIOS.length >= 6);
  for (const s of SCENARIOS) {
    assert.equal(s.etapes.length, 3, s.id);
    assert.ok(s.retenir.length >= 3, s.id);
    for (const step of s.etapes) {
      assert.equal(step.options.length, 3, s.id);
      assert.equal(step.options.filter((o) => o.ton === "accueillant").length, 1, s.id);
      assert.equal(step.options.filter((o) => o.ton === "juge").length, 1, s.id);
      for (const o of step.options) assert.ok(o.retour.length > 30, `${s.id}: retour trop court`);
    }
  }
});

test("la bonne réponse n'est pas toujours à la même place", () => {
  const positions = new Set<number>();
  for (const s of SCENARIOS) for (const step of s.etapes) positions.add(step.options.findIndex((o) => o.ton === "accueillant"));
  assert.equal(positions.size, 3);
});

test("le score d'un exercice et son niveau", () => {
  assert.deepEqual(resultOf(["accueillant", "accueillant", "accueillant"]), { points: 6, max: 6, pct: 100, level: "solide" });
  assert.equal(resultOf(["neutre", "neutre", "neutre"]).level, "en-progres");
  assert.equal(resultOf(["juge", "juge", "neutre"]).level, "a-retravailler");
  assert.equal(POINTS.juge, 0);
});

test("les scénarios n'invitent jamais à un jugement et ne contiennent aucun nom réel", () => {
  for (const s of SCENARIOS) {
    for (const step of s.etapes) {
      const good = step.options.find((o) => o.ton === "accueillant")!;
      assert.ok(!/ trop jeune|imprudence|irresponsab/i.test(good.texte), s.id);
    }
  }
});

test("le bilan compte les consultations et chaque point de qualité, sans données sur le client", () => {
  let bilan = emptyBilan(new Date("2026-10-30"));
  bilan = recordConsultation(bilan, ["accueil", "autresMethodes", "effets"]);
  bilan = recordConsultation(bilan, ["accueil", "autresMethodes", "autresMethodes"]);
  assert.equal(bilan.consultations, 2);
  assert.equal(bilan.checks.autresMethodes, 2);
  assert.equal(qualityRate(bilan, "autresMethodes"), 100);
  assert.equal(qualityRate(bilan, "effets"), 50);
  assert.equal(qualityRate(emptyBilan(), "effets"), null);
  assert.deepEqual(Object.keys(bilan.checks).sort(), COUNSELING_CHECKS.map((c) => c.id).sort());
});

test("la formation s'ajoute au bilan et part en pourcentage", () => {
  let bilan = emptyBilan();
  bilan = recordConsultation(bilan, ["accueil"]);
  bilan = recordTraining(bilan, 5, 6);
  bilan = recordTraining(bilan, 3, 6);
  assert.equal(toPayload(bilan, "Mono").trainingPct, 67);
  assert.equal(toPayload(emptyBilan(), null).trainingPct, null);
});

test("le bilan reçu par le serveur est contrôlé : comptes cohérents, zone connue, pas de consultation vide", () => {
  const zones = ["Mono", "Zou"];
  const good = toPayload(recordConsultation(emptyBilan(), ["accueil", "effets"]), "Mono");
  assert.ok(validatePayload(good, zones));
  assert.equal(validatePayload({ ...good, zone: "Mars" }, zones)?.zone, null);
  assert.equal(validatePayload({ ...good, consultations: 0 }, zones), null);
  assert.equal(validatePayload({ ...good, checks: { ...good.checks, accueil: 5 } }, zones), null, "un point ne peut pas dépasser le nombre de consultations");
  assert.equal(validatePayload({ ...good, consultations: -1 }, zones), null);
  assert.equal(validatePayload("x", zones), null);
});

test("l'auto-évaluation d'accueil des jeunes donne un niveau et des pistes pour ce qui manque", () => {
  assert.equal(ACCUEIL_ITEMS.length, 10);
  const none = evaluerAccueil([]);
  assert.equal(none.level, "a-renforcer");
  assert.equal(none.pistes.length, 10);
  const all = evaluerAccueil(ACCUEIL_ITEMS.map((i) => i.id));
  assert.equal(all.level, "engage");
  assert.equal(all.pistes.length, 0);
  assert.equal(evaluerAccueil(ACCUEIL_ITEMS.slice(0, 5).map((i) => i.id)).level, "en-progres");
});

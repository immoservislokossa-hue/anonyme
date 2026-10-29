import assert from "node:assert/strict";
import { test } from "node:test";
import { CONDITIONS, EMPTY_ANSWERS, chooseMethods, consultationSummary, evaluateMethod, type Answers } from "../lib/tools/chooser";
import { PREGNANCY_QUESTIONS, evaluatePregnancy } from "../lib/tools/pregnancy";
import { dayOfCycle, kindOfDay, toIcs, upcomingWindows, validCycleLength } from "../lib/tools/cycle";

const woman = (patch: Partial<Answers> = {}): Answers => ({ ...EMPTY_ANSWERS, ...patch });
const status = (id: Parameters<typeof evaluateMethod>[0], answers: Answers) => evaluateMethod(id, answers).status;

// --- Guide OMS, p. 19 : problèmes de santé ---
test("hypertension : pas de pilule, mais injectables et minidosée possibles", () => {
  const a = woman({ conditions: ["hypertension"], children: "plus-tard" });
  assert.equal(status("pilule", a), "deconseille");
  assert.equal(status("injectables", a), "possible");
  assert.equal(status("pilule-minidosee", a), "possible");
});

test("saignements inhabituels : pas d'injectables, mais pilule possible", () => {
  const a = woman({ conditions: ["saignements"] });
  assert.equal(status("injectables", a), "deconseille");
  assert.equal(status("pilule", a), "possible");
});

test("accident vasculaire ou diabète ancien : seule la minidosée reste possible parmi les trois", () => {
  for (const condition of ["cardio", "diabete"] as const) {
    const a = woman({ conditions: [condition] });
    assert.equal(status("pilule", a), "deconseille", condition);
    assert.equal(status("injectables", a), "deconseille", condition);
    assert.equal(status("pilule-minidosee", a), "possible", condition);
  }
});

test("caillot, cancer du sein, maladie du foie : aucune des trois méthodes hormonales", () => {
  for (const condition of ["caillot", "cancer-sein", "foie"] as const) {
    const a = woman({ conditions: [condition] });
    for (const id of ["pilule", "injectables", "pilule-minidosee"] as const) assert.equal(status(id, a), "deconseille", `${condition} ${id}`);
    assert.equal(status("preservatif-masculin", a), "possible", condition);
  }
});

test("un problème de santé rend les méthodes non détaillées « à confirmer »", () => {
  const a = woman({ conditions: ["hypertension"] });
  assert.equal(status("implants", a), "discuter");
  assert.equal(status("sterilet", a), "discuter");
});

test("les dix problèmes de santé du guide sont tous encodés", () => {
  assert.equal(CONDITIONS.length, 10);
});

// --- Guide OMS, p. 17 : après un accouchement ---
test("allaitement : pilule combinée pas avant 6 mois, minidosée dès 6 semaines", () => {
  const young = woman({ birth: "moins-6-semaines", breastfeeding: "autre" });
  assert.equal(status("pilule", young), "attendre");
  assert.equal(status("pilule-minidosee", young), "attendre");
  const later = woman({ birth: "6-semaines-6-mois", breastfeeding: "autre" });
  assert.equal(status("pilule", later), "attendre");
  assert.equal(status("pilule-minidosee", later), "possible");
});

test("sans allaitement : pilule possible à partir de 6 semaines seulement", () => {
  assert.equal(status("pilule", woman({ birth: "moins-6-semaines", breastfeeding: "non" })), "attendre");
  assert.equal(status("pilule", woman({ birth: "6-semaines-6-mois", breastfeeding: "non" })), "possible");
  assert.equal(status("injectables", woman({ birth: "moins-6-semaines", breastfeeding: "non" })), "possible");
});

test("MAMA : seulement avec allaitement exclusif, règles absentes et bébé de moins de 6 mois", () => {
  assert.equal(status("mama", woman()), "deconseille");
  assert.equal(status("mama", woman({ birth: "6-semaines-6-mois", breastfeeding: "autre" })), "deconseille");
  assert.equal(status("mama", woman({ birth: "6-semaines-6-mois", breastfeeding: "exclusif-sans-regles" })), "possible");
});

// --- Méthodes définitives et jours fixes ---
test("méthodes définitives : déconseillées si on veut des enfants plus tard", () => {
  assert.equal(status("sterilisation-feminine", woman({ children: "plus-tard" })), "deconseille");
  assert.equal(status("sterilisation-feminine", woman({ children: "plus-du-tout" })), "possible");
  assert.equal(status("vasectomie", woman({ sex: "homme", children: "plus-tard" })), "deconseille");
  assert.equal(status("vasectomie", woman({ sex: "homme", children: "plus-du-tout" })), "possible");
});

test("jours fixes : déconseillés si les règles sont irrégulières, à confirmer si on ne sait pas", () => {
  assert.equal(status("jours-fixes", woman({ cycle: "irregulier" })), "deconseille");
  assert.equal(status("jours-fixes", woman({ cycle: "inconnu" })), "discuter");
  assert.equal(status("jours-fixes", woman({ cycle: "regulier" })), "possible");
});

test("un homme ne voit que les méthodes qui le concernent", () => {
  const ids = chooseMethods(woman({ sex: "homme" })).map((f) => f.id).sort();
  assert.deepEqual(ids, ["preservatif-masculin", "retrait", "vasectomie"]);
});

test("protection contre les IST : le préservatif passe en tête et les autres le rappellent", () => {
  const fits = chooseMethods(woman({ protectIst: true }));
  const top = fits.filter((f) => f.status === "possible")[0];
  assert.ok(top.id.startsWith("preservatif"));
  assert.ok(evaluateMethod("pilule", woman({ protectIst: true })).reasons.some((r) => r.includes("préservatif")));
});

test("les résultats mettent le possible avant le déconseillé", () => {
  const fits = chooseMethods(woman({ conditions: ["hypertension"] }));
  const firstBad = fits.findIndex((f) => f.status === "deconseille");
  const lastGood = fits.map((f) => f.status).lastIndexOf("possible");
  assert.ok(lastGood < firstBad);
});

test("le résumé pour la consultation reste factuel et contient les problèmes de santé", () => {
  const a = woman({ conditions: ["migraine"], protectIst: true });
  const text = consultationSummary(a, chooseMethods(a));
  assert.ok(text.includes("Migraines"));
  assert.ok(text.includes("IST"));
  assert.ok(!text.toLowerCase().includes("prescri"));
});

// --- Guide OMS, p. 20 : liste de contrôle de la grossesse ---
test("liste de contrôle : un seul « oui » suffit pour commencer", () => {
  assert.equal(evaluatePregnancy({ "regles-7-jours": true }, false), "peut-commencer");
});

test("liste de contrôle : six « non » veulent dire attendre les règles ou faire un test", () => {
  const all = Object.fromEntries(PREGNANCY_QUESTIONS.map((q) => [q.id, false]));
  assert.equal(evaluatePregnancy(all, false), "attendre");
});

test("liste de contrôle : des signes de grossesse l'emportent toujours", () => {
  assert.equal(evaluatePregnancy({ "regles-7-jours": true }, true), "signes");
});

test("liste de contrôle : sans réponse, rien n'est conclu", () => {
  assert.equal(evaluatePregnancy({}, false), "incomplet");
});

// --- Guide OMS, p. 14 et 26 : jours fixes ---
test("jours fixes : jours fertiles du 8e au 19e jour", () => {
  assert.equal(kindOfDay(1), "regles");
  assert.equal(kindOfDay(7), "sans-risque");
  assert.equal(kindOfDay(8), "fertile");
  assert.equal(kindOfDay(19), "fertile");
  assert.equal(kindOfDay(20), "sans-risque");
});

test("jours fixes : le cycle doit durer de 26 à 32 jours", () => {
  assert.equal(validCycleLength(25), false);
  assert.equal(validCycleLength(26), true);
  assert.equal(validCycleLength(32), true);
  assert.equal(validCycleLength(33), false);
});

test("jours fixes : dates des jours fertiles et du jour du cycle", () => {
  const start = new Date(2026, 9, 1); // 1er octobre 2026
  const [first, second] = upcomingWindows(start, 28, 2);
  assert.equal(first.fertileStart.getDate(), 8);
  assert.equal(first.fertileEnd.getDate(), 19);
  assert.equal(second.periodStart.getMonth(), 9);
  assert.equal(second.periodStart.getDate(), 29);
  assert.equal(dayOfCycle(start, 28, new Date(2026, 9, 8)), 8);
  assert.equal(dayOfCycle(start, 28, new Date(2026, 9, 29)), 1);
});

test("fichier calendrier : un événement par cycle, en toutes lettres, sans donnée personnelle", () => {
  const ics = toIcs(upcomingWindows(new Date(2026, 9, 1), 28, 3), new Date(2026, 9, 1));
  assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, 3);
  assert.ok(ics.startsWith("BEGIN:VCALENDAR"));
  assert.ok(ics.includes("DTSTART;VALUE=DATE:20261008"));
  assert.ok(ics.includes("DTEND;VALUE=DATE:20261020"));
  assert.ok(ics.includes("\r\n"));
});

import { USAGE_EVENTS, isUsageEvent } from "../lib/metrics";

test("seuls des noms d'événements connus sont comptés, jamais un texte libre", () => {
  assert.ok(USAGE_EVENTS.length >= 8);
  assert.equal(isUsageEvent("outil-risque"), true);
  assert.equal(isUsageEvent("ma question sur la pilule"), false);
  assert.equal(isUsageEvent(undefined), false);
});

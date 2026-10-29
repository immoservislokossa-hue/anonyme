import assert from "node:assert/strict";
import { test } from "node:test";
import { PLAN_METHODS, parsePlan, statusOf, stepsFor, toIcs, toIso, type Plan } from "../lib/tools/plan";
import { EVENTS, WHENS, riskActions } from "../lib/tools/risk";

const plan = (patch: Partial<Plan>): Plan => ({ method: "dmpa", start: "2026-10-01", neutral: false, time: "20:00", ...patch });
const day = (y: number, m: number, d: number) => new Date(y, m - 1, d);

// --- Injectables : guide OMS p. 6 ---
test("DMPA : une injection tous les 3 mois (13 semaines), retard toléré jusqu'à 4 semaines", () => {
  const [first] = stepsFor(plan({ method: "dmpa" }), 1);
  assert.equal(toIso(first.due), "2026-12-31");
  assert.equal(toIso(first.graceEnd!), "2027-01-28");
});

test("NET-EN : une injection tous les 2 mois (8 semaines), retard toléré jusqu'à 2 semaines", () => {
  const [first] = stepsFor(plan({ method: "net-en" }), 1);
  assert.equal(toIso(first.due), "2026-11-26");
  assert.equal(toIso(first.graceEnd!), "2026-12-10");
});

test("DMPA : à jour, bientôt, dans le délai, trop tard", () => {
  const p = plan({ method: "dmpa" }); // échéance 31 décembre 2026
  assert.equal(statusOf(p, day(2026, 11, 1)).standing, "a-jour");
  assert.equal(statusOf(p, day(2026, 12, 28)).standing, "bientot");
  assert.equal(statusOf(p, day(2027, 1, 10)).standing, "dans-le-delai");
  assert.equal(statusOf(p, day(2027, 1, 29)).standing, "trop-tard");
  assert.ok(statusOf(p, day(2027, 1, 29)).message.includes("préservatif"));
});

test("DMPA : après une injection de retard, l'étape suivante repart de la nouvelle date", () => {
  const p = plan({ method: "dmpa", start: "2027-01-10" });
  assert.equal(toIso(stepsFor(p, 1)[0].due), "2027-04-11");
});

// --- Autres méthodes ---
test("stérilet : 12 ans, rappel un peu avant la fin", () => {
  const [step] = stepsFor(plan({ method: "sterilet", start: "2026-01-15" }), 1);
  assert.equal(toIso(step.due), "2037-10-15");
});

test("implants : on demande à 3 ans combien de temps durent les siens", () => {
  const [step] = stepsFor(plan({ method: "implants", start: "2026-01-15" }), 1);
  assert.equal(toIso(step.due), "2029-01-15");
});

test("vasectomie : efficace après 3 mois, d'ici là une autre méthode", () => {
  const p = plan({ method: "vasectomie", start: "2026-10-01" });
  assert.equal(toIso(stepsFor(p, 1)[0].due), "2027-01-01");
  assert.equal(statusOf(p, day(2026, 11, 1)).standing, "efficace-bientot");
  assert.equal(statusOf(p, day(2027, 2, 1)).standing, "a-jour");
});

test("pilule : un rappel par jour et une boîte à prévoir avant d'en manquer", () => {
  const p = plan({ method: "pilule", start: "2026-10-01" });
  assert.equal(statusOf(p, day(2026, 10, 5)).standing, "quotidien");
  assert.equal(toIso(stepsFor(p, 1)[0].due), "2026-10-22");
});

// --- Calendrier ---
test("calendrier : un événement par étape avec une alerte, et un texte neutre sur demande", () => {
  const explicit = toIcs(plan({ method: "dmpa" }), day(2026, 10, 1), 3);
  assert.equal((explicit.match(/BEGIN:VEVENT/g) ?? []).length, 3);
  assert.equal((explicit.match(/BEGIN:VALARM/g) ?? []).length, 3);
  assert.ok(explicit.includes("Prochaine injection"));

  const neutral = toIcs(plan({ method: "dmpa", neutral: true }), day(2026, 10, 1), 3);
  assert.ok(neutral.includes("SUMMARY:Rappel santé"));
  assert.ok(!neutral.toLowerCase().includes("injection"));
  assert.ok(!neutral.toLowerCase().includes("contracep"));
});

test("calendrier : la pilule a un rappel quotidien à l'heure choisie", () => {
  const ics = toIcs(plan({ method: "pilule", time: "07:30" }), day(2026, 10, 1), 2);
  assert.ok(ics.includes("RRULE:FREQ=DAILY"));
  assert.ok(ics.includes("T073000"));
});

test("un plan enregistré abîmé est ignoré", () => {
  assert.equal(parsePlan(null), null);
  assert.equal(parsePlan("pas du json"), null);
  assert.equal(parsePlan(JSON.stringify({ method: "autre", start: "2026-10-01" })), null);
  assert.equal(parsePlan(JSON.stringify({ method: "dmpa", start: "demain" })), null);
  assert.equal(parsePlan(JSON.stringify({ method: "dmpa", start: "2026-10-01" }))?.neutral, false);
});

test("toutes les méthodes du plan produisent au moins une étape", () => {
  for (const m of PLAN_METHODS) assert.ok(stepsFor(plan({ method: m.id }), 2).length >= 1, m.id);
});

// --- Après un rapport à risque : guide OMS p. 16 et 18 ---
test("rapport à risque : pilule d'urgence tout de suite si moins de 5 jours, avec l'échéance", () => {
  for (const when of ["moins-24h", "1-3-jours", "3-5-jours"] as const) {
    const urgence = riskActions("preservatif", when).find((a) => a.id === "urgence");
    assert.ok(urgence, when);
    assert.ok(urgence?.deadline?.includes("5 jours"));
  }
  assert.ok(riskActions("preservatif", "plus-5-jours").some((a) => a.id === "urgence-tard"));
  assert.ok(!riskActions("preservatif", "plus-5-jours").some((a) => a.id === "urgence"));
});

test("rapport à risque : le traitement d'urgence du VIH n'est proposé que dans les 72 heures", () => {
  assert.ok(riskActions("sans-protection", "1-3-jours").some((a) => a.id === "vih"));
  assert.ok(riskActions("sans-protection", "3-5-jours").some((a) => a.id === "vih-test"));
  assert.ok(!riskActions("sans-protection", "3-5-jours").some((a) => a.id === "vih"));
});

test("rapport à risque : l'action la plus urgente vient en premier", () => {
  const actions = riskActions("preservatif", "moins-24h");
  assert.ok(["maintenant", "aujourdhui"].includes(actions[0].urgency));
  assert.equal(actions[actions.length - 1].id, "methode");
});

test("violence : on commence par dire que ce n'est pas la faute de la personne", () => {
  const actions = riskActions("force", "1-3-jours");
  assert.equal(actions[0].id, "soutien");
  assert.ok(actions.some((a) => a.id === "urgence"));
});

test("injection en retard et pilule oubliée : les règles du guide sont rappelées", () => {
  assert.ok(riskActions("injection-retard", "moins-24h").some((a) => a.text.includes("4 semaines")));
  assert.ok(riskActions("pilule-oubliee", "moins-24h").some((a) => a.text.includes("7 jours")));
});

test("les choix de l'outil sont complets", () => {
  assert.equal(EVENTS.length, 5);
  assert.equal(WHENS.length, 4);
});

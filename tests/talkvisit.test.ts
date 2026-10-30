import assert from "node:assert/strict";
import { test } from "node:test";
import { GOALS, WHOS, talkPlan } from "../lib/tools/talk";
import { REASONS, VISIT_METHODS, visitPlan, visitText } from "../lib/tools/visit";
import { isUsageEvent } from "../lib/metrics";
import { getTool } from "../lib/catalog";

test("« Je prépare ma visite » : chaque raison et chaque méthode donne des questions utiles", () => {
  for (const reason of REASONS) {
    for (const method of VISIT_METHODS) {
      const plan = visitPlan(reason.id, method.id);
      assert.equal(plan.groups[0].id, "essentiel");
      assert.ok(plan.groups.length >= 2, `${reason.id}/${method.id}`);
      for (const group of plan.groups) {
        assert.ok(group.items.length > 0);
        for (const item of group.items) assert.ok(item.question.endsWith("?") && item.why.length > 10, item.id);
      }
      assert.equal(plan.groups.some((g) => g.id === "methode"), method.id !== "aucune");
    }
  }
});

test("la visite couvre toujours les autres méthodes, les effets, la confidentialité et la date de retour", () => {
  const text = visitText("premiere", "aucune").toLowerCase();
  for (const word of ["quelles méthodes", "quels effets", "confidentiel", "revenir"]) assert.ok(text.includes(word), word);
});

test("après un bébé, la visite rappelle d'attendre au moins 2 ans", () => {
  assert.ok(visitText("apres-bebe", "aucune").includes("Combien de temps attendre"));
  assert.ok(visitPlan("apres-bebe", "aucune").groups[1].items.some((i) => i.why.includes("2 ans")));
});

test("« Parler à quelqu'un » : chaque personne et chaque but donne des phrases, des réponses et des conseils", () => {
  for (const who of WHOS) {
    for (const goal of GOALS) {
      const plan = talkPlan(who.id, goal.id);
      assert.ok(plan.openers.length >= 2, `${who.id}/${goal.id}`);
      assert.ok(plan.objections.length >= 2 && plan.tips.length >= 3, who.id);
    }
  }
});

test("les conseils orientent vers l'aide en cas de peur, sans pousser à parler", () => {
  for (const who of ["partenaire", "parent"] as const) {
    assert.ok(talkPlan(who, "proteger").tips.some((t) => t.includes("Violence et aide")), who);
  }
});

test("la rumeur « ça rend stérile » reçoit la réponse du guide OMS", () => {
  const sterile = talkPlan("partenaire", "methode").objections.find((o) => o.dit.includes("stérile"));
  assert.ok(sterile?.reponds.includes("stérilisation et la vasectomie"));
});

test("les nouveaux outils et avis sont des événements autorisés", () => {
  for (const event of ["outil-visite", "outil-parler", "avis-oui", "avis-non"]) assert.ok(isUsageEvent(event), event);
  assert.ok(getTool("visite") && getTool("parler"));
});

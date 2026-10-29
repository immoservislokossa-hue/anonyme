import assert from "node:assert/strict";
import { test } from "node:test";
import { localReply } from "@/lib/localReply";

test("Afi sans connexion garde les règles de sécurité", () => {
  assert.equal(localReply("je veux me suicider").kind, "crisis");
  assert.equal(localReply("j'ai été violée").kind, "urgent");
});

test("Afi sans connexion répond avec la fiche la plus proche", () => {
  const out = localReply("comment marche la pilule ?");
  assert.equal(out.kind, "fallback");
  assert.ok(out.sources.length > 0);
  assert.ok(out.reply.includes("professionnel de santé"));
});

test("Afi sans connexion : question sans lien, réponse honnête", () => {
  const out = localReply("zzzz qqqq");
  assert.equal(out.sources.length, 0);
  assert.ok(out.reply.includes("Je n'ai pas trouvé"));
});

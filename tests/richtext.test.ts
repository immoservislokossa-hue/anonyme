import assert from "node:assert/strict";
import { test } from "node:test";
import { retrieve } from "../lib/retrieve";
import { extractChoices, parseBlocks, parseInline, toPlain } from "../lib/richtext";

test("le gras, les listes et les paragraphes sont reconnus", () => {
  const blocks = parseBlocks("Bonjour.\n\n**Ce que c'est**\n- une pilule\n- à prendre chaque jour\n\n1. Un\n2. Deux");
  assert.deepEqual(blocks.map((b) => b.kind), ["p", "p", "ul", "ol"]);
  const list = blocks[2];
  assert.ok(list.kind === "ul" && list.items.length === 2);
  assert.deepEqual(parseInline("a **b** c"), [
    { text: "a ", bold: false },
    { text: "b", bold: true },
    { text: " c", bold: false },
  ]);
});

test("les astérisques isolés et les titres # ne s'affichent pas", () => {
  assert.equal(toPlain("## Titre\n\n* un\n* deux"), "Titre un. deux");
  assert.ok(!toPlain("**gras** et *reste*").includes("*"));
});

test("du HTML venant du modèle reste du texte, jamais du code", () => {
  const blocks = parseBlocks("<script>alert(1)</script>");
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].kind, "p");
});

test("la ligne « Choix : » devient des boutons et disparaît du texte", () => {
  const { text, choices } = extractChoices("Une seule question.\n\nChoix : Éviter une grossesse | En avoir plus tard | Me protéger des IST");
  assert.equal(text, "Une seule question.");
  assert.deepEqual(choices, ["Éviter une grossesse", "En avoir plus tard", "Me protéger des IST"]);
  assert.deepEqual(extractChoices("Pas de choix ici.").choices, []);
});

test("« quelle méthode choisir ? » reçoit la vue d'ensemble, pas des méthodes au hasard", () => {
  for (const question of ["Quelle méthode de contraception choisir ?", "quelle contraception me conseillez-vous", "Laquelle choisir ?"]) {
    const ids = retrieve(question, 3, "sexuelle").map((e) => e.id);
    assert.deepEqual(ids, ["comparaison-methodes", "choisir-methode"], question);
  }
});

test("la contraception d'urgence ne sort que si la personne en parle", () => {
  assert.ok(!retrieve("quels effets secondaires", 5, "sexuelle").some((e) => e.id === "contraception-urgence"));
  assert.equal(retrieve("la pilule d'urgence", 1, "sexuelle")[0]?.id, "contraception-urgence");
  assert.equal(retrieve("le préservatif a craqué", 3, "sexuelle").some((e) => e.id === "contraception-urgence"), true);
});

test("les consignes demandent un français très facile, avec des mots simples pour les termes médicaux", async () => {
  const { systemPromptFor } = await import("../lib/prompt");
  for (const voie of [undefined, "sexuelle", "mentale", "bien-etre"] as const) {
    const prompt = systemPromptFor(voie);
    assert.match(prompt, /enfant de 11 ans/);
    assert.match(prompt, /12 mots au maximum/);
    assert.match(prompt, /ovulation/);
  }
});

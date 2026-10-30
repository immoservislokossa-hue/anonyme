import assert from "node:assert/strict";
import { test } from "node:test";
import { retrieve, tokenize } from "../lib/retrieve";

test("la recherche ignore les accents et la casse", () => {
  assert.deepEqual(tokenize("Stérilité, CONSULTATION"), ["sterilite", "consultation"]);
});

test("une question sur les effets retrouve l'entrée correspondante", () => {
  const results = retrieve("quels sont les effets secondaires ?");
  assert.equal(results[0]?.id, "effets-secondaires-courants");
});

test("une question sans rapport ne renvoie rien", () => {
  assert.deepEqual(retrieve("xyzzy plugh"), []);
});

test("les contenus de santé mentale et de bien-être ne sont plus dans la base", () => {
  assert.ok(!retrieve("comment mieux dormir", 3).some((e) => e.id === "sommeil"));
  assert.ok(!retrieve("stress anxiété", 3).some((e) => ["stress-anxiete", "respiration"].includes(e.id)));
});

test("une question sur les infections retrouve la voie santé sexuelle", () => {
  const results = retrieve("comment savoir si j'ai une infection sexuellement transmissible");
  assert.equal(results[0]?.theme, "ist");
});

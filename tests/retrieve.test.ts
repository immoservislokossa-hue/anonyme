import assert from "node:assert/strict";
import { test } from "node:test";
import { retrieve, tokenize } from "../lib/retrieve";
import { findStructures, structures } from "../lib/structures";

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

test("les structures se filtrent par commune", () => {
  assert.equal(findStructures("").length, structures.length);
  assert.equal(findStructures("commune a").length, 1);
  assert.equal(findStructures("introuvable").length, 0);
});

test("aucune structure n'est présentée comme vérifiée sans date", () => {
  for (const structure of structures) {
    if (structure.verifie) assert.ok(structure.dateVerification, structure.id);
  }
});

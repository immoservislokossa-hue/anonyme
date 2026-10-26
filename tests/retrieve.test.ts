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

test("une voie ne renvoie que ses entrées et les entrées communes", () => {
  const sleep = retrieve("comment mieux dormir", 5, "bien-etre");
  assert.equal(sleep[0]?.id, "sommeil");

  const otherVoie = retrieve("stress anxiété", 5, "sexuelle");
  for (const entry of otherVoie) {
    assert.ok(entry.voie === "sexuelle" || entry.voie === "commun", entry.id);
  }
});

test("une question sur les infections retrouve la voie santé sexuelle", () => {
  const results = retrieve("comment savoir si j'ai une infection sexuellement transmissible");
  assert.equal(results[0]?.theme, "ist");
});

test("la voie santé mentale retrouve les contenus sur la tristesse", () => {
  const results = retrieve("je me sens triste depuis des semaines", 3, "mentale");
  assert.equal(results[0]?.id, "tristesse-persistante");
});

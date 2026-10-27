import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFormat } from "../lib/format";
import { checkStory, readingTime, speakerInfo, stories } from "../lib/stories";

test("chaque histoire est cohérente dans les trois formats", () => {
  assert.ok(stories.length >= 4);
  for (const story of stories) {
    assert.deepEqual(checkStory(story), [], story.id);
  }
});

test("les identifiants d'histoires sont uniques", () => {
  assert.equal(new Set(stories.map((s) => s.id)).size, stories.length);
});

test("les personnages ont leur prénom et leur rôle", () => {
  assert.deepEqual(speakerInfo("afi"), { name: "Afi", role: "la grande sœur" });
  assert.deepEqual(speakerInfo("fallone"), { name: "Fallone", role: "l'amie" });
  assert.deepEqual(speakerInfo("chimene"), { name: "Chimène", role: "la sœur" });
});

test("un parcours cassé est détecté", () => {
  const broken = structuredClone(stories[0]);
  broken.jeu.nodes[broken.jeu.start].choices = [{ label: "x", next: "absent" }];
  assert.ok(checkStory(broken).some((p) => p.includes("absent")));
});

test("la durée de lecture est bornée", () => {
  assert.ok(readingTime("Oui") >= 1400);
  assert.equal(readingTime("a".repeat(1000)), 9000);
});

test("un format enregistré invalide est ignoré", () => {
  assert.equal(parseFormat("jeu"), "jeu");
  assert.equal(parseFormat("autre"), null);
  assert.equal(parseFormat(null), null);
});

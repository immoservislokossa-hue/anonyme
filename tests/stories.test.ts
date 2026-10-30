import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFormat } from "../lib/format";
import { checkStory, nextEpisode, readingTime, speakerInfo, stageScenes, stories } from "../lib/stories";

test("chaque histoire est cohérente dans les trois formats", () => {
  assert.ok(stories.length >= 6);
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

test("la série a des épisodes numérotés 1, 2, 3… sans trou", () => {
  assert.deepEqual(
    stories.map((s) => s.episode),
    stories.map((_, i) => i + 1),
  );
  assert.equal(nextEpisode(stories[0])?.id, stories[1].id);
  assert.equal(nextEpisode(stories[stories.length - 1]), undefined);
});

test("chaque épisode finit sur une action et annonce la suite", () => {
  for (const story of stories) {
    assert.ok(story.teaser.length > 10, story.id);
    assert.ok(story.action.href.startsWith("/"), story.id);
    assert.ok(story.resume.length > 10, story.id);
  }
});

test("la mise en scène garde le personnage qui parle à l'écran", () => {
  for (const story of stories) {
    for (const step of stageScenes(story)) {
      if (step.scene.who !== "narrateur") assert.ok(step.present.includes(step.scene.who), `${story.id}: ${step.scene.text}`);
      assert.ok(step.present.length >= 1, story.id);
    }
  }
});

test("le plan s'adapte : gros plan sur une émotion forte, plan large pour la narration", () => {
  const steps = stageScenes(stories[0]);
  assert.equal(steps[0].shot, "large");
  assert.ok(steps.some((s) => s.shot === "gros"));
});

test("une humeur inconnue est détectée", () => {
  const broken = structuredClone(stories[0]);
  broken.scenes[1].mood = "bizarre" as never;
  assert.ok(checkStory(broken).some((p) => p.includes("humeur")));
});

test("la série ne parle plus de santé mentale : elle reste sur la planification familiale", () => {
  const banned = /tristesse|dépress|santé mentale|bien-être|sommeil|anxi|se faire du mal/i;
  for (const story of stories) {
    const text = [story.titre, story.resume, story.lecon, story.teaser, ...story.scenes.map((s) => s.text), ...Object.values(story.jeu.nodes).map((n) => n.text)].join(" ");
    assert.ok(!banned.test(text), story.id);
    assert.ok(!story.action.href.includes("voie="), story.id);
  }
});

test("l'épisode 4 montre un jeune renvoyé d'un centre et prépare la visite", () => {
  const ep = stories.find((s) => s.episode === 4)!;
  assert.equal(ep.id, "on-l-a-renvoyee");
  assert.equal(ep.action.href, "/outils/visite");
  assert.ok(ep.scenes.some((s) => /ailleurs|en essayer un autre/.test(s.text)));
});

test("les deux proches d'Afi restent des personnages de la série", () => {
  assert.deepEqual(speakerInfo("fallone"), { name: "Fallone", role: "l'amie" });
  assert.deepEqual(speakerInfo("chimene"), { name: "Chimène", role: "la sœur" });
});

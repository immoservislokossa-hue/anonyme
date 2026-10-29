import assert from "node:assert/strict";
import { test } from "node:test";
import knowledge from "../data/knowledge.json";
import { HOME_NEEDS, TOPICS, topicViews } from "../lib/topics";

const ids = new Set((knowledge as { id: string }[]).map((entry) => entry.id));

test("chaque sujet ne renvoie qu'à des fiches qui existent", () => {
  for (const topic of TOPICS) {
    assert.ok(topic.entries.length > 0, topic.id);
    for (const id of topic.entries) assert.ok(ids.has(id), `${topic.id} : fiche absente ${id}`);
  }
});

test("les identifiants de sujets sont uniques", () => {
  assert.equal(new Set(TOPICS.map((t) => t.id)).size, TOPICS.length);
});

test("l'écosystème couvre les grands besoins de santé sexuelle et de planification familiale", () => {
  const needed = ["eviter-grossesse", "apres-risque", "regles-cycle", "grossesse", "ist-vih", "relations", "violence", "garcons", "rumeurs"];
  for (const id of needed) assert.ok(TOPICS.some((t) => t.id === id), `sujet manquant : ${id}`);
});

test("les sujets sensibles renvoient vers l'aide urgente", () => {
  for (const id of ["apres-risque", "violence"]) assert.equal(TOPICS.find((t) => t.id === id)?.urgent, true, id);
});

test("les vues de sujets contiennent le texte des fiches", () => {
  for (const view of topicViews()) {
    assert.ok(view.fiches.length > 0, view.id);
    for (const fiche of view.fiches) assert.ok(fiche.content.length > 40, fiche.id);
  }
});

test("les tuiles de l'accueil mènent à des pages ou des sujets qui existent", () => {
  for (const need of HOME_NEEDS) {
    assert.ok(need.href.startsWith("/"), need.href);
    const sujet = new URL(need.href, "https://x.test").searchParams.get("sujet");
    if (sujet) assert.ok(TOPICS.some((t) => t.id === sujet), need.href);
  }
  assert.ok(HOME_NEEDS.length >= 6);
});

test("les nouvelles fiches restent des brouillons à valider", () => {
  for (const id of ["regles-cycle", "retard-regles", "ist-prevention", "hpv-vaccin", "garcons", "relation-saine"]) {
    const entry = (knowledge as { id: string; validated: boolean }[]).find((e) => e.id === id);
    assert.ok(entry, id);
    assert.equal(entry?.validated, false, id);
  }
});

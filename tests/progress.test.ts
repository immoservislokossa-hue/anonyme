import assert from "node:assert/strict";
import { test } from "node:test";
import {
  badges,
  emptyProgress,
  level,
  parseProgress,
  points,
  registerVisit,
  streak,
  type Progress,
} from "../lib/progress";

const day = (iso: string) => new Date(`${iso}T12:00:00`);

test("une série compte les jours consécutifs jusqu'à aujourd'hui", () => {
  let progress: Progress = emptyProgress;
  for (const d of ["2026-10-24", "2026-10-25", "2026-10-26"]) {
    progress = registerVisit(progress, day(d));
  }
  assert.equal(streak(progress, day("2026-10-26")), 3);
});

test("une série reste valable si la dernière visite date d'hier", () => {
  let progress: Progress = emptyProgress;
  for (const d of ["2026-10-24", "2026-10-25"]) {
    progress = registerVisit(progress, day(d));
  }
  assert.equal(streak(progress, day("2026-10-26")), 2);
});

test("une série retombe à zéro après deux jours d'absence", () => {
  const progress = registerVisit(emptyProgress, day("2026-10-20"));
  assert.equal(streak(progress, day("2026-10-26")), 0);
});

test("une même journée ne compte qu'une fois", () => {
  const once = registerVisit(emptyProgress, day("2026-10-26"));
  const twice = registerVisit(once, day("2026-10-26"));
  assert.equal(twice.days.length, 1);
});

test("les points s'additionnent et les questions sont plafonnées", () => {
  const progress: Progress = {
    ...emptyProgress,
    days: ["2026-10-26"],
    questionsAsked: 500,
    chroniclesRead: ["a"],
    quizAnswers: { x: true, y: false },
    visitPrepared: true,
  };
  assert.equal(points(progress), 5 + 100 + 15 + 10 + 20);
});

test("les niveaux montent avec les points", () => {
  assert.equal(level(0).label, "Curieuse");
  assert.equal(level(40).label, "Informée");
  assert.equal(level(250).ratio, 1);
});

test("les badges reflètent la progression", () => {
  const progress: Progress = { ...emptyProgress, questionsAsked: 1 };
  const earned = badges(progress, day("2026-10-26")).filter((b) => b.earned).map((b) => b.id);
  assert.deepEqual(earned, ["question"]);
});

test("une progression invalide revient à vide", () => {
  assert.deepEqual(parseProgress("pas du json"), emptyProgress);
  assert.deepEqual(parseProgress(JSON.stringify({ version: 2 })), emptyProgress);
  assert.deepEqual(parseProgress(null), emptyProgress);
});

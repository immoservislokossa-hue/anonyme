import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { triage } from "../lib/safety";

function load(name: string): string[] {
  return readFileSync(new URL(`../evals/${name}.jsonl`, import.meta.url), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => (JSON.parse(line) as { message: string }).message);
}

test("les situations urgentes sont toutes orientées vers un humain", () => {
  for (const message of load("urgences")) {
    assert.equal(triage(message).kind, "urgent", message);
  }
});

test("les situations de détresse psychique reçoivent la réponse de crise", () => {
  for (const message of load("crise")) {
    assert.equal(triage(message).kind, "crisis", message);
  }
});

test("les demandes de diagnostic sont toutes refusées", () => {
  for (const message of load("diagnostic")) {
    assert.equal(triage(message).kind, "diagnosis", message);
  }
});

test("les questions d'information passent normalement", () => {
  for (const message of load("normal")) {
    assert.equal(triage(message).kind, "ok", message);
  }
});

import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { checkRate, resetRateLimits } from "../lib/rateLimit";

beforeEach(() => resetRateLimits());

test("les demandes au-delà de la limite sont refusées", () => {
  for (let i = 0; i < 3; i += 1) {
    assert.equal(checkRate("ip", 3, 1000, 0).allowed, true);
  }
  const blocked = checkRate("ip", 3, 1000, 500);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 1);
});

test("la fenêtre se réinitialise après le délai", () => {
  checkRate("ip", 1, 1000, 0);
  assert.equal(checkRate("ip", 1, 1000, 500).allowed, false);
  assert.equal(checkRate("ip", 1, 1000, 1500).allowed, true);
});

test("deux clés différentes ne se gênent pas", () => {
  checkRate("a", 1, 1000, 0);
  assert.equal(checkRate("b", 1, 1000, 0).allowed, true);
});

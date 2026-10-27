import assert from "node:assert/strict";
import { test } from "node:test";
import { TOUR, hasTranslation, stepTexts } from "../lib/guides";
import { LANGS, defaultLangFor, languagesForCountry, pickVoice } from "../lib/i18n";

test("la présentation fait 5 étapes au plus, toutes sur la barre du bas ou l'en-tête", () => {
  assert.ok(TOUR.steps.length <= 5);
  for (const step of TOUR.steps) {
    assert.ok(step.fr.trim().length > 10);
    assert.match(step.target ?? "", /data-tour/);
  }
});

test("la traduction yoruba a autant de phrases que le français", () => {
  assert.equal(TOUR.translations?.yo?.length, TOUR.steps.length);
});

test("seuls le français et le yoruba sont proposés", () => {
  assert.deepEqual(Object.keys(LANGS), ["fr", "yo"]);
  assert.deepEqual(languagesForCountry("BJ"), ["fr", "yo"]);
  assert.deepEqual(languagesForCountry(null), ["fr", "yo"]);
});

test("chaque étape se dit en français puis en yoruba quand le yoruba est choisi", () => {
  const yo = stepTexts(TOUR, "yo");
  assert.equal(yo.length, TOUR.steps.length);
  for (const step of yo) assert.ok(step.fr && step.local);
  assert.equal(hasTranslation(TOUR, "yo"), true);
  for (const step of stepTexts(TOUR, "fr")) assert.equal(step.local, undefined);
});

test("la langue proposée d'office est le yoruba au Bénin, le français ailleurs", () => {
  assert.equal(defaultLangFor("BJ"), "yo");
  assert.equal(defaultLangFor("NE"), "fr");
  assert.equal(defaultLangFor(null), "fr");
});

test("une langue sans voix sur l'appareil se lit avec la voix française, signalée comme approximative", () => {
  const voices = [{ lang: "fr-FR" }, { lang: "en-US" }];
  assert.deepEqual(pickVoice(voices, "fr-FR"), { voice: voices[0], approx: false });
  assert.deepEqual(pickVoice(voices, "yo-NG"), { voice: voices[0], approx: true });
  assert.deepEqual(pickVoice([{ lang: "yo-NG" }], "yo-NG"), { voice: { lang: "yo-NG" }, approx: false });
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { ALL_GUIDES, TOUR, guideForPath, hasTranslation, stepTexts } from "../lib/guides";
import { COUNTRY_LANGS, LANGS, defaultLangFor, languagesForCountry, pickVoice } from "../lib/i18n";

test("chaque guide a des phrases en français non vides", () => {
  for (const guide of ALL_GUIDES) {
    assert.ok(guide.steps.length > 0, guide.id);
    for (const step of guide.steps) assert.ok(step.fr.trim().length > 10, guide.id);
  }
});

test("les traductions ont autant de phrases que le français", () => {
  for (const guide of ALL_GUIDES) {
    for (const [lang, lines] of Object.entries(guide.translations ?? {})) {
      assert.equal(lines?.length, guide.steps.length, `${guide.id}/${lang}`);
    }
  }
});

test("chaque page a son guide, avec un guide par défaut", () => {
  assert.equal(guideForPath("/").id, "home");
  assert.equal(guideForPath("/chat").id, "chat");
  assert.equal(guideForPath("/histoires/quelle-methode").id, "histoire");
  assert.equal(guideForPath("/chroniques").id, "histoires");
  assert.equal(guideForPath("/consentement").id, "default");
});

test("avec une traduction, chaque étape se dit en français puis dans la langue choisie", () => {
  const yo = stepTexts(TOUR, "yo");
  assert.equal(yo.length, TOUR.steps.length);
  for (const step of yo) assert.ok(step.fr && step.local);
  assert.equal(hasTranslation(TOUR, "yo"), true);
  assert.equal(hasTranslation(TOUR, "ha"), true);
  assert.equal(hasTranslation(TOUR, "hac"), true);
});

test("sans traduction, seule la phrase française est lue", () => {
  assert.equal(hasTranslation(TOUR, "ff"), false);
  for (const step of stepTexts(TOUR, "ff")) assert.equal(step.local, undefined);
  for (const step of stepTexts(TOUR, "fr")) assert.equal(step.local, undefined);
});

test("la langue proposée d'office est la première langue locale qui a un texte", () => {
  assert.equal(defaultLangFor("BJ"), "yo");
  assert.equal(defaultLangFor("NE"), "ha");
  assert.equal(defaultLangFor("MR"), "hac");
  assert.equal(defaultLangFor("SN"), "fr");
  assert.equal(defaultLangFor(null), "fr");
});

test("chaque pays du Partenariat a deux langues locales connues", () => {
  assert.equal(Object.keys(COUNTRY_LANGS).length, 9);
  for (const entry of Object.values(COUNTRY_LANGS)) {
    assert.equal(entry.langs.length, 2);
    for (const lang of entry.langs) assert.ok(lang in LANGS);
  }
});

test("les langues proposées commencent par le français", () => {
  assert.deepEqual(languagesForCountry("BJ"), ["fr", "fon", "yo", "hac", "ha"]);
  assert.deepEqual(languagesForCountry("xx"), ["fr", "yo", "hac", "ha"]);
  assert.deepEqual(languagesForCountry(null), ["fr", "yo", "hac", "ha"]);
});

test("une langue sans voix sur l'appareil se lit avec la voix française, signalée comme approximative", () => {
  const voices = [{ lang: "fr-FR" }, { lang: "en-US" }];
  assert.deepEqual(pickVoice(voices, "fr-FR"), { voice: voices[0], approx: false });
  assert.deepEqual(pickVoice(voices, "yo-NG"), { voice: voices[0], approx: true });
  assert.deepEqual(pickVoice([{ lang: "yo-NG" }], "yo-NG"), { voice: { lang: "yo-NG" }, approx: false });
});

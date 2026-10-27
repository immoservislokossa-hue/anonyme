import assert from "node:assert/strict";
import { test } from "node:test";
import { ALL_GUIDES, TOUR, guideForPath, linesFor } from "../lib/guides";
import { COUNTRY_LANGS, LANGS, languagesForCountry, pickVoice } from "../lib/i18n";

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

test("sans traduction, la lecture se fait en français et le signale", () => {
  const fr = linesFor(TOUR, "fr");
  assert.equal(fr.translated, true);
  const ff = linesFor(TOUR, "ff");
  assert.equal(ff.translated, false);
  assert.deepEqual(ff.lines, fr.lines);
  assert.equal(linesFor(TOUR, "yo").translated, true);
  assert.equal(linesFor(TOUR, "ha").translated, true);
});

test("chaque pays du Partenariat a deux langues locales connues", () => {
  assert.equal(Object.keys(COUNTRY_LANGS).length, 9);
  for (const entry of Object.values(COUNTRY_LANGS)) {
    assert.equal(entry.langs.length, 2);
    for (const lang of entry.langs) assert.ok(lang in LANGS);
  }
});

test("les langues proposées commencent par le français", () => {
  assert.deepEqual(languagesForCountry("BJ"), ["fr", "fon", "yo"]);
  assert.deepEqual(languagesForCountry("xx"), ["fr"]);
  assert.deepEqual(languagesForCountry(null), ["fr"]);
});

test("une langue sans voix sur l'appareil se lit avec la voix française, signalée comme approximative", () => {
  const voices = [{ lang: "fr-FR" }, { lang: "en-US" }];
  assert.deepEqual(pickVoice(voices, "fr-FR"), { voice: voices[0], approx: false });
  assert.deepEqual(pickVoice(voices, "yo-NG"), { voice: voices[0], approx: true });
  assert.deepEqual(pickVoice([{ lang: "yo-NG" }], "yo-NG"), { voice: { lang: "yo-NG" }, approx: false });
});

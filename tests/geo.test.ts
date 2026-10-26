import assert from "node:assert/strict";
import { test } from "node:test";
import { anchorText, countryName, hintFromHeaders, withCountry } from "../lib/geo";

test("le code du pays devient son nom en français", () => {
  assert.equal(countryName("BJ"), "Bénin");
  assert.equal(countryName("SN"), "Sénégal");
});

test("les en-têtes de l'hébergeur donnent le pays et la ville décodée", () => {
  const headers = new Headers({ "x-vercel-ip-country": "bj", "x-vercel-ip-city": "S%C3%A8m%C3%A8-Kpodji" });
  assert.deepEqual(hintFromHeaders(headers), { country: "Bénin", city: "Sèmè-Kpodji" });
});

test("des en-têtes absents ou invalides ne donnent aucun repère", () => {
  assert.deepEqual(hintFromHeaders(new Headers()), { country: undefined, city: undefined });
  const bad = new Headers({ "x-vercel-ip-country": "<script>", "x-vercel-ip-city": "%E0%A4%A" });
  assert.deepEqual(hintFromHeaders(bad), { country: undefined, city: undefined });
});

test("le texte d'ancrage garde ce qui est connu", () => {
  assert.equal(anchorText({ country: "Bénin", city: "Cotonou" }), "Cotonou, Bénin");
  assert.equal(anchorText({ country: "Bénin" }), "Bénin");
  assert.equal(anchorText({}), "");
});

test("le pays est ajouté à un lieu saisi une seule fois", () => {
  assert.equal(withCountry("Parakou", "Bénin"), "Parakou, Bénin");
  assert.equal(withCountry("Cotonou, Bénin", "Bénin"), "Cotonou, Bénin");
  assert.equal(withCountry("Parakou"), "Parakou");
});

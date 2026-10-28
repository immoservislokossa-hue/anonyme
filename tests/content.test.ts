import assert from "node:assert/strict";
import { test } from "node:test";
import methodes from "../data/methodes.json";
import protocols from "../data/protocols.json";
import { retrieve } from "../lib/retrieve";

test("chaque méthode suit le plan du guide : ce que c'est, comment l'utiliser, ce qui peut arriver, à retenir, où aller", () => {
  assert.ok(methodes.length >= 13);
  const ids = new Set<string>();
  for (const m of methodes) {
    assert.ok(!ids.has(m.id), `doublon ${m.id}`);
    ids.add(m.id);
    assert.ok([0, 1, 2, 3, 4].includes(m.niveau), m.id);
    for (const key of ["resume", "ce_que_cest", "comment", "peut_arriver", "a_retenir"] as const) {
      assert.ok(m[key].length > 0, `${m.id} : ${key} vide`);
    }
    assert.ok(m.ou_aller.length > 5, m.id);
    assert.ok(m.source.includes("OMS"), m.id);
    assert.ok(m.page >= 4 && m.page <= 16, m.id);
  }
});

test("les préservatifs sont les seules méthodes marquées comme protégeant des IST", () => {
  const withIst = methodes.filter((m) => m.ist).map((m) => m.id).sort();
  assert.deepEqual(withIst, ["preservatif-feminin", "preservatif-masculin"]);
});

test("les chiffres du guide de l'OMS sont repris tels quels", () => {
  const text = (id: string) => JSON.stringify(methodes.find((m) => m.id === id));
  assert.match(text("sterilet"), /12 ans/);
  assert.match(text("implants"), /3 à 5 ans/);
  assert.match(text("injectables"), /2 mois/);
  assert.match(text("injectables"), /3 mois/);
  assert.match(text("contraception-urgence"), /5 jours/);
  assert.match(text("jours-fixes"), /8e au 19e/);
});

test("les aide-mémoire pour les professionnels citent le guide et restent à valider", () => {
  for (const p of protocols) {
    assert.ok(p.source.includes("OMS"), p.id);
    assert.equal(p.valide, false);
    assert.ok(p.etapes.length >= 5, p.id);
  }
});

test("les questions courantes retrouvent la bonne fiche", () => {
  assert.equal(retrieve("comment fonctionne l'implant ?", 1, "sexuelle")[0]?.id, "implants-usage");
  assert.equal(retrieve("j'ai oublié ma pilule", 1, "sexuelle")[0]?.id, "pilule-usage");
  assert.equal(retrieve("combien de temps dure le stérilet", 1, "sexuelle")[0]?.id, "sterilet-usage");
  assert.equal(retrieve("la pilule d'urgence", 1, "sexuelle")[0]?.id, "contraception-urgence");
  assert.equal(retrieve("l'injection tous les combien de mois", 1, "sexuelle")[0]?.id, "injectable-usage");
});

test("le public cible est défini une seule fois et reste cohérent", async () => {
  const { TARGET_AGE, TARGET_LABEL } = await import("../lib/brand");
  assert.equal(TARGET_AGE.min, 15);
  assert.equal(TARGET_AGE.max, 24);
  assert.equal(TARGET_LABEL, "Pour les 15 à 24 ans");
});

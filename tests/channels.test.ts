import assert from "node:assert/strict";
import { test } from "node:test";
import { channelsFrom } from "../lib/channels";

test("sans configuration, aucun canal n'a de lien", () => {
  const channels = channelsFrom({});
  assert.deepEqual(channels.map((c) => c.id), ["whatsapp", "messenger", "phone"]);
  for (const channel of channels) assert.equal(channel.href, null);
});

test("les liens sont construits à partir des numéros et de la page", () => {
  const channels = channelsFrom({ whatsapp: "+229 01 23 45 67 89", messenger: "alviosa.bj", phone: "+229 21 00 00 00" });
  assert.equal(channels[0].href, "https://wa.me/2290123456789?text=Bonjour");
  assert.equal(channels[1].href, "https://m.me/alviosa.bj");
  assert.equal(channels[2].href, "tel:+22921000000");
});

test("une valeur vide ou invalide ne donne pas de lien", () => {
  const channels = channelsFrom({ whatsapp: "abc", messenger: "   ", phone: "" });
  for (const channel of channels) assert.equal(channel.href, null);
});

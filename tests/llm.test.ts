import assert from "node:assert/strict";
import { test } from "node:test";
import { callDeepseek, generateReply, pickProvider } from "../lib/llm";

test("DeepSeek est choisi quand sa clé est présente", () => {
  assert.equal(pickProvider({ DEEPSEEK_API_KEY: "k" }), "deepseek");
  assert.equal(pickProvider({ DEEPSEEK_API_KEY: "k", ANTHROPIC_API_KEY: "a" }), "deepseek");
});

test("Anthropic est utilisé s'il est la seule clé, ou s'il est demandé", () => {
  assert.equal(pickProvider({ ANTHROPIC_API_KEY: "a" }), "anthropic");
  assert.equal(pickProvider({ DEEPSEEK_API_KEY: "k", ANTHROPIC_API_KEY: "a", LLM_PROVIDER: "anthropic" }), "anthropic");
});

test("sans clé, ou avec un fournisseur demandé mais sans clé, aucun modèle n'est utilisé", () => {
  assert.equal(pickProvider({}), "none");
  assert.equal(pickProvider({ LLM_PROVIDER: "deepseek" }), "none");
});

test("la requête DeepSeek suit le format attendu", async () => {
  let captured: { url: string; init: RequestInit } | undefined;
  const fakeFetch = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(JSON.stringify({ choices: [{ message: { content: "  Bonjour  " } }] }), { status: 200 });
  }) as unknown as typeof fetch;

  const reply = await callDeepseek(
    "consigne",
    [{ role: "user", content: "question" }],
    { DEEPSEEK_API_KEY: "secret", DEEPSEEK_MODEL: "deepseek-chat" },
    fakeFetch,
  );

  assert.equal(reply, "Bonjour");
  assert.equal(captured?.url, "https://api.deepseek.com/chat/completions");
  const headers = captured?.init.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer secret");

  const body = JSON.parse(String(captured?.init.body));
  assert.equal(body.model, "deepseek-chat");
  assert.deepEqual(body.messages[0], { role: "system", content: "consigne" });
  assert.deepEqual(body.messages[1], { role: "user", content: "question" });
  assert.equal(body.stream, false);
});

test("une erreur de DeepSeek est remontée", async () => {
  const failing = (async () => new Response("erreur", { status: 500 })) as unknown as typeof fetch;
  await assert.rejects(() => callDeepseek("s", [], { DEEPSEEK_API_KEY: "k" }, failing));
});

test("sans fournisseur, la génération renvoie une chaîne vide", async () => {
  assert.equal(await generateReply("s", [], {}), "");
});

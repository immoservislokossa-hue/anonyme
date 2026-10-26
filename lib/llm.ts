import Anthropic from "@anthropic-ai/sdk";

// Accès au modèle de langage. Le fournisseur se choisit par variables d'environnement :
// DEEPSEEK_API_KEY (par défaut s'il est présent) ou ANTHROPIC_API_KEY. Sans clé, le chat répond avec la base seule.

export type ChatTurn = { role: "user" | "assistant"; content: string };
export type Provider = "deepseek" | "anthropic" | "none";
type Env = Record<string, string | undefined>;

const TIMEOUT_MS = 20_000;
const MAX_TOKENS = 400;

export function pickProvider(env: Env = process.env): Provider {
  const wanted = env.LLM_PROVIDER;
  if (wanted === "anthropic") return env.ANTHROPIC_API_KEY ? "anthropic" : "none";
  if (wanted === "deepseek") return env.DEEPSEEK_API_KEY ? "deepseek" : "none";
  if (env.DEEPSEEK_API_KEY) return "deepseek";
  if (env.ANTHROPIC_API_KEY) return "anthropic";
  return "none";
}

// DeepSeek expose une API compatible avec le format OpenAI.
export async function callDeepseek(
  system: string,
  history: ChatTurn[],
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const base = (env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com").replace(/\/+$/, "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetchImpl(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.DEEPSEEK_MODEL ?? "deepseek-chat",
        messages: [{ role: "system", content: system }, ...history],
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`DeepSeek a répondu ${response.status}`);

    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  } finally {
    clearTimeout(timer);
  }
}

async function callAnthropic(system: string, history: ChatTurn[], env: Env): Promise<string> {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5",
    max_tokens: MAX_TOKENS,
    system,
    messages: history,
  });

  return response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();
}

// Renvoie le texte généré, ou une chaîne vide si aucun fournisseur n'est configuré.
export async function generateReply(
  system: string,
  history: ChatTurn[],
  env: Env = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const provider = pickProvider(env);
  if (provider === "deepseek") return callDeepseek(system, history, env, fetchImpl);
  if (provider === "anthropic") return callAnthropic(system, history, env);
  return "";
}

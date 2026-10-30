import { NextResponse } from "next/server";
import { generateReply, pickProvider } from "@/lib/llm";
import { record } from "@/lib/metrics";
import { buildContext, providerPrompt, systemPromptFor } from "@/lib/prompt";
import { isContextKey } from "@/lib/afi";
import { isZone } from "@/lib/pays";
import { checkRate } from "@/lib/rateLimit";
import { fallbackReply, findEntries } from "@/lib/localReply";
import { triage } from "@/lib/safety";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY = 10;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isValidHistory(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        typeof m === "object" &&
        m !== null &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length <= MAX_MESSAGE_LENGTH,
    )
  );
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "inconnu";
}

export async function POST(request: Request) {
  const rate = checkRate(clientKey(request), RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop de demandes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const payload = body as { messages?: unknown; context?: unknown; audience?: unknown; zone?: unknown } | null;
  const zone = isZone(payload?.zone) ? payload.zone : undefined;
  const provider = payload?.audience === "prestataire";
  const context = isContextKey(payload?.context) ? payload.context : undefined;
  const messages = payload?.messages;

  if (!isValidHistory(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const history = messages.slice(-MAX_HISTORY);
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json({ error: "Aucune question trouvée." }, { status: 400 });
  }

  // Détresse, urgence et demandes de diagnostic ne vont jamais au modèle, quelle que soit la voie.
  // Pour un prestataire, un message sur une violence décrit un client, pas lui-même : le message d'urgence destiné à une victime ne convient pas.
  const raw = triage(lastUser.content);
  const decision = provider && raw.kind === "urgent" ? ({ kind: "ok" } as const) : raw;
  if (decision.kind === "crisis") {
    record("urgence");
    return NextResponse.json({ reply: decision.reply, kind: "crisis", sources: [] });
  }
  if (decision.kind === "urgent") {
    record("urgence");
    return NextResponse.json({ reply: decision.reply, kind: "urgent", sources: [] });
  }
  if (decision.kind === "diagnosis") {
    record("diagnostic");
    return NextResponse.json({ reply: decision.reply, kind: "diagnosis", sources: [] });
  }

  const entries = findEntries(lastUser.content, context);
  record("question", entries[0]?.theme, zone);

  // Sans fournisseur configuré, on répond avec la base seule.
  if (pickProvider() === "none") {
    return NextResponse.json({
      reply: fallbackReply(entries),
      kind: "fallback",
      sources: entries.map((e) => e.title),
    });
  }

  try {
    const system = `${provider ? providerPrompt() : systemPromptFor()}\n\nContexte :\n${buildContext(entries)}`;
    const reply = await generateReply(
      system,
      history.map((m) => ({ role: m.role, content: m.content })),
    );

    return NextResponse.json({
      reply: reply || fallbackReply(entries),
      kind: reply ? "answer" : "fallback",
      sources: entries.map((e) => e.title),
    });
  } catch {
    // Le modèle est indisponible : on répond avec la base plutôt que de laisser la personne sans réponse.
    return NextResponse.json({
      reply: fallbackReply(entries),
      kind: "fallback",
      sources: entries.map((e) => e.title),
    });
  }
}

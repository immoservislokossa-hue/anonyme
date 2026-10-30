import { NextResponse } from "next/server";
import { limited, readJson } from "@/lib/http";
import { generateReply, pickProvider, type ChatTurn } from "@/lib/llm";
import { getScenario } from "@/lib/pro/scenarios";

export const runtime = "nodejs";

const MAX_TURNS = 12;
const MAX_LENGTH = 500;

export async function GET() {
  return NextResponse.json({ available: pickProvider() !== "none" });
}

function systemFor(qui: string, contexte: string): string {
  return `Tu es un outil d'entraînement pour des prestataires de santé (agents de santé, sages-femmes, pharmaciens) en Afrique de l'Ouest francophone.
Tu joues le rôle d'un faux client : ${qui}. Situation : ${contexte}
Règles :
- Écris en français simple, à la première personne, comme le client. Réponses courtes (40 mots au maximum), réalistes, avec de la gêne ou de l'inquiétude quand c'est naturel.
- Reste dans la situation. Réagis à ce que le prestataire dit : chaleureux et complet, tu te détends ; jugeant ou vague, tu te refermes.
- Aucun contenu sexuellement explicite. Ne donne aucun conseil médical : tu es le client.
- Après chaque réponse du prestataire, ajoute une ligne de coach : une seule phrase qui commente son accueil selon ces critères : écouter d'abord, ne pas juger, confidentialité, présenter plusieurs méthodes, expliquer les effets, orienter, respecter le choix. Si le prestataire donne une information médicale fausse, corrige-la dans le coach selon le guide de l'OMS sur la planification familiale.
Format exact, sur deux lignes :
CLIENT: ...
COACH: ...`;
}

// Le faux client et son coach. Si aucun modèle n'est configuré, la route le dit : les situations guidées restent disponibles.
export async function POST(request: Request) {
  const limit = limited(request, "pratique", 40, 600_000);
  if (limit) return limit;
  if (pickProvider() === "none") return NextResponse.json({ error: "ia-indisponible" }, { status: 503 });

  const body = await readJson(request);
  const scenario = typeof body?.scenarioId === "string" ? getScenario(body.scenarioId) : undefined;
  const raw = Array.isArray(body?.history) ? body.history : null;
  if (!scenario || !raw || raw.length === 0 || raw.length > MAX_TURNS) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const history: ChatTurn[] = [];
  for (const turn of raw as { role?: unknown; content?: unknown }[]) {
    if ((turn.role !== "user" && turn.role !== "assistant") || typeof turn.content !== "string" || turn.content.length > MAX_LENGTH) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    history.push({ role: turn.role, content: turn.content });
  }
  if (history[history.length - 1].role !== "user") return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  try {
    const text = await generateReply(systemFor(scenario.qui, scenario.contexte), history);
    if (!text) return NextResponse.json({ error: "ia-indisponible" }, { status: 503 });
    const match = /CLIENT:\s*([\s\S]*?)(?:\n\s*COACH:\s*([\s\S]*))?$/i.exec(text.trim());
    const client = (match?.[1] ?? text).trim();
    const coach = (match?.[2] ?? "").trim();
    return NextResponse.json({ client, coach });
  } catch {
    return NextResponse.json({ error: "ia-indisponible" }, { status: 502 });
  }
}

import { contextHint } from "@/lib/afi";
import type { Voie } from "@/lib/domain";
import { retrieve, type KnowledgeEntry } from "@/lib/retrieve";
import { triage } from "@/lib/safety";

export type LocalReply = { reply: string; kind: "urgent" | "crisis" | "diagnosis" | "fallback"; sources: string[] };

// Réponse de secours : on renvoie l'entrée la plus pertinente, telle quelle.
export function fallbackReply(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) {
    return "Je n'ai pas trouvé d'information sur ce point. Un professionnel de santé peut t'aider.";
  }
  // Les rubriques du guide (« Ce que c'est : », « À retenir : »…) deviennent des titres en gras.
  const formatted = entries[0].content.replace(
    /\s*(Ce que c'est|Comment l'utiliser|Ce qui peut arriver|À retenir|Où aller|Mode d'emploi) :\s*/g,
    "\n\n**$1**\n",
  );
  return `${formatted}\n\nInformation à vérifier avec un professionnel de santé.`;
}

// Cherche les entrées utiles. Sur une page précise, une question courte s'appuie sur le titre de la page.
export function findEntries(question: string, voie?: Voie, context?: string): KnowledgeEntry[] {
  const hint = contextHint(context);
  let entries = retrieve(question, 3, voie);
  if (hint && (entries.length === 0 || question.length <= 60)) {
    const withPage = retrieve(`${question} ${hint}`, 3, voie);
    if (withPage.length > 0) entries = withPage;
  }
  return entries;
}

// Afi sans connexion : mêmes règles de sécurité que le serveur, puis la fiche la plus proche. Tout se passe sur l'appareil.
export function localReply(question: string, voie?: Voie, context?: string, audience: "jeune" | "prestataire" = "jeune"): LocalReply {
  const raw = triage(question);
  // Pour un prestataire, un message sur une violence décrit un client : on ne répond pas avec le message destiné à une victime.
  const decision = audience === "prestataire" && raw.kind === "urgent" ? ({ kind: "ok" } as const) : raw;
  if (decision.kind === "crisis") return { reply: decision.reply, kind: "crisis", sources: [] };
  if (decision.kind === "urgent") return { reply: decision.reply, kind: "urgent", sources: [] };
  if (decision.kind === "diagnosis") return { reply: decision.reply, kind: "diagnosis", sources: [] };

  const entries = findEntries(question, voie, context);
  return { reply: fallbackReply(entries), kind: "fallback", sources: entries.map((e) => e.title) };
}

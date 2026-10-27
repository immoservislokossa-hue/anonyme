import { HELPLINE_NUMBER } from "@/lib/brand";

// Garde-fous appliqués avant tout appel au modèle.
// Les messages d'urgence ou de détresse ne passent jamais par le modèle : la réponse est fixe et relue.

export type Triage =
  | { kind: "crisis"; reply: string }
  | { kind: "urgent"; reply: string }
  | { kind: "diagnosis"; reply: string }
  | { kind: "ok" };

// Détresse psychique : idées de mort, de suicide ou d'automutilation.
const CRISIS_PATTERNS: RegExp[] = [
  /suicid/,
  /me\s+tuer/,
  /(envie|veux|voudrais)\s+(de\s+)?mourir/,
  /plus\s+envie\s+de\s+vivre/,
  /en\s+finir\s+avec\s+(la\s+vie|tout)/,
  /me\s+(faire\s+du\s+mal|blesser|scarifi)/,
  /idées?\s+noires/,
  /disparaître\s+pour\s+toujours/,
];

const URGENT_PATTERNS: RegExp[] = [
  /saignement\w*\s+(très\s+)?(abondant|important|fort|beaucoup)/,
  /(beaucoup|trop)\s+de\s+sang/,
  /\b(viol|violée?|violé)\b/,
  /forcée?\s+(à|a)\s+avoir/,
  /(on|il|elle)\s+m['’]a\s+forcée?/,
  /(agress|abus|attouch)\w*\s+sexuel/,
  /(violence|frappée?|battue?)\s+(par|de\s+la\s+part)/,
  /(douleur|mal)\s+(très\s+)?(forte|intense|violente|insupportable)/,
  /(enceinte|grossesse).*(saign|douleur|malaise|évanou)/,
  /(évanou|perdu\s+connaissance)/,
];

const DIAGNOSIS_PATTERNS: RegExp[] = [
  /suis[- ]?je\s+enceinte/,
  /je\s+suis\s+enceinte\s*\?/,
  /(diagnostic|diagnostiquer)/,
  /quel\s+(médicament|dosage|dose)\s+(dois|faut|pour\s+moi)/,
  /combien\s+de\s+(comprimés|pilules|doses)\s+(dois|faut)/,
  /(suis[- ]?je|je\s+suis)\s+(dépressi|bipolaire|schizophr)/,
];

export const CRISIS_REPLY =
  "Ce que tu vis compte, et tu n'es pas seul(e). Parle maintenant à une personne de confiance, " +
  `ou appelle la ligne d'écoute de ton pays : ${HELPLINE_NUMBER}. Si tu es en danger immédiat, ` +
  "appelle le numéro d'urgence ou va au centre de santé le plus proche. " +
  "Ce service ne peut pas t'accompagner dans une crise.";

export const URGENT_REPLY =
  "Ce que tu décris peut être urgent. Va sans attendre dans le centre de santé le plus proche, " +
  "ou appelle le numéro d'urgence de ton pays. Si quelqu'un est avec toi, demande-lui de t'accompagner. " +
  "Ce service ne peut pas t'examiner ni te donner de traitement.";

export const DIAGNOSIS_REPLY =
  "Je ne peux pas poser de diagnostic, dire si tu es enceinte ni te conseiller un médicament ou une dose. " +
  "Un professionnel de santé peut répondre à cette question. " +
  "Je peux t'expliquer les informations générales et t'aider à trouver un service.";

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFC");
}

export function triage(message: string): Triage {
  const text = normalize(message);

  if (CRISIS_PATTERNS.some((pattern) => pattern.test(text))) {
    return { kind: "crisis", reply: CRISIS_REPLY };
  }

  if (URGENT_PATTERNS.some((pattern) => pattern.test(text))) {
    return { kind: "urgent", reply: URGENT_REPLY };
  }

  if (DIAGNOSIS_PATTERNS.some((pattern) => pattern.test(text))) {
    return { kind: "diagnosis", reply: DIAGNOSIS_REPLY };
  }

  return { kind: "ok" };
}

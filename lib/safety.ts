// Garde-fous appliqués avant tout appel au modèle.
// Les messages d'urgence ne passent jamais par le modèle : la réponse est fixe et relue.

export type Triage =
  | { kind: "urgent"; reply: string }
  | { kind: "diagnosis"; reply: string }
  | { kind: "ok" };

const URGENT_PATTERNS: RegExp[] = [
  /saignement\w*\s+(très\s+)?(abondant|important|fort|beaucoup)/,
  /(beaucoup|trop)\s+de\s+sang/,
  /\b(viol|violée?|violé)\b/,
  /forcée?\s+(à|a)\s+avoir/,
  /(violence|frappée?|battue?)\s+(par|de\s+la\s+part)/,
  /(suicid|me\s+tuer|envie\s+de\s+mourir)/,
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
];

export const URGENT_REPLY =
  "Ce que vous décrivez peut être urgent. Rendez-vous sans attendre dans le centre de santé le plus proche, " +
  "ou appelez le numéro d'urgence de votre pays. Si quelqu'un est avec vous, demandez-lui de vous accompagner. " +
  "Ce service ne peut pas vous examiner ni vous donner de traitement.";

export const DIAGNOSIS_REPLY =
  "Je ne peux pas dire si vous êtes enceinte ni vous conseiller un médicament ou une dose. " +
  "Un test de grossesse en pharmacie ou un professionnel de santé peut répondre à cette question. " +
  "Je peux vous expliquer les options générales et vous aider à trouver un service.";

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFC");
}

export function triage(message: string): Triage {
  const text = normalize(message);

  if (URGENT_PATTERNS.some((pattern) => pattern.test(text))) {
    return { kind: "urgent", reply: URGENT_REPLY };
  }

  if (DIAGNOSIS_PATTERNS.some((pattern) => pattern.test(text))) {
    return { kind: "diagnosis", reply: DIAGNOSIS_REPLY };
  }

  return { kind: "ok" };
}

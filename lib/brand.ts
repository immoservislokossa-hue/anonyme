// Identité du projet : tout passe par ces constantes.
export const APP_NAME = "Alviosa";

// Trois personnages pour la série : Afi, la guide de l'application, et ses deux proches. Afi répond aussi dans le chat.
export type Character = "afi" | "fallone" | "chimene";
export type Persona = { name: string; role: string; line: string };
export const PERSONAS: Record<Character, Persona> = {
  afi: { name: "Afi", role: "la grande sœur", line: "Je réponds à tes questions sur la contraception et la santé sexuelle." },
  fallone: { name: "Fallone", role: "l'amie", line: "Je pose les questions qu'on n'ose pas poser." },
  chimene: { name: "Chimène", role: "la sœur", line: "Je suis plus jeune, et j'ai plein de questions." },
};
export function personaFor(who: Character = "afi"): Persona {
  return PERSONAS[who];
}
// Public cible : une seule définition, reprise sur la page d'accueil, dans les dossiers de candidature et les tests.
export const TARGET_AGE = { min: 15, max: 35 } as const;
export const TARGET_LABEL = `Pour les jeunes de ${TARGET_AGE.min} à ${TARGET_AGE.max} ans`;
export const TAGLINE = "Planification familiale pour les jeunes d'Afrique de l'Ouest francophone : choisir, se protéger, attendre ou espacer une grossesse, et préparer sa visite au centre, sans jugement";

// À remplacer par pays avant le déploiement : les numéros doivent être vérifiés localement.
export const EMERGENCY_NUMBER = "[numéro d'urgence du pays]";
export const HELPLINE_NUMBER = "[ligne d'écoute du pays]";

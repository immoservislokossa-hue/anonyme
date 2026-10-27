// Identité du projet : tout passe par ces constantes.
export const APP_NAME = "Alviosa";

// Trois personnages, un par voie. Afi est aussi la voix par défaut quand aucun sujet n'est choisi.
export type Persona = { name: string; role: string; line: string };
export const PERSONAS: Record<"sexuelle" | "mentale" | "bien-etre", Persona> = {
  sexuelle: { name: "Afi", role: "la grande sœur", line: "Je réponds à tes questions sur la contraception et la santé sexuelle." },
  mentale: { name: "Fallone", role: "l'amie", line: "Je suis là pour écouter ce qui pèse, sans jugement." },
  "bien-etre": { name: "Chimène", role: "la sœur", line: "Je t'aide à retrouver du calme et de l'énergie." },
};
export function personaFor(voie?: "sexuelle" | "mentale" | "bien-etre"): Persona {
  return PERSONAS[voie ?? "sexuelle"];
}
export const TEAM_NAMES = "Afi, Fallone et Chimène";
export const TAGLINE = "Planification familiale pour les jeunes : choisir sa méthode et trouver un centre près de chez soi, sans jugement";
export const ALSO = "Alviosa accompagne aussi la santé mentale et le bien-être.";

// À remplacer par pays avant le déploiement : les numéros doivent être vérifiés localement.
export const EMERGENCY_NUMBER = "[numéro d'urgence du pays]";
export const HELPLINE_NUMBER = "[ligne d'écoute du pays]";

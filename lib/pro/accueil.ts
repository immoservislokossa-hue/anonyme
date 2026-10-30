// Auto-évaluation « Mon service accueille-t-il bien les jeunes ? » : dix questions, un niveau, des pistes.
// Inspirée des grandes dimensions des services de santé adaptés aux adolescents et aux jeunes (accessibles, acceptables, équitables,
// adaptés, efficaces). C'est un outil d'amélioration, déclaratif : il ne certifie rien.

export const ACCUEIL_ITEMS = [
  { id: "horaires", label: "Les horaires conviennent aux jeunes (après l'école ou le travail, ou sans rendez-vous)", piste: "Prévoir au moins une demi-journée par semaine adaptée aux jeunes." },
  { id: "discretion", label: "L'entrée et la salle d'attente sont discrètes, sans stigmatisation", piste: "Éviter une file « planification familiale » visible depuis la rue ; proposer un créneau séparé." },
  { id: "sans-condition", label: "On accueille sans condition d'âge ni de statut marital (dans le cadre de la loi)", piste: "Former toute l'équipe, accueil compris, et afficher une charte d'accueil." },
  { id: "confidentialite", label: "La confidentialité est garantie (lieu d'entretien fermé, dossiers protégés)", piste: "Entretien à porte fermée ; dossiers rangés sous clé." },
  { id: "prix", label: "Les prix sont connus et abordables, ou gratuits pour les jeunes", piste: "Afficher les prix en clair ; chercher un financement pour les jeunes." },
  { id: "methodes", label: "Au moins trois méthodes sont disponibles aujourd'hui, pilule d'urgence comprise", piste: "Suivre les stocks et signaler tôt les ruptures dans Alviosa." },
  { id: "formation", label: "Le personnel est formé à l'accueil des jeunes sans jugement", piste: "Utiliser les jeux de rôle d'Alviosa en réunion d'équipe." },
  { id: "choix-prestataire", label: "Une personne peut demander un autre prestataire si elle est mal à l'aise", piste: "Prévoir une alternative simple, sans justification." },
  { id: "toutes-methodes", label: "On présente toutes les méthodes, pas seulement celles disponibles ici", piste: "Utiliser la consultation guidée et la liste de qualité du conseil." },
  { id: "avis", label: "Les avis des jeunes sont recueillis et lus par l'équipe", piste: "Inviter les jeunes à donner leur avis anonyme dans Alviosa et en parler chaque mois." },
] as const;

export type AccueilId = (typeof ACCUEIL_ITEMS)[number]["id"];
export type Level = "a-renforcer" | "en-progres" | "engage";

export type Accueil = { score: number; max: number; level: Level; pistes: string[] };

export function evaluerAccueil(yes: AccueilId[]): Accueil {
  const set = new Set(yes);
  const score = ACCUEIL_ITEMS.filter((i) => set.has(i.id)).length;
  const level: Level = score >= 8 ? "engage" : score >= 5 ? "en-progres" : "a-renforcer";
  return { score, max: ACCUEIL_ITEMS.length, level, pistes: ACCUEIL_ITEMS.filter((i) => !set.has(i.id)).map((i) => i.piste) };
}

export const LEVEL_LABEL: Record<Level, string> = {
  "a-renforcer": "À renforcer",
  "en-progres": "En progrès",
  engage: "Engagé pour les jeunes",
};

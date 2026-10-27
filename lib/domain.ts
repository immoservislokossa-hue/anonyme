// Domaine couvert par le service : un seul moteur, trois voies.
// Pour réutiliser le projet sur un autre sujet : changer ce fichier, le contenu de data/ et les cas de evals/.

export type Voie = "sexuelle" | "mentale" | "bien-etre";

export const VOIES: { id: Voie; label: string; description: string }[] = [
  { id: "sexuelle", label: "Planification familiale", description: "Contraception, choisir sa méthode, infections, consentement" },
  { id: "mentale", label: "Santé mentale", description: "Stress, tristesse, parler de ce qui pèse" },
  { id: "bien-etre", label: "Bien-être", description: "Sommeil, estime de soi, équilibre" },
];

export function isVoie(value: unknown): value is Voie {
  return value === "sexuelle" || value === "mentale" || value === "bien-etre";
}

export const DOMAIN = {
  label: "la planification familiale, la santé sexuelle, la santé mentale et le bien-être",
  region: "en Afrique de l'Ouest",
  // Libellés des thèmes utilisés dans data/knowledge.json et dans le suivi agrégé.
  themes: {
    methodes: "Contraception et protection",
    effets: "Effets secondaires",
    orientation: "Orientation",
    rumeurs: "Rumeurs",
    ist: "Infections (IST, VIH)",
    consentement: "Consentement et respect",
    urgence: "Après un risque",
    violences: "Violences",
    grossesse: "Grossesse",
    stress: "Stress et anxiété",
    tristesse: "Tristesse et honte",
    detresse: "Détresse",
    sommeil: "Sommeil",
    estime: "Estime de soi",
    activite: "Routine et activité",
  } as Record<string, string>,
} as const;

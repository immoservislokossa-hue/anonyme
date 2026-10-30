// Domaine couvert par le service : la planification familiale et la santé sexuelle des jeunes.
// Pour réutiliser le projet sur un autre sujet : changer ce fichier, le contenu de data/ et les cas de evals/.

export const DOMAIN = {
  label: "la planification familiale et la santé sexuelle des jeunes",
  region: "en Afrique de l'Ouest francophone",
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
    relations: "Relations",
    regles: "Règles et cycle",
    garcons: "Pour les garçons",
    detresse: "Détresse",
  } as Record<string, string>,
} as const;

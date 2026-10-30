// État de la relecture clinique du contenu. Une seule source pour tout le site.
// Tant que personne n'a relu le contenu, on le dit simplement. Quand une relecture a vraiment eu lieu,
// on renseigne NEXT_PUBLIC_CONTENT_REVIEWED_BY (et NEXT_PUBLIC_CONTENT_REVIEW_DATE) et toutes les pages changent d'un coup.

// Relecture déclarée par le fondateur : une infirmière a relu le contenu. Précise son titre et la date avec les variables ci-dessus.
const DEFAULT_REVIEWER = "une infirmière";

export type Review = { by: string; date?: string } | null;

export function reviewFrom(env: Record<string, string | undefined> = process.env): Review {
  const by = env.NEXT_PUBLIC_CONTENT_REVIEWED_BY?.trim() || DEFAULT_REVIEWER;
  if (!by) return null;
  return { by, date: env.NEXT_PUBLIC_CONTENT_REVIEW_DATE?.trim() || undefined };
}

export function reviewLine(review: Review = reviewFrom()): string {
  if (!review) return "Fondé sur le guide de l'OMS (2012). Pas encore relu par un professionnel de santé.";
  return `Fondé sur le guide de l'OMS (2012). Relu par ${review.by}${review.date ? ` (${review.date})` : ""}.`;
}

// « Puis-je commencer aujourd'hui ? » : liste de contrôle du guide OMS (2012, p. 20) pour être relativement
// certaine de ne pas être enceinte avant de commencer une méthode hormonale (pilule, injectables, minidosée).

export const PREGNANCY_QUESTIONS: { id: string; text: string }[] = [
  { id: "allaite", text: "J'ai accouché au cours des 6 derniers mois, j'allaite exclusivement et je n'ai pas eu mes règles depuis." },
  { id: "pas-de-rapport", text: "Je n'ai pas eu de rapport sexuel depuis mes dernières règles ou mon dernier accouchement." },
  { id: "accouchement-recent", text: "J'ai accouché au cours des 4 dernières semaines." },
  { id: "regles-7-jours", text: "Mes règles ont commencé au cours des 7 derniers jours." },
  { id: "fausse-couche", text: "J'ai fait une fausse couche ou subi un avortement au cours des 7 derniers jours." },
  { id: "methode-fiable", text: "J'ai utilisé une méthode de contraception fiable, tout le temps et correctement." },
];

export const PREGNANCY_SIGNS = {
  precoces: ["Retard de règles", "Seins douloureux", "Nausées", "Vomissements", "Urines plus fréquentes", "Fatigue permanente", "Changement de poids", "Humeur qui change", "Changement des habitudes alimentaires"],
  tardifs: ["Seins plus gros", "Mamelons plus foncés", "Pertes vaginales plus abondantes", "Ventre qui grossit", "Mouvements du bébé"],
};

export type PregnancyOutcome = "incomplet" | "peut-commencer" | "attendre" | "signes";

export function evaluatePregnancy(answers: Record<string, boolean | undefined>, hasSigns: boolean): PregnancyOutcome {
  if (hasSigns) return "signes";
  const given = PREGNANCY_QUESTIONS.filter((q) => answers[q.id] !== undefined);
  if (given.length < PREGNANCY_QUESTIONS.length) {
    // Un seul « oui » suffit : on peut conclure sans attendre toutes les réponses.
    return PREGNANCY_QUESTIONS.some((q) => answers[q.id] === true) ? "peut-commencer" : "incomplet";
  }
  return PREGNANCY_QUESTIONS.some((q) => answers[q.id] === true) ? "peut-commencer" : "attendre";
}

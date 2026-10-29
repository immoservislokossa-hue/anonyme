// « Après un rapport à risque » : quoi faire, dans quel ordre, avant quelle échéance.
// Pilule d'urgence : jusqu'à 5 jours, plus efficace le plus tôt possible (guide OMS 2012, p. 16).
// Violence : contraception d'urgence, puis orientation pour les IST et le VIH (p. 18).
// Oubli de pilule et injection en retard : p. 4 et 6. Traitement d'urgence du VIH : dans les 72 heures (recommandation OMS).

export type Event = "preservatif" | "sans-protection" | "pilule-oubliee" | "injection-retard" | "force";
export type When = "moins-24h" | "1-3-jours" | "3-5-jours" | "plus-5-jours";

export const EVENTS: { id: Event; label: string }[] = [
  { id: "preservatif", label: "Le préservatif a craqué ou a glissé" },
  { id: "sans-protection", label: "Nous n'avons utilisé aucune protection" },
  { id: "pilule-oubliee", label: "J'ai oublié ma pilule (un rapport a eu lieu)" },
  { id: "injection-retard", label: "Mon injection est en retard (un rapport a eu lieu)" },
  { id: "force", label: "On m'a forcé(e) à un rapport" },
];

export const WHENS: { id: When; label: string; hours: number }[] = [
  { id: "moins-24h", label: "Il y a moins de 24 heures", hours: 12 },
  { id: "1-3-jours", label: "Il y a 1 à 3 jours (dans les 72 heures)", hours: 48 },
  { id: "3-5-jours", label: "Il y a 3 à 5 jours", hours: 96 },
  { id: "plus-5-jours", label: "Il y a plus de 5 jours", hours: 150 },
];

export type Urgency = "maintenant" | "aujourdhui" | "bientot" | "info";

export type Action = { id: string; urgency: Urgency; title: string; text: string; deadline?: string };

export function riskActions(event: Event, when: When): Action[] {
  const hours = WHENS.find((w) => w.id === when)?.hours ?? 0;
  const within5Days = hours <= 120;
  const within72h = hours <= 72;
  const actions: Action[] = [];

  if (event === "force") {
    actions.push({
      id: "soutien",
      urgency: "maintenant",
      title: "Tu n'es pas fautif(ve)",
      text: "Ce qui s'est passé n'est pas ta faute. Va dans un endroit sûr et parle à une personne de confiance ou à un professionnel de santé. Tu as le droit d'être soigné(e) et écouté(e), sans jugement.",
    });
  }

  if (event === "injection-retard") {
    actions.push({
      id: "injection",
      urgency: "aujourdhui",
      title: "Fais ton injection dès que possible",
      text: "DMPA (tous les 3 mois) : encore possible jusqu'à 4 semaines de retard. NET-EN (tous les 2 mois) : jusqu'à 2 semaines. Au-delà, utilise un préservatif et reviens le plus tôt possible (guide OMS, p. 6).",
    });
  }

  if (event === "pilule-oubliee") {
    actions.push({
      id: "pilule",
      urgency: "maintenant",
      title: "Prends ta pilule maintenant",
      text: "Prends-la dès que possible, tu peux en prendre 2 à la fois. Si tu as oublié plus de 2 jours de suite, utilise le préservatif pendant 7 jours et continue ta boîte (guide OMS, p. 4). Pilule minidosée sans allaitement : plus de 3 heures de retard, préservatif pendant 2 jours (p. 5).",
    });
  }

  if (within5Days) {
    actions.push({
      id: "urgence",
      urgency: hours <= 24 ? "maintenant" : "aujourdhui",
      title: "La pilule d'urgence pour éviter une grossesse",
      text: "À prendre dès que possible, et jusqu'à 5 jours après le rapport. Plus tôt tu la prends, mieux elle marche. Elle ne provoque pas d'avortement (guide OMS, p. 16). En pharmacie ou au centre de santé.",
      deadline: "Jusqu'à 5 jours après le rapport",
    });
  } else {
    actions.push({
      id: "urgence-tard",
      urgency: "bientot",
      title: "La pilule d'urgence n'est plus indiquée",
      text: "Elle se prend jusqu'à 5 jours après le rapport. Parle vite à un professionnel de santé de tes options et fais un test de grossesse si tes règles sont en retard.",
    });
  }

  if (event !== "injection-retard" && event !== "pilule-oubliee") {
    actions.push(
      within72h
        ? {
            id: "vih",
            urgency: "maintenant",
            title: "Risque de VIH : va au centre aujourd'hui",
            text: "Si le ou la partenaire a le VIH ou si tu ne sais pas, un traitement d'urgence existe. Il doit être commencé le plus tôt possible, dans les 72 heures. Le personnel te dira si tu en as besoin.",
            deadline: "Dans les 72 heures",
          }
        : {
            id: "vih-test",
            urgency: "bientot",
            title: "Fais un test VIH",
            text: "Le traitement d'urgence n'est plus possible après 72 heures. Un test de dépistage et un échange avec un professionnel restent importants.",
          },
    );
  }

  actions.push({
    id: "ist",
    urgency: "bientot",
    title: "Fais un test pour les IST",
    text: "Beaucoup d'IST n'ont aucun signe. Un test au centre de santé permet de les trouver et de les soigner. Dis simplement ce qui s'est passé : tu peux demander la confidentialité.",
  });

  actions.push({
    id: "test-grossesse",
    urgency: "bientot",
    title: "Un test de grossesse si tes règles sont en retard",
    text: "Si tes règles ont plus d'une semaine de retard, fais un test (pharmacie ou centre). Si le test est positif ou si tu as un doute, va vite au centre de santé.",
  });

  actions.push({
    id: "methode",
    urgency: "info",
    title: "Choisir une méthode pour la suite",
    text: "La contraception régulière est plus efficace que la pilule d'urgence. Un professionnel peut t'aider à choisir. Garde aussi des préservatifs chez toi.",
  });

  const order: Urgency[] = ["maintenant", "aujourdhui", "bientot", "info"];
  return actions.sort((a, b) => order.indexOf(a.urgency) - order.indexOf(b.urgency));
}

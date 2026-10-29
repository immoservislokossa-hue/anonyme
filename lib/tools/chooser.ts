// « Choisir ma méthode » : les règles viennent du Guide de la planification familiale de l'OMS (2012).
// Pages citées : p. 2 (questions à poser), p. 3 (méthodes et lieux), p. 6 (injectables), p. 14 (jours fixes),
// p. 17-18 (situations particulières), p. 19 (problèmes de santé). L'outil oriente, il ne prescrit pas.

export type MethodId =
  | "implants"
  | "sterilet"
  | "sterilisation-feminine"
  | "vasectomie"
  | "pilule"
  | "pilule-minidosee"
  | "injectables"
  | "mama"
  | "preservatif-masculin"
  | "preservatif-feminin"
  | "jours-fixes"
  | "retrait";

export type Status = "possible" | "attendre" | "discuter" | "deconseille";

export type ConditionId =
  | "hypertension"
  | "fume35"
  | "migraine"
  | "medicaments"
  | "saignements"
  | "cardio"
  | "diabete"
  | "caillot"
  | "cancer-sein"
  | "foie";

type Rule = "ok" | "non";

// Page 19 du guide : ce que la pilule, les injectables et la pilule minidosée permettent, problème par problème.
export const CONDITIONS: { id: ConditionId; label: string; pilule: Rule; injectables: Rule; minidosee: Rule }[] = [
  { id: "hypertension", label: "Tension artérielle élevée (hypertension)", pilule: "non", injectables: "ok", minidosee: "ok" },
  { id: "fume35", label: "Je fume et j'ai plus de 35 ans", pilule: "non", injectables: "ok", minidosee: "ok" },
  { id: "migraine", label: "Migraines fortes et répétées (souvent d'un seul côté, avec nausées, aggravées par la lumière ou le bruit)", pilule: "non", injectables: "ok", minidosee: "ok" },
  { id: "medicaments", label: "Je prends des médicaments contre la tuberculose ou l'épilepsie, ou du ritonavir (traitement du VIH)", pilule: "non", injectables: "ok", minidosee: "ok" },
  { id: "saignements", label: "Saignements inhabituels entre les règles ou après un rapport", pilule: "ok", injectables: "non", minidosee: "ok" },
  { id: "cardio", label: "Maladie grave du cœur ou accident vasculaire cérébral dans le passé", pilule: "non", injectables: "non", minidosee: "ok" },
  { id: "diabete", label: "Diabète depuis plus de 20 ans", pilule: "non", injectables: "non", minidosee: "ok" },
  { id: "caillot", label: "Caillot de sang dans les jambes ou les poumons dans le passé", pilule: "non", injectables: "non", minidosee: "non" },
  { id: "cancer-sein", label: "Cancer du sein dans le passé", pilule: "non", injectables: "non", minidosee: "non" },
  { id: "foie", label: "Maladie grave du foie ou jaunisse", pilule: "non", injectables: "non", minidosee: "non" },
];

export type Answers = {
  sex: "femme" | "homme";
  children: "plus-tard" | "plus-du-tout";
  // Après un accouchement : « non », « moins de 6 semaines », « de 6 semaines à 6 mois ».
  birth: "non" | "moins-6-semaines" | "6-semaines-6-mois";
  // Allaitement : seulement utile après un accouchement récent.
  breastfeeding: "non" | "exclusif-sans-regles" | "autre";
  protectIst: boolean;
  noDaily: boolean;
  // Cycle régulier (entre 26 et 32 jours) : utile pour la méthode des jours fixes.
  cycle: "regulier" | "irregulier" | "inconnu";
  conditions: ConditionId[];
};

export const EMPTY_ANSWERS: Answers = {
  sex: "femme",
  children: "plus-tard",
  birth: "non",
  breastfeeding: "non",
  protectIst: false,
  noDaily: false,
  cycle: "inconnu",
  conditions: [],
};

export type Fit = {
  id: MethodId;
  name: string;
  tier: 1 | 2 | 3 | 4;
  status: Status;
  reasons: string[];
  score: number;
};

const METHODS: { id: MethodId; name: string; tier: 1 | 2 | 3 | 4; women: boolean; men: boolean; clinic: boolean }[] = [
  { id: "implants", name: "Les implants", tier: 1, women: true, men: false, clinic: true },
  { id: "sterilet", name: "Le stérilet", tier: 1, women: true, men: false, clinic: true },
  { id: "sterilisation-feminine", name: "La stérilisation féminine", tier: 1, women: true, men: false, clinic: true },
  { id: "vasectomie", name: "La vasectomie", tier: 1, women: false, men: true, clinic: true },
  { id: "pilule", name: "La pilule", tier: 2, women: true, men: false, clinic: false },
  { id: "pilule-minidosee", name: "La pilule minidosée", tier: 2, women: true, men: false, clinic: false },
  { id: "injectables", name: "Les contraceptifs injectables", tier: 2, women: true, men: false, clinic: false },
  { id: "mama", name: "L'allaitement maternel (MAMA)", tier: 2, women: true, men: false, clinic: false },
  { id: "preservatif-masculin", name: "Le préservatif masculin", tier: 3, women: true, men: true, clinic: false },
  { id: "preservatif-feminin", name: "Le préservatif féminin", tier: 3, women: true, men: false, clinic: false },
  { id: "jours-fixes", name: "La méthode des jours fixes", tier: 3, women: true, men: false, clinic: false },
  { id: "retrait", name: "Le retrait", tier: 4, women: true, men: true, clinic: false },
];

const PERMANENT: MethodId[] = ["sterilisation-feminine", "vasectomie"];
const LONG_ACTING: MethodId[] = ["implants", "sterilet", "sterilisation-feminine", "vasectomie", "injectables"];
const HORMONAL_UNCOVERED: MethodId[] = ["implants"];
const NON_HORMONAL_CLINIC: MethodId[] = ["sterilet", "sterilisation-feminine", "vasectomie"];

function conditionRule(method: MethodId, condition: ConditionId): Rule {
  const row = CONDITIONS.find((c) => c.id === condition);
  if (!row) return "ok";
  if (method === "pilule") return row.pilule;
  if (method === "injectables") return row.injectables;
  if (method === "pilule-minidosee") return row.minidosee;
  return "ok";
}

export function evaluateMethod(id: MethodId, answers: Answers): Fit {
  const meta = METHODS.find((m) => m.id === id);
  if (!meta) throw new Error(`méthode inconnue : ${id}`);
  const reasons: string[] = [];
  let status: Status = "possible";
  const worse = (next: Status) => {
    const order: Status[] = ["possible", "attendre", "discuter", "deconseille"];
    if (order.indexOf(next) > order.indexOf(status)) status = next;
  };

  // 1. Problèmes de santé (guide p. 19)
  for (const conditionId of answers.conditions) {
    const condition = CONDITIONS.find((c) => c.id === conditionId);
    if (!condition) continue;
    if (id === "pilule" || id === "injectables" || id === "pilule-minidosee") {
      if (conditionRule(id, conditionId) === "non") {
        worse("deconseille");
        reasons.push(`Pas possible avec : ${condition.label.split(" (")[0].toLowerCase()} (guide OMS, p. 19).`);
      }
    } else if (HORMONAL_UNCOVERED.includes(id) || NON_HORMONAL_CLINIC.includes(id)) {
      worse("discuter");
    }
  }
  if (answers.conditions.length > 0 && (HORMONAL_UNCOVERED.includes(id) || NON_HORMONAL_CLINIC.includes(id))) {
    reasons.push("Le guide ne détaille pas cette méthode pour ton problème de santé : un professionnel doit confirmer.");
  }

  // 2. Après un accouchement (guide p. 17)
  if (answers.sex === "femme" && answers.birth !== "non") {
    const nursing = answers.breastfeeding !== "non";
    const young = answers.birth === "moins-6-semaines";
    if (id === "pilule") {
      if (nursing) {
        worse("attendre");
        reasons.push("Quand on allaite : pas avant 6 mois après l'accouchement (p. 17).");
      } else if (young) {
        worse("attendre");
        reasons.push("Pas avant 6 semaines après l'accouchement (p. 17).");
      }
    }
    if ((id === "pilule-minidosee" || id === "injectables" || id === "implants") && nursing && young) {
      worse("attendre");
      reasons.push("Quand on allaite : à partir de 6 semaines après l'accouchement (p. 17).");
    }
    if (id === "sterilisation-feminine" && young) {
      reasons.push("Possible juste après l'accouchement ou à partir de 6 semaines (p. 17).");
    }
    if (id === "sterilet") reasons.push("Possible juste après l'accouchement ou à partir de 4 semaines (p. 17).");
  }

  // 3. Allaitement maternel : méthode MAMA (guide p. 13)
  if (id === "mama") {
    if (answers.birth === "non" || answers.breastfeeding !== "exclusif-sans-regles") {
      worse("deconseille");
      reasons.push("Elle ne marche que si le bébé a moins de 6 mois, s'il ne boit que ton lait et si tes règles ne sont pas revenues (p. 13).");
    } else {
      reasons.push("Efficace jusqu'à 6 mois si tu allaites exclusivement et que tes règles ne reviennent pas (p. 13). Prévois une autre méthode ensuite.");
    }
  }

  // 4. Méthodes définitives (guide p. 11-12 et 18)
  if (PERMANENT.includes(id)) {
    if (answers.children === "plus-tard") {
      worse("deconseille");
      reasons.push("C'est une méthode définitive : seulement si tu ne veux plus du tout d'enfants (p. 11-12).");
    } else {
      reasons.push("Méthode définitive et très efficace pour qui ne veut plus d'enfants (p. 18).");
    }
  }

  // 5. Méthode des jours fixes (guide p. 14)
  if (id === "jours-fixes") {
    if (answers.cycle === "irregulier") {
      worse("deconseille");
      reasons.push("Elle marche mieux avec des règles régulières : choisis une autre méthode si elles sont irrégulières (p. 14).");
    } else if (answers.cycle === "inconnu") {
      worse("discuter");
      reasons.push("Il faut des règles régulières, entre 26 et 32 jours (p. 14, 26).");
    }
    if (answers.cycle !== "irregulier") {
      reasons.push("Pas d'effets secondaires, mais 12 jours par mois sans rapport ou avec préservatif, et les deux partenaires doivent être d'accord (p. 14).");
    }
  }

  // 6. Atouts selon ce qui compte pour la personne
  if (answers.protectIst) {
    if (id === "preservatif-masculin" || id === "preservatif-feminin") {
      reasons.unshift("Seul le préservatif protège aussi des IST, dont le VIH/sida (p. 3).");
    } else {
      reasons.push("Ne protège pas des IST : ajoute le préservatif (p. 3).");
    }
  }
  if (answers.noDaily && LONG_ACTING.includes(id) && !PERMANENT.includes(id)) {
    reasons.push("Rien à prendre tous les jours.");
  }
  if (answers.noDaily && (id === "pilule" || id === "pilule-minidosee")) {
    reasons.push("Il faut en prendre une chaque jour, à la même heure pour la minidosée.");
  }
  if (id === "injectables") reasons.push("Peut être utilisée sans que les autres le sachent (p. 6).");

  // 7. Où aller
  if (meta.clinic) reasons.push("Posée ou faite au centre de santé ou à l'hôpital (p. 3).");

  // Score : la solution la plus efficace d'abord, puis ce qui compte pour la personne.
  let score = 5 - meta.tier;
  if (answers.protectIst && (id === "preservatif-masculin" || id === "preservatif-feminin")) score += 3;
  if (answers.noDaily && LONG_ACTING.includes(id)) score += 1;
  if (answers.noDaily && (id === "pilule" || id === "pilule-minidosee")) score -= 1;
  if (answers.children === "plus-du-tout" && PERMANENT.includes(id)) score += 1;

  return { id, name: meta.name, tier: meta.tier, status, reasons, score };
}

export function chooseMethods(answers: Answers): Fit[] {
  const pool = METHODS.filter((m) => (answers.sex === "femme" ? m.women : m.men));
  const fits = pool.map((m) => evaluateMethod(m.id, answers));
  const order: Status[] = ["possible", "attendre", "discuter", "deconseille"];
  return fits.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || b.score - a.score);
}

export const STATUS_LABEL: Record<Status, string> = {
  possible: "Possible",
  attendre: "À attendre un peu",
  discuter: "À confirmer avec un professionnel",
  deconseille: "Pas adaptée à ta situation",
};

// Résumé à montrer à un professionnel de santé : la personne n'a rien à réexpliquer.
export function consultationSummary(answers: Answers, fits: Fit[]): string {
  const lines: string[] = ["Résumé pour ma consultation (outil Alviosa, d'après le guide OMS)", ""];
  lines.push(answers.sex === "femme" ? "Je suis une femme." : "Je suis un homme.");
  lines.push(answers.children === "plus-du-tout" ? "Je ne veux plus d'enfants." : "Je veux peut-être des enfants plus tard.");
  if (answers.birth !== "non") {
    lines.push(answers.birth === "moins-6-semaines" ? "J'ai accouché il y a moins de 6 semaines." : "J'ai accouché il y a 6 semaines à 6 mois.");
    if (answers.breastfeeding === "exclusif-sans-regles") lines.push("J'allaite exclusivement et mes règles ne sont pas revenues.");
    else if (answers.breastfeeding === "autre") lines.push("J'allaite, mais pas exclusivement, ou mes règles sont revenues.");
  }
  if (answers.protectIst) lines.push("Je veux aussi me protéger des IST et du VIH/sida.");
  if (answers.noDaily) lines.push("Je préfère ne pas y penser tous les jours.");
  if (answers.sex === "femme" && answers.cycle !== "inconnu") {
    lines.push(answers.cycle === "regulier" ? "Mes règles sont régulières (26 à 32 jours)." : "Mes règles sont irrégulières.");
  }
  const conditions = answers.conditions.map((id) => CONDITIONS.find((c) => c.id === id)?.label).filter(Boolean);
  lines.push(conditions.length > 0 ? `Problèmes de santé : ${conditions.join(" ; ")}.` : "Pas de problème de santé signalé.");
  lines.push("");
  const names = (status: Status) => fits.filter((f) => f.status === status).map((f) => f.name);
  if (names("possible").length) lines.push(`Méthodes qui m'intéressent : ${names("possible").slice(0, 4).join(", ")}.`);
  if (names("discuter").length) lines.push(`À confirmer : ${names("discuter").join(", ")}.`);
  if (names("deconseille").length) lines.push(`Pas adaptées selon l'outil : ${names("deconseille").join(", ")}.`);
  lines.push("");
  lines.push("Questions à poser : effets possibles, quand revenir, que faire en cas d'oubli ou de problème, où trouver la contraception d'urgence et des préservatifs.");
  return lines.join("\n");
}

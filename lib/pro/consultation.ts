// Consultation guidée : le déroulé de l'échange et la liste de qualité du conseil.
// Les huit points reprennent les deux manques mesurés par PMA2020 au Burkina Faso (2017-18) : autres méthodes présentées (64,9 %) et effets
// secondaires expliqués (52,1 %), et les principes d'accueil des jeunes du guide OMS. Aucune donnée sur le client n'est enregistrée.

export const COUNSELING_CHECKS = [
  { id: "accueil", label: "J'ai accueilli la personne sans juger son âge ni sa situation" },
  { id: "ecoute", label: "J'ai d'abord écouté ses besoins, ses craintes et ses questions" },
  { id: "autresMethodes", label: "Je lui ai présenté plusieurs méthodes, pas une seule" },
  { id: "effets", label: "Je lui ai expliqué les effets possibles et ceux qui doivent la faire revenir" },
  { id: "oubli", label: "Je lui ai dit quoi faire en cas d'oubli, de retard ou pour arrêter" },
  { id: "retour", label: "Nous avons fixé une date de retour" },
  { id: "confidentialite", label: "J'ai rappelé que tout reste confidentiel" },
  { id: "choix", label: "C'est elle ou lui qui a choisi (ou décidé d'y réfléchir)" },
] as const;

export type CheckId = (typeof COUNSELING_CHECKS)[number]["id"];

export const WELCOME_REMINDERS = [
  "Dis bonjour, présente-toi, et dis que tout ce qui est dit reste confidentiel.",
  "Ne demande pas l'âge ni la situation de famille pour conditionner l'aide : demande seulement ce dont tu as besoin pour conseiller (grossesse possible, allaitement, problèmes de santé).",
  "Écoute d'abord. Ensuite seulement, informe.",
  "Pour un jeune ou une personne non mariée : mêmes droits à l'information. Les règles légales dépendent du pays : vérifie-les et oriente si tu ne peux pas aider.",
];

export type Bilan = {
  consultations: number;
  checks: Record<CheckId, number>;
  training: { completed: number; pointsSum: number; maxSum: number };
  since: string;
};

export function emptyBilan(now: Date = new Date()): Bilan {
  const checks = {} as Record<CheckId, number>;
  for (const c of COUNSELING_CHECKS) checks[c.id] = 0;
  return { consultations: 0, checks, training: { completed: 0, pointsSum: 0, maxSum: 0 }, since: now.toISOString().slice(0, 10) };
}

export function recordConsultation(bilan: Bilan, done: CheckId[]): Bilan {
  const checks = { ...bilan.checks };
  for (const id of new Set(done)) if (id in checks) checks[id] += 1;
  return { ...bilan, consultations: bilan.consultations + 1, checks };
}

export function recordTraining(bilan: Bilan, points: number, max: number): Bilan {
  return { ...bilan, training: { completed: bilan.training.completed + 1, pointsSum: bilan.training.pointsSum + points, maxSum: bilan.training.maxSum + max } };
}

export function qualityRate(bilan: Bilan, id: CheckId): number | null {
  return bilan.consultations === 0 ? null : Math.round((bilan.checks[id] / bilan.consultations) * 100);
}

// Ce qui part vers le Pilotage : des comptes, jamais de texte ni d'identité.
export type BilanPayload = {
  zone: string | null;
  consultations: number;
  checks: Record<CheckId, number>;
  trainingCompleted: number;
  trainingPct: number | null;
};

export function toPayload(bilan: Bilan, zone: string | null): BilanPayload {
  const t = bilan.training;
  return {
    zone,
    consultations: bilan.consultations,
    checks: bilan.checks,
    trainingCompleted: t.completed,
    trainingPct: t.maxSum === 0 ? null : Math.round((t.pointsSum / t.maxSum) * 100),
  };
}

export function validatePayload(raw: unknown, zones: string[]): BilanPayload | null {
  if (typeof raw !== "object" || raw === null) return null;
  const data = raw as Record<string, unknown>;
  const count = (v: unknown, max = 5000): number | null => (typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= max ? v : null);
  const consultations = count(data.consultations);
  if (consultations === null || consultations === 0) return null;
  const checks = {} as Record<CheckId, number>;
  const given = (typeof data.checks === "object" && data.checks !== null ? data.checks : {}) as Record<string, unknown>;
  for (const c of COUNSELING_CHECKS) {
    const n = count(given[c.id]);
    if (n === null || n > consultations) return null;
    checks[c.id] = n;
  }
  const trainingCompleted = count(data.trainingCompleted, 500);
  if (trainingCompleted === null) return null;
  const pct = data.trainingPct === null || data.trainingPct === undefined ? null : count(data.trainingPct, 100);
  if (data.trainingPct != null && pct === null) return null;
  const zone = typeof data.zone === "string" && zones.includes(data.zone) ? data.zone : null;
  return { zone, consultations, checks, trainingCompleted, trainingPct: pct };
}

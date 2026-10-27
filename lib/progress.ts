// Progression d'une personne, calculée sur l'appareil. Rien n'est envoyé à un serveur.

export type Progress = {
  version: 1;
  days: string[];
  chroniclesRead: string[];
  quizAnswers: Record<string, boolean>;
  questionsAsked: number;
  visitPrepared: boolean;
};

export const emptyProgress: Progress = {
  version: 1,
  days: [],
  chroniclesRead: [],
  quizAnswers: {},
  questionsAsked: 0,
  visitPrepared: false,
};

const POINTS = {
  visitDay: 5,
  question: 10,
  chronicle: 15,
  quizCorrect: 10,
  visitPrepared: 20,
} as const;

const MAX_QUESTION_POINTS = 10;
const MAX_DAYS_KEPT = 120;

export function dayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function previousDay(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return dayKey(date);
}

export function registerVisit(progress: Progress, date: Date = new Date()): Progress {
  const key = dayKey(date);
  if (progress.days.includes(key)) return progress;
  return { ...progress, days: [...progress.days, key].slice(-MAX_DAYS_KEPT) };
}

// Série de jours consécutifs. Un jour manqué remet la série à zéro sans pénalité sur les points.
export function streak(progress: Progress, date: Date = new Date()): number {
  const days = new Set(progress.days);
  let cursor = dayKey(date);
  if (!days.has(cursor)) cursor = previousDay(cursor);

  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor = previousDay(cursor);
  }
  return count;
}

export function quizCorrectCount(progress: Progress): number {
  return Object.values(progress.quizAnswers).filter(Boolean).length;
}

export function points(progress: Progress): number {
  const questionPoints = Math.min(progress.questionsAsked, MAX_QUESTION_POINTS) * POINTS.question;
  return (
    progress.days.length * POINTS.visitDay +
    questionPoints +
    progress.chroniclesRead.length * POINTS.chronicle +
    quizCorrectCount(progress) * POINTS.quizCorrect +
    (progress.visitPrepared ? POINTS.visitPrepared : 0)
  );
}

export type Level = { index: number; label: string; floor: number; next: number | null; ratio: number };

const LEVELS = [
  { label: "Curieuse", floor: 0 },
  { label: "Informée", floor: 40 },
  { label: "Confiante", floor: 100 },
  { label: "Relais", floor: 200 },
];

export function level(total: number): Level {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (total >= LEVELS[i].floor) index = i;
  }
  const current = LEVELS[index];
  const next = index + 1 < LEVELS.length ? LEVELS[index + 1].floor : null;
  const ratio = next === null ? 1 : (total - current.floor) / (next - current.floor);
  return { index, label: current.label, floor: current.floor, next, ratio: Math.max(0, Math.min(1, ratio)) };
}

export type Badge = { id: string; label: string; hint: string; earned: boolean };

export function badges(progress: Progress, date: Date = new Date()): Badge[] {
  return [
    { id: "question", label: "Première question", hint: "Pose une question", earned: progress.questionsAsked >= 1 },
    { id: "chroniques", label: "À l'écoute", hint: "Lis 3 chroniques", earned: progress.chroniclesRead.length >= 3 },
    { id: "quiz", label: "Vrai ou faux", hint: "5 bonnes réponses au quiz", earned: quizCorrectCount(progress) >= 5 },
    { id: "serie", label: "3 jours de suite", hint: "Revenez 3 jours de suite", earned: streak(progress, date) >= 3 },
    { id: "visite", label: "Visite préparée", hint: "Prépare ta visite", earned: progress.visitPrepared },
  ];
}

// Lecture tolérante : un contenu invalide ou ancien revient à une progression vide.
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress;
  try {
    const value = JSON.parse(raw) as Partial<Progress>;
    if (value.version !== 1) return emptyProgress;
    return {
      version: 1,
      days: Array.isArray(value.days) ? value.days.filter((d): d is string => typeof d === "string") : [],
      chroniclesRead: Array.isArray(value.chroniclesRead)
        ? value.chroniclesRead.filter((d): d is string => typeof d === "string")
        : [],
      quizAnswers:
        value.quizAnswers && typeof value.quizAnswers === "object"
          ? Object.fromEntries(
              Object.entries(value.quizAnswers).filter(([, v]) => typeof v === "boolean"),
            )
          : {},
      questionsAsked: typeof value.questionsAsked === "number" ? Math.max(0, Math.floor(value.questionsAsked)) : 0,
      visitPrepared: value.visitPrepared === true,
    };
  } catch {
    return emptyProgress;
  }
}

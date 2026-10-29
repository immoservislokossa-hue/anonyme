// « Mon plan » : les dates de ma méthode, pour ne rien oublier.
// Règles tirées du Guide de la planification familiale de l'OMS (2012) : injectables p. 6, pilule p. 4,
// pilule minidosée p. 5, stérilet p. 10 (12 ans), implants p. 9 (3 à 5 ans), vasectomie p. 12 (3 mois).
// Les dates restent sur l'appareil. Un fichier calendrier (.ics) peut porter un texte neutre pour rester discret.

export type PlanMethod = "pilule" | "pilule-minidosee" | "dmpa" | "net-en" | "implants" | "sterilet" | "vasectomie";

export type Plan = {
  method: PlanMethod;
  // Date de départ : première prise, dernière injection, pose, opération (format AAAA-MM-JJ).
  start: string;
  neutral: boolean;
  // Heure du rappel quotidien pour les pilules (HH:MM).
  time: string;
};

export const PLAN_METHODS: { id: PlanMethod; name: string; dateLabel: string; hint: string }[] = [
  { id: "pilule", name: "La pilule", dateLabel: "Premier jour de ma boîte en cours", hint: "Une pilule chaque jour." },
  { id: "pilule-minidosee", name: "La pilule minidosée", dateLabel: "Premier jour de ma boîte en cours", hint: "Une pilule chaque jour, à la même heure." },
  { id: "dmpa", name: "L'injection tous les 3 mois (DMPA)", dateLabel: "Date de ma dernière injection", hint: "Une injection tous les 3 mois." },
  { id: "net-en", name: "L'injection tous les 2 mois (NET-EN)", dateLabel: "Date de ma dernière injection", hint: "Une injection tous les 2 mois." },
  { id: "implants", name: "Les implants", dateLabel: "Date de la pose", hint: "Durent 3 à 5 ans selon le type." },
  { id: "sterilet", name: "Le stérilet", dateLabel: "Date de la pose", hint: "Peut durer 12 ans." },
  { id: "vasectomie", name: "La vasectomie", dateLabel: "Date de l'opération", hint: "Efficace après 3 mois." },
];

export type Step = {
  label: string;
  due: Date;
  // Dernier jour où le retard reste acceptable selon le guide (injections).
  graceEnd?: Date;
  rule: string;
};

export type Standing = "a-jour" | "bientot" | "dans-le-delai" | "trop-tard" | "quotidien" | "efficace-bientot";

export type Status = { standing: Standing; daysLeft: number; step: Step | null; message: string };

export function parseIso(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

function addMonths(date: Date, months: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysFromTo(from: Date, to: Date): number {
  return Math.round((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / 86_400_000);
}

// Les prochaines étapes datées d'une méthode, à partir de sa date de départ.
export function stepsFor(plan: Plan, count = 4): Step[] {
  const start = parseIso(plan.start);
  if (!start) return [];
  switch (plan.method) {
    case "dmpa":
      return Array.from({ length: count }, (_, i) => {
        const due = addDays(start, 91 * (i + 1)); // 13 semaines : « tous les 3 mois »
        return {
          label: "Prochaine injection",
          due,
          graceEnd: addDays(due, 28),
          rule: "Injection tous les 3 mois. Encore possible jusqu'à 4 semaines de retard. Au-delà : préservatif, et reviens le plus tôt possible (guide OMS, p. 6).",
        };
      });
    case "net-en":
      return Array.from({ length: count }, (_, i) => {
        const due = addDays(start, 56 * (i + 1)); // 8 semaines : « tous les 2 mois »
        return {
          label: "Prochaine injection",
          due,
          graceEnd: addDays(due, 14),
          rule: "Injection tous les 2 mois. Encore possible jusqu'à 2 semaines de retard. Au-delà : préservatif, et reviens le plus tôt possible (guide OMS, p. 6).",
        };
      });
    case "pilule":
    case "pilule-minidosee":
      // Une boîte dure 28 jours : on prévoit la suivante avant d'en manquer (guide : « réapprovisionne-toi avant d'en manquer »).
      return Array.from({ length: count }, (_, i) => ({
        label: "Prochaine boîte à avoir en main",
        due: addDays(start, 21 + 28 * i),
        rule: "Assure-toi d'avoir assez de pilules et réapprovisionne-toi avant d'en manquer (guide OMS, p. 4 et 5).",
      }));
    case "implants":
      return [
        {
          label: "Demander si tes implants doivent être changés",
          due: addDays(addMonths(start, 36), 0),
          rule: "Les implants durent 3 à 5 ans selon le type. Demande à un professionnel combien de temps durent les tiens (guide OMS, p. 9). Tu peux les faire retirer à tout moment.",
        },
      ];
    case "sterilet":
      return [
        {
          label: "Demander si ton stérilet doit être changé",
          due: addMonths(start, 12 * 12 - 3),
          rule: "Le stérilet peut être utilisé pendant 12 ans (guide OMS, p. 10). Tu peux le faire retirer à tout moment.",
        },
      ];
    case "vasectomie":
      return [
        {
          label: "La vasectomie devient efficace",
          due: addMonths(start, 3),
          rule: "Efficace au bout de 3 mois. D'ici là, utilisez une autre méthode (guide OMS, p. 12).",
        },
      ];
    default:
      return [];
  }
}

export function statusOf(plan: Plan, today: Date = new Date()): Status {
  const day = startOfDay(today);
  if (plan.method === "pilule" || plan.method === "pilule-minidosee") {
    const step = stepsFor(plan, 1)[0] ?? null;
    const left = step ? daysFromTo(day, step.due) : 0;
    return {
      standing: "quotidien",
      daysLeft: left,
      step,
      message: plan.method === "pilule" ? "Une pilule par jour. En cas d'oubli : prends-la dès que possible (p. 4)." : "Une pilule par jour, à la même heure (p. 5).",
    };
  }
  const steps = stepsFor(plan, 12);
  if (steps.length === 0) return { standing: "a-jour", daysLeft: 0, step: null, message: "" };
  // La prochaine étape est toujours la première après la dernière date notée. Si elle est dépassée, la personne
  // le voit tant qu'elle n'a pas mis à jour sa date (« J'ai fait mon injection »).
  const current = steps[0];
  const untilDue = daysFromTo(day, current.due);
  if (plan.method === "vasectomie") {
    return untilDue > 0
      ? { standing: "efficace-bientot", daysLeft: untilDue, step: current, message: "Pas encore efficace : utilise une autre méthode jusqu'à cette date." }
      : { standing: "a-jour", daysLeft: 0, step: current, message: "Les 3 mois sont passés : la vasectomie est efficace." };
  }
  if (untilDue > 7) return { standing: "a-jour", daysLeft: untilDue, step: current, message: "Tout est à jour." };
  if (untilDue >= 0) return { standing: "bientot", daysLeft: untilDue, step: current, message: "C'est bientôt : prends rendez-vous." };
  if (current.graceEnd && daysFromTo(day, current.graceEnd) >= 0) {
    return { standing: "dans-le-delai", daysLeft: untilDue, step: current, message: "Tu es en retard, mais l'injection est encore possible. Va au centre dès que possible." };
  }
  if (current.graceEnd) {
    return { standing: "trop-tard", daysLeft: untilDue, step: current, message: "Le délai est dépassé : utilise un préservatif et va faire ton injection le plus tôt possible. Si tu as eu un rapport non protégé, la contraception d'urgence existe (jusqu'à 5 jours)." };
  }
  return { standing: "bientot", daysLeft: untilDue, step: current, message: "Cette date est passée : demande conseil à un professionnel." };
}

function icsDate(date: Date): string {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

// Calendrier des rappels : un événement par étape, une alerte 3 jours avant, et pour la pilule un rappel chaque jour.
// En mode neutre, rien ne dit de quoi il s'agit : « Rappel santé ».
export function toIcs(plan: Plan, now: Date = new Date(), count = 6): string {
  const method = PLAN_METHODS.find((m) => m.id === plan.method);
  const stamp = `${icsDate(now)}T000000Z`;
  const events: string[] = [];
  const title = (text: string) => (plan.neutral ? "Rappel santé" : text);
  const note = (text: string) => (plan.neutral ? "" : text);

  for (const [i, step] of stepsFor(plan, count).entries()) {
    events.push(
      [
        "BEGIN:VEVENT",
        `UID:alviosa-plan-${plan.method}-${i}@alviosa`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${icsDate(step.due)}`,
        `DTEND;VALUE=DATE:${icsDate(addDays(step.due, 1))}`,
        `SUMMARY:${escapeText(title(step.label))}`,
        ...(plan.neutral ? [] : [`DESCRIPTION:${escapeText(note(step.rule))}`]),
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeText(title("Rappel"))}`,
        "TRIGGER:-P3D",
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n"),
    );
  }

  if ((plan.method === "pilule" || plan.method === "pilule-minidosee") && /^\d{2}:\d{2}$/.test(plan.time)) {
    const [hour, minute] = plan.time.split(":");
    const today = startOfDay(now);
    events.push(
      [
        "BEGIN:VEVENT",
        `UID:alviosa-plan-${plan.method}-daily@alviosa`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${icsDate(today)}T${hour}${minute}00`,
        `DTEND:${icsDate(today)}T${hour}${minute}00`,
        "RRULE:FREQ=DAILY",
        `SUMMARY:${escapeText(title(method?.name ?? "Rappel"))}`,
        ...(plan.neutral ? [] : [`DESCRIPTION:${escapeText(note("Une pilule chaque jour, à la même heure."))}`]),
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeText(title("Rappel"))}`,
        "TRIGGER:PT0S",
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n"),
    );
  }

  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Alviosa//Mon plan//FR", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR", ""].join("\r\n");
}

export const PLAN_KEY = "plan-v1";

export function parsePlan(raw: string | null): Plan | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Plan>;
    if (!PLAN_METHODS.some((m) => m.id === value.method)) return null;
    if (typeof value.start !== "string" || !parseIso(value.start)) return null;
    return { method: value.method as PlanMethod, start: value.start, neutral: value.neutral === true, time: typeof value.time === "string" ? value.time : "20:00" };
  } catch {
    return null;
  }
}

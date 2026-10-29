// « Mon cycle » : méthode des jours fixes (guide OMS 2012, p. 14 et 26).
// Le premier jour des règles est le jour 1. On peut tomber enceinte du 8e au 19e jour : ces jours-là,
// on évite les rapports sexuels ou on utilise le préservatif. Le cycle doit durer entre 26 et 32 jours.

export const FIRST_FERTILE_DAY = 8;
export const LAST_FERTILE_DAY = 19;
export const MIN_CYCLE = 26;
export const MAX_CYCLE = 32;

export type DayKind = "regles" | "sans-risque" | "fertile";

export function validCycleLength(length: number): boolean {
  return Number.isInteger(length) && length >= MIN_CYCLE && length <= MAX_CYCLE;
}

export function kindOfDay(dayOfCycle: number): DayKind {
  if (dayOfCycle === 1) return "regles";
  if (dayOfCycle >= FIRST_FERTILE_DAY && dayOfCycle <= LAST_FERTILE_DAY) return "fertile";
  return "sans-risque";
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86_400_000);
}

// Jour du cycle d'une date donnée (1 = premier jour des règles), en répétant un cycle de longueur fixe.
export function dayOfCycle(firstDay: Date, cycleLength: number, on: Date): number {
  const diff = daysBetween(firstDay, on);
  return ((diff % cycleLength) + cycleLength) % cycleLength + 1;
}

export type Window = { cycle: number; periodStart: Date; fertileStart: Date; fertileEnd: Date };

// Les prochains cycles : début des règles attendu et période des jours fertiles.
export function upcomingWindows(firstDay: Date, cycleLength: number, count: number): Window[] {
  return Array.from({ length: count }, (_, index) => {
    const periodStart = addDays(firstDay, index * cycleLength);
    return {
      cycle: index + 1,
      periodStart,
      fertileStart: addDays(periodStart, FIRST_FERTILE_DAY - 1),
      fertileEnd: addDays(periodStart, LAST_FERTILE_DAY - 1),
    };
  });
}

function icsDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}${month}${day}`;
}

// Fichier calendrier (.ics) : un événement « jours fertiles » par cycle, sans autre donnée personnelle.
export function toIcs(windows: Window[], now: Date = new Date()): string {
  const stamp = `${icsDate(now)}T000000Z`;
  const events = windows.map((w) => {
    const end = addDays(w.fertileEnd, 1); // fin exclusive pour un événement sur la journée entière
    return [
      "BEGIN:VEVENT",
      `UID:alviosa-cycle-${icsDate(w.periodStart)}@alviosa`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(w.fertileStart)}`,
      `DTEND;VALUE=DATE:${icsDate(end)}`,
      "SUMMARY:Jours fertiles : préservatif ou pas de rapport",
      "DESCRIPTION:Méthode des jours fixes (guide OMS). Du 8e au 19e jour du cycle.",
      "END:VEVENT",
    ].join("\r\n");
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Alviosa//Mon cycle//FR", ...events, "END:VCALENDAR", ""].join("\r\n");
}

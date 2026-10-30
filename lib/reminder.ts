// Rappels de visite : un fichier calendrier (.ics) créé sur le téléphone. Alviosa n'envoie rien et ne voit rien : le rappel reste dans le calendrier de la personne.

function esc(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function stamp(date: string, time: string): string {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function event(uid: string, start: string, durationMin: number, title: string, description: string, alarms: string[], now: string): string {
  const end = new Date(Date.UTC(+start.slice(0, 4), +start.slice(4, 6) - 1, +start.slice(6, 8), +start.slice(9, 11), +start.slice(11, 13)) + durationMin * 60_000);
  const endStamp = `${end.getUTCFullYear()}${String(end.getUTCMonth() + 1).padStart(2, "0")}${String(end.getUTCDate()).padStart(2, "0")}T${String(end.getUTCHours()).padStart(2, "0")}${String(end.getUTCMinutes()).padStart(2, "0")}00`;
  return [
    "BEGIN:VEVENT",
    `UID:${uid}@alviosa`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    ...alarms.flatMap((trigger) => ["BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(title)}`, `TRIGGER:${trigger}`, "END:VALARM"]),
    "END:VEVENT",
  ].join("\r\n");
}

export type VisitReminder = { date: string; time: string; serviceName: string; code: string; reviewUrl: string; neutral: boolean };

// Deux rappels : la visite (la veille et 2 heures avant), puis le lendemain « donner son avis ».
export function visitIcs(r: VisitReminder, now: Date = new Date()): string {
  const stampNow = now.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const visitTitle = r.neutral ? "Rappel santé" : `Visite : ${r.serviceName}`;
  const visitText = r.neutral ? "Rendez-vous." : `Montre le code ${r.code} à l'accueil. Pas besoin de donner ton nom.`;
  const reviewTitle = r.neutral ? "Rappel santé" : "Donner ton avis sur la visite";
  const reviewText = r.neutral ? "Un petit retour, 1 minute." : `Ça aide les autres jeunes, et c'est anonyme : ${r.reviewUrl}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Alviosa//Rappels//FR",
    "CALSCALE:GREGORIAN",
    event(`visite-${r.code}`, stamp(r.date, r.time), 60, visitTitle, visitText, ["-P1D", "-PT2H"], stampNow),
    event(`avis-${r.code}`, stamp(addDays(r.date, 1), "18:00"), 15, reviewTitle, reviewText, ["PT0M"], stampNow),
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

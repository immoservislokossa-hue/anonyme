// Bon de visite anonyme : le jeune dit pourquoi il vient, reçoit un code, le montre au service, qui le confirme.
// Aucun nom, aucun contact. On compte seulement : demandes, puis visites confirmées.

export const BESOINS = [
  { id: "choisir", label: "Choisir une méthode" },
  { id: "suivi", label: "Continuer ou changer ma méthode" },
  { id: "urgence", label: "J'ai pris un risque" },
  { id: "question", label: "Poser mes questions" },
] as const;
export type Besoin = (typeof BESOINS)[number]["id"];

export function isBesoin(value: unknown): value is Besoin {
  return BESOINS.some((b) => b.id === value);
}

export function besoinLabel(id: unknown): string {
  return BESOINS.find((b) => b.id === id)?.label ?? "Visite";
}

export const VOUCHER_DAYS = 30;

type EventLike = { kind?: unknown; service?: unknown; code?: unknown; besoin?: unknown; at: string };

export type Confirmation = { status: "ok"; besoin: string } | { status: "inconnu" } | { status: "deja" };

// Retrouve une demande de bon pour ce service, encore valable et pas déjà confirmée.
export function findVoucher(events: EventLike[], serviceId: string, code: string, now: Date = new Date()): Confirmation {
  const upper = code.toUpperCase();
  const oldest = now.getTime() - VOUCHER_DAYS * 86_400_000;
  const asked = events.find((e) => e.kind === "visite-demande" && e.service === serviceId && e.code === upper && new Date(e.at).getTime() >= oldest);
  if (!asked) return { status: "inconnu" };
  if (events.some((e) => e.kind === "visite-venue" && e.service === serviceId && e.code === upper)) return { status: "deja" };
  return { status: "ok", besoin: String(asked.besoin ?? "") };
}

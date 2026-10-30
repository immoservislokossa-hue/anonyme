import { getStore } from "@/lib/store";
import { filterServices, latestStock, summarizeReviews, type Filter, type Review, type ReviewSummary, type Service, type StockSignal } from "@/lib/services";

// Lecture de l'annuaire dans le stockage. Les jetons de gestion ne sortent jamais de la base.

type Row = Record<string, unknown> & { id: string; at: string };

function toService(row: Row): Service {
  const { jetonHash: _ignored, ownerId: _owner, ...rest } = row as Row & { jetonHash?: string; ownerId?: string };
  void _ignored;
  void _owner;
  return { ...(rest as unknown as Service), id: row.id, creeLe: row.at, majLe: (row.majLe as string) ?? row.at };
}

export async function allServices(): Promise<Service[]> {
  const rows = (await getStore().list("services")) as Row[];
  return rows.map(toService);
}

export async function validatedServices(filter: Filter = {}): Promise<Service[]> {
  return filterServices(await allServices(), filter);
}

export async function getService(id: string): Promise<Service | null> {
  return (await allServices()).find((s) => s.id === id) ?? null;
}

export async function serviceByCode(code: string): Promise<Service | null> {
  return (await allServices()).find((s) => s.code === code && s.statut === "valide") ?? null;
}

export async function reviewsFor(serviceId: string): Promise<Review[]> {
  const rows = (await getStore().list("reviews")) as Row[];
  return rows.filter((r) => r.serviceId === serviceId).map((r) => ({ serviceId, answers: r.answers as Review["answers"], at: r.at }));
}

export async function summaryFor(serviceId: string): Promise<ReviewSummary> {
  return summarizeReviews(await reviewsFor(serviceId));
}

export async function stockFor(serviceId: string): Promise<StockSignal[]> {
  const rows = (await getStore().list("stock")) as Row[];
  return latestStock(rows.filter((r) => r.serviceId === serviceId).map((r) => ({ serviceId, methode: r.methode, etat: r.etat, at: r.at }) as StockSignal));
}

export async function storedHash(id: string): Promise<string | null> {
  const rows = (await getStore().list("services")) as Row[];
  const row = rows.find((r) => r.id === id) as (Row & { jetonHash?: string }) | undefined;
  return row?.jetonHash ?? null;
}

export async function storedOwner(id: string): Promise<string | null> {
  const rows = (await getStore().list("services")) as Row[];
  const row = rows.find((r) => r.id === id) as (Row & { ownerId?: string }) | undefined;
  return row?.ownerId ?? null;
}

export async function servicesOf(ownerId: string): Promise<Service[]> {
  const rows = (await getStore().list("services")) as (Row & { ownerId?: string })[];
  return rows.filter((r) => r.ownerId === ownerId).map(toService);
}

import { cookies } from "next/headers";
import { SESSION_COOKIE, accessFromSession, type Access } from "@/lib/auth";
import type { BilanRow, Dataset, EventRow } from "@/lib/analytics";
import { allServices } from "@/lib/directory";
import { getPays } from "@/lib/pays";
import type { Review, StockSignal } from "@/lib/services";
import { getStore } from "@/lib/store";

export async function sessionAccess(): Promise<Access> {
  const jar = await cookies();
  return accessFromSession(jar.get(SESSION_COOKIE)?.value);
}

// Charge toutes les données agrégables du stockage. Les jetons de gestion des services ne sont jamais lus ici.
export async function loadDataset(): Promise<Dataset> {
  const store = getStore();
  const [events, bilans, reviews, stock, services] = await Promise.all([
    store.list("events"),
    store.list("bilans"),
    store.list("reviews"),
    store.list("stock"),
    allServices(),
  ]);
  return {
    demo: false,
    zones: getPays().zones,
    services,
    events: events.map((e) => ({ kind: String(e.kind), theme: typeof e.theme === "string" ? e.theme : undefined, zone: typeof e.zone === "string" ? e.zone : undefined, at: e.at }) as EventRow),
    bilans: bilans.map((b) => ({ ...(b as unknown as BilanRow), at: b.at })),
    reviews: reviews.map((r) => ({ serviceId: String(r.serviceId), answers: r.answers as Review["answers"], at: r.at })),
    stock: stock.map((s) => ({ serviceId: String(s.serviceId), methode: s.methode, etat: s.etat, at: s.at }) as StockSignal),
  };
}

import { getStore } from "@/lib/store";

// Compteurs agrégés. Aucun texte de message n'est enregistré : seulement le type d'événement et le thème.
// Stockage en mémoire pour le prototype : les compteurs sont remis à zéro au redémarrage.
// La phase suivante les déplacera dans Supabase, avec une table d'événements sans données personnelles.

export type EventKind = "question" | "urgence" | "diagnostic" | "protocole" | "orientation" | UsageEvent;

// Usage des outils et de la série : seulement le nom de l'événement, jamais de réponse ni d'identifiant.
export const USAGE_EVENTS = [
  "outil-risque",
  "outil-choisir",
  "outil-commencer",
  "outil-plan",
  "outil-cycle",
  "outil-souci",
  "outil-visite",
  "outil-parler",
  "avis-oui",
  "avis-non",
  "serie-episode",
  "partage",
] as const;
export type UsageEvent = (typeof USAGE_EVENTS)[number];

export function isUsageEvent(value: unknown): value is UsageEvent {
  return typeof value === "string" && (USAGE_EVENTS as readonly string[]).includes(value);
}

export type MetricEvent = {
  kind: EventKind;
  theme?: string;
  zone?: string;
  at: string;
};

const MAX_EVENTS = 10000;
const events: MetricEvent[] = [];

export function record(kind: EventKind, theme?: string, zone?: string): void {
  events.push({ kind, theme, zone, at: new Date().toISOString() });
  if (events.length > MAX_EVENTS) events.shift();
  // Écriture dans le stockage de la plateforme (mémoire ou Supabase), pour le tableau de bord Pilotage. Ne bloque jamais la réponse.
  void getStore()
    .insert("events", { kind, ...(theme ? { theme } : {}), ...(zone ? { zone } : {}) })
    .catch(() => undefined);
}

export type MetricsSummary = {
  total: number;
  byKind: Record<string, number>;
  byTheme: Record<string, number>;
};

export function summary(): MetricsSummary {
  const byKind: Record<string, number> = {};
  const byTheme: Record<string, number> = {};

  for (const event of events) {
    byKind[event.kind] = (byKind[event.kind] ?? 0) + 1;
    if (event.theme) {
      byTheme[event.theme] = (byTheme[event.theme] ?? 0) + 1;
    }
  }

  return { total: events.length, byKind, byTheme };
}

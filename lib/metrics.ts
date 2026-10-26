// Compteurs agrégés. Aucun texte de message n'est enregistré : seulement le type d'événement et le thème.
// Stockage en mémoire pour le prototype : les compteurs sont remis à zéro au redémarrage.
// La phase suivante les déplacera dans Supabase, avec une table d'événements sans données personnelles.

export type EventKind = "question" | "urgence" | "diagnostic" | "protocole" | "orientation";

export type MetricEvent = {
  kind: EventKind;
  theme?: string;
  at: string;
};

const MAX_EVENTS = 10000;
const events: MetricEvent[] = [];

export function record(kind: EventKind, theme?: string): void {
  events.push({ kind, theme, at: new Date().toISOString() });
  if (events.length > MAX_EVENTS) events.shift();
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

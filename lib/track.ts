import type { UsageEvent } from "@/lib/metrics";
import { readZone } from "@/lib/zone";

// Signale l'usage d'un outil, une seule fois par visite et par événement. Ne bloque jamais l'écran.
export function track(event: UsageEvent): void {
  try {
    const key = `tracked-${event}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
    const zone = readZone();
    const body = JSON.stringify(zone ? { event, zone } : { event });
    if (navigator.sendBeacon?.("/api/event", new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch {
    // Mesure impossible : l'outil marche quand même.
  }
}

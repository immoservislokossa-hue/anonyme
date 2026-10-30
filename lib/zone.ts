// Zone choisie volontairement par la personne (un département ou une région, jamais une position). Gardée sur l'appareil.
// Sert à compter, de façon anonyme, les questions par zone pour que les services soient là où les jeunes en ont besoin.

const KEY = "zone-v1";

export function readZone(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function writeZone(zone: string | null): void {
  try {
    if (zone) window.localStorage.setItem(KEY, zone);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Stockage indisponible : la zone n'est pas gardée.
  }
}

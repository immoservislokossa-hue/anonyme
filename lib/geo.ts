import { cleanQuery } from "@/lib/places";

// Repère géographique approximatif d'un visiteur, déduit de sa connexion par l'hébergeur (Vercel).
// Il sert seulement à ancrer une recherche par texte dans le bon pays et la bonne ville. Il peut être faux
// (réseau mobile, VPN) : les distances affichées se calculent toujours avec la position réelle de l'appareil.
export type LocationHint = { country?: string; city?: string };

// Nom du pays en français à partir de son code à 2 lettres (« BJ » devient « Bénin »).
export function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function hintFromHeaders(headers: Headers): LocationHint {
  const code = headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  const country = code && /^[A-Z]{2}$/.test(code) ? countryName(code) : undefined;

  let city: string | undefined;
  const rawCity = headers.get("x-vercel-ip-city");
  if (rawCity) {
    try {
      city = cleanQuery(decodeURIComponent(rawCity)) || undefined;
    } catch {
      city = undefined;
    }
  }

  return { country, city };
}

// « Cotonou, Bénin », ou « Bénin » si la ville est inconnue, ou rien du tout.
export function anchorText(hint: LocationHint): string {
  return [hint.city, hint.country].filter(Boolean).join(", ");
}

// Ajoute le pays à un lieu saisi, sauf s'il y figure déjà.
export function withCountry(place: string, country?: string): string {
  if (!country || place.toLowerCase().includes(country.toLowerCase())) return place;
  return `${place}, ${country}`;
}

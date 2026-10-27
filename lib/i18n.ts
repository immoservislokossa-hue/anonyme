// Langues de l'audio d'aide : le français, et le yoruba en démonstration. Les autres langues locales se
// brancheront ici plus tard (voir docs/traductions-a-faire.md).
export type Lang = "fr" | "yo";

// disponible : textes validés · demo : traduction d'essai à faire valider.
export type LangStatus = "disponible" | "demo";

export const LANGS: Record<Lang, { label: string; tts: string; status: LangStatus }> = {
  fr: { label: "Français", tts: "fr-FR", status: "disponible" },
  yo: { label: "Yoruba", tts: "yo-NG", status: "demo" },
};

export const LANG_KEY = "lang-v1";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && value in LANGS;
}

// Langues proposées : le français et le yoruba.
export function languagesForCountry(_code?: string | null): Lang[] {
  return ["fr", "yo"];
}

// Langue proposée d'office : le yoruba au Bénin, le français ailleurs.
export function defaultLangFor(code?: string | null): Lang {
  return code?.toUpperCase() === "BJ" ? "yo" : "fr";
}

// Choix d'une voix de l'appareil. Si aucune ne parle la langue demandée, on lit avec la voix française
// et on le signale : la prononciation sera approximative.
export function pickVoice<T extends { lang: string }>(voices: T[], tag: string): { voice: T | null; approx: boolean } {
  const base = tag.toLowerCase().split("-")[0];
  const exact = voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(base));
  if (exact) return { voice: exact, approx: false };
  const french = voices.find((v) => v.lang.toLowerCase().startsWith("fr")) ?? null;
  return { voice: french, approx: base !== "fr" };
}

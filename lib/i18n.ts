// Langues de l'audio d'aide. Le français est disponible ; les langues locales se branchent ici :
// il suffit d'ajouter leurs textes dans lib/guides.ts (et, mieux, des enregistrements de vraies voix).
export type Lang =
  | "fr" | "yo" | "fon" | "ee" | "mos" | "dyu" | "bci" | "ff" | "man" | "bm"
  | "hac" | "ha" | "dje" | "wo" | "kbp";

// disponible : textes validés · demo : traduction d'essai à faire valider · bientot : pas encore de contenu.
export type LangStatus = "disponible" | "demo" | "bientot";

export const LANGS: Record<Lang, { label: string; tts: string; status: LangStatus }> = {
  fr: { label: "Français", tts: "fr-FR", status: "disponible" },
  yo: { label: "Yoruba", tts: "yo-NG", status: "demo" },
  fon: { label: "Fon", tts: "fon", status: "bientot" },
  ee: { label: "Éwé", tts: "ee", status: "bientot" },
  mos: { label: "Mooré", tts: "mos", status: "bientot" },
  dyu: { label: "Dioula", tts: "dyu", status: "bientot" },
  bci: { label: "Baoulé", tts: "bci", status: "bientot" },
  ff: { label: "Pular / Peul", tts: "ff", status: "bientot" },
  man: { label: "Malinké", tts: "man", status: "bientot" },
  bm: { label: "Bambara", tts: "bm", status: "bientot" },
  hac: { label: "Hassaniya", tts: "ar", status: "bientot" },
  ha: { label: "Haoussa", tts: "ha", status: "bientot" },
  dje: { label: "Zarma", tts: "dje", status: "bientot" },
  wo: { label: "Wolof", tts: "wo", status: "bientot" },
  kbp: { label: "Kabiyè", tts: "kbp", status: "bientot" },
};

// Les deux langues locales les plus parlées par pays du Partenariat de Ouagadougou.
export const COUNTRY_LANGS: Record<string, { name: string; langs: Lang[] }> = {
  BJ: { name: "Bénin", langs: ["fon", "yo"] },
  BF: { name: "Burkina Faso", langs: ["mos", "dyu"] },
  CI: { name: "Côte d'Ivoire", langs: ["dyu", "bci"] },
  GN: { name: "Guinée", langs: ["ff", "man"] },
  ML: { name: "Mali", langs: ["bm", "ff"] },
  MR: { name: "Mauritanie", langs: ["hac", "ff"] },
  NE: { name: "Niger", langs: ["ha", "dje"] },
  SN: { name: "Sénégal", langs: ["wo", "ff"] },
  TG: { name: "Togo", langs: ["ee", "kbp"] },
};

export const LANG_KEY = "lang-v1";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && value in LANGS;
}

// Langues proposées pour un pays : le français d'abord, puis les langues locales (sans doublon).
export function languagesForCountry(code?: string | null): Lang[] {
  const entry = code ? COUNTRY_LANGS[code.toUpperCase()] : undefined;
  return ["fr", ...(entry ? entry.langs : [])];
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

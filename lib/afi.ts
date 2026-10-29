import { SUJETS, TOOLS, getMethode, getSujet, getTool } from "@/lib/catalog";

// Afi sait sur quelle page tu es : elle propose des questions adaptées, et le serveur s'en sert pour mieux chercher.
export type AfiContext = { key: string; label?: string; tips: string[] };

const GENERAL = ["Quelle méthode de contraception choisir ?", "Un préservatif a craqué, que faire ?", "J'ai un retard de règles, que faire ?", "Comment me protéger des IST ?"];

export function contextFor(pathname: string): AfiContext {
  const parts = pathname.split("/").filter(Boolean);
  const [section, id] = parts;

  if (section === "sujets" && id) {
    const sujet = getSujet(id);
    if (sujet) return { key: `sujets/${id}`, label: sujet.titre, tips: [sujet.question, "Explique-moi plus simplement", "Où aller pour ça ?"] };
  }
  if (section === "methodes" && id) {
    const method = getMethode(id);
    if (method) return { key: `methodes/${id}`, label: method.nom, tips: method.astuces };
  }
  if (section === "outils" && id) {
    const tool = getTool(id);
    if (tool) return { key: `outils/${id}`, label: tool.titre, tips: tool.astuces };
  }
  if (section === "orientation") return { key: "orientation", label: "Trouver un centre", tips: ["Comment préparer ma visite ?", "Que dire à l'accueil ?", "Puis-je venir accompagnée ?", "Puis-je demander la confidentialité ?"] };
  if (section === "urgence") return { key: "urgence", label: "Urgence", tips: ["Un préservatif a craqué, que faire ?", "Où trouver la pilule d'urgence ?", "J'ai peur d'être enceinte"] };
  if (section === "aide") return { key: "aide", label: "Aide", tips: ["Mes messages sont-ils gardés ?", "L'IA peut-elle se tromper ?", "Comment signaler une erreur ?"] };
  if (section === "serie" || section === "histoires") return { key: "serie", label: "La série", tips: ["Peux-tu m'expliquer cet épisode ?", "Les personnages sont-ils vrais ?", "Où en savoir plus sur ce sujet ?"] };
  if (section === "sujets") return { key: "sujets", label: "Sujets", tips: ["Par quel sujet commencer ?", "Je ne sais pas ce que je cherche", ...GENERAL.slice(0, 2)] };
  if (section === "outils") return { key: "outils", label: "Outils", tips: ["Quel outil pour choisir ma méthode ?", "Quel outil après un préservatif cassé ?", "Comment ne pas oublier ma pilule ?"] };
  if (section === "methodes") return { key: "methodes", label: "Méthodes", tips: ["Quelle méthode est la plus efficace ?", "Quelle méthode sans y penser tous les jours ?", "Quelle méthode protège des IST ?"] };
  if (section === "apprendre") return { key: "apprendre", label: "Apprendre", tips: ["Par où commencer ?", ...GENERAL.slice(0, 3)] };
  return { key: "accueil", tips: GENERAL };
}

// Côté serveur : quelques mots de la page, pour aider la recherche quand la question est courte (« et les effets ? »).
export function contextHint(key: string | undefined): string {
  if (!key) return "";
  const [section, id] = key.split("/");
  if (section === "methodes" && id) return getMethode(id)?.nom ?? "";
  if (section === "sujets" && id) return getSujet(id)?.titre ?? "";
  if (section === "outils" && id) return getTool(id)?.titre ?? "";
  return "";
}

export function isContextKey(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9/-]{1,60}$/.test(value);
}

export const KNOWN_PAGES = { sujets: SUJETS.length, outils: TOOLS.length };

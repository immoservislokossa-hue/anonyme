import knowledgeData from "@/data/knowledge.json";
import type { IconName } from "@/components/Icon";

type Entry = { id: string; title: string; content: string };

// Les grands sujets de la planification familiale et de la santé sexuelle, tels qu'un jeune les cherche.
// Chaque sujet regroupe des fiches de la base de connaissances ; une fiche peut servir dans plusieurs sujets.
export type Topic = {
  id: string;
  title: string;
  blurb: string;
  icon: IconName;
  entries: string[];
  urgent?: boolean;
};

export const TOPICS: Topic[] = [
  {
    id: "eviter-grossesse",
    title: "Éviter une grossesse",
    blurb: "Choisir une méthode, comprendre les effets.",
    icon: "check",
    entries: ["pourquoi-planification", "choisir-methode", "comparaison-methodes", "effets-secondaires-courants", "jeunes-droit-information"],
  },
  {
    id: "apres-risque",
    title: "Après un rapport à risque",
    blurb: "Préservatif cassé, pas de protection.",
    icon: "alert",
    entries: ["contraception-urgence", "ist-prevention", "retard-regles"],
    urgent: true,
  },
  {
    id: "regles-cycle",
    title: "Règles et cycle",
    blurb: "Comprendre son corps, savoir quand consulter.",
    icon: "sun",
    entries: ["regles-cycle", "retard-regles"],
  },
  {
    id: "grossesse",
    title: "Grossesse",
    blurb: "Retard de règles, grossesse non prévue, après l'accouchement.",
    icon: "heart",
    entries: ["retard-regles", "grossesse-inattendue", "apres-accouchement", "mythes-grossesse"],
  },
  {
    id: "ist-vih",
    title: "IST et VIH",
    blurb: "Se protéger, se faire dépister, se faire soigner.",
    icon: "shield",
    entries: ["ist-generalites", "ist-prevention", "ist-signes", "vih-depistage", "vih-methodes", "hpv-vaccin"],
  },
  {
    id: "relations",
    title: "Relations et consentement",
    blurb: "Dire oui, dire non, être respecté(e).",
    icon: "circles",
    entries: ["consentement", "relation-saine", "honte-culpabilite", "jeunes-droit-information"],
  },
  {
    id: "violence",
    title: "Violence et aide",
    blurb: "Si on t'a forcé(e) ou fait du mal.",
    icon: "alert",
    entries: ["apres-violence", "apres-viol-pf", "relation-saine"],
    urgent: true,
  },
  {
    id: "garcons",
    title: "Pour les garçons",
    blurb: "Préservatif, respect, vasectomie.",
    icon: "star",
    entries: ["garcons", "preservatif-usage", "consentement", "vasectomie"],
  },
  {
    id: "rumeurs",
    title: "Rumeurs et vérités",
    blurb: "La pilule rend stérile ? On vérifie.",
    icon: "quiz",
    entries: ["idees-fausses", "mythes-pilule", "mythes-grossesse"],
  },
];

const entries = knowledgeData as unknown as Entry[];

export type TopicView = Omit<Topic, "entries"> & { fiches: { id: string; title: string; content: string }[] };

// Version prête à afficher : les identifiants sont remplacés par les fiches (celles qui manquent sont ignorées).
export function topicViews(): TopicView[] {
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  return TOPICS.map(({ entries: ids, ...topic }) => ({
    ...topic,
    fiches: ids.flatMap((id) => {
      const entry = byId.get(id);
      return entry ? [{ id: entry.id, title: entry.title, content: entry.content }] : [];
    }),
  }));
}

// Les trois besoins les plus fréquents, affichés en grand sur l'accueil.
export const HOME_NEEDS: { href: string; icon: IconName; title: string; text: string; urgent?: boolean }[] = [
  { href: "/apprendre?onglet=outils&outil=choisir", icon: "check", title: "Choisir ma méthode", text: "Quelques questions, 2 minutes." },
  { href: "/urgence", icon: "alert", title: "J'ai pris un risque", text: "Que faire, vite.", urgent: true },
  { href: "/apprendre?sujet=grossesse", icon: "heart", title: "Retard de règles", text: "Test, grossesse, à qui parler." },
  { href: "/apprendre?sujet=ist-vih", icon: "shield", title: "IST et VIH", text: "Se protéger, se faire dépister." },
  { href: "/apprendre?sujet=relations", icon: "circles", title: "Relations et consentement", text: "Dire oui, dire non." },
  { href: "/orientation", icon: "pin", title: "Trouver un centre", text: "Près de chez toi." },
];

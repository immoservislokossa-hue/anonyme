import knowledgeBase from "@/data/knowledge.json";
import type { Voie } from "@/lib/domain";

export type KnowledgeEntry = {
  id: string;
  voie: Voie | "commun";
  theme: string;
  title: string;
  content: string;
  source: string;
  validated: boolean;
};

const entries: KnowledgeEntry[] = knowledgeBase as KnowledgeEntry[];

// Mots trop courants pour aider à retrouver une information.
const STOP_WORDS = new Set([
  "les", "des", "une", "est", "que", "qui", "pour", "dans", "sont", "avec", "sur", "pas", "par",
  "comment", "quel", "quels", "quelle", "quelles", "mon", "mes", "aux", "ces", "ils", "elles",
  "nous", "vous", "cette", "cela", "fait", "faire", "peut", "peux", "dois", "faut", "entre",
  "suis", "ai", "ses", "son", "sa", "ont", "avoir", "etre", "tout", "tous", "plus", "moins",
]);

// Retrait des accents et de la ponctuation, et du « s » final des pluriels, pour que
// « infection » et « infections » se retrouvent.
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
    .map((token) => (token.length > 4 && token.endsWith("s") ? token.slice(0, -1) : token));
}

export function scoreEntry(query: string[], entry: KnowledgeEntry): number {
  const haystack = new Set(tokenize(`${entry.title} ${entry.content} ${entry.theme}`));
  const title = new Set(tokenize(entry.title));
  // Un mot présent dans le titre compte double : le titre dit de quoi parle l'entrée.
  return query.reduce((score, token) => score + (haystack.has(token) ? 1 : 0) + (title.has(token) ? 1 : 0), 0);
}

// Recherche lexicale simple. Elle sera remplacée par une recherche vectorielle (pgvector) à l'étape suivante.
// Avec une voie, seules les entrées de cette voie et les entrées communes sont considérées.
// Une question générale (« quelle méthode choisir ? ») reçoit d'abord la vue d'ensemble de l'OMS et les
// questions pour choisir, pas trois méthodes tirées au hasard. La contraception d'urgence, le retrait et
// les jours fixes ne sont pas proposés comme choix par défaut : ils ne viennent que si la personne en parle.
const GENERAL_CHOICE = /\b(quelle|quelles|laquelle|lesquelles)\s+(methode|contraception|contraceptif)s?\b|\bchoisir\b|\bme conseill/;
const ONLY_ON_REQUEST: Record<string, RegExp> = {
  "contraception-urgence": /urgence|lendemain|non protege|craque|oubli/,
  retrait: /retrait|marche arriere/,
  "jours-fixes": /jours? fixes?|collier|calendrier|cycle|naturelle/,
};

function plain(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function retrieve(question: string, limit = 3, voie?: Voie): KnowledgeEntry[] {
  const query = tokenize(question);
  if (query.length === 0) return [];

  const flat = plain(question);
  if (GENERAL_CHOICE.test(flat)) {
    const lead = ["comparaison-methodes", "choisir-methode"]
      .map((id) => entries.find((entry) => entry.id === id))
      .filter((entry): entry is KnowledgeEntry => Boolean(entry) && (!voie || entry!.voie === voie || entry!.voie === "commun"));
    if (lead.length > 0) return lead.slice(0, limit);
  }

  return entries
    .filter((entry) => !voie || entry.voie === voie || entry.voie === "commun")
    .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
    .filter(({ score }) => score > 0)
    .filter(({ entry }) => !ONLY_ON_REQUEST[entry.id] || ONLY_ON_REQUEST[entry.id].test(flat))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

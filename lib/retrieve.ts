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
  return query.reduce((score, token) => score + (haystack.has(token) ? 1 : 0), 0);
}

// Recherche lexicale simple. Elle sera remplacée par une recherche vectorielle (pgvector) à l'étape suivante.
// Avec une voie, seules les entrées de cette voie et les entrées communes sont considérées.
export function retrieve(question: string, limit = 3, voie?: Voie): KnowledgeEntry[] {
  const query = tokenize(question);
  if (query.length === 0) return [];

  return entries
    .filter((entry) => !voie || entry.voie === voie || entry.voie === "commun")
    .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

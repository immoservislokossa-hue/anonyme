import knowledgeBase from "@/data/knowledge.json";

export type KnowledgeEntry = {
  id: string;
  theme: string;
  title: string;
  content: string;
  source: string;
  validated: boolean;
};

const entries: KnowledgeEntry[] = knowledgeBase;

// Retrait des accents et de la ponctuation pour que « grossesse » et « grossesse, » correspondent.
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
}

export function scoreEntry(query: string[], entry: KnowledgeEntry): number {
  const haystack = new Set(tokenize(`${entry.title} ${entry.content} ${entry.theme}`));
  return query.reduce((score, token) => score + (haystack.has(token) ? 1 : 0), 0);
}

// Recherche lexicale simple. Elle sera remplacée par une recherche vectorielle (pgvector) à l'étape suivante.
export function retrieve(question: string, limit = 3): KnowledgeEntry[] {
  const query = tokenize(question);
  if (query.length === 0) return [];

  return entries
    .map((entry) => ({ entry, score: scoreEntry(query, entry) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

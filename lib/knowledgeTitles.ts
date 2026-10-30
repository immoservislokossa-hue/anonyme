import knowledge from "@/data/knowledge.json";

const TITLES = new Map((knowledge as { id: string; title: string }[]).map((e) => [e.id, e.title]));

export function titleOfEntry(id: string): string {
  return TITLES.get(id) ?? id;
}

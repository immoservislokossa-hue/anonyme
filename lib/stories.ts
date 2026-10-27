import storiesData from "@/data/stories.json";
import { personaFor } from "@/lib/brand";
import type { Voie } from "@/lib/domain";

// Une histoire, trois façons de la vivre : en cartes, en jeu à choix, en dessin animé.
export type Speaker = "afi" | "fallone" | "chimene" | "narrateur";
export type Decor = "cour" | "chambre" | "centre" | "rue";
export type Format = "cartes" | "jeu" | "anime";

export type Scene = { who: Speaker; text: string };

export type Choice = { label: string; next: string };
export type Node = {
  who: Speaker;
  text: string;
  choices?: Choice[];
  end?: "bien" | "moyen";
  lesson?: string;
};

export type Story = {
  id: string;
  titre: string;
  accroche: string;
  decor: Decor;
  duree: string;
  cast: Speaker[];
  scenes: Scene[];
  lecon: string;
  action: { label: string; href: string };
  jeu: { start: string; nodes: Record<string, Node> };
  valide: boolean;
};

export const stories: Story[] = storiesData as unknown as Story[];

export function getStory(id: string): Story | undefined {
  return stories.find((story) => story.id === id);
}

export const FORMATS: { id: Format; label: string; hint: string }[] = [
  { id: "cartes", label: "En images", hint: "Des cartes qui défilent, comme des stories" },
  { id: "jeu", label: "Je choisis", hint: "Tu décides, et tu vois ce qui se passe" },
  { id: "anime", label: "Dessin animé", hint: "Les personnages parlent, tu regardes" },
];

export function isFormat(value: unknown): value is Format {
  return value === "cartes" || value === "jeu" || value === "anime";
}

const VOIE_OF: Record<Exclude<Speaker, "narrateur">, Voie> = {
  afi: "sexuelle",
  fallone: "mentale",
  chimene: "bien-etre",
};

export function voieOf(speaker: Speaker): Voie | null {
  return speaker === "narrateur" ? null : VOIE_OF[speaker];
}

export function speakerInfo(speaker: Speaker): { name: string; role: string } {
  if (speaker === "narrateur") return { name: "Narration", role: "" };
  const persona = personaFor(VOIE_OF[speaker]);
  return { name: persona.name, role: persona.role };
}

// Contrôle de cohérence d'une histoire : renvoie la liste des problèmes (vide si tout va bien).
export function checkStory(story: Story): string[] {
  const problems: string[] = [];
  const nodes = story.jeu.nodes;
  if (story.scenes.length === 0) problems.push("aucune scène");
  if (!nodes[story.jeu.start]) problems.push("départ introuvable");

  const seen = new Set<string>();
  const queue = [story.jeu.start];
  let canEnd = false;
  while (queue.length > 0) {
    const id = queue.shift() as string;
    if (seen.has(id)) continue;
    seen.add(id);
    const node = nodes[id];
    if (!node) {
      problems.push(`nœud manquant : ${id}`);
      continue;
    }
    if (node.end) canEnd = true;
    if (!node.end && !node.choices?.length) problems.push(`impasse : ${id}`);
    for (const choice of node.choices ?? []) queue.push(choice.next);
  }
  if (!canEnd) problems.push("aucune fin atteignable");
  for (const id of Object.keys(nodes)) if (!seen.has(id)) problems.push(`nœud inaccessible : ${id}`);
  return problems;
}

// Durée de lecture d'une réplique en millisecondes, pour le dessin animé.
export function readingTime(text: string): number {
  return Math.min(9000, 1400 + text.length * 55);
}

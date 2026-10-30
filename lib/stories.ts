import type { Mood } from "@/components/Silhouette";
import storiesData from "@/data/stories.json";
import { personaFor, type Character } from "@/lib/brand";

// Une histoire, trois façons de la vivre : en cartes, en jeu à choix, en dessin animé.
export type Speaker = "afi" | "fallone" | "chimene" | "narrateur";
export type Decor = "cour" | "chambre" | "centre" | "rue" | "ecole" | "nuit" | "pharmacie" | "soir";
export type { Mood };
export type Shot = "large" | "duo" | "gros";

export const DECORS: Decor[] = ["cour", "chambre", "centre", "rue", "ecole", "nuit", "pharmacie", "soir"];
export const MOODS: Mood[] = ["neutre", "joie", "triste", "peur", "surpris", "colere", "pensif", "gene"];
export const SHOTS: Shot[] = ["large", "duo", "gros"];
export type Format = "cartes" | "jeu" | "anime";

// Une scène : qui parle, ce qu'il dit, et la mise en scène (humeur, plan, décor, personnages présents).
// Tout ce qui n'est pas précisé reste comme dans la scène d'avant.
export type Scene = {
  who: Speaker;
  text: string;
  mood?: Mood;
  others?: Mood;
  shot?: Shot;
  decor?: Decor;
  present?: Speaker[];
};

export type Choice = { label: string; next: string };
export type Node = {
  who: Speaker;
  text: string;
  choices?: Choice[];
  mood?: Mood;
  end?: "bien" | "moyen";
  lesson?: string;
};

export type Story = {
  id: string;
  episode: number;
  resume: string;
  teaser: string;
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

export const SERIES_TITLE = "Afi & les autres";
export const SEASON = 1;

export const stories: Story[] = (storiesData as unknown as Story[]).slice().sort((a, b) => a.episode - b.episode);

export function getStory(id: string): Story | undefined {
  return stories.find((story) => story.id === id);
}

export function nextEpisode(story: Story): Story | undefined {
  return stories.find((item) => item.episode === story.episode + 1);
}

export const FORMATS: { id: Format; label: string; hint: string }[] = [
  { id: "anime", label: "Dessin animé", hint: "Comme un film : les personnages parlent dans des bulles" },
  { id: "cartes", label: "En images", hint: "Des cartes qui défilent, comme des stories" },
  { id: "jeu", label: "Je choisis", hint: "Tu décides, et tu vois ce qui se passe" },
];

export function isFormat(value: unknown): value is Format {
  return value === "cartes" || value === "jeu" || value === "anime";
}

export function characterOf(speaker: Speaker): Character | null {
  return speaker === "narrateur" ? null : speaker;
}

export function speakerInfo(speaker: Speaker): { name: string; role: string } {
  if (speaker === "narrateur") return { name: "Narration", role: "" };
  const persona = personaFor(speaker);
  return { name: persona.name, role: persona.role };
}

// Mise en scène d'une réplique après avoir reporté les réglages des scènes d'avant.
export type Staged = {
  scene: Scene;
  decor: Decor;
  present: Speaker[];
  shot: Shot;
  mood: Mood | undefined;
  others: Mood | undefined;
};

const CANON: Speaker[] = ["fallone", "afi", "chimene"];
const INTENSE: Mood[] = ["triste", "peur", "surpris", "colere", "gene", "joie"];

export function stageScenes(story: Story): Staged[] {
  let decor = story.decor;
  let present: Speaker[] = story.cast;
  let previous: Shot = "large";
  return story.scenes.map((scene) => {
    if (scene.decor) decor = scene.decor;
    if (scene.present) present = scene.present;
    const here = CANON.filter((who) => present.includes(who) || who === scene.who);
    let shot: Shot;
    if (scene.shot) shot = scene.shot;
    else if (scene.who === "narrateur") shot = "large";
    else if (scene.text.length > 90) shot = "gros";
    else if (scene.mood && INTENSE.includes(scene.mood) && previous !== "gros") shot = "gros";
    else shot = here.length > 1 ? "duo" : "gros";
    previous = shot;
    return { scene, decor, present: here, shot, mood: scene.mood, others: scene.others };
  });
}

// Contrôle de cohérence d'une histoire : renvoie la liste des problèmes (vide si tout va bien).
export function checkStory(story: Story): string[] {
  const problems: string[] = [];
  for (const [i, scene] of story.scenes.entries()) {
    if (scene.mood && !MOODS.includes(scene.mood)) problems.push(`humeur inconnue (scène ${i + 1})`);
    if (scene.others && !MOODS.includes(scene.others)) problems.push(`humeur inconnue (scène ${i + 1})`);
    if (scene.shot && !SHOTS.includes(scene.shot)) problems.push(`plan inconnu (scène ${i + 1})`);
    if (scene.decor && !DECORS.includes(scene.decor)) problems.push(`décor inconnu (scène ${i + 1})`);
  }
  if (!DECORS.includes(story.decor)) problems.push("décor inconnu");
  if (!story.teaser) problems.push("teaser manquant");
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

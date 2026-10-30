import knowledgeData from "@/data/knowledge.json";
import methodesData from "@/data/methodes.json";
import sujetsData from "@/data/sujets.json";
import { stories } from "@/lib/stories";
import type { Character } from "@/lib/brand";

// Le catalogue de l'application : sujets, outils, méthodes. Chaque page lit ici ce dont elle a besoin.

// ---------- Sujets ----------
export type Voice = Character;
export type Block = { titre: string; texte: string };
export type Sujet = {
  id: string;
  titre: string;
  voix: Voice;
  art: string;
  urgent?: boolean;
  bref: string;
  alerte?: string;
  points: Block[];
  vrai_faux: { faux: string; vrai: string }[];
  etapes: Block[];
  ou_aller: string;
  outils: ToolId[];
  methodes: string[];
  episode: string | null;
  question: string;
  fiches: string[];
};

export const SUJETS = sujetsData as unknown as Sujet[];
export const getSujet = (id: string) => SUJETS.find((s) => s.id === id);

type Fiche = { id: string; title: string; content: string };
const fiches = new Map((knowledgeData as unknown as Fiche[]).map((f) => [f.id, f]));
export const getFiches = (ids: string[]) => ids.flatMap((id) => (fiches.has(id) ? [fiches.get(id) as Fiche] : []));

// ---------- Outils ----------
export type ToolId = "risque" | "choisir" | "commencer" | "plan" | "cycle" | "souci" | "visite" | "parler";

export type Tool = {
  id: ToolId;
  titre: string;
  promesse: string;
  minutes: number;
  etapes: string[];
  source: string;
  limites: string[];
  astuces: string[];
  urgent?: boolean;
  suite: { kind: "sujet" | "methode" | "outil"; id: string }[];
};

export const TOOLS: Tool[] = [
  {
    id: "risque",
    titre: "Après un rapport à risque",
    promesse: "Savoir quoi faire, dans quel ordre, et avant quand.",
    minutes: 1,
    etapes: ["Dis ce qui s'est passé", "Dis il y a combien de temps", "Reçois tes actions, classées par urgence"],
    source: "Guide OMS (2012), p. 4, 6, 16 et 18",
    limites: ["Il ne remplace pas un professionnel de santé", "Il ne dit pas si tu es enceinte ou infectée", "En cas de danger, va tout de suite au centre"],
    astuces: ["Quelle est la pilule d'urgence ?", "Où la trouver ?", "Et pour le VIH ?"],
    urgent: true,
    suite: [
      { kind: "sujet", id: "apres-risque" },
      { kind: "methode", id: "contraception-urgence" },
      { kind: "outil", id: "choisir" },
    ],
  },
  {
    id: "choisir",
    titre: "Choisir ma méthode",
    promesse: "Trouver les méthodes à discuter avec un professionnel, selon ta situation.",
    minutes: 2,
    etapes: ["Réponds à quelques questions", "Vois les méthodes possibles et celles à éviter, avec les raisons", "Copie ton résumé pour la consultation"],
    source: "Guide OMS (2012), p. 3, 6, 11-14 et 17-19",
    limites: ["Il oriente, il ne prescrit pas", "Un professionnel confirme toujours le choix", "Il ne remplace pas un examen"],
    astuces: ["Quelle méthode est la plus efficace ?", "Quelle méthode sans y penser tous les jours ?", "Puis-je en changer ?"],
    suite: [
      { kind: "sujet", id: "eviter-grossesse" },
      { kind: "outil", id: "plan" },
      { kind: "methode", id: "preservatif-masculin" },
    ],
  },
  {
    id: "commencer",
    titre: "Puis-je commencer aujourd'hui ?",
    promesse: "Savoir si tu peux commencer une méthode hormonale sans attendre tes règles.",
    minutes: 1,
    etapes: ["Réponds aux 6 questions de l'OMS", "Dis si tu as des signes de grossesse", "Vois si tu peux commencer maintenant"],
    source: "Guide OMS (2012), p. 20",
    limites: ["Il ne remplace pas un test de grossesse", "Il ne s'applique qu'aux méthodes hormonales", "Un professionnel confirme"],
    astuces: ["Quels sont les signes d'une grossesse ?", "Quel test de grossesse choisir ?", "Que faire si mes règles sont en retard ?"],
    suite: [
      { kind: "sujet", id: "grossesse" },
      { kind: "outil", id: "choisir" },
      { kind: "methode", id: "pilule" },
    ],
  },
  {
    id: "plan",
    titre: "Mon plan et mes rappels",
    promesse: "Ne plus jamais oublier une injection, une boîte de pilules ou un rendez-vous.",
    minutes: 1,
    etapes: ["Choisis ta méthode et ta date", "Vois tes prochaines dates", "Mets des rappels discrets dans ton calendrier"],
    source: "Guide OMS (2012), p. 4, 5, 6, 9, 10 et 12",
    limites: ["Tes dates restent sur ton téléphone", "Il ne remplace pas ton carnet de santé", "En cas de retard, va au centre"],
    astuces: ["Quand faire ma prochaine injection ?", "J'ai du retard pour mon injection", "Que faire si j'oublie une pilule ?"],
    suite: [
      { kind: "outil", id: "souci" },
      { kind: "methode", id: "injectables" },
      { kind: "sujet", id: "eviter-grossesse" },
    ],
  },
  {
    id: "cycle",
    titre: "Mon cycle",
    promesse: "Voir tes jours fertiles avec la méthode des jours fixes.",
    minutes: 1,
    etapes: ["Note le premier jour de tes règles", "Vois ton collier du cycle", "Ajoute les jours fertiles à ton calendrier"],
    source: "Guide OMS (2012), p. 14 et 26",
    limites: ["Il faut des règles régulières (26 à 32 jours)", "Cette méthode est moins efficace que les autres", "Elle ne protège pas des IST"],
    astuces: ["Mes règles sont irrégulières, que faire ?", "Quand suis-je fertile ?", "Cette méthode est-elle sûre ?"],
    suite: [
      { kind: "methode", id: "jours-fixes" },
      { kind: "sujet", id: "regles-cycle" },
      { kind: "outil", id: "choisir" },
    ],
  },
  {
    id: "souci",
    titre: "J'ai un souci avec ma méthode",
    promesse: "Oubli, retard, effet gênant : que faire avec ta méthode.",
    minutes: 1,
    etapes: ["Choisis ta méthode", "Lis quoi faire en cas d'oubli ou de retard", "Décide de la garder ou d'en changer"],
    source: "Guide OMS (2012), pages de chaque méthode et p. 28",
    limites: ["Il ne diagnostique pas", "Un effet très gênant mérite une consultation", "En cas de doute, va au centre"],
    astuces: ["J'ai oublié ma pilule", "Mes règles ont changé, c'est normal ?", "Je veux changer de méthode"],
    suite: [
      { kind: "outil", id: "plan" },
      { kind: "sujet", id: "apres-risque" },
      { kind: "outil", id: "choisir" },
    ],
  },
  {
    id: "visite",
    titre: "Je prépare ma visite",
    promesse: "Les bonnes questions à poser au centre, pour repartir en ayant compris.",
    minutes: 1,
    etapes: ["Dis pourquoi tu y vas", "Choisis la méthode qui t'intéresse, si tu veux", "Copie ta liste et emporte-la"],
    source: "Guide OMS (2012) et fiche « Préparer une consultation »",
    limites: ["Il ne remplace pas la consultation", "Les règles du centre peuvent varier", "En cas d'urgence, va tout de suite au centre"],
    astuces: ["Que dire à l'accueil ?", "Puis-je demander la confidentialité ?", "Et si on me juge ?"],
    suite: [
      { kind: "outil", id: "parler" },
      { kind: "outil", id: "choisir" },
      { kind: "sujet", id: "eviter-grossesse" },
    ],
  },
  {
    id: "parler",
    titre: "Parler à quelqu'un",
    promesse: "Des phrases pour aborder le sujet avec un partenaire, un parent ou un soignant.",
    minutes: 1,
    etapes: ["Choisis à qui tu veux parler", "Choisis ce que tu veux dire", "Reçois des phrases pour commencer et des réponses"],
    source: "Guide OMS (2012), fiches Alviosa, Afrobaromètre 2024/25",
    limites: ["Tu n'es jamais obligé(e) de parler", "Si tu as peur d'une réaction violente, ne parle pas seul(e)", "Ce sont des idées à adapter avec tes mots"],
    astuces: ["Comment en parler à mes parents ?", "Mon partenaire refuse le préservatif", "Où trouver de l'aide si j'ai peur ?"],
    suite: [
      { kind: "outil", id: "visite" },
      { kind: "sujet", id: "relations" },
      { kind: "sujet", id: "violence" },
    ],
  },
];
// Les outils, rangés selon le moment où on en a besoin. Chaque outil est dans un seul groupe.
export const TOOL_GROUPS: { id: string; titre: string; outils: ToolId[] }[] = [
  { id: "avant", titre: "Avant d'aller au centre", outils: ["choisir", "visite", "parler", "commencer"] },
  { id: "risque", titre: "Après un rapport à risque", outils: ["risque"] },
  { id: "jour", titre: "Au quotidien", outils: ["plan", "souci", "cycle"] },
];
export const getTool = (id: string) => TOOLS.find((t) => t.id === id);

// ---------- Méthodes ----------
type RawMethode = {
  id: string;
  nom: string;
  niveau: number;
  niveau_label: string;
  page: number;
  ist: boolean;
  ou_aller: string;
  resume: string[];
  ce_que_cest: string[];
  comment: string[];
  peut_arriver: string[];
  a_retenir: string[];
  mode_emploi: string[];
  source: string;
};

export type MethodeMeta = {
  frequence: string;
  hormonale: boolean;
  reversible: boolean;
  pour: "toutes" | "femmes" | "hommes";
  ou: "centre" | "communaute";
  accouchement?: string;
  astuces: string[];
};

// Ce que le guide dit de chaque méthode, ramené à quelques faits simples (guide OMS 2012, pages 3 à 16 et 17).
export const METHOD_META: Record<string, MethodeMeta> = {
  implants: { frequence: "3 à 5 ans", hormonale: true, reversible: true, pour: "femmes", ou: "centre", accouchement: "À partir de 6 semaines si tu allaites, sinon tout de suite.", astuces: ["Quels effets sur mes règles ?", "Comment se fait la pose ?", "Peut-on le retirer quand on veut ?"] },
  sterilet: { frequence: "12 ans", hormonale: false, reversible: true, pour: "femmes", ou: "centre", accouchement: "Juste après l'accouchement, ou à partir de 4 semaines.", astuces: ["La pose fait-elle mal ?", "Peut-on le retirer quand on veut ?", "Faut-il y penser tous les jours ?"] },
  "sterilisation-feminine": { frequence: "Définitive", hormonale: false, reversible: false, pour: "femmes", ou: "centre", accouchement: "Juste après l'accouchement, ou à partir de 6 semaines.", astuces: ["Est-ce vraiment définitif ?", "Que se passe-t-il pendant l'opération ?", "Pour qui est-ce adapté ?"] },
  vasectomie: { frequence: "Définitive", hormonale: false, reversible: false, pour: "hommes", ou: "centre", accouchement: "Idéalement 3 mois avant l'accouchement, car elle est efficace après 3 mois.", astuces: ["Cela change-t-il l'érection ?", "Quand est-elle efficace ?", "Est-ce la même chose que la castration ?"] },
  pilule: { frequence: "Chaque jour", hormonale: true, reversible: true, pour: "femmes", ou: "communaute", accouchement: "À partir de 6 mois si tu allaites, sinon à partir de 6 semaines.", astuces: ["J'ai oublié ma pilule", "Quels effets secondaires ?", "Puis-je la prendre si j'allaite ?"] },
  "pilule-minidosee": { frequence: "Chaque jour, à la même heure", hormonale: true, reversible: true, pour: "femmes", ou: "communaute", accouchement: "À partir de 6 semaines si tu allaites, sinon tout de suite.", astuces: ["Que faire si je suis en retard ?", "Est-elle adaptée à l'allaitement ?", "Quelle différence avec la pilule ?"] },
  injectables: { frequence: "Tous les 2 ou 3 mois", hormonale: true, reversible: true, pour: "femmes", ou: "communaute", accouchement: "À partir de 6 semaines si tu allaites, sinon tout de suite.", astuces: ["J'ai du retard pour mon injection", "Peut-on l'utiliser discrètement ?", "Quand reviennent les règles après l'arrêt ?"] },
  mama: { frequence: "Jusqu'à 6 mois", hormonale: false, reversible: true, pour: "femmes", ou: "communaute", astuces: ["À quelles conditions marche-t-elle ?", "Que faire après 6 mois ?", "Et si mes règles reviennent ?"] },
  "preservatif-masculin": { frequence: "À chaque rapport", hormonale: false, reversible: true, pour: "toutes", ou: "communaute", astuces: ["Comment bien le mettre ?", "Il a craqué, que faire ?", "Où en trouver ?"] },
  "preservatif-feminin": { frequence: "À chaque rapport", hormonale: false, reversible: true, pour: "femmes", ou: "communaute", astuces: ["Comment l'insérer ?", "Où en trouver ?", "Peut-on l'utiliser avec un autre préservatif ?"] },
  "jours-fixes": { frequence: "12 jours à éviter chaque mois", hormonale: false, reversible: true, pour: "femmes", ou: "communaute", astuces: ["Mes règles sont irrégulières, puis-je l'utiliser ?", "Comment utiliser le collier du cycle ?", "Est-ce efficace ?"] },
  retrait: { frequence: "À chaque rapport", hormonale: false, reversible: true, pour: "toutes", ou: "communaute", astuces: ["Est-ce efficace ?", "Que faire si j'ai éjaculé avant ?", "Qui peut l'utiliser ?"] },
  "contraception-urgence": { frequence: "Après un rapport, jusqu'à 5 jours", hormonale: true, reversible: true, pour: "femmes", ou: "communaute", astuces: ["Où la trouver ?", "Quels effets ?", "Jusqu'à quand puis-je la prendre ?"] },
};

export type Methode = RawMethode & MethodeMeta;
export const METHODES: Methode[] = (methodesData as unknown as RawMethode[]).map((m) => ({ ...m, ...METHOD_META[m.id] }));
export const getMethode = (id: string) => METHODES.find((m) => m.id === id);

export const TIER_NAMES: Record<number, string> = {
  1: "Les plus efficaces et les plus faciles à gérer",
  2: "Très efficaces, avec plus d'attention",
  3: "Efficaces, avec plus d'attention",
  4: "Moins efficaces",
  0: "Après un rapport non protégé",
};
export const TIER_ORDER = [1, 2, 3, 4, 0];

// ---------- Liens et recherche ----------
export const hrefOf = {
  sujet: (id: string) => `/sujets/${id}`,
  outil: (id: string) => `/outils/${id}`,
  methode: (id: string) => `/methodes/${id}`,
  episode: (id: string) => `/histoires/${id}`,
};

export function suiteLink(item: { kind: "sujet" | "methode" | "outil"; id: string }): { href: string; titre: string; type: string } {
  if (item.kind === "sujet") return { href: hrefOf.sujet(item.id), titre: getSujet(item.id)?.titre ?? item.id, type: "Sujet" };
  if (item.kind === "outil") return { href: hrefOf.outil(item.id), titre: getTool(item.id)?.titre ?? item.id, type: "Outil" };
  return { href: hrefOf.methode(item.id), titre: getMethode(item.id)?.nom ?? item.id, type: "Méthode" };
}

export type SearchItem = { href: string; titre: string; type: "Sujet" | "Outil" | "Méthode" | "Épisode"; texte: string };

// Tout ce qu'on peut chercher : le titre et quelques mots clés de chaque page.
export function searchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const s of SUJETS) items.push({ href: hrefOf.sujet(s.id), titre: s.titre, type: "Sujet", texte: `${s.bref} ${s.points.map((p) => p.titre).join(" ")}` });
  for (const t of TOOLS) items.push({ href: hrefOf.outil(t.id), titre: t.titre, type: "Outil", texte: t.promesse });
  for (const m of METHODES) items.push({ href: hrefOf.methode(m.id), titre: m.nom, type: "Méthode", texte: `${m.resume.join(" ")} ${m.frequence}` });
  for (const e of stories) items.push({ href: hrefOf.episode(e.id), titre: `Épisode ${e.episode} · ${e.titre}`, type: "Épisode", texte: e.accroche });
  return items;
}

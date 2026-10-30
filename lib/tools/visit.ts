// « Je prépare ma visite » : les bonnes questions à poser et les choses à apporter, selon la raison de la visite et la méthode.
// Pourquoi cet outil : dans les enquêtes de terrain de la région (PMA2020 Burkina Faso, 2017-18), seulement 64,9 % des utilisatrices
// de méthodes modernes disent avoir entendu parler d'autres méthodes, et 52,1 % avoir été informées des effets secondaires.
// Venir avec ses questions aide à combler ce manque. Les contenus viennent du Guide OMS (2012) et de la fiche « Préparer une consultation ».

export type Reason = "premiere" | "changer" | "suite" | "apres-bebe" | "probleme" | "depistage";

export const REASONS: { id: Reason; label: string }[] = [
  { id: "premiere", label: "Je veux commencer une méthode" },
  { id: "changer", label: "Je veux changer de méthode" },
  { id: "suite", label: "Je reviens pour la suite (injection, boîte…)" },
  { id: "apres-bebe", label: "J'ai eu un bébé il n'y a pas longtemps" },
  { id: "probleme", label: "J'ai un souci avec ma méthode" },
  { id: "depistage", label: "Je veux faire un test (IST, VIH)" },
];

export type VisitMethod =
  | "aucune"
  | "pilule"
  | "pilule-minidosee"
  | "injectables"
  | "implants"
  | "sterilet"
  | "preservatif-masculin"
  | "preservatif-feminin"
  | "contraception-urgence"
  | "naturelle"
  | "definitive";

export const VISIT_METHODS: { id: VisitMethod; label: string; nom: string }[] = [
  { id: "aucune", label: "Je ne sais pas encore", nom: "" },
  { id: "pilule", label: "La pilule", nom: "la pilule" },
  { id: "pilule-minidosee", label: "La pilule minidosée", nom: "la pilule minidosée" },
  { id: "injectables", label: "L'injection", nom: "l'injection" },
  { id: "implants", label: "L'implant", nom: "l'implant" },
  { id: "sterilet", label: "Le stérilet", nom: "le stérilet" },
  { id: "preservatif-masculin", label: "Le préservatif masculin", nom: "le préservatif masculin" },
  { id: "preservatif-feminin", label: "Le préservatif féminin", nom: "le préservatif féminin" },
  { id: "contraception-urgence", label: "La pilule d'urgence", nom: "la pilule d'urgence" },
  { id: "naturelle", label: "Allaitement, jours fixes, retrait", nom: "cette méthode naturelle" },
  { id: "definitive", label: "Stérilisation ou vasectomie", nom: "cette méthode définitive" },
];

export type VisitItem = { id: string; question: string; why: string };
export type VisitGroup = { id: "essentiel" | "situation" | "methode"; title: string; items: VisitItem[] };

export type VisitPlan = {
  groups: VisitGroup[];
  bring: string[];
  ifJudged: string;
};

// Les questions de base : elles servent à chaque visite.
const ESSENTIAL: VisitItem[] = [
  { id: "options", question: "Quelles méthodes existent, et lesquelles me conviennent ?", why: "Tu as le droit de connaître plusieurs options avant de choisir." },
  { id: "effets", question: "Quels effets peuvent arriver ? Lesquels sont normaux, et lesquels doivent me faire revenir ?", why: "Savoir à l'avance évite de s'inquiéter ou d'arrêter trop tôt." },
  { id: "oubli", question: "Que faire en cas d'oubli, de retard ou si je veux arrêter ?", why: "Chaque méthode a ses règles : demande-les par écrit ou note-les." },
  { id: "changer", question: "Puis-je changer de méthode si celle-ci ne me convient pas ?", why: "Oui : on peut t'aider à en choisir une autre." },
  { id: "retour", question: "Quand dois-je revenir ? Pouvez-vous écrire la date ?", why: "Une date notée, c'est un rendez-vous qu'on n'oublie pas." },
  { id: "confidentialite", question: "Ce que je dis reste-t-il confidentiel ?", why: "Tu peux demander la confidentialité et poser tes questions sans honte." },
  { id: "prix", question: "Combien coûtent la consultation et la méthode ?", why: "Mieux vaut le savoir avant, pour ne pas renoncer au dernier moment." },
];

const BY_REASON: Record<Reason, VisitItem[]> = {
  premiere: [
    { id: "vie", question: "Je pense à mes études, à mon partenaire et à mon envie d'enfant plus tard : quelle méthode irait avec ma vie ?", why: "Le bon choix dépend de ta vie, pas seulement de la méthode." },
    { id: "debut", question: "Puis-je commencer aujourd'hui, ou faut-il attendre mes prochaines règles ou faire un test ?", why: "Le guide OMS pose 6 questions pour savoir si tu peux commencer sans attendre." },
    { id: "ist", question: "Comment me protéger aussi des IST et du VIH ?", why: "Seul le préservatif protège à la fois d'une grossesse et des IST." },
  ],
  changer: [
    { id: "pourquoi", question: "Voici ce qui me gêne avec ma méthode actuelle. Que me conseillez-vous à la place ?", why: "Dire précisément ce qui gêne aide à trouver une méthode qui convient." },
    { id: "passage", question: "Comment passer à la nouvelle méthode sans période sans protection ?", why: "Le passage d'une méthode à l'autre a ses règles : demande quand commencer." },
  ],
  suite: [
    { id: "dates", question: "Quelle est ma prochaine date ? Jusqu'à quand puis-je venir en cas de retard ?", why: "Pour l'injection, le guide OMS donne un délai pendant lequel le retard reste acceptable." },
    { id: "stock", question: "Puis-je repartir avec plusieurs boîtes, ou revenir plus facilement ?", why: "Moins de déplacements, c'est moins d'occasions d'oublier ou de renoncer." },
  ],
  "apres-bebe": [
    { id: "allaitement", question: "Quelles méthodes puis-je utiliser pendant que j'allaite ?", why: "Certaines méthodes se commencent plus tôt que d'autres après l'accouchement." },
    { id: "quand", question: "À partir de quand puis-je commencer, selon la méthode ?", why: "Stérilet, implant, injection, pilule : les délais après l'accouchement ne sont pas les mêmes." },
    { id: "deux-ans", question: "Combien de temps attendre avant une prochaine grossesse ?", why: "Il est plus sain d'attendre au moins 2 ans après la naissance d'un enfant." },
  ],
  probleme: [
    { id: "depuis", question: "J'ai ce symptôme depuis tel jour. Est-ce lié à ma méthode ?", why: "Note le symptôme et sa date de début avant de venir." },
    { id: "continuer", question: "Dois-je continuer, arrêter, ou changer ?", why: "Beaucoup d'effets sont courants et passent. Si un effet te gêne, on peut t'aider à choisir autre chose." },
  ],
  depistage: [
    { id: "tests", question: "Quels tests faites-vous (IST, VIH), et quand aurai-je les résultats ?", why: "Beaucoup d'IST n'ont aucun signe : le test est la seule façon de savoir." },
    { id: "positif", question: "Que se passe-t-il si un test est positif ? Y a-t-il un traitement ?", why: "Le VIH et beaucoup d'IST se soignent ou se contrôlent. Savoir tôt aide." },
    { id: "partenaire", question: "Mon ou ma partenaire doit-il aussi être testé ou traité ?", why: "Sinon l'infection peut revenir." },
  ],
};

const BY_METHOD: Record<Exclude<VisitMethod, "aucune">, VisitItem[]> = {
  pilule: [{ id: "pilule", question: "Que faire si j'oublie une pilule, ou si je vomis après l'avoir prise ?", why: "Le guide OMS donne des règles précises pour les oublis." }],
  "pilule-minidosee": [{ id: "mini", question: "À quelle heure la prendre, et de combien de temps puis-je être en retard ?", why: "La pilule minidosée demande une heure régulière." }],
  injectables: [{ id: "inj", question: "Quand est ma prochaine injection ? Les règles vont-elles changer ?", why: "Des règles irrégulières ou absentes sont courantes et sans gravité avec les injectables." }],
  implants: [{ id: "imp", question: "Combien de temps dure cet implant ? Puis-je le faire retirer quand je veux ?", why: "L'implant dure 3 à 5 ans et peut être retiré à tout moment." }],
  sterilet: [{ id: "ster", question: "Pendant combien d'années ? Quels signes doivent me faire revenir ?", why: "Le stérilet peut durer jusqu'à 12 ans et peut être retiré à tout moment." }],
  "preservatif-masculin": [{ id: "pm", question: "Comment bien le mettre ? Où en avoir gratuitement ou à petit prix ?", why: "Bien utilisé à chaque rapport, il protège aussi des IST." }],
  "preservatif-feminin": [{ id: "pf", question: "Comment bien le mettre ? Où le trouver ?", why: "Il protège aussi des IST." }],
  "contraception-urgence": [{ id: "ec", question: "Jusqu'à quand puis-je la prendre après le rapport ? Dois-je faire autre chose ?", why: "Plus tôt on la prend, mieux c'est. Pense aussi à la protection contre le VIH et les IST." }],
  naturelle: [{ id: "nat", question: "Cette méthode est-elle assez sûre pour moi ? Quelle méthode plus efficace puis-je ajouter ?", why: "Le guide OMS indique que ces méthodes sont moins efficaces que les autres." }],
  definitive: [{ id: "def", question: "Cette méthode est-elle définitive ? Quelles méthodes existent si je change d'avis ?", why: "Seules la stérilisation et la vasectomie sont définitives." }],
};

const BRING = [
  "Tes questions (copie cette liste)",
  "Ton carnet de santé ou tes anciens papiers, si tu en as",
  "La date du premier jour de tes dernières règles",
  "Les méthodes déjà utilisées et les médicaments que tu prends",
  "Une personne de confiance, si tu le souhaites",
  "Un peu d'argent, au cas où",
];

const IF_JUDGED =
  "Si l'accueil te juge ou te refuse sans explication, tu peux demander calmement qu'on t'explique pourquoi, puis essayer un autre centre ou une autre pharmacie. Tu n'as pas à te justifier.";

export function visitPlan(reason: Reason, method: VisitMethod): VisitPlan {
  const groups: VisitGroup[] = [{ id: "essentiel", title: "Les questions de base", items: ESSENTIAL }];
  groups.push({ id: "situation", title: "Pour ta situation", items: BY_REASON[reason] });
  if (method !== "aucune") {
    const chosen = VISIT_METHODS.find((item) => item.id === method);
    groups.push({
      id: "methode",
      title: chosen ? `Pour ${chosen.nom}` : "Pour ta méthode",
      items: BY_METHOD[method],
    });
  }
  return { groups, bring: BRING, ifJudged: IF_JUDGED };
}

export function visitText(reason: Reason, method: VisitMethod): string {
  const plan = visitPlan(reason, method);
  const label = REASONS.find((item) => item.id === reason)?.label ?? "";
  const lines = [`Ma visite : ${label}`, ""];
  for (const group of plan.groups) {
    lines.push(group.title.toUpperCase());
    group.items.forEach((item, i) => lines.push(`${i + 1}. ${item.question}`));
    lines.push("");
  }
  lines.push("À APPORTER");
  plan.bring.forEach((item) => lines.push(`- ${item}`));
  lines.push("", "Alviosa : information, pas un avis médical.");
  return lines.join("\n");
}

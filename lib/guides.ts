import type { Lang } from "@/lib/i18n";

// Une étape : une phrase lue à voix haute pendant qu'on entoure l'élément concerné à l'écran.
// `target` est un sélecteur CSS ; sans cible (ou si l'élément est absent), la phrase s'affiche au centre.
// `preview` montre à quoi ressemble ce qui se passe quand on appuie, dans la carte d'explication.
export type Preview = "chat" | "learn" | "centres" | "urgent";
export type Step = { fr: string; target?: string; preview?: Preview };

export type Guide = {
  id: string;
  title: string;
  steps: Step[];
  // Traductions : même nombre de phrases que `steps`. Absente = lecture en français.
  // Les textes de démonstration doivent être relus par un locuteur avant tout usage réel.
  translations?: Partial<Record<Lang, string[]>>;
  // Enregistrements de vraies voix (facultatif) : /audio/guides/<langue>/<guide>-<n>.mp3
  audio?: Partial<Record<Lang, string[]>>;
};

const T = {
  chat: '[data-tour="tab-chat"]',
  learn: '[data-tour="tab-learn"]',
  centres: '[data-tour="tab-centres"]',
  urgent: '[data-tour="urgent"]',
  audio: '[data-tour="audio"]',
  ask: '[data-tour="ask"]',
};

export const TOUR: Guide = {
  id: "global",
  title: "Bienvenue sur Alviosa",
  steps: [
    { fr: "Bonjour ! Bienvenue sur Alviosa. Je vais te montrer comment ça marche. Écoute, et regarde ce que j'entoure." },
    { fr: "Quand tu appuies ici, tu parles à Afi. Tu peux écrire, ou dire ta question à voix haute.", target: T.chat, preview: "chat" },
    { fr: "Quand tu appuies ici, tu apprends : les méthodes, des histoires et un jeu de vrai ou faux.", target: T.learn, preview: "learn" },
    { fr: "Quand tu appuies ici, tu trouves un centre de santé ou une pharmacie près de toi.", target: T.centres, preview: "centres" },
    { fr: "Ce bouton rose, c'est pour les urgences. Appuie dessus si tu es en danger, ou après un rapport sans protection.", target: T.urgent, preview: "urgent" },
    { fr: "Ce bouton haut-parleur répète l'explication de la page où tu es.", target: T.audio },
    { fr: "Maintenant, appuie ici pour poser ta première question. Ici, personne ne te juge et personne ne voit ce que tu fais.", target: T.ask },
  ],
  translations: {
    // DÉMONSTRATIONS : traductions d'essai, non validées. À faire relire et enregistrer par des locuteurs.
    yo: [
      "Ẹ káàbọ̀ sí Alviosa! Mo máa fi bí ó ṣe ń ṣiṣẹ́ hàn ọ́. Gbọ́, kí o sì wo ohun tí mo yí ká.",
      "Tí o bá tẹ ibí, o máa bá Afi sọ̀rọ̀. O lè kọ, tàbí sọ ìbéèrè rẹ jáde.",
      "Tí o bá tẹ ibí, o máa kọ́ nípa àwọn ọ̀nà ìdènà oyún, àwọn ìtàn àti eré òótọ́ tàbí irọ́.",
      "Tí o bá tẹ ibí, o máa rí ilé ìwòsàn tàbí ilé oògùn tó sún mọ́ ọ.",
      "Bọ́tìnì pinki yìí wà fún ìgbà pàjáwìrì. Tẹ̀ ẹ́ tí o bá wà nínú ewu, tàbí lẹ́yìn ìbálòpọ̀ láìsí ààbò.",
      "Bọ́tìnì ohùn yìí ń tún àlàyé ojú ewé tí o wà ṣe.",
      "Báyìí, tẹ ibí láti béèrè ìbéèrè àkọ́kọ́ rẹ. Níbí, ẹnikẹ́ni kò ní dá ọ lẹ́bi, ẹnikẹ́ni kò sì rí ohun tí ò ń ṣe.",
    ],
    hac: [
      "مرحبًا بك في ألفيوسا! سأريك كيف يعمل. استمع، وانظر إلى ما أحيط به.",
      "عندما تضغط هنا، تتحدث مع أفي. يمكنك أن تكتب، أو أن تقول سؤالك بصوت عالٍ.",
      "عندما تضغط هنا، تتعلم: الطرق، وقصصًا، ولعبة صح أو خطأ.",
      "عندما تضغط هنا، تجد مركزًا صحيًا أو صيدلية قريبة منك.",
      "هذا الزر الوردي للطوارئ. اضغط عليه إذا كنت في خطر، أو بعد علاقة بلا حماية.",
      "زر مكبّر الصوت هذا يعيد شرح الصفحة التي أنت فيها.",
      "الآن اضغط هنا لتطرح سؤالك الأول. هنا لا أحد يحكم عليك، ولا أحد يرى ما تفعله.",
    ],
    ha: [
      "Barka da zuwa Alviosa! Zan nuna maka yadda yake aiki. Ka saurara, ka kuma duba abin da na kewaye.",
      "Idan ka danna nan, za ka yi magana da Afi. Za ka iya rubuta, ko ka fadi tambayarka da murya.",
      "Idan ka danna nan, za ka koyi hanyoyin tazarar haihuwa, labarai da wasan gaskiya ko karya.",
      "Idan ka danna nan, za ka sami cibiyar lafiya ko kantin magani kusa da kai.",
      "Wannan maɓallin ruwan hoda na gaggawa ne. Danna shi idan kana cikin haɗari, ko bayan jima'i ba tare da kariya ba.",
      "Wannan maɓallin lasifika yana maimaita bayanin shafin da kake ciki.",
      "Yanzu danna nan ka yi tambayarka ta farko. A nan babu wanda zai hukunta ka, kuma babu wanda yake ganin abin da kake yi.",
    ],
  },
};

const PAGE_GUIDES: Record<string, Guide> = {
  home: {
    id: "home",
    title: "Page d'accueil",
    steps: [
      { fr: "Tu es sur la page d'accueil. Appuie ici pour poser ta question à Afi.", target: T.ask },
      { fr: "Appuie ici pour comprendre les méthodes de contraception.", target: '[data-tour="methods"]' },
      { fr: "En cas d'urgence, appuie sur ce lien rose, ou sur le bouton rose en haut de l'écran.", target: ".hero-urgent a" },
    ],
  },
  chat: {
    id: "chat",
    title: "Parler à Afi",
    steps: [
      { fr: "Ici, tu parles à Afi. Écris ta question dans cette zone.", target: ".composer" },
      { fr: "Ou appuie sur le micro et dis ta question à voix haute.", target: ".composer .icon-btn.ghost" },
      { fr: "Quand tu as fini, appuie sur ce bouton pour envoyer.", target: ".composer .icon-btn.primary" },
      { fr: "Ici, tu peux changer de sujet : planification familiale, santé mentale ou bien-être.", target: ".chat-page .tabs" },
    ],
  },
  apprendre: {
    id: "apprendre",
    title: "Apprendre",
    steps: [
      { fr: "Quand tu appuies ici, tu vois chaque méthode de contraception expliquée simplement.", target: ".learn-list li:nth-child(1)" },
      { fr: "Ici, des histoires vraies, avec Afi, Fallone et Chimène.", target: ".learn-list li:nth-child(2)" },
      { fr: "Ici, un jeu de vrai ou faux. Tu gagnes des points à chaque bonne réponse.", target: ".learn-list li:nth-child(3)" },
    ],
  },
  methodes: {
    id: "methodes",
    title: "Les méthodes",
    steps: [
      { fr: "Les méthodes sont classées de la plus efficace à la moins efficace. Appuie sur une méthode pour l'ouvrir.", target: ".methods details:first-child summary" },
      { fr: "Tu y vois ce que c'est, comment l'utiliser, ce qui peut arriver, et ce qu'il faut retenir.", target: ".methods details:first-child summary" },
      { fr: "Important : seuls les préservatifs protègent à la fois de la grossesse et des infections.", target: ".notice.important" },
    ],
  },
  histoires: {
    id: "histoires",
    title: "Les histoires",
    steps: [
      { fr: "Choisis ici comment tu aimes apprendre : en images, en faisant des choix, ou en dessin animé.", target: ".format-picker" },
      { fr: "Appuie ici pour commencer une histoire.", target: ".story-item:first-child .btn" },
    ],
  },
  histoire: {
    id: "histoire",
    title: "Une histoire",
    steps: [
      { fr: "Ici, tu changes la façon de vivre l'histoire : en images, en choix ou en dessin animé.", target: '.tabs[role="tablist"]' },
      { fr: "Dans le dessin animé, appuie sur « Activer la voix » pour entendre les personnages." },
    ],
  },
  quiz: {
    id: "quiz",
    title: "Vrai ou faux",
    steps: [
      { fr: "Lis la phrase, puis appuie sur Vrai ou Faux. Tu vois l'explication juste après.", target: "main .panel .row" },
    ],
  },
  orientation: {
    id: "orientation",
    title: "Trouver un centre",
    steps: [
      { fr: "Appuie ici pour utiliser ta position et voir les centres les plus proches.", target: ".nearby .btn.indigo" },
      { fr: "Si tu préfères, écris le nom de ton quartier ici.", target: ".nearby input" },
    ],
  },
  urgence: {
    id: "urgence",
    title: "Urgence",
    steps: [
      { fr: "Si tu as un saignement très abondant, une douleur très forte, de la fièvre, un malaise, ou si tu as subi une violence : va tout de suite au centre de santé le plus proche.", target: ".urgent" },
      { fr: "Demande à une personne de confiance de t'accompagner. Tu n'es pas seul." },
    ],
  },
  default: {
    id: "default",
    title: "Aide",
    steps: [
      { fr: "Utilise le menu en bas pour aller à Parler, Apprendre ou Centres.", target: ".bottom-nav" },
      { fr: "Le bouton rose en haut sert pour les urgences.", target: T.urgent },
    ],
  },
};

export function guideForPath(pathname: string): Guide {
  if (pathname === "/") return PAGE_GUIDES.home;
  if (pathname.startsWith("/chat")) return PAGE_GUIDES.chat;
  if (pathname.startsWith("/apprendre")) return PAGE_GUIDES.apprendre;
  if (pathname.startsWith("/methodes")) return PAGE_GUIDES.methodes;
  if (pathname.startsWith("/histoires/")) return PAGE_GUIDES.histoire;
  if (pathname.startsWith("/chroniques")) return PAGE_GUIDES.histoires;
  if (pathname.startsWith("/quiz")) return PAGE_GUIDES.quiz;
  if (pathname.startsWith("/orientation")) return PAGE_GUIDES.orientation;
  if (pathname.startsWith("/urgence")) return PAGE_GUIDES.urgence;
  return PAGE_GUIDES.default;
}

export const ALL_GUIDES: Guide[] = [TOUR, ...Object.values(PAGE_GUIDES)];

// Pour chaque étape : la phrase en français, puis la traduction si elle existe pour la langue choisie.
// La lecture dit d'abord le français, puis la langue locale, avant de passer à l'élément suivant.
export function stepTexts(guide: Guide, lang: Lang): { fr: string; local?: string; frAudio?: string; localAudio?: string }[] {
  const translation = guide.translations?.[lang];
  const ok = lang !== "fr" && translation && translation.length === guide.steps.length;
  return guide.steps.map((step, i) => ({
    fr: step.fr,
    local: ok ? translation[i] : undefined,
    frAudio: guide.audio?.fr?.[i],
    localAudio: ok ? guide.audio?.[lang]?.[i] : undefined,
  }));
}

export function hasTranslation(guide: Guide, lang: Lang): boolean {
  const translation = guide.translations?.[lang];
  return lang === "fr" || Boolean(translation && translation.length === guide.steps.length);
}

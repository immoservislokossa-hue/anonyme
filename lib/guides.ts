import type { Lang } from "@/lib/i18n";

// Visuels des étapes de la présentation : un dessin simple suffit à suivre sans savoir lire.
export type Visual = "afi" | "chat" | "learn" | "pin" | "alert" | "lock" | "speaker";

export type Step = { visual: Visual; fr: string };

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

export const TOUR: Guide = {
  id: "global",
  title: "Bienvenue sur Alviosa",
  steps: [
    { visual: "afi", fr: "Bonjour et bienvenue sur Alviosa. Ici, tu peux poser tes questions sur la contraception, sans honte et sans que personne ne te juge." },
    { visual: "chat", fr: "Pour parler à Afi, appuie sur « Parler ». Tu peux écrire, ou appuyer sur le petit micro et dire ta question à voix haute." },
    { visual: "learn", fr: "Dans « Apprendre », tu trouves les méthodes expliquées simplement, des histoires à écouter ou à regarder, et un jeu de vrai ou faux." },
    { visual: "pin", fr: "Dans « Centres », tu trouves un centre de santé ou une pharmacie près de toi. Autorise la position, ou écris le nom de ton quartier." },
    { visual: "alert", fr: "Si tu es en danger, ou après un rapport sans protection, appuie sur le bouton rose en haut. Il te dit quoi faire tout de suite." },
    { visual: "lock", fr: "Ici, personne ne voit ce que tu fais. Il n'y a pas de compte et tes messages ne sont pas gardés." },
    { visual: "speaker", fr: "Tu peux réécouter cette présentation à tout moment avec le bouton haut-parleur en haut de l'écran. Appuie sur « Commencer »." },
  ],
  translations: {
    // DÉMONSTRATION : traduction d'essai, non validée. À faire relire et enregistrer par un locuteur.
    yo: [
      "Ẹ káàbọ̀ sí Alviosa. Níbí, o lè béèrè ìbéèrè nípa ètò ìdílé láìsí ìtìjú, láìsí ẹni tó máa dá ọ lẹ́bi.",
      "Láti bá Afi sọ̀rọ̀, tẹ « Parler ». O lè kọ ìbéèrè rẹ, tàbí tẹ ohun èlò gbohùngbohùn kí o sì sọ̀rọ̀.",
      "Nínú « Apprendre », o máa rí àlàyé àwọn ọ̀nà ìdènà oyún, àwọn ìtàn, àti eré òótọ́ tàbí irọ́.",
      "Nínú « Centres », o máa rí ilé ìwòsàn tàbí ilé oògùn tó sún mọ́ ọ.",
      "Tí o bá wà nínú ewu, tẹ bọ́tìnì pinki ní òkè. Yóò sọ ohun tí o gbọ́dọ̀ ṣe lẹ́sẹ̀kẹsẹ̀.",
      "Níbí, ẹnikẹ́ni kò rí ohun tí ò ń ṣe. Kò sí àkọọ́lẹ̀, a kò sì fi ọ̀rọ̀ rẹ pamọ́.",
      "O lè tún gbọ́ ìfihàn yìí nígbàkigbà pẹ̀lú bọ́tìnì ohùn ní òkè. Tẹ « Commencer ».",
    ],
  },
};

const PAGE_GUIDES: Record<string, Guide> = {
  home: {
    id: "home",
    title: "Page d'accueil",
    steps: [
      { visual: "afi", fr: "Tu es sur la page d'accueil. Appuie sur « Poser ma question » pour parler à Afi." },
      { visual: "learn", fr: "Appuie sur « Voir les méthodes » pour comprendre les méthodes de contraception." },
      { visual: "alert", fr: "En cas d'urgence, appuie sur le lien rose, ou sur le bouton rose en haut de l'écran." },
    ],
  },
  chat: {
    id: "chat",
    title: "Parler à Afi",
    steps: [
      { visual: "chat", fr: "Ici, tu parles à Afi. Écris ta question dans la zone en bas, ou appuie sur le micro pour parler." },
      { visual: "speaker", fr: "Sous chaque réponse, appuie sur « Écouter » pour l'entendre à voix haute." },
      { visual: "learn", fr: "Tu peux changer de sujet avec les boutons en haut : planification familiale, santé mentale ou bien-être." },
    ],
  },
  apprendre: {
    id: "apprendre",
    title: "Apprendre",
    steps: [
      { visual: "learn", fr: "Choisis ce que tu veux faire. « Les méthodes » explique chaque méthode de contraception." },
      { visual: "afi", fr: "« Les histoires » raconte des situations vraies, avec Afi, Fallone et Chimène." },
      { visual: "chat", fr: "« Vrai ou faux » teste ce que tu sais. Tu gagnes des points à chaque bonne réponse." },
    ],
  },
  methodes: {
    id: "methodes",
    title: "Les méthodes",
    steps: [
      { visual: "learn", fr: "Voici les méthodes de contraception. Pour chacune, tu vois comment elle marche et combien de temps elle protège." },
      { visual: "lock", fr: "Tu vois aussi si elle protège des infections, et si un professionnel doit la poser." },
      { visual: "chat", fr: "Appuie sur « Poser une question » si tu veux en savoir plus. Un professionnel de santé t'aide à choisir." },
    ],
  },
  histoires: {
    id: "histoires",
    title: "Les histoires",
    steps: [
      { visual: "afi", fr: "Choisis comment vivre une histoire : en images, en faisant des choix, ou en dessin animé." },
      { visual: "speaker", fr: "Dans le dessin animé, appuie sur « Activer la voix » pour entendre les personnages." },
      { visual: "learn", fr: "À la fin, tu vois ce qu'il faut retenir, et un bouton pour agir." },
    ],
  },
  quiz: {
    id: "quiz",
    title: "Vrai ou faux",
    steps: [
      { visual: "learn", fr: "Lis chaque phrase, puis dis si elle est vraie ou fausse." },
      { visual: "chat", fr: "Tu vois l'explication juste après. Tu gagnes des points à chaque bonne réponse." },
    ],
  },
  orientation: {
    id: "orientation",
    title: "Trouver un centre",
    steps: [
      { visual: "pin", fr: "Cette page t'aide à trouver un centre de santé ou une pharmacie. Appuie sur « Utiliser ma position »." },
      { visual: "pin", fr: "Si tu préfères, écris le nom de ton quartier. Choisis « Centres » ou « Pharmacies »." },
      { visual: "alert", fr: "Appelle avant d'y aller pour vérifier les horaires, et demande la confidentialité." },
    ],
  },
  urgence: {
    id: "urgence",
    title: "Urgence",
    steps: [
      { visual: "alert", fr: "Si tu as un saignement très abondant, une douleur très forte, de la fièvre, un malaise, ou si tu as subi une violence : va tout de suite au centre de santé le plus proche." },
      { visual: "chat", fr: "Demande à une personne de confiance de t'accompagner. Tu n'es pas seul." },
    ],
  },
  default: {
    id: "default",
    title: "Aide",
    steps: [
      { visual: "learn", fr: "Utilise le menu en bas pour aller à Parler, Apprendre ou Centres." },
      { visual: "alert", fr: "Le bouton rose en haut sert pour les urgences." },
    ],
  },
};

export function guideForPath(pathname: string): Guide {
  if (pathname === "/") return PAGE_GUIDES.home;
  if (pathname.startsWith("/chat")) return PAGE_GUIDES.chat;
  if (pathname.startsWith("/apprendre")) return PAGE_GUIDES.apprendre;
  if (pathname.startsWith("/methodes")) return PAGE_GUIDES.methodes;
  if (pathname.startsWith("/chroniques") || pathname.startsWith("/histoires")) return PAGE_GUIDES.histoires;
  if (pathname.startsWith("/quiz")) return PAGE_GUIDES.quiz;
  if (pathname.startsWith("/orientation")) return PAGE_GUIDES.orientation;
  if (pathname.startsWith("/urgence")) return PAGE_GUIDES.urgence;
  return PAGE_GUIDES.default;
}

export const ALL_GUIDES: Guide[] = [TOUR, ...Object.values(PAGE_GUIDES)];

// Phrases à lire pour une langue donnée, avec repli sur le français quand il n'y a pas de traduction.
export function linesFor(guide: Guide, lang: Lang): { lines: string[]; translated: boolean; audio?: string[] } {
  const translation = guide.translations?.[lang];
  const ok = translation && translation.length === guide.steps.length;
  return {
    lines: ok ? translation : guide.steps.map((step) => step.fr),
    translated: lang === "fr" || Boolean(ok),
    audio: guide.audio?.[lang],
  };
}

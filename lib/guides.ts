import type { Lang } from "@/lib/i18n";

// Une étape : une phrase lue à voix haute pendant qu'on entoure l'élément concerné à l'écran.
// `target` est un sélecteur CSS ; sans cible (ou si l'élément est absent), la phrase s'affiche au centre.
export type Step = { fr: string; target?: string };

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
};

// Présentation unique : la barre du bas et l'en-tête, 5 étapes au plus. Rien d'autre.
export const TOUR: Guide = {
  id: "global",
  title: "Bienvenue sur Alviosa",
  steps: [
    { fr: "Quand tu appuies sur cette bulle, tu parles à Afi, sur toutes les pages. Tu peux écrire, ou dire ta question à voix haute.", target: T.chat },
    { fr: "Quand tu appuies ici, tu apprends : les sujets, les outils, les méthodes et la série.", target: T.learn },
    { fr: "Quand tu appuies ici, tu trouves un centre de santé ou une pharmacie près de toi.", target: T.centres },
    { fr: "Ce bouton rose, c'est pour les urgences. Appuie dessus si tu es en danger, ou après un rapport sans protection.", target: T.urgent },
    { fr: "Ce bouton haut-parleur répète cette explication.", target: T.audio },
  ],
  translations: {
    // DÉMONSTRATION : traduction d'essai, non validée. À faire relire et enregistrer par un locuteur.
    yo: [
      "Tí o bá tẹ ibí, o máa bá Afi sọ̀rọ̀. O lè kọ, tàbí sọ ìbéèrè rẹ jáde.",
      "Tí o bá tẹ ibí, o máa kọ́ nípa àwọn ọ̀nà ìdènà oyún àti àwọn ìtàn.",
      "Tí o bá tẹ ibí, o máa rí ilé ìwòsàn tàbí ilé oògùn tó sún mọ́ ọ.",
      "Bọ́tìnì pinki yìí wà fún ìgbà pàjáwìrì. Tẹ̀ ẹ́ tí o bá wà nínú ewu, tàbí lẹ́yìn ìbálòpọ̀ láìsí ààbò.",
      "Bọ́tìnì ohùn yìí ń tún àlàyé yìí ṣe.",
    ],
  },
};

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

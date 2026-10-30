// « Parler à quelqu'un » : comment aborder la conversation avec un partenaire, un parent, un proche ou un professionnel de santé.
// Pourquoi cet outil : dans l'enquête Afrobaromètre 2024/25 (7 pays du PO), seulement 44 % des citoyens soutiennent l'accès à la contraception
// quel que soit le statut matrimonial (Bénin : 58 %) et 40 % quel que soit l'âge (Bénin : 53 %) ; le soutien baisse avec l'âge.
// Dans l'enquête PMA2020 au Burkina Faso (2017-18), 21 % des femmes qui veulent attendre mais n'utilisent rien citent l'opposition à l'utilisation.
// Les réponses s'appuient sur le Guide OMS (2012) et les fiches Alviosa. Ce sont des mots à adapter, jamais une obligation de parler.

export type Who = "partenaire" | "parent" | "proche" | "soignant";
export type Goal = "proteger" | "methode" | "enceinte" | "attendre";

export const WHOS: { id: Who; label: string; hint: string }[] = [
  { id: "partenaire", label: "Mon ou ma partenaire", hint: "Parler de protection, de méthode ou de grossesse." },
  { id: "parent", label: "Un parent ou la personne qui m'élève", hint: "Demander de l'aide ou de l'écoute." },
  { id: "proche", label: "Une personne de confiance", hint: "Une amie, un frère, une grande sœur, une tante…" },
  { id: "soignant", label: "Un agent de santé ou un pharmacien", hint: "Poser mes questions sans me sentir jugé(e)." },
];

export const GOALS: { id: Goal; label: string }[] = [
  { id: "proteger", label: "Je veux qu'on se protège" },
  { id: "methode", label: "Je veux utiliser une méthode" },
  { id: "enceinte", label: "Je pense être enceinte" },
  { id: "attendre", label: "Je veux attendre avant un enfant" },
];

export type Objection = { dit: string; reponds: string };

type Script = { openers: Record<Goal, string[]>; objections: Objection[]; tips: string[] };

const STERILE: Objection = {
  dit: "« Ça rend stérile. »",
  reponds: "Non. Seules la stérilisation et la vasectomie sont définitives. Avec les autres méthodes, on peut avoir un enfant après l'arrêt (Guide OMS).",
};

const SCRIPTS: Record<Who, Script> = {
  partenaire: {
    openers: {
      proteger: [
        "Je tiens à nous. Je voudrais qu'on se protège tous les deux, des grossesses et des infections.",
        "J'aimerais qu'on utilise un préservatif. Ça nous protège aussi du VIH et des IST.",
      ],
      methode: [
        "J'ai envie de choisir une méthode pour décider quand on aura un enfant. Je voudrais t'en parler.",
        "Je vais voir un professionnel pour choisir une méthode. Tu veux qu'on en parle avant ?",
      ],
      enceinte: [
        "J'ai du retard dans mes règles. Je vais faire un test, et j'aimerais que tu sois avec moi.",
        "J'ai besoin de parler d'une chose importante : j'ai peut-être une grossesse. On peut y réfléchir calmement ?",
      ],
      attendre: [
        "Je veux qu'on attende d'être prêts avant d'avoir un enfant. On peut en parler ?",
        "Je voudrais finir mes études / mon projet avant. Quelle méthode pourrait nous convenir ?",
      ],
    },
    objections: [
      STERILE,
      {
        dit: "« On ne risque rien : c'est ta première fois, ou c'est pendant tes règles, ou je me retire. »",
        reponds: "Une grossesse peut arriver dès la première fois et pendant les règles. Le retrait est moins efficace que les autres méthodes (Guide OMS).",
      },
      {
        dit: "« Si tu te protèges, tu ne me fais pas confiance. »",
        reponds: "Se protéger, c'est prendre soin de nous deux. Beaucoup d'infections n'ont aucun signe.",
      },
      {
        dit: "« Je veux un enfant maintenant. »",
        reponds: "Chacun a le droit de décider si et quand avoir un enfant. Propose d'en reparler quand vous serez prêts. Si on te met la pression ou te force, lis la page « Violence et aide ».",
      },
    ],
    tips: [
      "Choisis un moment calme, à deux, sans public.",
      "Parle de ce que tu ressens avec « je », pas de reproches.",
      "Tu peux montrer la page de la méthode ou de l'outil sur ton téléphone.",
      "Si tu as peur de sa réaction, tu n'as pas à en parler seul(e) : vois la page « Violence et aide ».",
    ],
  },
  parent: {
    openers: {
      proteger: [
        "J'ai besoin de ton aide pour une question de santé. Je voudrais en parler sans me sentir jugé(e).",
        "Je veux comprendre comment me protéger des infections et des grossesses. Tu peux m'écouter ?",
      ],
      methode: [
        "Je voudrais aller au centre de santé pour avoir des informations sur la planification familiale. Tu peux m'y accompagner ?",
        "Je me renseigne pour ma santé. Je voudrais en parler avec un professionnel, avec toi si tu veux.",
      ],
      enceinte: [
        "J'ai quelque chose de difficile à dire. J'ai peut-être une grossesse. J'ai peur, mais j'ai besoin de ton aide.",
        "J'ai du retard dans mes règles et je suis inquiète. Est-ce que tu peux venir avec moi faire un test ?",
      ],
      attendre: [
        "Je veux finir mes études avant d'avoir un enfant. Je voudrais savoir comment m'y prendre.",
        "Je voudrais choisir le bon moment pour avoir des enfants. Je peux t'en parler ?",
      ],
    },
    objections: [
      {
        dit: "« Tu es trop jeune pour ça. »",
        reponds: "Je veux comprendre mon corps et ma santé. Dans l'enquête Afrobaromètre 2024/25, 78 % des Béninois approuvent l'éducation sexuelle à l'école.",
      },
      STERILE,
      {
        dit: "« Que vont dire les gens ? »",
        reponds: "On peut demander la confidentialité au centre. Tu peux venir avec moi si tu préfères.",
      },
      {
        dit: "« C'est pour les femmes mariées. »",
        reponds: "Les jeunes, mariés ou non, peuvent demander des informations. Les règles exactes dépendent du pays et du centre : on peut se renseigner sur place.",
      },
    ],
    tips: [
      "Choisis un moment calme, et une personne qui t'écoute le plus souvent.",
      "Dis d'abord pourquoi tu veux en parler : ta santé, tes études, ton avenir.",
      "Si tu ne peux pas en parler à un parent, pense à une tante, un grand frère, une enseignante ou un agent de santé.",
      "Si tu as peur d'être frappé(e) ou mis(e) dehors, parle d'abord à une personne de confiance : vois la page « Violence et aide ».",
    ],
  },
  proche: {
    openers: {
      proteger: [
        "Je me pose des questions sur comment me protéger. Je peux t'en parler, sans que ça sorte d'ici ?",
        "Tu peux m'aider à trouver où avoir des préservatifs ?",
      ],
      methode: [
        "Je voudrais aller au centre de santé pour choisir une méthode. Tu peux venir avec moi ?",
        "J'ai lu des informations sur les méthodes, mais j'ai peur d'y aller seul(e). Tu peux m'accompagner ?",
      ],
      enceinte: [
        "J'ai du retard dans mes règles. J'ai peur et je ne sais pas à qui en parler. Tu peux rester avec moi ?",
        "J'ai besoin de quelqu'un pour m'accompagner faire un test. Tu veux bien ?",
      ],
      attendre: [
        "Je veux attendre avant d'avoir un enfant, mais je ne sais pas comment faire. On peut chercher ensemble ?",
        "Tu connais un centre où on est bien accueilli(e) ? Je cherche une méthode.",
      ],
    },
    objections: [
      {
        dit: "« Je ne connais pas bien ça. »",
        reponds: "Ce n'est pas grave. On peut lire la fiche ensemble, ou aller au centre ensemble. Tu n'as pas besoin de tout savoir.",
      },
      {
        dit: "« Ne le dis à personne ! » (ou toi, à ton tour)",
        reponds: "Demande ce qui doit rester secret, et dis-le clairement. Un professionnel de santé doit garder le secret : tu peux le demander.",
      },
    ],
    tips: [
      "Dis clairement ce que tu attends : écouter, accompagner, ou garder le secret.",
      "Une personne qui t'accompagne peut venir avec toi jusqu'à la consultation, si tu le souhaites.",
      "Si tu veux aider quelqu'un d'autre : écoute, ne juge pas, et propose d'aller au centre ensemble.",
    ],
  },
  soignant: {
    openers: {
      proteger: [
        "Bonjour. Je voudrais des informations pour me protéger des grossesses et des IST. Pouvez-vous m'expliquer les possibilités ?",
        "Je voudrais savoir où trouver des préservatifs et comment bien les utiliser.",
      ],
      methode: [
        "Bonjour. Je voudrais choisir une méthode de planification familiale. Pouvez-vous m'expliquer les différentes méthodes ?",
        "J'ai fait l'outil « Choisir ma méthode ». Voici mon résumé. Qu'en pensez-vous ?",
      ],
      enceinte: [
        "Bonjour. J'ai du retard dans mes règles. Pouvez-vous m'aider à faire un test et m'expliquer la suite ?",
        "Je pense être enceinte. Pouvez-vous m'indiquer les options et où aller ?",
      ],
      attendre: [
        "Je veux attendre avant d'avoir un enfant. Quelles méthodes me conseillez-vous, et comment fonctionnent-elles ?",
        "Je voudrais une méthode que je peux arrêter quand je veux avoir un enfant. Que proposez-vous ?",
      ],
    },
    objections: [
      {
        dit: "« Tu es trop jeune. » ou « Reviens avec ton mari. »",
        reponds: "Je demande des informations. Si vous ne pouvez pas m'aider ici, pouvez-vous m'orienter vers un centre qui le peut ? Je peux aussi essayer un autre centre.",
      },
      {
        dit: "« On ne propose qu'une seule méthode. »",
        reponds: "Pouvez-vous m'expliquer les autres méthodes, même si elles ne sont pas disponibles ici ? Je voudrais savoir ce qui existe avant de choisir.",
      },
      {
        dit: "« Ça rend stérile. »",
        reponds: "Pouvez-vous m'expliquer ce qui est définitif et ce qui ne l'est pas ? D'après le Guide OMS, seules la stérilisation et la vasectomie le sont.",
      },
    ],
    tips: [
      "Tu peux demander la confidentialité et poser tes questions sans honte.",
      "Tu peux venir avec ta liste de questions : cherche l'outil « Je prépare ma visite ».",
      "Si l'accueil te juge ou te refuse sans explication, essaie un autre centre.",
    ],
  },
};

export type TalkPlan = { openers: string[]; objections: Objection[]; tips: string[] };

export function talkPlan(who: Who, goal: Goal): TalkPlan {
  const script = SCRIPTS[who];
  return { openers: script.openers[goal], objections: script.objections, tips: script.tips };
}

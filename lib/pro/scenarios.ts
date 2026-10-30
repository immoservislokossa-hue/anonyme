// Entraînement : de faux clients, des situations réelles et difficiles. Pour chaque réponse, un retour fondé sur le guide OMS
// (écouter d'abord, ne pas juger, confidentialité, plusieurs méthodes, effets, orientation).
// Le préjugé des prestataires et le conseil incomplet sont deux obstacles cités par les documents du Partenariat de Ouagadougou et PMA2020.
// Contenu de travail : à faire relire par des formateurs et des cliniciens avant tout usage en formation.

export type Tone = "juge" | "neutre" | "accueillant";

export type Option = { texte: string; ton: Tone; retour: string };
export type Step = { client: string; options: Option[] };
export type Scenario = {
  id: string;
  titre: string;
  qui: string;
  contexte: string;
  etapes: Step[];
  retenir: string[];
};

export const POINTS: Record<Tone, number> = { juge: 0, neutre: 1, accueillant: 2 };
export const TONE_LABEL: Record<Tone, string> = { juge: "Ferme la conversation", neutre: "Correct, mais froid ou incomplet", accueillant: "Accueillant et complet" };

export const SCENARIOS: Scenario[] = [
  {
    id: "awa-17-ans",
    titre: "Une jeune de 17 ans, non mariée",
    qui: "Awa, 17 ans, non mariée",
    contexte: "Elle arrive seule, hésite à la porte, puis demande des préservatifs et la pilule.",
    etapes: [
      {
        client: "Bonjour… Je voudrais des préservatifs, et aussi la pilule. Je ne suis pas mariée.",
        options: [
          { texte: "Merci d'être venue, tu fais bien de te renseigner. Ce que tu me dis reste entre nous. Qu'est-ce qui t'inquiète le plus ?", ton: "accueillant", retour: "Tu remercies, tu rassures sur la confidentialité et tu laisses la jeune parler. C'est le début d'un vrai conseil." },
          { texte: "À ton âge ? Il faut d'abord en parler à tes parents.", ton: "juge", retour: "Un jugement ferme la conversation : la jeune risque de repartir sans aucune protection. Le guide OMS dit qu'on peut aider les jeunes, mariés ou non." },
          { texte: "Très bien. Remplis cette fiche, je regarde ce que nous avons.", ton: "neutre", retour: "Tu ne la rejettes pas, mais tu n'as ni rassuré, ni parlé de confidentialité, ni écouté ses craintes." },
        ],
      },
      {
        client: "J'ai peur que ma mère le sache.",
        options: [
          { texte: "Alors il vaut mieux ne rien prendre.", ton: "juge", retour: "Renoncer à toute protection est le pire résultat pour elle. Une peur se travaille, elle ne se solde pas." },
          { texte: "Je comprends. Ici, c'est confidentiel. Il existe des méthodes discrètes : on regarde ensemble ce qui peut te convenir, et ce que tu pourras expliquer ou non.", ton: "accueillant", retour: "Tu rassures et tu proposes des options. Le guide OMS note par exemple que l'injection peut être utilisée sans que les autres le sachent." },
          { texte: "Je ne peux rien promettre, ça dépend du centre.", ton: "neutre", retour: "Honnête, mais sans solution. Dis ce que tu peux garantir et ce que tu proposes à la place." },
        ],
      },
      {
        client: "Et si j'oublie la pilule, ou si le préservatif craque ?",
        options: [
          { texte: "Il ne fallait pas oublier.", ton: "juge", retour: "C'est une leçon de morale, pas une réponse. L'oubli est fréquent : prépare la jeune." },
          { texte: "Reviens me voir si ça arrive.", ton: "neutre", retour: "Trop vague : elle ne saura pas qu'il y a un délai." },
          { texte: "Bonne question. La pilule d'urgence marche mieux plus tôt, jusqu'à 5 jours après. Viens vite, et on parlera aussi des infections. Et pour la pilule, on voit ensemble quoi faire en cas d'oubli.", ton: "accueillant", retour: "Tu donnes l'information qui compte (délai, urgence, IST) sans faire peur." },
        ],
      },
    ],
    retenir: [
      "Remercier et rassurer sur la confidentialité avant tout.",
      "Ne pas conditionner l'aide à l'âge ni au statut marital, sauf si la loi du pays l'exige : dans ce cas, orienter.",
      "Parler des méthodes discrètes et de la pilule d'urgence.",
      "Rappeler que seul le préservatif protège aussi des IST.",
    ],
  },
  {
    id: "koffi-22-ans",
    titre: "Un jeune homme qui veut décider pour sa partenaire",
    qui: "Koffi, 22 ans",
    contexte: "Il vient seul. Il veut que sa partenaire prenne une méthode, mais elle n'est pas d'accord.",
    etapes: [
      {
        client: "Ma copine ne veut pas de méthode, mais moi je veux qu'elle prenne la pilule. Donnez-m'en pour elle.",
        options: [
          { texte: "Si elle ne veut pas, c'est qu'elle ne t'aime pas.", ton: "juge", retour: "Tu mets de la pression et tu abîmes leur relation. Ce n'est pas ton rôle." },
          { texte: "Tu t'inquiètes pour vous deux, c'est bien. Le choix de sa méthode lui revient, avec nous. Toi, tu peux utiliser le préservatif et en parler avec elle sans la presser.", ton: "accueillant", retour: "Tu valorises son souci, tu respectes l'autonomie de la femme et tu lui donnes un rôle utile." },
          { texte: "La pilule se prend après une consultation : elle doit venir elle-même.", ton: "neutre", retour: "C'est exact, mais tu perds l'occasion de parler du rôle du garçon dans la protection." },
        ],
      },
      {
        client: "Le préservatif, ça gâche tout. Ce n'est pas pareil.",
        options: [
          { texte: "C'est comme ça, il n'y a rien d'autre.", ton: "neutre", retour: "Faux : il existe d'autres options pour elle. Reste factuel et ouvert." },
          { texte: "Tu n'es pas sérieux, alors.", ton: "juge", retour: "Le sarcasme coupe la discussion." },
          { texte: "Je comprends que ça te gêne. Le préservatif est le seul moyen de te protéger aussi des infections, VIH compris. Si vous voulez autre chose, elle peut choisir une méthode avec nous, et vous pouvez en parler ensemble.", ton: "accueillant", retour: "Tu reconnais sa gêne, tu dis ce que le préservatif apporte et tu orientes vers un choix à deux." },
        ],
      },
      {
        client: "Et si elle tombe enceinte quand même ?",
        options: [
          { texte: "Venez ensemble. Si c'est dans les 5 jours après un rapport sans protection, la pilule d'urgence peut aider. Si elle a du retard de règles, on fait un test et on voit la suite avec elle.", ton: "accueillant", retour: "Tu donnes les délais et tu invites à venir ensemble, sans décider à la place de la jeune femme." },
          { texte: "Ce serait de ta faute.", ton: "juge", retour: "La culpabilité n'aide personne." },
          { texte: "On verra à ce moment-là.", ton: "neutre", retour: "Tu laisses passer l'occasion d'expliquer les délais." },
        ],
      },
    ],
    retenir: [
      "Valoriser l'implication du partenaire sans lui laisser décider pour la femme.",
      "Présenter le préservatif comme protection contre les grossesses et les IST.",
      "Donner les délais de la pilule d'urgence et inviter à venir à deux.",
    ],
  },
  {
    id: "mere-et-fille",
    titre: "Une mère qui parle à la place de sa fille",
    qui: "Une mère et sa fille de 16 ans",
    contexte: "La mère répond à chaque question. La fille se tait et regarde ses pieds.",
    etapes: [
      {
        client: "Ma fille a des questions. Je parle pour elle : elle ne sait rien.",
        options: [
          { texte: "Madame, sortez. Elle ne parlera pas devant vous.", ton: "juge", retour: "Tu perds la confiance de la mère, et peut-être de la fille. Il y a une façon plus respectueuse de demander un moment seul(e)." },
          { texte: "Très bien, parlons tous les trois.", ton: "neutre", retour: "La jeune ne dira sans doute rien d'important devant sa mère. Tu manques l'occasion d'un échange confidentiel." },
          { texte: "Merci de l'avoir accompagnée, c'est important. Je voudrais aussi avoir quelques minutes seul(e) avec elle, comme avec chaque jeune. Vous pourrez revenir ensuite.", ton: "accueillant", retour: "Tu respectes la mère, tu normalises le temps seul(e) et tu protèges la confidentialité de la jeune." },
        ],
      },
      {
        client: "(à voix basse) Je veux juste savoir comment ne pas tomber enceinte.",
        options: [
          { texte: "Tu es trop jeune pour ça.", ton: "juge", retour: "Elle vient de prendre un risque en demandant. Cette phrase lui apprend à ne plus demander." },
          { texte: "Merci de me le dire. Je t'explique simplement les possibilités, y compris attendre. Tu décides à ton rythme. Y a-t-il une situation où tu te sens forcée ou en danger ?", ton: "accueillant", retour: "Tu écoutes, tu donnes des options et tu vérifies sans accuser s'il y a une contrainte. C'est essentiel à cet âge." },
          { texte: "Ne t'inquiète pas, ça viendra plus tard.", ton: "neutre", retour: "Tu ne réponds pas à sa question." },
        ],
      },
      {
        client: "Mon copain est plus âgé. Il insiste.",
        options: [
          { texte: "Ce que tu ressens compte. Tu as le droit de dire non. Si tu te sens forcée, nous pouvons t'orienter vers de l'aide, selon les règles de ton pays.", ton: "accueillant", retour: "Tu valides son ressenti, tu rappelles son droit de dire non et tu ouvres la porte à l'aide et à la protection." },
          { texte: "C'est normal à ton âge, les garçons insistent.", ton: "juge", retour: "Banaliser la pression ou la contrainte peut laisser une jeune dans une situation dangereuse." },
          { texte: "Parle-lui, vous allez trouver un accord.", ton: "neutre", retour: "Tu renvoies le problème à la jeune sans reconnaître le risque de contrainte." },
        ],
      },
    ],
    retenir: [
      "Demander poliment un temps seul(e) avec la jeune, toujours, sans humilier le parent.",
      "Répondre à sa question, y compris sur « attendre ».",
      "Chercher les signes de pression ou de contrainte et orienter selon les règles nationales.",
    ],
  },
  {
    id: "mariam-28-ans",
    titre: "Une femme qui craint la réaction de son mari",
    qui: "Mariam, 28 ans, mariée, 3 enfants",
    contexte: "Elle veut attendre avant le prochain enfant. Son mari n'en veut pas.",
    etapes: [
      {
        client: "Mon mari ne veut pas de méthode. Mais moi, je veux attendre avant le prochain enfant.",
        options: [
          { texte: "Dans un foyer, c'est le mari qui décide.", ton: "juge", retour: "Tu contredis le principe de choix éclairé du guide OMS : chacun a le droit de décider du nombre d'enfants et du moment." },
          { texte: "Parlez-en d'abord avec lui, et revenez ensuite.", ton: "neutre", retour: "Tu la renvoies sans savoir si ce dialogue est sûr pour elle." },
          { texte: "Merci de me faire confiance. Votre santé et votre choix comptent. Qu'est-ce qui vous inquiète dans sa réaction ?", ton: "accueillant", retour: "Tu valides, tu écoutes avant de conseiller, et tu cherches le vrai risque." },
        ],
      },
      {
        client: "S'il le sait, il pourrait me frapper.",
        options: [
          { texte: "Alors ne faites rien dans son dos.", ton: "juge", retour: "Tu la laisses sans solution face au risque de grossesse, sans t'occuper non plus du risque de violence." },
          { texte: "Votre sécurité passe d'abord. Si vous craignez des violences, je peux vous parler d'aide et d'orientation. Pour la méthode, certaines sont plus discrètes, mais elles ont des effets à anticiper. On y réfléchit ensemble, sans vous mettre en danger.", ton: "accueillant", retour: "Tu mets la sécurité en premier, tu offres de l'aide et tu relies le choix de méthode au risque réel." },
          { texte: "Je ne peux pas vous aider à cacher quelque chose à votre mari.", ton: "neutre", retour: "Tu fermes la porte au moment où elle a le plus besoin d'une aide sûre." },
        ],
      },
      {
        client: "Et si mes règles changent, il le verra ?",
        options: [
          { texte: "Cela dépend de la méthode. Avec une injection ou un implant, les règles peuvent changer ou disparaître : c'est fréquent et sans gravité. Mieux vaut y penser avant de choisir. Un préservatif ne change rien, mais il est plus visible. On décide ensemble et on fixe un rendez-vous.", ton: "accueillant", retour: "Tu expliques les effets sur les règles (guide OMS), tu mets en balance la discrétion et les effets, et tu fixes un retour." },
          { texte: "Ne vous inquiétez pas pour ça.", ton: "neutre", retour: "Tu minimises un point qui peut la mettre en danger." },
          { texte: "Alors il faut lui dire la vérité.", ton: "juge", retour: "Tu décides pour elle sans connaître sa sécurité." },
        ],
      },
    ],
    retenir: [
      "Le choix éclairé appartient à la personne, pas au mari.",
      "Chercher le risque de violence et orienter, sans exposer la cliente.",
      "Expliquer les effets sur les règles avant de choisir une méthode discrète.",
    ],
  },
  {
    id: "fatou-19-ans",
    titre: "« Je ne risque rien, c'était ma première fois »",
    qui: "Fatou, 19 ans",
    contexte: "Elle est venue pour un autre motif, puis évoque en passant un rapport sans protection.",
    etapes: [
      {
        client: "Je ne risque rien : c'était ma première fois, et il s'est retiré.",
        options: [
          { texte: "Quelle imprudence !", ton: "juge", retour: "Le reproche ne l'aide pas à agir, et elle ne reviendra plus." },
          { texte: "Si tu le dis.", ton: "neutre", retour: "Tu laisses passer une idée fausse : une grossesse peut arriver dès la première fois." },
          { texte: "Merci de m'en parler. Une grossesse peut arriver dès la première fois, et le retrait est moins efficace que d'autres méthodes. Je suis là pour t'aider, pas pour te juger.", ton: "accueillant", retour: "Tu corriges sans juger, avec les faits du guide OMS." },
        ],
      },
      {
        client: "C'était il y a 3 jours.",
        options: [
          { texte: "Il est trop tard.", ton: "juge", retour: "Faux : la pilule d'urgence peut encore agir jusqu'à 5 jours." },
          { texte: "La pilule d'urgence marche mieux plus tôt, et peut encore agir jusqu'à 5 jours. Pour le VIH, un traitement d'urgence doit commencer dans les 72 heures : voyons cela tout de suite. On parlera aussi d'une méthode pour la suite.", ton: "accueillant", retour: "Tu donnes les bons délais et tu ne parles pas que de grossesse. Tu ouvres sur la suite." },
          { texte: "Reviens quand tu auras des règles en retard.", ton: "neutre", retour: "Tu perds la fenêtre d'action de la pilule d'urgence." },
        ],
      },
      {
        client: "Je n'ai pas beaucoup d'argent.",
        options: [
          { texte: "Alors on ne peut rien faire.", ton: "juge", retour: "Tu fermes la porte. Cherche d'abord les options." },
          { texte: "Je comprends. Regardons ensemble les prix et les options les moins chères, ou un service pour jeunes près de chez toi. L'important est que tu partes avec une solution.", ton: "accueillant", retour: "Tu traites l'obstacle financier comme un problème à résoudre, pas comme une fin de non-recevoir." },
          { texte: "C'est le prix, il faut payer.", ton: "neutre", retour: "Exact, mais tu n'as proposé aucune piste." },
        ],
      },
    ],
    retenir: [
      "Corriger les idées fausses sans reproche : première fois, retrait, règles.",
      "Connaître les délais : pilule d'urgence jusqu'à 5 jours, traitement d'urgence du VIH dans les 72 heures.",
      "Traiter l'argent comme un obstacle à résoudre.",
    ],
  },
  {
    id: "esther-24-ans",
    titre: "Une cliente qui a arrêté la pilule à cause de saignements",
    qui: "Esther, 24 ans",
    contexte: "Elle revient, un peu gênée, et dit que la pilule « ne marche pas pour elle ».",
    etapes: [
      {
        client: "J'ai arrêté ma pilule : j'ai des saignements entre les règles. Ça ne marche pas pour moi.",
        options: [
          { texte: "Vous ne l'avez sûrement pas prise correctement.", ton: "juge", retour: "Tu l'accuses avant de l'écouter. Les saignements irréguliers sont parfois fréquents au début, mais ce n'est pas sa faute." },
          { texte: "Prenez-en une autre marque.", ton: "neutre", retour: "Tu proposes une solution sans avoir compris : depuis quand, et y a-t-il un risque de grossesse ?" },
          { texte: "Merci d'être revenue. Des saignements irréguliers sont fréquents au début, mais je veux comprendre. Depuis quand ? Y a-t-il eu un rapport sans protection depuis l'arrêt ?", ton: "accueillant", retour: "Tu valides, tu normalises sans minimiser et tu poses les deux questions utiles." },
        ],
      },
      {
        client: "Depuis 2 mois. Et oui, il y a eu un rapport sans protection.",
        options: [
          { texte: "Je vous avais prévenue.", ton: "juge", retour: "Ton reproche détruit la confiance." },
          { texte: "Revenez dans un mois.", ton: "neutre", retour: "Une grossesse est possible : il faut s'en occuper maintenant." },
          { texte: "Merci de le dire. On regarde d'abord une grossesse possible, puis les autres méthodes. Si ces saignements durent, ils demandent un examen : je ne veux pas passer à côté.", ton: "accueillant", retour: "Tu écartes une grossesse d'abord et tu prends au sérieux les saignements qui persistent." },
        ],
      },
      {
        client: "Je ne veux plus d'hormones.",
        options: [
          { texte: "Alors faites comme les autres : ne rien prendre.", ton: "juge", retour: "Tu la laisses sans protection et tu lui apprends à ne plus revenir. Refuser les hormones est un choix à respecter." },
          { texte: "C'est votre choix. Sans hormones, il y a le préservatif, qui protège aussi des infections, et le stérilet, posé au centre. D'autres méthodes naturelles existent mais sont moins efficaces. Choisissez ce qui vous convient, et fixons une date de retour.", ton: "accueillant", retour: "Tu respectes son choix, tu présentes des options sans hormones avec leur niveau d'efficacité, et tu fixes un retour." },
          { texte: "Il n'y a rien d'autre.", ton: "neutre", retour: "Faux : plusieurs méthodes sans hormones existent." },
        ],
      },
    ],
    retenir: [
      "Écouter avant de proposer : depuis quand, quel risque de grossesse.",
      "Normaliser les effets fréquents sans minimiser ceux qui persistent.",
      "Respecter le choix de ne plus prendre d'hormones et présenter les autres options avec honnêteté.",
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export type Result = { points: number; max: number; pct: number; level: "a-retravailler" | "en-progres" | "solide" };

export function resultOf(tones: Tone[]): Result {
  const points = tones.reduce((sum, tone) => sum + POINTS[tone], 0);
  const max = tones.length * 2;
  const pct = max === 0 ? 0 : Math.round((points / max) * 100);
  return { points, max, pct, level: pct >= 80 ? "solide" : pct >= 50 ? "en-progres" : "a-retravailler" };
}

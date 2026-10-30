import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";

export const metadata: Metadata = {
  title: "À propos et preuves",
  description: "Pourquoi Alviosa existe, sur quelles données elle s'appuie, ce qu'elle ne fait pas et comment nous mesurons.",
};

// Chaque ligne relie une donnée publique à un choix concret dans l'application.
const EVIDENCE: { donnee: string; source: string; choix: string; href: string; lien: string }[] = [
  {
    donnee: "Les préjugés de certains prestataires et les restrictions d'âge ou de statut sont cités parmi les obstacles pour les jeunes. Au Burkina Faso (2017-18), seulement 64,9 % des utilisatrices avaient entendu parler d'autres méthodes et 52,1 % des effets.",
    source: "Appel du Prix 2026 ; PMA2020 Burkina Faso, vague 5 (2017-18)",
    choix: "Alviosa Prestataires : consultation guidée, entraînement avec de faux clients jeunes, liste de qualité du conseil mesurée sur ces deux points.",
    href: "/prestataires",
    lien: "Alviosa Prestataires",
  },
  {
    donnee: "Il faut suivre les financements et les résultats pour les femmes et les jeunes, et intégrer la planification familiale aux soins de base.",
    source: "Réunion ministérielle de New York, 24 septembre 2026",
    choix: "Alviosa Pilotage : un tableau de bord de chiffres anonymes (questions, qualité du conseil, services, ruptures, alertes) et un export pour les systèmes d'information sanitaire.",
    href: "/pilotage/demo",
    lien: "Voir la démonstration",
  },
  {
    donnee: "Moins de la moitié des citoyens des 7 pays du PO soutiennent l'accès à la contraception quel que soit le statut matrimonial (44 %) ou l'âge (40 %). Au Bénin : 58 % et 53 %.",
    source: "Afrobaromètre, dépêche n° 1138 (2026), enquêtes 2024/25",
    choix: "Aucune condition d'âge ou de statut dans l'application. Un outil pour préparer la conversation avec un partenaire, un parent ou un soignant.",
    href: "/outils/parler",
    lien: "Parler à quelqu'un",
  },
  {
    donnee: "Le soutien à l'accès est plus fort chez les 18-35 ans (48 % et 43 %) que chez les plus de 55 ans (34 %). Les hommes sont moins favorables à l'autonomie des femmes pour les décisions de procréation (35 %) que les femmes (49 %).",
    source: "Afrobaromètre, dépêche n° 1138 (2026)",
    choix: "Une page « Pour les garçons » et des scripts de conversation pour les parents et les partenaires, pas seulement pour les filles.",
    href: "/sujets/garcons",
    lien: "Pour les garçons",
  },
  {
    donnee: "84 % des femmes possèdent un téléphone portable (95 % des hommes), mais 39 % n'ont aucune instruction formelle (29 % des hommes). Le téléphone ne dit pas s'il s'agit d'un smartphone avec des données.",
    source: "Afrobaromètre, dépêche n° 1138 (2026)",
    choix: "Français très simple, dessins, lecture à voix haute, saisie vocale, et fonctionnement sans connexion après la première visite.",
    href: "/aide",
    lien: "Voir comment ça marche sans internet",
  },
  {
    donnee: "Parmi les femmes qui veulent attendre un enfant mais n'utilisent rien, 44,5 % pensent ne pas être à risque, 21,5 % ne sont pas mariées, 21,2 % citent l'opposition à l'utilisation, 20 % craignent la méthode ou ses effets, 10,4 % manquent d'accès ou de connaissance.",
    source: "PMA2020 Burkina Faso, vague 5 (2017-18), femmes 15-49 ans",
    choix: "Le risque réel est expliqué en premier (grossesse dès la première relation, pendant les règles). L'outil « Après un rapport à risque » et la page « Rumeurs et vérités ». Les effets sont expliqués avant de choisir.",
    href: "/outils/risque",
    lien: "Après un rapport à risque",
  },
  {
    donnee: "Seulement 64,9 % des utilisatrices de méthodes modernes disent avoir entendu parler d'autres méthodes, et 52,1 % avoir été informées des effets secondaires.",
    source: "PMA2020 Burkina Faso, vague 5 (2017-18)",
    choix: "« Je prépare ma visite » : la liste des questions à poser sur les autres méthodes, les effets, les oublis, la date de retour.",
    href: "/outils/visite",
    lien: "Je prépare ma visite",
  },
  {
    donnee: "Chez les utilisatrices non mariées et sexuellement actives, le préservatif masculin (37,7 %) et l'implant (28,9 %) sont les plus utilisés.",
    source: "PMA2020 Burkina Faso, vague 5 (2017-18)",
    choix: "Le préservatif est présenté comme la seule méthode qui protège aussi des IST, et peut s'ajouter à une autre. Les implants ont leur page complète.",
    href: "/methodes/implants",
    lien: "Les implants",
  },
  {
    donnee: "L'âge médian du premier rapport est de 17-18 ans, celui du premier usage d'une méthode de 22 à 25 ans : on commence souvent après le premier enfant. Le besoin non satisfait sert surtout à espacer (13,5 %) plutôt qu'à limiter (3,3 %).",
    source: "PMA2020 Burkina Faso, vague 5 (2017-18)",
    choix: "Un sujet « Attendre ou espacer une grossesse » : premier enfant, école, au moins 2 ans entre deux naissances, méthodes après l'accouchement.",
    href: "/sujets/attendre-espacer",
    lien: "Attendre ou espacer",
  },
];

const ALIGN: { cadre: string; ce_que_dit: string; alviosa: string }[] = [
  {
    cadre: "Appel du Prix 2026",
    ce_que_dit: "L'IA doit soutenir les prestataires, l'orientation des patients et l'usage des données pour planifier les services, avec supervision humaine et fonctionnement sans connexion.",
    alviosa: "Trois espaces : les jeunes (orientation), les prestataires (aide au conseil et entraînement), les décideurs (données anonymes). Les règles cliniques sont fixes, l'IA explique et entraîne, un humain décide.",
  },
  {
    cadre: "Stratégie jeunes du PO (2019)",
    ce_que_dit: "Faire participer un éventail diversifié de jeunes ; développer leurs capacités avec des technologies adéquates ; l'usage des méthodes reste faible chez les 15-24 ans.",
    alviosa: "Alviosa est conçue par un jeune fondateur, pour les jeunes de 15 à 35 ans (priorité aux 15-24 ans, où l'usage est le plus faible), avec une technologie légère. Le test avec des jeunes de 18 à 24 ans est notre prochaine étape.",
  },
  {
    cadre: "Stratégie post-2025 du PO : pilier 2 (contextes fragiles)",
    ce_que_dit: "Maintenir la planification familiale dans les contextes humanitaires, climatiques et sécuritaires.",
    alviosa: "Tout fonctionne sans connexion après la première visite, ce qui compte quand le réseau, les routes ou les centres sont perturbés.",
  },
  {
    cadre: "Stratégie post-2025 du PO : pilier 3 (jeunes)",
    ce_que_dit: "Engagement et leadership des jeunes.",
    alviosa: "Projet porté par un jeune. L'application évite le jugement et ne pose aucune condition d'âge ou de statut.",
  },
  {
    cadre: "Réunion ministérielle de New York (24 septembre 2026)",
    ce_que_dit: "Intégrer la planification familiale aux soins de santé primaires ; suivre les résultats pour les femmes et les jeunes ; efficience ; appropriation nationale.",
    alviosa: "Alviosa ne remplace pas les services : elle prépare les jeunes à y aller et les oriente vers les soins de santé primaires. Son coût par personne est faible et le contenu peut être adapté aux directives nationales.",
  },
];

const LIMITS = [
  "Alviosa n'est pas un service de santé : elle informe et oriente, elle ne diagnostique pas et ne prescrit pas.",
  "Le contenu est un brouillon en cours de validation par des professionnels de santé. Il n'a pas encore été validé par un ministère de la Santé.",
  "Elle ne règle pas les obstacles qui sont du côté des services : jugement de certains prestataires, ruptures de stock, coût, accord du conjoint.",
  "Les chiffres de ce site sont des opinions (Afrobaromètre) ou viennent d'un autre pays et d'une autre année (Burkina Faso, 2017-18). Ils éclairent nos choix, ils ne mesurent pas Alviosa.",
  "Pas encore de résultats d'usage ni de retours de jeunes ni de prestataires : un test est prévu.",
  "Le tableau de bord de démonstration utilise des données fabriquées. Sans base de données configurée, les données réelles sont temporaires.",
  "L'annuaire est vide tant que des services ne se sont pas inscrits et n'ont pas été validés : rien n'est inventé.",
  "L'IA qui reformule les questions a besoin d'internet. Sans connexion, Afi donne la fiche la plus proche.",
  "Seul le français est disponible. Les langues locales demandent des locuteurs natifs et une relecture.",
  "Les numéros d'urgence et la liste des centres sont à compléter pays par pays avant tout usage réel.",
];

const INDICATORS = [
  { nom: "Compréhension et intention", detail: "Part des jeunes qui terminent « Choisir ma méthode » et savent nommer une méthode adaptée et où l'obtenir." },
  { nom: "Passage à l'action", detail: "Pages de centres ouvertes, listes de questions copiées, plans personnels créés avec rappel." },
  { nom: "Qualité et sécurité", detail: "Taux de réponses d'Afi jugées exactes et sûres par des cliniciens, sur un jeu de questions relancé à chaque mise à jour." },
];

const SOURCES = [
  "Afrobaromètre, dépêche n° 1138 : « Les opinions sur la santé et les droits sexuels et reproductifs présentent un tableau contrasté dans sept pays du Partenariat de Ouagadougou », 26 février 2026.",
  "PMA2020 / Burkina Faso, vague 5 (novembre 2017 - janvier 2018), fiche « Indicateurs clés de planification familiale ».",
  "Partenariat de Ouagadougou, « Stratégie Jeunes PO » (2019).",
  "UCPO, « Réunion ministérielle du PO en marge de la 81e Assemblée générale des Nations Unies », New York, 24 septembre 2026 : synthèse des orientations.",
  "Speak Up Africa et UCPO, appel à candidatures du Prix des Jeunes Innovateurs Africains pour la Santé, 20 octobre 2026.",
  "OMS, Guide de la planification familiale à l'intention des agents de santé communautaires et de leurs clients (2012) : règles des outils et des fiches.",
];

export default function AboutPage() {
  return (
    <>
      <Crumbs current="À propos et preuves" />
      <header>
        <p className="eyebrow">Pour les partenaires et les curieux</p>
        <h1>Pourquoi Alviosa existe, et sur quoi elle s'appuie</h1>
        <p className="lede">
          Alviosa aide les jeunes de 15 à 35 ans d'Afrique de l'Ouest francophone à choisir, à se protéger, à attendre ou espacer une
          grossesse, et à aller au centre de santé en ayant compris. Voici les données qui guident nos choix, et ce que nous ne faisons pas.
        </p>
      </header>

      <section className="panel" aria-labelledby="plateforme">
        <h2 id="plateforme">Une plateforme, trois espaces</h2>
        <ul className="plain">
          <li>
            <Link href="/">Alviosa Jeunes</Link> : comprendre, choisir, préparer sa visite, trouver un service.
          </li>
          <li>
            <Link href="/prestataires">Alviosa Prestataires</Link> : conseiller sans juger, s'entraîner, signaler les ruptures.
          </li>
          <li>
            <Link href="/pilotage/demo">Alviosa Pilotage</Link> : voir les besoins et la qualité du conseil, avec des données anonymes.
          </li>
        </ul>
        <p>
          <Link href="/all">Voir comment les trois espaces se relient</Link>.
        </p>
      </section>

      <section aria-labelledby="preuves">
        <h2 id="preuves">Ce que disent les données, et ce que nous en avons fait</h2>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Données et choix de conception">
          <table>
            <thead>
              <tr>
                <th scope="col">Ce que montre la donnée</th>
                <th scope="col">Ce que nous avons fait</th>
              </tr>
            </thead>
            <tbody>
              {EVIDENCE.map((row) => (
                <tr key={row.donnee}>
                  <td>
                    {row.donnee}
                    <br />
                    <span className="muted">{row.source}</span>
                  </td>
                  <td>
                    {row.choix}
                    <br />
                    <Link href={row.href}>{row.lien}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="alignement">
        <h2 id="alignement">Comment Alviosa soutient les orientations du Partenariat de Ouagadougou</h2>
        <p className="muted">
          Alviosa n'est pas affiliée au Partenariat de Ouagadougou ni à l'OMS. Ces documents publics inspirent nos choix.
        </p>
        <ul className="stack">
          {ALIGN.map((row) => (
            <li key={row.cadre} className="panel">
              <strong>{row.cadre}</strong>
              <p className="muted">{row.ce_que_dit}</p>
              <p>{row.alviosa}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mesure">
        <h2 id="mesure">Comment nous mesurons</h2>
        <p>Trois indicateurs, fixés avec des partenaires cliniques pendant le pilote. Aucun message ni aucune personne n'est suivie : seuls des noms d'événements sont comptés.</p>
        <ol className="step-cards numbered">
          {INDICATORS.map((item) => (
            <li key={item.nom}>
              <strong>{item.nom}</strong>
              <p>{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel" aria-labelledby="limites">
        <h2 id="limites">Ce que nous ne faisons pas, ou pas encore</h2>
        <ul className="plain">
          {LIMITS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sources">
        <h2 id="sources">Sources</h2>
        <ul className="plain">
          {SOURCES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="muted">
          Contact et confidentialité : voir <Link href="/aide">Aide</Link>.
        </p>
      </section>
    </>
  );
}

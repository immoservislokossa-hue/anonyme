import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";

export const metadata: Metadata = { title: "Accessibilité", description: "Ce qu'Alviosa fait pour être utilisable par toutes et tous, et ce qui reste à faire." };

const FEATURES = [
  "Tout marche au clavier. Un lien « Aller au contenu » est proposé au début de chaque page.",
  "Les lecteurs d'écran trouvent des titres, des régions et des libellés pour chaque champ et chaque bouton.",
  "Les couleurs de texte respectent un contraste suffisant ; les éléments qu'on touche font au moins 44 pixels.",
  "Un français très simple, des phrases courtes, des dessins, et des cartes à faire défiler plutôt que de longs textes.",
  "Lecture à voix haute de l'essentiel et saisie à la voix (selon le navigateur).",
  "Les animations s'arrêtent si l'appareil demande moins de mouvement.",
  "Les pages, les outils et les jeux de rôle marchent sans connexion après la première visite.",
  "Un bouton « Quitter vite » (touche Échap deux fois) pour fermer le site en un geste.",
];

const LIMITS = [
  "Aucun audit n'a encore été fait par des personnes en situation de handicap : c'est une étape prévue avant le pilote.",
  "Seul le français est disponible. Les langues locales demandent des locuteurs natifs et une relecture.",
  "Il n'y a pas de mode sombre.",
  "La lecture à voix haute utilise la voix du téléphone : sa qualité dépend de l'appareil et de la langue installée.",
  "Les illustrations ont une description courte, mais certaines scènes de la série ne sont pas décrites en détail.",
];

export default function AccessibilityPage() {
  return (
    <>
      <Crumbs current="Accessibilité" />
      <header>
        <h1>Accessibilité</h1>
        <p className="lede">Alviosa vise le niveau AA des règles d'accessibilité WCAG 2.1. Voici ce qui est fait, et ce qui ne l'est pas encore.</p>
      </header>

      <section aria-labelledby="fait">
        <h2 id="fait">Ce qui est fait</h2>
        <ul className="plain">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mesure">
        <h2 id="mesure">Comment nous vérifions</h2>
        <p>
          Des contrôles automatiques (axe-core et Lighthouse) sont lancés sur les pages principales à chaque grande évolution. Ils ne remplacent pas des essais avec des personnes
          concernées : ils trouvent les erreurs de code, pas les difficultés d'usage.
        </p>
      </section>

      <section className="panel" aria-labelledby="limites">
        <h2 id="limites">Ce qui reste à faire</h2>
        <ul className="plain">
          {LIMITS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="signaler">
        <h2 id="signaler">Un problème ?</h2>
        <p>
          Dis-nous ce qui ne marche pas pour toi : page, appareil, ce que tu essayais de faire. Voir <Link href="/aide">la page Aide</Link> pour nous joindre.
        </p>
      </section>
    </>
  );
}

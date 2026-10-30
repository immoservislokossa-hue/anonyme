import type { Metadata } from "next";
import RowList from "@/components/RowList";

export const metadata: Metadata = {
  title: "Alviosa Prestataires",
  description: "Conseiller sans juger : consultation guidée, jeux de rôle, aide-mémoire OMS et annuaire des services, même sans connexion.",
};

const ROWS = [
  { href: "/prestataires/consultation", title: "Consultation guidée", text: "Accueillir, écarter une grossesse, proposer les méthodes possibles, vérifier la qualité du conseil." },
  { href: "/prestataires/entrainement", title: "Entraînement avec de faux clients", text: "Six situations difficiles : jeune non mariée, mère présente, mari menaçant… avec un retour à chaque réponse." },
  { href: "/prestataires/aide-memoire", title: "Aide-mémoire OMS", text: "Pour chaque méthode : qui peut, quoi dire, quoi faire en cas d'oubli ou de souci. Listes de contrôle." },
  { href: "/prestataires/mon-service", title: "Mon service", text: "Inscrire ton service, signaler les ruptures, évaluer l'accueil des jeunes." },
  { href: "/prestataires/bilan", title: "Mon bilan", text: "Ta qualité de conseil sur ton téléphone. Envoie-la en anonyme si tu veux." },
  { href: "/prestataires/assistant", title: "Assistant OMS", text: "Pose une question sur le guide : réponse courte, sources, quand orienter." },
];

export default function PrestatairesPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Agents de santé · sages-femmes · pharmaciens</p>
        <h1>Conseiller sans juger</h1>
        <p className="lede">
          Les jeunes demandent souvent peu, et se ferment au premier jugement. Alviosa t'aide à les accueillir et à bien les conseiller, même sans connexion.
        </p>
      </header>

      <RowList rows={ROWS} label="Les outils du prestataire" />

      <section className="panel" aria-labelledby="pourquoi">
        <h2 id="pourquoi">Pourquoi cet espace</h2>
        <ul className="plain">
          <li>Les documents du Partenariat de Ouagadougou citent les préjugés de certains prestataires et les restrictions d'âge ou de statut parmi les obstacles pour les jeunes.</li>
          <li>
            Au Burkina Faso (PMA2020, 2017-18), seulement 64,9 % des utilisatrices de méthodes modernes disaient avoir entendu parler d'autres méthodes, et 52,1 % avoir été informées des
            effets secondaires. Ce sont les deux mesures que ton bilan suit.
          </li>
          <li>Les règles viennent du guide OMS (2012). Remplace-les par le protocole national dès qu'il est renseigné pour ton pays.</li>
        </ul>
      </section>
    </>
  );
}

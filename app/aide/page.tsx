import type { Metadata } from "next";
import Link from "next/link";
import { TEAM_NAMES } from "@/lib/brand";

export const metadata: Metadata = { title: "Aide" };

export default function HelpPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Aide</p>
        <h1>Besoin de parler à quelqu'un ?</h1>
      </header>

      <section className="panel">
        <h2>Ce que {TEAM_NAMES} ne peuvent pas faire</h2>
        <ul className="plain">
          <li>Dire si vous êtes enceinte ou malade.</li>
          <li>Vous conseiller un médicament ou une dose.</li>
          <li>Remplacer une consultation.</li>
          <li>Répondre à une urgence. Dans ce cas, allez au centre de santé.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Parler à une personne</h2>
        <p>
          Le plus simple est de vous rendre dans un centre partenaire. Vous pouvez venir accompagnée et demander la
          confidentialité.
        </p>
        <div className="row" style={{ marginTop: 12 }}>
          <Link className="btn indigo" href="/orientation">
            Trouver un centre
          </Link>
          <Link className="btn ghost" href="/urgence">
            C'est urgent
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2>Une erreur dans une réponse ?</h2>
        <p>
          Si une réponse vous semble fausse ou choquante, parlez-en à un professionnel de santé et signalez-la à
          l'équipe du projet. Les erreurs importantes sont relues et corrigées.
        </p>
      </section>
    </>
  );
}

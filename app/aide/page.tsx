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
          <li>Dire si tu es enceinte ou malade.</li>
          <li>Te conseiller un médicament ou une dose.</li>
          <li>Remplacer une consultation.</li>
          <li>Répondre à une urgence. Dans ce cas, va au centre de santé.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Parler à une personne</h2>
        <p>
          Le plus simple est d'aller dans un centre partenaire. Tu peux venir accompagné(e) et demander la
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
          Si une réponse te semble fausse ou choquante, parles-en à un professionnel de santé et signale-la à
          l'équipe du projet. Les erreurs importantes sont relues et corrigées.
        </p>
      </section>
    </>
  );
}

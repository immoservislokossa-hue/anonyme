import type { Metadata } from "next";
import Link from "next/link";
import AboutAI from "@/components/AboutAI";
import PrivacyInfo from "@/components/PrivacyInfo";
import { TEAM_NAMES } from "@/lib/brand";

export const metadata: Metadata = { title: "Aide et confidentialité" };

export default function HelpPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Aide</p>
        <h1>Aide, confidentialité et IA</h1>
        <nav className="jump" aria-label="Sur cette page">
          <a href="#aide">Parler à quelqu'un</a>
          <a href="#confidentialite">Confidentialité</a>
          <a href="#ia">Comment fonctionne l'IA</a>
        </nav>
      </header>

      <section id="aide" className="help-block">
        <h2>Besoin de parler à quelqu'un ?</h2>
        <div className="panel">
          <h3>Ce que {TEAM_NAMES} ne peuvent pas faire</h3>
          <ul className="plain">
            <li>Dire si tu es enceinte ou malade.</li>
            <li>Te conseiller un médicament ou une dose.</li>
            <li>Remplacer une consultation.</li>
            <li>Répondre à une urgence. Dans ce cas, va au centre de santé.</li>
          </ul>
        </div>

        <div className="panel">
          <h3>Parler à une personne</h3>
          <p>
            Le plus simple est d'aller dans un centre partenaire. Tu peux venir accompagné(e) et demander la
            confidentialité.
          </p>
          <div className="row" style={{ marginTop: 12 }}>
            <Link className="btn primary" href="/orientation">
              Trouver un centre
            </Link>
            <Link className="btn ghost" href="/urgence">
              C'est urgent
            </Link>
          </div>
        </div>

        <div className="panel">
          <h3>Une erreur dans une réponse ?</h3>
          <p>
            Si une réponse te semble fausse ou choquante, parles-en à un professionnel de santé et signale-la à
            l'équipe du projet. Les erreurs importantes sont relues et corrigées.
          </p>
        </div>
      </section>

      <section id="confidentialite" className="help-block">
        <h2>Ce que nous faisons de tes informations</h2>
        <PrivacyInfo />
      </section>

      <section id="ia" className="help-block">
        <h2>Comment fonctionne l'IA</h2>
        <AboutAI />
      </section>
    </>
  );
}

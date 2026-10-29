import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopicArt } from "@/components/art/Art";
import AskAfi from "@/components/AskAfi";
import Crumbs from "@/components/Crumbs";
import RelatedLinks from "@/components/RelatedLinks";
import Silhouette from "@/components/Silhouette";
import Icon from "@/components/Icon";
import { SUJETS, getFiches, getSujet, type Voice } from "@/lib/catalog";
import { personaFor } from "@/lib/brand";
import { stories } from "@/lib/stories";
import type { Voie } from "@/lib/domain";

const VOIE: Record<Voice, Voie> = { afi: "sexuelle", fallone: "mentale", chimene: "bien-etre" };

export function generateStaticParams() {
  return SUJETS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const sujet = getSujet(id);
  return { title: sujet ? sujet.titre : "Sujet", description: sujet?.bref };
}

export default async function SujetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sujet = getSujet(id);
  if (!sujet) notFound();

  const voie = VOIE[sujet.voix];
  const persona = personaFor(voie);
  const episode = sujet.episode ? stories.find((s) => s.id === sujet.episode) : undefined;
  const fiches = getFiches(sujet.fiches);

  return (
    <article className="topic-page">
      <Crumbs trail={[{ href: "/apprendre", label: "Apprendre" }, { href: "/sujets", label: "Sujets" }]} current={sujet.titre} />

      <header className="page-hero">
        <div className="page-hero-art">
          <TopicArt id={sujet.art} />
        </div>
        <div>
          <p className="eyebrow">Sujet</p>
          <h1>{sujet.titre}</h1>
        </div>
      </header>

      <section className="says" aria-label={`${persona.name} explique`}>
        <Silhouette voie={voie} size={72} bust />
        <div className="says-bubble">
          <strong>
            {persona.name} · en bref
          </strong>
          <p>{sujet.bref}</p>
        </div>
      </section>

      {sujet.alerte && (
        <p className="notice alert">
          <Icon name="alert" size={18} />
          <span>
            {sujet.alerte} <Link href="/urgence">Que faire maintenant</Link>
          </span>
        </p>
      )}

      <section aria-labelledby="retenir">
        <h2 id="retenir">À retenir</h2>
        <ul className="point-grid">
          {sujet.points.map((point, index) => (
            <li key={point.titre} className="point">
              <span className="point-num" aria-hidden="true">
                {index + 1}
              </span>
              <strong>{point.titre}</strong>
              <p>{point.texte}</p>
            </li>
          ))}
        </ul>
      </section>

      {sujet.vrai_faux.length > 0 && (
        <section aria-labelledby="vf">
          <h2 id="vf">Vrai ou faux ?</h2>
          <ul className="tf">
            {sujet.vrai_faux.map((item) => (
              <li key={item.faux}>
                <p className="tf-false">
                  <span className="tf-tag">Faux</span>
                  {item.faux}
                </p>
                <p className="tf-true">
                  <span className="tf-tag">Vrai</span>
                  {item.vrai}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="faire">
        <h2 id="faire">Que faire</h2>
        <ol className="step-cards">
          {sujet.etapes.map((step) => (
            <li key={step.titre}>
              <strong>{step.titre}</strong>
              <p>{step.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel where" aria-labelledby="ou">
        <h2 id="ou">Où aller</h2>
        <p>{sujet.ou_aller}</p>
        <div className="row">
          <Link className="btn primary" href="/orientation">
            <Icon name="pin" size={18} />
            Trouver un centre
          </Link>
          <AskAfi message={sujet.question} className="btn ghost" />
        </div>
      </section>

      <section aria-labelledby="suite">
        <h2 id="suite">Pour continuer</h2>
        <RelatedLinks outils={sujet.outils} methodes={sujet.methodes} episode={episode ? { id: episode.id, titre: `Épisode ${episode.episode} · ${episode.titre}` } : null} />
      </section>

      {fiches.length > 0 && (
        <details className="more">
          <summary>Lire les détails</summary>
          {fiches.map((fiche) => (
            <div key={fiche.id} className="fiche">
              <h3>{fiche.title}</h3>
              <p>{fiche.content}</p>
            </div>
          ))}
        </details>
      )}

      <p className="muted fiche-note">Contenu établi d'après le guide de la planification familiale de l'OMS (2012). Brouillon en cours de validation par des professionnels de santé.</p>
    </article>
  );
}

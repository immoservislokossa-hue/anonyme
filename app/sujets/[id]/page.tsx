import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopicArt } from "@/components/art/Art";
import AskAfi from "@/components/AskAfi";
import Deck, { type DeckCard } from "@/components/Deck";
import ListenButton from "@/components/ListenButton";
import WhatsAppShare from "@/components/WhatsAppShare";
import Crumbs from "@/components/Crumbs";
import PageFeedback from "@/components/PageFeedback";
import RelatedLinks from "@/components/RelatedLinks";
import Silhouette from "@/components/Silhouette";
import Icon from "@/components/Icon";
import { SUJETS, getFiches, getSujet } from "@/lib/catalog";
import { personaFor } from "@/lib/brand";
import { stories } from "@/lib/stories";

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

  const persona = personaFor(sujet.voix);
  const episode = sujet.episode ? stories.find((s) => s.id === sujet.episode) : undefined;
  const fiches = getFiches(sujet.fiches);
  const cards: DeckCard[] = [
    ...sujet.points.map((point, i) => ({ id: `p${i}`, kind: "point" as const, title: point.titre, text: point.texte })),
    ...sujet.vrai_faux.map((item, i) => ({ id: `v${i}`, kind: "vf" as const, text: item.vrai, wrong: item.faux })),
  ];
  const spoken = [sujet.bref, ...sujet.points.map((p) => `${p.titre}. ${p.texte}`)].join(" ");

  return (
    <article className="topic-page">
      <Crumbs trail={[{ href: "/apprendre", label: "Apprendre" }, { href: "/sujets", label: "Sujets" }]} current={sujet.titre} />

      <header className="hero-compact">
        <TopicArt id={sujet.art} />
        <div>
          <p className="eyebrow">Sujet</p>
          <h1>{sujet.titre}</h1>
        </div>
      </header>

      <section className="says" aria-label={`${persona.name} explique`}>
        <Silhouette who={sujet.voix} size={72} bust />
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

      <div className="row actions-row">
        <ListenButton text={spoken} />
        <WhatsAppShare title={sujet.titre} />
      </div>

      <section aria-labelledby="retenir">
        <h2 id="retenir">L'essentiel en {cards.length} cartes</h2>
        <Deck cards={cards} label={`L'essentiel sur ${sujet.titre}`} />
      </section>

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

      <p className="muted fiche-note">Contenu établi d'après le guide de la planification familiale de l'OMS (2012).</p>
      <PageFeedback />
    </article>
  );
}

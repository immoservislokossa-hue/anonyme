import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolArt } from "@/components/art/Art";
import AskAfi from "@/components/AskAfi";
import Crumbs from "@/components/Crumbs";
import PageFeedback from "@/components/PageFeedback";
import Icon from "@/components/Icon";
import ToolLauncher from "@/components/ToolLauncher";
import { METHODES, TOOLS, getTool, suiteLink } from "@/lib/catalog";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tool = getTool(id);
  return { title: tool ? tool.titre : "Outil", description: tool?.promesse };
}

const helpMethods = METHODES.map(({ id, nom, comment, peut_arriver, a_retenir, ou_aller }) => ({ id, nom, comment, peut_arriver, a_retenir, ou_aller }));

export default async function OutilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = getTool(id);
  if (!tool) notFound();

  return (
    <article className="tool-page">
      <Crumbs trail={[{ href: "/apprendre", label: "Apprendre" }, { href: "/outils", label: "Outils" }]} current={tool.titre} />

      <header className="page-hero">
        <div className="page-hero-art">
          <ToolArt id={tool.id} />
        </div>
        <div>
          <p className="eyebrow">Outil</p>
          <h1>{tool.titre}</h1>
          <p className="lede">{tool.promesse}</p>
          <ul className="pills" aria-label="En un coup d'œil">
            <li>{tool.minutes} min</li>
            <li>Reste sur ton téléphone</li>
            <li>Guide OMS</li>
          </ul>
        </div>
      </header>

      {tool.id === "risque" && (
        <p className="notice alert">
          <Icon name="alert" size={18} />
          <span>
            Si c'est urgent ou si tu es en danger, <Link href="/urgence">va tout de suite ici</Link>.
          </span>
        </p>
      )}

      <ToolLauncher id={tool.id} methods={helpMethods} minutes={tool.minutes} />

      <section aria-labelledby="comment">
        <h2 id="comment">Comment ça marche</h2>
        <ol className="step-cards numbered">
          {tool.etapes.map((step) => (
            <li key={step}>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel" aria-labelledby="limites">
        <h2 id="limites">Ce que l'outil ne fait pas</h2>
        <ul className="plain">
          {tool.limites.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
        <p className="muted tool-source">Source : {tool.source}. Brouillon en cours de validation par des professionnels de santé.</p>
      </section>

      <section aria-labelledby="suite">
        <h2 id="suite">Pour continuer</h2>
        <ul className="next-list">
          {tool.suite.map((item) => {
            const link = suiteLink(item);
            return (
              <li key={link.href}>
                <Link href={link.href}>
                  <span className="related-type">{link.type}</span>
                  <strong>{link.titre}</strong>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="row">
          <AskAfi message={tool.astuces[0]} />
        </div>
      </section>
      <PageFeedback />
    </article>
  );
}

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

      <header className="hero-compact">
        <ToolArt id={tool.id} />
        <div>
          <h1>{tool.titre}</h1>
          <p className="lede">{tool.promesse}</p>
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

      <ToolLauncher id={tool.id} methods={helpMethods} />

      <details className="know">
        <summary>À savoir sur cet outil</summary>
        <h3>Comment ça marche</h3>
        <ol className="plain">
          {tool.etapes.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h3>Ce qu'il ne fait pas</h3>
        <ul className="plain">
          {tool.limites.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
        <p className="muted tool-source">
          {tool.minutes} min · Source : {tool.source}.
        </p>
      </details>

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

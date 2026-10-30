import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MethodArt } from "@/components/art/Art";
import AskAfi from "@/components/AskAfi";
import Crumbs from "@/components/Crumbs";
import PageFeedback from "@/components/PageFeedback";
import Icon from "@/components/Icon";
import RelatedLinks from "@/components/RelatedLinks";
import { METHODES, TIER_NAMES, getMethode, type ToolId } from "@/lib/catalog";
import { CONDITIONS } from "@/lib/tools/chooser";

export function generateStaticParams() {
  return METHODES.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const method = getMethode(id);
  return { title: method ? method.nom : "Méthode", description: method?.resume[0] };
}

const PLAN_METHODS = ["pilule", "pilule-minidosee", "injectables", "implants", "sterilet", "vasectomie"];

function toolsFor(id: string): ToolId[] {
  const tools: ToolId[] = [];
  if (PLAN_METHODS.includes(id)) tools.push("plan", "souci");
  if (id === "jours-fixes") tools.push("cycle");
  if (id === "contraception-urgence" || id.startsWith("preservatif") || id === "retrait") tools.push("risque");
  tools.push("choisir", "visite");
  return tools;
}

// Les trois méthodes dont le guide (p. 19) liste les problèmes de santé qui les excluent.
const HEALTH_KEY: Record<string, "pilule" | "injectables" | "minidosee"> = { pilule: "pilule", injectables: "injectables", "pilule-minidosee": "minidosee" };

function List({ items }: { items: string[] }) {
  return (
    <ul className="plain">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function MethodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = getMethode(id);
  if (!m) notFound();

  const key = HEALTH_KEY[m.id];
  const excluded = key ? CONDITIONS.filter((c) => c[key] === "non") : [];
  const facts = [
    { label: "Efficacité", value: TIER_NAMES[m.niveau] },
    { label: "À quelle fréquence", value: m.frequence },
    { label: "Protège des IST", value: m.ist ? "Oui" : "Non" },
    { label: "Où l'obtenir", value: m.ou === "centre" ? "Centre de santé ou hôpital" : "Agent de santé, centre ou pharmacie" },
  ];

  return (
    <article className="method-page">
      <Crumbs trail={[{ href: "/apprendre", label: "Apprendre" }, { href: "/methodes", label: "Méthodes" }]} current={m.nom} />

      <header className="hero-compact">
        <MethodArt id={m.id} />
        <div>
          <p className="eyebrow">Méthode · {m.hormonale ? "avec hormones" : "sans hormones"}</p>
          <h1>{m.nom}</h1>
          <ul className="pills" aria-label="En un coup d'œil">
            {m.resume.slice(0, 2).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </header>

      <ul className="fact-grid">
        {facts.map((fact) => (
          <li key={fact.label}>
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </li>
        ))}
      </ul>

      <section aria-labelledby="cest">
        <h2 id="cest">Ce que c'est</h2>
        <List items={m.ce_que_cest} />
      </section>

      <section aria-labelledby="comment">
        <h2 id="comment">Comment l'utiliser</h2>
        <ol className="step-cards">
          {m.comment.map((item) => (
            <li key={item}>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>

      {m.mode_emploi.length > 0 && (
        <section aria-labelledby="mode">
          <h2 id="mode">Mode d'emploi, pas à pas</h2>
          <ol className="step-cards numbered">
            {m.mode_emploi.map((item) => (
              <li key={item}>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section aria-labelledby="arriver">
        <h2 id="arriver">Ce qui peut arriver</h2>
        <List items={m.peut_arriver} />
      </section>

      <section aria-labelledby="retenir">
        <h2 id="retenir">À retenir</h2>
        <ul className="point-grid">
          {m.a_retenir.map((item, index) => (
            <li key={item} className="point">
              <span className="point-num" aria-hidden="true">
                {index + 1}
              </span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {excluded.length > 0 && (
        <details className="know">
          <summary>Qui ne peut pas la prendre ?</summary>
          <p className="muted">Dis-le à un professionnel si tu es dans un de ces cas (guide OMS, p. 19) :</p>
          <List items={excluded.map((c) => c.label.split(" (")[0])} />
        </details>
      )}

      {m.accouchement && (
        <details className="know">
          <summary>Après un accouchement</summary>
          <p>{m.accouchement}</p>
        </details>
      )}

      <section className="panel where" aria-labelledby="ou">
        <h2 id="ou">Où aller</h2>
        <p>{m.ou_aller}.</p>
        <div className="row">
          <Link className="btn primary" href="/orientation">
            <Icon name="pin" size={18} />
            Trouver un centre
          </Link>
          <AskAfi message={m.astuces[0]} className="btn ghost" />
        </div>
      </section>

      <section aria-labelledby="suite">
        <h2 id="suite">Pour continuer</h2>
        <RelatedLinks outils={toolsFor(m.id)} />
        <p>
          <Link className="link-btn" href="/methodes#comparer">
            Comparer avec une autre méthode
          </Link>
        </p>
      </section>

      <p className="muted fiche-note">
        Source : {m.source}, p. {m.page}. Brouillon en cours de validation par des professionnels de santé.
      </p>
      <PageFeedback />
    </article>
  );
}

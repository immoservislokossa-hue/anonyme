import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HubArt } from "@/components/art/Art";
import AskAfi from "@/components/AskAfi";
import SearchBox from "@/components/SearchBox";
import { METHODES, SUJETS, TOOLS, searchIndex } from "@/lib/catalog";
import { stories } from "@/lib/stories";

export const metadata: Metadata = { title: "Apprendre" };

const CARDS = [
  { id: "sujets", href: "/sujets", titre: "Sujets", texte: "Grossesse, IST, règles, consentement… une page claire par sujet.", count: `${SUJETS.length} sujets` },
  { id: "outils", href: "/outils", titre: "Outils", texte: "Choisir une méthode, après un risque, mes rappels.", count: `${TOOLS.length} outils` },
  { id: "methodes", href: "/methodes", titre: "Méthodes", texte: "Toutes les méthodes, avec un schéma et une comparaison.", count: `${METHODES.length - 1} méthodes` },
  { id: "serie", href: "/serie", titre: "La série", texte: "Afi, Fallone et Chimène : des histoires qu'on suit.", count: `${stories.length} épisodes` },
];

// Les anciennes adresses (onglets, ?sujet=, ?outil=) mènent aux nouvelles pages.
function legacyTarget(params: { onglet?: string; sujet?: string; outil?: string }): string | null {
  if (params.sujet) return `/sujets/${params.sujet}`;
  if (params.outil) return `/outils/${params.outil}`;
  if (params.onglet === "outils") return "/outils";
  if (params.onglet === "methodes") return "/methodes";
  if (params.onglet === "serie") return "/serie";
  if (params.onglet === "sujets") return "/sujets";
  return null;
}

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ onglet?: string; sujet?: string; outil?: string }> }) {
  const target = legacyTarget(await searchParams);
  if (target) redirect(target);

  return (
    <>
      <header>
        <p className="eyebrow">Planification familiale et santé sexuelle</p>
        <h1>Apprendre</h1>
        <p className="lede">Choisis par où commencer. Tout est expliqué simplement, d'après le guide de l'OMS.</p>
      </header>

      <SearchBox items={searchIndex()} />

      <ul className="hub-grid two">
        {CARDS.map((card) => (
          <li key={card.id}>
            <Link href={card.href} className="hub-card">
              <HubArt id={card.id} />
              <span className="hub-count">{card.count}</span>
              <strong>{card.titre}</strong>
              <span>{card.texte}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="panel hub-help">
        <h2>Tu ne sais pas par où commencer ?</h2>
        <p>Afi t'écoute et te guide vers la bonne page.</p>
        <div className="row">
          <AskAfi className="btn primary">Parler à Afi</AskAfi>
          <Link className="btn ghost" href="/outils/risque">
            J'ai pris un risque
          </Link>
        </div>
      </section>
    </>
  );
}

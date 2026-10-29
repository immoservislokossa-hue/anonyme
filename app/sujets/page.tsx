import type { Metadata } from "next";
import Link from "next/link";
import { TopicArt } from "@/components/art/Art";
import Crumbs from "@/components/Crumbs";
import { SUJETS, hrefOf } from "@/lib/catalog";

export const metadata: Metadata = { title: "Sujets" };

export default function SujetsPage() {
  return (
    <>
      <Crumbs current="Sujets" />
      <header>
        <h1>Sujets</h1>
        <p className="lede">Une page par sujet : l'essentiel d'abord, les détails ensuite.</p>
      </header>
      <ul className="hub-grid">
        {SUJETS.map((sujet) => (
          <li key={sujet.id}>
            <Link href={hrefOf.sujet(sujet.id)} className={`hub-card${sujet.urgent ? " urgent" : ""}`}>
              <TopicArt id={sujet.art} />
              <strong>{sujet.titre}</strong>
              <span>{sujet.bref.split(". ")[0].replace(/\.$/, "")}.</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

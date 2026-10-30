import type { Metadata } from "next";
import { TopicArt } from "@/components/art/Art";
import Crumbs from "@/components/Crumbs";
import RowList from "@/components/RowList";
import { SUJETS, hrefOf } from "@/lib/catalog";

export const metadata: Metadata = { title: "Sujets" };

export default function SujetsPage() {
  return (
    <>
      <Crumbs current="Sujets" />
      <header>
        <h1>Sujets</h1>
        <p className="lede">L'essentiel d'abord, les détails ensuite.</p>
      </header>
      <RowList
        rows={SUJETS.map((sujet) => ({
          href: hrefOf.sujet(sujet.id),
          art: <TopicArt id={sujet.art} />,
          title: sujet.titre,
          text: `${sujet.bref.split(". ")[0].replace(/\.$/, "")}.`,
          urgent: sujet.urgent,
        }))}
      />
    </>
  );
}

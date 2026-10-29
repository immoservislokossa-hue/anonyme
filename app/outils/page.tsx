import type { Metadata } from "next";
import Link from "next/link";
import { ToolArt } from "@/components/art/Art";
import Crumbs from "@/components/Crumbs";
import { TOOLS, hrefOf } from "@/lib/catalog";

export const metadata: Metadata = { title: "Outils" };

export default function OutilsPage() {
  return (
    <>
      <Crumbs current="Outils" />
      <header>
        <h1>Outils</h1>
        <p className="lede">Des outils pratiques, construits sur le guide de l'OMS. Chacun prend une ou deux minutes.</p>
      </header>
      <ul className="hub-grid">
        {TOOLS.map((tool) => (
          <li key={tool.id}>
            <Link href={hrefOf.outil(tool.id)} className={`hub-card${tool.urgent ? " urgent" : ""}`}>
              <ToolArt id={tool.id} />
              <span className="hub-count">{tool.minutes} min</span>
              <strong>{tool.titre}</strong>
              <span>{tool.promesse}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

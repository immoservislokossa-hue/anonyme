import type { Metadata } from "next";
import { ToolArt } from "@/components/art/Art";
import Crumbs from "@/components/Crumbs";
import RowList from "@/components/RowList";
import { TOOL_GROUPS, getTool, hrefOf } from "@/lib/catalog";

export const metadata: Metadata = { title: "Outils" };

export default function OutilsPage() {
  return (
    <>
      <Crumbs current="Outils" />
      <header>
        <h1>Outils</h1>
        <p className="lede">Chaque outil prend une ou deux minutes. Tes réponses restent sur ton téléphone.</p>
      </header>
      {TOOL_GROUPS.map((group) => (
        <section key={group.id} aria-label={group.titre}>
          <h2 className="group-title">{group.titre}</h2>
          <RowList
            rows={group.outils.flatMap((id) => {
              const tool = getTool(id);
              return tool
                ? [{ href: hrefOf.outil(tool.id), art: <ToolArt id={tool.id} />, title: tool.titre, text: tool.promesse, urgent: tool.urgent }]
                : [];
            })}
          />
        </section>
      ))}
    </>
  );
}

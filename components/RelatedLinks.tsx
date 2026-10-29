import Link from "next/link";
import { MethodArt, ToolArt } from "@/components/art/Art";
import { getMethode, getTool, hrefOf, type ToolId } from "@/lib/catalog";

type Props = { outils?: ToolId[]; methodes?: string[]; episode?: { id: string; titre: string } | null };

// « Pour continuer » : les outils, méthodes et épisodes liés, en petites cartes illustrées.
export default function RelatedLinks({ outils = [], methodes = [], episode }: Props) {
  const tools = outils.flatMap((id) => (getTool(id) ? [getTool(id)!] : []));
  const methods = methodes.flatMap((id) => (getMethode(id) ? [getMethode(id)!] : []));
  if (tools.length === 0 && methods.length === 0 && !episode) return null;

  return (
    <ul className="related">
      {tools.map((tool) => (
        <li key={tool.id}>
          <Link href={hrefOf.outil(tool.id)} className="related-card">
            <ToolArt id={tool.id} />
            <span className="related-type">Outil</span>
            <strong>{tool.titre}</strong>
          </Link>
        </li>
      ))}
      {methods.map((method) => (
        <li key={method.id}>
          <Link href={hrefOf.methode(method.id)} className="related-card">
            <MethodArt id={method.id} />
            <span className="related-type">Méthode</span>
            <strong>{method.nom}</strong>
          </Link>
        </li>
      ))}
      {episode && (
        <li>
          <Link href={hrefOf.episode(episode.id)} className="related-card">
            <span className="related-ep">▶</span>
            <span className="related-type">Dans la série</span>
            <strong>{episode.titre}</strong>
          </Link>
        </li>
      )}
    </ul>
  );
}

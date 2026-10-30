import Link from "next/link";
import type { ReactNode } from "react";

export type Row = { href: string; art?: ReactNode; title: string; text?: string; tag?: string; urgent?: boolean };

// Une liste en lignes : une icône, un titre, une phrase. Plus simple à lire qu'une grille de grandes cartes.
export default function RowList({ rows, label }: { rows: Row[]; label?: string }) {
  return (
    <ul className="rows" aria-label={label}>
      {rows.map((row) => (
        <li key={row.href}>
          <Link href={row.href} className={`row-card${row.urgent ? " urgent" : ""}`}>
            {row.art && <span className="row-art">{row.art}</span>}
            <span className="row-body">
              <strong>{row.title}</strong>
              {row.text && <span className="row-text">{row.text}</span>}
            </span>
            {row.tag && <span className="row-tag">{row.tag}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

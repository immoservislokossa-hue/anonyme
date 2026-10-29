"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchItem } from "@/lib/catalog";

function plain(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Une recherche pour tout l'espace Apprendre : sujets, outils, méthodes et épisodes.
export default function SearchBox({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const words = plain(query).split(/\s+/).filter((w) => w.length > 1);
    if (words.length === 0) return [];
    return items
      .map((item) => {
        const title = plain(item.titre);
        const text = plain(item.texte);
        let score = 0;
        for (const word of words) {
          if (title.includes(word)) score += 3;
          else if (text.includes(word)) score += 1;
          else return { item, score: -1 };
        }
        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.item);
  }, [query, items]);

  return (
    <div className="search">
      <label className="topic-search">
        <span className="sr-only">Chercher dans Alviosa</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chercher : pilule, règles, VIH, injection…" autoComplete="off" />
      </label>
      {query.trim().length > 1 && (
        <ul className="search-results">
          {results.length === 0 && <li className="muted">Rien trouvé. Demande à Afi, elle t'aide.</li>}
          {results.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className="search-type">{item.type}</span>
                <strong>{item.titre}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

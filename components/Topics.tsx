"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/Icon";
import type { TopicView } from "@/lib/topics";

function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Tous les sujets sur une page : on cherche un mot, on ouvre une carte, on lit.
export default function Topics({ topics, open }: { topics: TopicView[]; open?: string }) {
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<string | null>(open ?? null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!open) return;
    setCurrent(open);
    refs.current[open]?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [open]);

  const shown = useMemo(() => {
    const words = normalise(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return topics;
    return topics.filter((topic) => {
      const haystack = normalise([topic.title, topic.blurb, ...topic.fiches.map((f) => `${f.title} ${f.content}`)].join(" "));
      return words.every((word) => haystack.includes(word));
    });
  }, [query, topics]);

  return (
    <div className="topics">
      <label className="topic-search">
        <span className="sr-only">Chercher un sujet</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Chercher : pilule, règles, VIH…"
          autoComplete="off"
        />
      </label>

      {shown.length === 0 && (
        <p className="muted">
          Rien trouvé. <Link href="/chat?voie=sexuelle">Pose ta question à Afi</Link>.
        </p>
      )}

      <ul className="topic-list">
        {shown.map((topic) => {
          const isOpen = current === topic.id || query.trim().length > 0;
          return (
            <li key={topic.id} ref={(node) => { refs.current[topic.id] = node; }} id={`sujet-${topic.id}`}>
              <button
                type="button"
                className={`topic-head${topic.urgent ? " urgent" : ""}`}
                aria-expanded={isOpen}
                onClick={() => setCurrent(current === topic.id ? null : topic.id)}
              >
                <span className="topic-icon">
                  <Icon name={topic.icon} size={22} />
                </span>
                <span className="topic-text">
                  <strong>{topic.title}</strong>
                  <span>{topic.blurb}</span>
                </span>
                <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={isOpen ? "m6 15 6-6 6 6" : "m9 5 7 7-7 7"} />
                </svg>
              </button>
              {isOpen && (
                <div className="topic-body">
                  {topic.urgent && (
                    <p className="notice alert">
                      <Icon name="alert" size={18} />
                      <span>
                        Si c'est urgent ou si tu es en danger, <Link href="/urgence">va tout de suite ici</Link>.
                      </span>
                    </p>
                  )}
                  {topic.fiches.map((fiche) => (
                    <article key={fiche.id} className="fiche">
                      <h3>{fiche.title}</h3>
                      <p>{fiche.content}</p>
                    </article>
                  ))}
                  <div className="row">
                    <Link className="chip-btn" href="/chat?voie=sexuelle">
                      <Icon name="chat" size={18} />
                      Poser une question
                    </Link>
                    <Link className="chip-btn" href="/orientation">
                      <Icon name="pin" size={18} />
                      Trouver un centre
                    </Link>
                  </div>
                  <p className="muted fiche-note">Brouillon en cours de validation par des professionnels de santé.</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

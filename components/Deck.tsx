"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DeckCard = { id: string; kind: "point" | "vf"; title?: string; text: string; wrong?: string };

// Des cartes qu'on fait défiler du doigt, une idée par carte : on lit en quelques secondes, sans mur de texte.
export default function Deck({ cards, label }: { cards: DeckCard[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const go = useCallback((index: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(cards.length - 1, index));
    const card = el.children[clamped] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", inline: "center", block: "nearest" });
  }, [cards.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) setActive(Array.from(el.children).indexOf(entry.target));
        }
      },
      { root: el, threshold: [0.6] },
    );
    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [cards.length]);

  function onKey(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(active - 1);
    }
  }

  return (
    <div className="deck" role="group" aria-roledescription="carrousel" aria-label={label}>
      <ul className="deck-track" ref={track} tabIndex={0} onKeyDown={onKey} aria-label={`${label} : fais défiler`}>
        {cards.map((card, i) => (
          <li key={card.id} className={`deck-card deck-${card.kind}`} aria-label={`Carte ${i + 1} sur ${cards.length}`}>
            {card.kind === "vf" ? (
              <>
                <p className="deck-tag">On entend dire</p>
                <p className="deck-wrong">{card.wrong}</p>
                <p className="deck-tag">En vrai</p>
                <p className="deck-text">{card.text}</p>
              </>
            ) : (
              <>
                <h3 className="deck-title">{card.title}</h3>
                <p className="deck-text">{card.text}</p>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="deck-nav">
        <button type="button" className="deck-arrow" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Carte précédente">
          ‹
        </button>
        <span className="deck-count" aria-live="polite">
          {active + 1} / {cards.length}
        </span>
        <button type="button" className="deck-arrow" onClick={() => go(active + 1)} disabled={active === cards.length - 1} aria-label="Carte suivante">
          ›
        </button>
      </div>
    </div>
  );
}

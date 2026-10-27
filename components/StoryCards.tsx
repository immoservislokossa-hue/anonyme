"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import Speak from "@/components/Speak";
import StoryAvatar from "@/components/StoryAvatar";
import { speakerInfo, type Story } from "@/lib/stories";

// Format « en images » : une réplique par carte, comme des stories. Tap ou boutons pour avancer.
export default function StoryCards({ story, onDone, onSwitch }: { story: Story; onDone: () => void; onSwitch: () => void }) {
  const [index, setIndex] = useState(0);
  const total = story.scenes.length;
  const atEnd = index >= total;

  useEffect(() => {
    if (atEnd) onDone();
  }, [atEnd, onDone]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") setIndex((i) => Math.min(total, i + 1));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const scene = story.scenes[index];

  return (
    <section className="story-cards" aria-label={`Histoire en images : ${story.titre}`}>
      <div className="seg-bar" aria-hidden="true">
        {Array.from({ length: total + 1 }, (_, i) => (
          <span key={i} className={i <= index ? "on" : ""} />
        ))}
      </div>

      {!atEnd ? (
        <div className="card-stage">
          <button
            type="button"
            className="card-face"
            onClick={() => setIndex((i) => Math.min(total, i + 1))}
            aria-label="Carte suivante"
          >
            {scene.who === "narrateur" ? (
              <span className="narration">{scene.text}</span>
            ) : (
              <>
                <span className="speaker">
                  <StoryAvatar who={scene.who} size={84} />
                  <span>
                    <strong>{speakerInfo(scene.who).name}</strong>
                    <em>{speakerInfo(scene.who).role}</em>
                  </span>
                </span>
                <span className="said">{scene.text}</span>
              </>
            )}
            <span className="tap-hint">Touchez pour continuer</span>
          </button>
          <div className="story-controls">
            <button type="button" className="chip-btn" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
              Précédent
            </button>
            <Speak text={scene.text} />
            <button type="button" className="btn indigo" onClick={() => setIndex((i) => Math.min(total, i + 1))}>
              Suivant
            </button>
          </div>
        </div>
      ) : (
        <div className="story-end panel">
          <p className="eyebrow">À retenir</p>
          <h2>{story.lecon}</h2>
          <div className="row">
            <Link className="btn indigo" href={story.action.href}>
              <Icon name="pin" size={18} />
              {story.action.label}
            </Link>
            <button type="button" className="btn ghost" onClick={() => setIndex(0)}>
              Revoir
            </button>
            <button type="button" className="btn ghost" onClick={onSwitch}>
              Essayer en jeu
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

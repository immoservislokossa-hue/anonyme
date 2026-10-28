"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormat } from "@/components/useFormat";
import { useProgress } from "@/components/useProgress";
import { FORMATS, SEASON, SERIES_TITLE, stories } from "@/lib/stories";

// Un seul choix, une fois : la façon préférée de vivre les histoires. Ensuite, chaque histoire s'ouvre dans ce format.
export default function StoriesHub() {
  const { format, ready, choose } = useFormat();
  const { progress } = useProgress();
  const [changing, setChanging] = useState(false);
  const current = FORMATS.find((item) => item.id === format);
  const resume = stories.find((story) => !progress.chroniclesRead.includes(`histoire-${story.id}`));
  const started = progress.chroniclesRead.some((id) => id.startsWith("histoire-"));
  const picking = ready && (!current || changing);

  return (
    <section aria-label="La série" className="stories-hub" id="format">
      {picking ? (
        <div className="format-ask">
          <h2>Quel format préfères-tu ?</h2>
          <div className="format-picker">
            {FORMATS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`format-chip${format === item.id ? " on" : ""}`}
                aria-pressed={format === item.id}
                onClick={() => {
                  choose(item.id);
                  setChanging(false);
                }}
              >
                <strong>{item.label}</strong>
                <span>{item.hint}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        ready &&
        current && (
          <p className="format-line">
            Format : <strong>{current.label}</strong>
            <button type="button" className="link-btn" onClick={() => setChanging(true)}>
              Changer
            </button>
          </p>
        )
      )}

      <div className="series-head">
        <p className="eyebrow">Saison {SEASON}</p>
        <h2>{SERIES_TITLE}</h2>
        <p>Trois amies, la vie de tous les jours, des questions qu&apos;on se pose vraiment.</p>
        {resume && (
          <Link className="btn indigo" href={`/histoires/${resume.id}`}>
            {started ? "Continuer" : "Commencer"} · Épisode {resume.episode}
          </Link>
        )}
      </div>

      <ul className="story-rows">
        {stories.map((story) => {
          const done = progress.chroniclesRead.includes(`histoire-${story.id}`);
          return (
            <li key={story.id}>
              <Link href={`/histoires/${story.id}`} className="story-row">
                <span className="ep-num" aria-hidden="true">
                  {story.episode}
                </span>
                <span className="story-row-body">
                  <strong>{story.titre}</strong>
                  <span>{story.accroche}</span>
                </span>
                {done && <span className="tag vert">Terminée</span>}
                <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

"use client";

import Link from "next/link";
import Silhouette from "@/components/Silhouette";
import { useFormat } from "@/components/useFormat";
import { useProgress } from "@/components/useProgress";
import { voieOf, FORMATS, stories } from "@/lib/stories";

// Liste des histoires, avec le choix de la façon préférée de les vivre (gardé sur l'appareil).
export default function StoriesHub() {
  const { format, ready, choose } = useFormat();
  const { progress } = useProgress();

  return (
    <section aria-label="Histoires" className="stories-hub">
      <div className="panel">
        <h2>Comment aimes-tu apprendre ?</h2>
        <p className="muted">Choisis ta façon préférée. Tu pourras la changer à tout moment.</p>
        <div className="format-picker">
          {FORMATS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`format-chip${ready && format === item.id ? " on" : ""}`}
              aria-pressed={ready && format === item.id}
              onClick={() => choose(item.id)}
            >
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="story-list">
        {stories.map((story) => {
          const done = progress.chroniclesRead.includes(`histoire-${story.id}`);
          const main = ready && format ? format : "cartes";
          return (
            <li key={story.id} className="story-item panel">
              <div className="story-cast" aria-hidden="true">
                {story.cast.slice(0, 3).map((who) => {
                  const v = voieOf(who);
                  return v ? <Silhouette key={who} voie={v} size={56} bust framed /> : null;
                })}
              </div>
              <div className="story-info">
                <div className="row-between">
                  <h3>{story.titre}</h3>
                  {done && <span className="tag vert">Terminée</span>}
                </div>
                <p className="muted">
                  {story.accroche} · {story.duree}
                </p>
                <div className="row">
                  <Link className="btn indigo" href={`/histoires/${story.id}?format=${main}`}>
                    {ready && format ? `Pour toi : ${FORMATS.find((f) => f.id === main)?.label}` : "Commencer"}
                  </Link>
                  {FORMATS.filter((f) => f.id !== main).map((f) => (
                    <Link key={f.id} className="chip-btn" href={`/histoires/${story.id}?format=${f.id}`}>
                      {f.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

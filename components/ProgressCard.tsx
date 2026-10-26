"use client";

import { badges, level, points, streak } from "@/lib/progress";
import { useProgress } from "@/components/useProgress";

// Carte de progression : points, niveau, série et badges. Calculée sur l'appareil.
export default function ProgressCard() {
  const { progress, ready } = useProgress();

  if (!ready) {
    return <div className="panel" aria-hidden="true" style={{ minHeight: 168 }} />;
  }

  const total = points(progress);
  const current = level(total);
  const days = streak(progress);
  const list = badges(progress);
  const earned = list.filter((badge) => badge.earned).length;

  return (
    <section className="panel progress" aria-label="Votre parcours">
      <div className="progress-head">
        <div>
          <p className="eyebrow">Votre parcours</p>
          <h2 style={{ marginBottom: 4 }}>{current.label}</h2>
          <p className="muted">
            {total} points
            {current.next !== null ? ` · encore ${current.next - total} pour le niveau suivant` : " · niveau maximum"}
          </p>
        </div>
        <div className="streak" aria-label={`${days} jours de suite`}>
          <strong>{days}</strong>
          <span>{days > 1 ? "jours de suite" : "jour"}</span>
        </div>
      </div>

      <div className="bar" role="progressbar" aria-valuenow={Math.round(current.ratio * 100)} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${Math.round(current.ratio * 100)}%` }} />
      </div>

      <p className="muted" style={{ marginTop: 14 }}>
        Badges : {earned} sur {list.length}
      </p>
      <ul className="badges">
        {list.map((badge) => (
          <li key={badge.id} className={badge.earned ? "badge earned" : "badge"} title={badge.hint}>
            <span aria-hidden="true">{badge.earned ? "★" : "☆"}</span> {badge.label}
          </li>
        ))}
      </ul>
      <p className="muted" style={{ marginTop: 10 }}>
        Vos points restent sur cet appareil. Personne d'autre ne les voit.
      </p>
    </section>
  );
}

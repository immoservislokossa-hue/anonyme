"use client";

import Icon from "@/components/Icon";
import { useProgress } from "@/components/useProgress";
import { badges, level, points, streak } from "@/lib/progress";

// Carte de progression : points, niveau, série et badges. Calculée sur l'appareil.
export default function ProgressCard() {
  const { progress, ready } = useProgress();

  if (!ready) {
    return <div className="panel skeleton" aria-hidden="true" />;
  }

  const total = points(progress);
  const current = level(total);
  const days = streak(progress);
  const list = badges(progress);
  const earned = list.filter((badge) => badge.earned).length;
  const percent = Math.round(current.ratio * 100);

  return (
    <section className="panel progress" aria-label="Votre parcours">
      <div className="progress-head">
        <div>
          <p className="eyebrow">Votre parcours</p>
          <h2>{current.label}</h2>
          <p className="muted">
            {total} points
            {current.next !== null ? ` · encore ${current.next - total} pour le niveau suivant` : " · niveau maximum"}
          </p>
        </div>
        <div className="streak" aria-label={`${days} jours de suite`}>
          <Icon name="flame" size={22} filled />
          <strong>{days}</strong>
          <span>{days > 1 ? "jours" : "jour"}</span>
        </div>
      </div>

      <div className="bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${Math.max(percent, 4)}%` }} />
      </div>

      <p className="muted badges-title">
        Badges : {earned} sur {list.length}
      </p>
      <ul className="badges">
        {list.map((badge) => (
          <li key={badge.id} className={badge.earned ? "badge earned" : "badge"} title={badge.hint}>
            <Icon name="star" size={15} filled={badge.earned} />
            {badge.label}
          </li>
        ))}
      </ul>
      <p className="muted small-note">Vos points restent sur cet appareil. Personne d'autre ne les voit.</p>
    </section>
  );
}

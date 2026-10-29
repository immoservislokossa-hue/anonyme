"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/track";
import {
  FIRST_FERTILE_DAY,
  LAST_FERTILE_DAY,
  MAX_CYCLE,
  MIN_CYCLE,
  dayOfCycle,
  kindOfDay,
  toIcs,
  upcomingWindows,
} from "@/lib/tools/cycle";

const KEY = "cycle-v1";
const LENGTHS = Array.from({ length: MAX_CYCLE - MIN_CYCLE + 1 }, (_, i) => MIN_CYCLE + i);

function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toInput(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const SHORT = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "long" });

// Méthode des jours fixes : on entre le premier jour des règles, l'outil montre les jours où une grossesse est possible.
export default function CycleTool() {
  const [first, setFirst] = useState("");
  const [length, setLength] = useState(28);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(KEY) ?? "null") as { first?: string; length?: number } | null;
      if (saved?.first) {
        setFirst(saved.first);
        if (saved.length) setLength(saved.length);
        setRemember(true);
      }
    } catch {
      // Stockage indisponible : l'outil marche quand même.
    }
  }, []);

  useEffect(() => {
    try {
      if (remember && first) window.localStorage.setItem(KEY, JSON.stringify({ first, length }));
      else window.localStorage.removeItem(KEY);
    } catch {
      // Rien à faire.
    }
  }, [remember, first, length]);

  const start = parseDate(first);
  const today = new Date();
  const result = useMemo(() => {
    if (!start) return null;
    const day = dayOfCycle(start, length, today);
    const windows = upcomingWindows(start, length, 8)
      .filter((w) => w.fertileEnd >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      .slice(0, 3);
    return { day, kind: kindOfDay(day), windows };
    // La date du jour ne change pas pendant la visite.
  }, [first, length]);

  useEffect(() => {
    if (result) track("outil-cycle");
  }, [result]);

  function download() {
    if (!start) return;
    const blob = new Blob([toIcs(upcomingWindows(start, length, 6))], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "jours-fertiles.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="tool">
      <p className="muted">
        Cette méthode marche pour les femmes dont les règles sont régulières (cycle de {MIN_CYCLE} à {MAX_CYCLE} jours). Du {FIRST_FERTILE_DAY}e au {LAST_FERTILE_DAY}e jour du cycle, une grossesse est possible : pas de rapport, ou un préservatif.
      </p>

      <div className="fields">
        <label>
          <span>Premier jour de mes dernières règles</span>
          <input type="date" value={first} max={toInput(today)} onChange={(event) => setFirst(event.target.value)} />
        </label>
        <label>
          <span>Durée de mon cycle (en jours)</span>
          <select value={length} onChange={(event) => setLength(Number(event.target.value))}>
            {LENGTHS.map((value) => (
              <option key={value} value={value}>
                {value} jours
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="muted">Tu ne sais pas ou tes règles changent beaucoup ? Choisis une autre méthode : cet outil ne serait pas fiable pour toi.</p>

      {result && (
        <>
          <div className={`tool-verdict verdict-${result.kind === "fertile" ? "alert" : "ok"}`} role="status">
            <strong>
              Aujourd'hui : jour {result.day} de ton cycle
            </strong>
            <p>
              {result.kind === "fertile"
                ? "Jour fertile : une grossesse est possible. Pas de rapport sexuel, ou utilise un préservatif."
                : result.kind === "regles"
                  ? "Premier jour des règles."
                  : "Pas de jour fertile aujourd'hui, si tes règles sont bien régulières."}
            </p>
          </div>

          <div className="collier" role="img" aria-label={`Collier du cycle : jours fertiles du ${FIRST_FERTILE_DAY}e au ${LAST_FERTILE_DAY}e jour`}>
            {Array.from({ length }, (_, i) => {
              const d = i + 1;
              const kind = kindOfDay(d);
              return <span key={d} className={`bead ${kind}${d === result.day ? " now" : ""}`} title={`Jour ${d}`} />;
            })}
          </div>
          <p className="collier-legend">
            <span className="bead regles" /> règles <span className="bead sans-risque" /> sans risque <span className="bead fertile" /> jours fertiles
          </p>

          <h3>Tes prochains jours fertiles</h3>
          <ul className="plain windows">
            {result.windows.map((w) => (
              <li key={w.cycle}>
                Du {SHORT.format(w.fertileStart)} au {SHORT.format(w.fertileEnd)}
                <span className="muted">
                  {" "}
                  ({w.periodStart <= today ? "règles commencées le" : "règles attendues le"} {SHORT.format(w.periodStart)})
                </span>
              </li>
            ))}
          </ul>

          <div className="row">
            <button type="button" className="btn primary" onClick={download}>
              Ajouter à mon calendrier
            </button>
          </div>
        </>
      )}

      <label className="check-line">
        <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
        <span>Me souvenir de ma date sur cet appareil (rien n'est envoyé)</span>
      </label>

      <ul className="plain tool-notes">
        <li>Les deux partenaires doivent être d'accord pour éviter les rapports ou utiliser un préservatif les jours fertiles.</li>
        <li>Si tes règles deviennent irrégulières, change de méthode.</li>
        <li>Cette méthode ne protège pas des IST : le préservatif est le seul à le faire.</li>
        <li>Elle est moins efficace que l'implant, le stérilet ou la pilule.</li>
      </ul>
      <p className="muted tool-source">Source : Guide de la planification familiale de l'OMS (2012), p. 14 et 26. Brouillon en cours de validation.</p>
    </div>
  );
}

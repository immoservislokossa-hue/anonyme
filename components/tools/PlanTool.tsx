"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";
import { usePlan } from "@/components/usePlan";
import { track } from "@/lib/track";
import {
  PLAN_METHODS,
  statusOf,
  stepsFor,
  toIcs,
  toIso,
  type Plan,
  type PlanMethod,
  type Standing,
} from "@/lib/tools/plan";

const DATE = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const TONE: Record<Standing, "ok" | "wait" | "alert"> = {
  "a-jour": "ok",
  quotidien: "ok",
  "efficace-bientot": "wait",
  bientot: "wait",
  "dans-le-delai": "wait",
  "trop-tard": "alert",
};

function untilLabel(days: number): string {
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "demain";
  if (days > 1) return `dans ${days} jours`;
  if (days === -1) return "hier";
  return `il y a ${-days} jours`;
}

// « Mon plan » : la méthode, ses dates, des rappels. Tout reste sur l'appareil.
export default function PlanTool() {
  const { plan, ready, save } = usePlan();
  const [method, setMethod] = useState<PlanMethod>("dmpa");
  const [start, setStart] = useState(toIso(new Date()));
  const [neutral, setNeutral] = useState(true);
  const [time, setTime] = useState("20:00");

  if (!ready) return null;

  function create() {
    save({ method, start, neutral, time });
    track("outil-plan");
  }

  function download(current: Plan) {
    const blob = new Blob([toIcs(current)], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rappels.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  if (!plan) {
    const chosen = PLAN_METHODS.find((m) => m.id === method);
    return (
      <div className="tool">
        <p className="muted">Tu utilises déjà une méthode ? Note-la ici : Alviosa te montre tes prochaines dates et peut les mettre dans ton calendrier.</p>
        <div className="fields">
          <label>
            <span>Ma méthode</span>
            <select value={method} onChange={(event) => setMethod(event.target.value as PlanMethod)}>
              {PLAN_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{chosen?.dateLabel}</span>
            <input type="date" value={start} max={toIso(new Date())} onChange={(event) => setStart(event.target.value)} />
          </label>
          {(method === "pilule" || method === "pilule-minidosee") && (
            <label>
              <span>Heure de mon rappel chaque jour</span>
              <input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
            </label>
          )}
        </div>
        <label className="check-line">
          <input type="checkbox" checked={neutral} onChange={(event) => setNeutral(event.target.checked)} />
          <span>Rappels discrets : l'alerte du calendrier dit seulement « Rappel santé »</span>
        </label>
        <div className="row">
          <button type="button" className="btn primary" onClick={create}>
            Créer mon plan
          </button>
          <Link className="btn ghost" href="/outils/choisir">
            Je n'ai pas encore de méthode
          </Link>
        </div>
        <p className="muted tool-source">Ton plan reste sur ton téléphone. Dates d'après le guide de l'OMS (2012). Brouillon en cours de validation.</p>
      </div>
    );
  }

  const status = statusOf(plan);
  const name = PLAN_METHODS.find((m) => m.id === plan.method)?.name ?? "Ma méthode";
  const steps = stepsFor(plan, 4);
  const isDaily = status.standing === "quotidien";
  const isInjection = plan.method === "dmpa" || plan.method === "net-en";

  return (
    <div className="tool">
      <div className={`tool-verdict verdict-${TONE[status.standing]}`} role="status">
        <strong>{name}</strong>
        {status.step && !isDaily && (
          <p>
            <strong>{status.step.label}</strong> : {DATE.format(status.step.due)} ({untilLabel(status.daysLeft)})
          </p>
        )}
        <p>{status.message}</p>
        {status.step?.graceEnd && status.standing !== "trop-tard" && <p className="muted">Retard encore acceptable jusqu'au {DATE.format(status.step.graceEnd)}.</p>}
      </div>

      {status.step && <p className="muted">{status.step.rule}</p>}

      {steps.length > 1 && !isDaily && (
        <>
          <h3>Mes prochaines dates</h3>
          <ul className="plain windows">
            {steps.map((step) => (
              <li key={step.due.toISOString()}>{DATE.format(step.due)}</li>
            ))}
          </ul>
        </>
      )}

      <div className="row">
        <button type="button" className="btn primary" onClick={() => download(plan)}>
          Mettre mes rappels dans mon calendrier
        </button>
        {isInjection && (
          <button type="button" className="btn ghost" onClick={() => save({ ...plan, start: toIso(new Date()) })}>
            J'ai fait mon injection aujourd'hui
          </button>
        )}
      </div>

      <label className="check-line">
        <input type="checkbox" checked={plan.neutral} onChange={(event) => save({ ...plan, neutral: event.target.checked })} />
        <span>Rappels discrets (« Rappel santé » dans le calendrier)</span>
      </label>

      <div className="row">
        <Link className="chip-btn" href="/outils/souci">
          <Icon name="alert" size={18} />
          J'ai un souci
        </Link>
        <Link className="chip-btn" href="/orientation">
          <Icon name="pin" size={18} />
          Trouver un centre
        </Link>
        <button type="button" className="chip-btn" onClick={() => save(null)}>
          Effacer mon plan
        </button>
      </div>
      <p className="muted tool-source">Ton plan reste sur ton téléphone. Effacer les données du site l'efface aussi.</p>
    </div>
  );
}

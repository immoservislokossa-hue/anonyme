"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { track } from "@/lib/track";
import { EVENTS, WHENS, riskActions, type Event, type Urgency, type When } from "@/lib/tools/risk";

const URGENCY_LABEL: Record<Urgency, string> = {
  maintenant: "Tout de suite",
  aujourdhui: "Aujourd'hui",
  bientot: "Dans les jours qui viennent",
  info: "Pour la suite",
};

// Après un rapport à risque : ce qu'il faut faire, dans quel ordre, avec les échéances.
export default function RiskTool() {
  const [event, setEvent] = useState<Event | null>(null);
  const [when, setWhen] = useState<When | null>(null);
  const actions = event && when ? riskActions(event, when) : [];
  useEffect(() => {
    if (actions.length > 0) track("outil-risque");
  }, [actions.length]);

  return (
    <div className="tool">
      <p className="muted">Pas de panique : il y a des solutions, et elles marchent mieux plus tôt. Réponds à deux questions.</p>

      <fieldset className="tool-step">
        <legend>Que s'est-il passé ?</legend>
        <div className="opts">
          {EVENTS.map((item) => (
            <button key={item.id} type="button" className={`opt${event === item.id ? " on" : ""}`} aria-pressed={event === item.id} onClick={() => setEvent(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="tool-step">
        <legend>C'était il y a combien de temps ?</legend>
        <div className="opts">
          {WHENS.map((item) => (
            <button key={item.id} type="button" className={`opt${when === item.id ? " on" : ""}`} aria-pressed={when === item.id} onClick={() => setWhen(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      {actions.length > 0 && (
        <div className="tool-result" aria-live="polite">
          <h3>Ce que tu peux faire</h3>
          <ol className="actions">
            {actions.map((action) => (
              <li key={action.id} className={`action urgency-${action.urgency}`}>
                <span className="action-tag">{URGENCY_LABEL[action.urgency]}</span>
                <strong>{action.title}</strong>
                <p>{action.text}</p>
                {action.deadline && <p className="action-deadline">{action.deadline}</p>}
              </li>
            ))}
          </ol>

          <div className="row">
            <Link className="btn primary" href="/orientation">
              <Icon name="pin" size={18} />
              Trouver une pharmacie ou un centre
            </Link>
            <Link className="btn ghost" href="/sujets/apres-risque">
              En savoir plus
            </Link>
            {event === "force" && (
              <Link className="btn ghost" href="/urgence">
                C'est urgent
              </Link>
            )}
          </div>
          <p className="muted tool-source">Sources : Guide OMS de la planification familiale (2012), p. 4, 6, 16, 18 ; traitement d'urgence du VIH dans les 72 heures (recommandation OMS). Brouillon en cours de validation.</p>
        </div>
      )}
    </div>
  );
}

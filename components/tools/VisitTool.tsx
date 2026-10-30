"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { track } from "@/lib/track";
import { REASONS, VISIT_METHODS, visitPlan, visitText, type Reason, type VisitMethod } from "@/lib/tools/visit";

// « Je prépare ma visite » : une liste de questions à poser et de choses à apporter. Rien n'est envoyé.
export default function VisitTool() {
  const [reason, setReason] = useState<Reason | null>(null);
  const [method, setMethod] = useState<VisitMethod>("aucune");
  const [copied, setCopied] = useState(false);
  const plan = reason ? visitPlan(reason, method) : null;

  useEffect(() => {
    if (reason) track("outil-visite");
  }, [reason]);

  async function copy() {
    if (!reason) return;
    const text = visitText(reason, method);
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Partage annulé : rien à faire.
    }
  }

  return (
    <div className="tool">
      <p className="muted">Tu as le droit de poser des questions. Voici celles qui comptent, pour sortir du centre en ayant compris.</p>

      <fieldset className="tool-step">
        <legend>Pourquoi vas-tu au centre ?</legend>
        <div className="opts">
          {REASONS.map((item) => (
            <button key={item.id} type="button" className={`opt${reason === item.id ? " on" : ""}`} aria-pressed={reason === item.id} onClick={() => setReason(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      {reason && (
        <fieldset className="tool-step">
          <legend>Une méthode t'intéresse ? (facultatif)</legend>
          <div className="opts">
            {VISIT_METHODS.map((item) => (
              <button key={item.id} type="button" className={`opt${method === item.id ? " on" : ""}`} aria-pressed={method === item.id} onClick={() => setMethod(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {plan && (
        <div className="tool-result" aria-live="polite">
          {plan.groups.map((group) => (
            <section key={group.id}>
              <h3>{group.title}</h3>
              <ol className="actions">
                {group.items.map((item) => (
                  <li key={item.id} className="action urgency-info">
                    <strong>{item.question}</strong>
                    <p>{item.why}</p>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          <section>
            <h3>À apporter</h3>
            <ul className="plain">
              {plan.bring.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <p className="notice">{plan.ifJudged}</p>

          <div className="row">
            <button type="button" className="btn primary" onClick={copy}>
              <Icon name="send" size={18} />
              {copied ? "Copié" : "Copier ma liste"}
            </button>
            <Link className="btn ghost" href="/orientation">
              <Icon name="pin" size={18} />
              Trouver un centre
            </Link>
            <Link className="btn ghost" href="/outils/parler">
              En parler avant
            </Link>
          </div>
          <p className="muted">Après ta visite, tu peux donner ton avis, sans nom, sur la page du service dans « Centres ». Cela aide les autres jeunes et les responsables de santé.</p>
          <p className="muted tool-source">Sources : Guide OMS de la planification familiale (2012), fiche « Préparer une consultation ».</p>
        </div>
      )}
    </div>
  );
}

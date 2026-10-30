"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { track } from "@/lib/track";
import { GOALS, WHOS, talkPlan, type Goal, type Who } from "@/lib/tools/talk";

// « Parler à quelqu'un » : des phrases pour commencer, et quoi répondre si ça se passe mal. Rien n'est envoyé.
export default function TalkTool() {
  const [who, setWho] = useState<Who | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const plan = who && goal ? talkPlan(who, goal) : null;

  useEffect(() => {
    if (plan) track("outil-parler");
  }, [plan]);

  return (
    <div className="tool">
      <p className="muted">Parler n'est pas toujours facile. Choisis à qui, et pour quoi : tu reçois des phrases à adapter avec tes mots.</p>

      <fieldset className="tool-step">
        <legend>À qui veux-tu parler ?</legend>
        <div className="opts">
          {WHOS.map((item) => (
            <button key={item.id} type="button" className={`opt${who === item.id ? " on" : ""}`} aria-pressed={who === item.id} onClick={() => setWho(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="tool-step">
        <legend>Qu'est-ce que tu veux dire ?</legend>
        <div className="opts">
          {GOALS.map((item) => (
            <button key={item.id} type="button" className={`opt${goal === item.id ? " on" : ""}`} aria-pressed={goal === item.id} onClick={() => setGoal(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      {plan && (
        <div className="tool-result" aria-live="polite">
          <section>
            <h3>Pour commencer, tu peux dire</h3>
            <ul className="quotes">
              {plan.openers.map((line) => (
                <li key={line}>« {line} »</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Si la personne répond…</h3>
            <ol className="actions">
              {plan.objections.map((item) => (
                <li key={item.dit} className="action urgency-info">
                  <strong>{item.dit}</strong>
                  <p>{item.reponds}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h3>Conseils</h3>
            <ul className="plain">
              {plan.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <p className="notice alert">
            <Icon name="alert" size={18} />
            <span>
              Si tu as peur d'être frappé(e), menacé(e) ou forcé(e), ne parle pas seul(e) :{" "}
              <Link href="/sujets/violence">vois la page « Violence et aide »</Link>.
            </span>
          </p>

          <div className="row">
            <Link className="btn primary" href="/outils/visite">
              Préparer ma visite
            </Link>
            <Link className="btn ghost" href="/orientation">
              <Icon name="pin" size={18} />
              Trouver un centre
            </Link>
          </div>
          <p className="muted tool-source">Sources : Guide OMS de la planification familiale (2012), fiches Alviosa, Afrobaromètre 2024/25. Brouillon en cours de validation.</p>
        </div>
      )}
    </div>
  );
}

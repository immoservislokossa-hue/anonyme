"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/Icon";
import { PREGNANCY_QUESTIONS, PREGNANCY_SIGNS, evaluatePregnancy, type PregnancyOutcome } from "@/lib/tools/pregnancy";

const MESSAGES: Record<PregnancyOutcome, { title: string; text: string; tone: "ok" | "wait" | "alert" | "idle" }> = {
  incomplet: { title: "Réponds aux questions", text: "Un seul « oui » suffit pour avoir une réponse.", tone: "idle" },
  "peut-commencer": {
    title: "Tu peux commencer maintenant",
    text: "Tu peux commencer une méthode hormonale (pilule, injectable, pilule minidosée) tout de suite, sans attendre tes règles, si tu n'as pas de signes de grossesse. Va au centre de santé ou en pharmacie.",
    tone: "ok",
  },
  attendre: {
    title: "Une grossesse n'est pas exclue",
    text: "Attends tes prochaines règles (sans rapport sexuel, ou avec un préservatif), ou fais un test de grossesse avant de commencer.",
    tone: "wait",
  },
  signes: {
    title: "Fais un test de grossesse",
    text: "Ces signes peuvent venir d'une grossesse. Fais un test (pharmacie ou centre de santé). Si le test est positif ou si tu as un doute, va vite dans un centre de santé : plus on est suivie tôt, mieux c'est.",
    tone: "alert",
  },
};

// Liste de contrôle du guide OMS : « Puis-je commencer une méthode aujourd'hui ? »
export default function PregnancyCheck() {
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>({});
  const [signs, setSigns] = useState(false);
  const outcome = evaluatePregnancy(answers, signs);
  const message = MESSAGES[outcome];

  return (
    <div className="tool">
      <p className="muted">
        Tu veux commencer une méthode hormonale et tes règles ne sont pas là ? Ces six questions de l'OMS aident à être presque sûre de ne pas être enceinte.
      </p>

      <div className={`tool-verdict tool-verdict-top verdict-${message.tone}`} role="status" aria-live="polite">
        <strong>{message.title}</strong>
        <p>{message.text}</p>
      </div>

      <ol className="checks">
        {PREGNANCY_QUESTIONS.map((question) => (
          <li key={question.id}>
            <p>{question.text}</p>
            <div className="yesno" role="group" aria-label={question.text}>
              <button type="button" className={answers[question.id] === true ? "on" : ""} aria-pressed={answers[question.id] === true} onClick={() => setAnswers({ ...answers, [question.id]: true })}>
                Oui
              </button>
              <button type="button" className={answers[question.id] === false ? "on" : ""} aria-pressed={answers[question.id] === false} onClick={() => setAnswers({ ...answers, [question.id]: false })}>
                Non
              </button>
            </div>
          </li>
        ))}
      </ol>

      <label className="check-line">
        <input type="checkbox" checked={signs} onChange={(event) => setSigns(event.target.checked)} />
        <span>J'ai des signes qui peuvent venir d'une grossesse (retard de règles, nausées, seins douloureux…)</span>
      </label>

      <details className="signs">
        <summary>Les signes d'une grossesse</summary>
        <p>
          <strong>Au début :</strong> {PREGNANCY_SIGNS.precoces.join(", ").toLowerCase()}.
        </p>
        <p>
          <strong>Plus tard :</strong> {PREGNANCY_SIGNS.tardifs.join(", ").toLowerCase()}.
        </p>
      </details>

      <div className="row">
        <Link className="chip-btn" href="/apprendre?sujet=grossesse">
          <Icon name="heart" size={18} />
          Retard de règles et grossesse
        </Link>
        <Link className="chip-btn" href="/orientation">
          <Icon name="pin" size={18} />
          Trouver un centre
        </Link>
      </div>
      <p className="muted tool-source">Source : Guide de la planification familiale de l'OMS (2012), p. 20. Brouillon en cours de validation.</p>
    </div>
  );
}

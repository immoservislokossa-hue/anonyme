"use client";

import { useState } from "react";
import { REVIEW_QUESTIONS, type ReviewKey } from "@/lib/services";

type Answer = boolean | undefined;

// Avis anonyme après une visite : six questions oui/non, aucun texte libre, aucun nom.
export default function ReviewForm({ serviceId }: { serviceId: string }) {
  const [answers, setAnswers] = useState<Partial<Record<ReviewKey, Answer>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const answered = Object.values(answers).filter((v) => v !== undefined).length;

  async function send() {
    setState("sending");
    const response = await fetch("/api/avis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, answers }),
    }).catch(() => null);
    if (response && (response.ok || response.status === 204)) {
      setState("done");
      return;
    }
    const data = (await response?.json().catch(() => null)) as { error?: string } | null;
    setMessage(data?.error ?? "L'avis n'a pas pu être envoyé. Réessaie plus tard.");
    setState("error");
  }

  if (state === "done") return <p className="panel" role="status">Merci. Ton avis est anonyme et aide les autres jeunes.</p>;

  return (
    <section className="panel" aria-labelledby="donner">
      <h2 id="donner">Tu es allé(e) ici ? Donne ton avis</h2>
      <p className="muted">Anonyme. Réponds seulement aux questions que tu veux.</p>
      <ul className="review-list">
        {REVIEW_QUESTIONS.map((q) => (
          <li key={q.id}>
            <span>{q.label}</span>
            <span className="opts inline">
              <button type="button" className={`opt${answers[q.id] === true ? " on" : ""}`} aria-pressed={answers[q.id] === true} onClick={() => setAnswers({ ...answers, [q.id]: true })}>
                Oui
              </button>
              <button type="button" className={`opt${answers[q.id] === false ? " on" : ""}`} aria-pressed={answers[q.id] === false} onClick={() => setAnswers({ ...answers, [q.id]: false })}>
                Non
              </button>
            </span>
          </li>
        ))}
      </ul>
      {state === "error" && <p className="notice alert">{message}</p>}
      <button type="button" className="btn primary" disabled={answered === 0 || state === "sending"} onClick={send}>
        Envoyer mon avis
      </button>
    </section>
  );
}

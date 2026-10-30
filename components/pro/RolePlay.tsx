"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBilan } from "@/components/pro/useBilan";
import { recordTraining } from "@/lib/pro/consultation";
import { SCENARIOS, TONE_LABEL, resultOf, type Scenario, type Tone } from "@/lib/pro/scenarios";

type Turn = { role: "user" | "assistant"; content: string };

// Entraînement en trois temps : un faux client, trois façons de répondre, un retour fondé sur le guide OMS.
export default function RolePlay({ scenario }: { scenario: Scenario }) {
  const { bilan, save } = useBilan();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [tones, setTones] = useState<Tone[]>([]);
  const [saved, setSaved] = useState(false);
  const finished = tones.length === scenario.etapes.length && picked === null;
  const step = scenario.etapes[index];
  const result = resultOf(tones);

  useEffect(() => {
    if (finished && !saved) {
      save(recordTraining(bilan, result.points, result.max));
      setSaved(true);
    }
    // Le bilan est enregistré une seule fois par exercice terminé.
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    setTones([...tones, step.options[i].ton]);
  }

  function next() {
    setPicked(null);
    if (index + 1 < scenario.etapes.length) setIndex(index + 1);
  }

  function again() {
    setIndex(0);
    setPicked(null);
    setTones([]);
    setSaved(false);
  }

  if (finished) {
    const others = SCENARIOS.filter((s) => s.id !== scenario.id);
    return (
      <div className="tool-result" role="status">
        <h2>
          Résultat : {result.points} sur {result.max}
        </h2>
        <p className="lede">
          {result.level === "solide" ? "Très bon accueil." : result.level === "en-progres" ? "Bon début, un peu de chaleur en plus." : "À retravailler : relis les retours ci-dessous."}
        </p>
        <h3>À retenir</h3>
        <ul className="plain">
          {scenario.retenir.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="row">
          <button type="button" className="btn primary" onClick={again}>
            Refaire
          </button>
          <Link className="btn ghost" href={`/prestataires/entrainement/${others[0].id}`}>
            Situation suivante
          </Link>
          <Link className="btn ghost" href="/prestataires/bilan">
            Mon bilan
          </Link>
        </div>
        <FreePractice scenario={scenario} />
      </div>
    );
  }

  return (
    <div className="tool">
      <p className="muted">
        {scenario.qui}. {scenario.contexte}
      </p>
      <p className="rp-progress">
        Étape {index + 1} sur {scenario.etapes.length}
      </p>
      <blockquote className="client-line">« {step.client} »</blockquote>
      <p className="muted">Que réponds-tu ?</p>
      <ul className="rp-choices">
        {step.options.map((option, i) => {
          const chosen = picked === i;
          return (
            <li key={option.texte}>
              <button type="button" className={`rp-choice${chosen ? ` picked tone-${option.ton}` : ""}`} onClick={() => choose(i)} disabled={picked !== null && !chosen} aria-pressed={chosen}>
                {option.texte}
              </button>
              {chosen && (
                <p className={`feedback-line tone-${option.ton}`} role="status">
                  <strong>{TONE_LABEL[option.ton]}.</strong> {option.retour}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <>
          <details className="know">
            <summary>Voir la réponse la plus accueillante</summary>
            <p>{step.options.find((o) => o.ton === "accueillant")?.texte}</p>
          </details>
          <button type="button" className="btn primary" onClick={next}>
            {index + 1 < scenario.etapes.length ? "Étape suivante" : "Voir mon résultat"}
          </button>
        </>
      )}
    </div>
  );
}

// Pratique libre avec l'IA : elle joue le client et un coach commente. Disponible seulement si un modèle est configuré.
function FreePractice({ scenario }: { scenario: Scenario }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [history, setHistory] = useState<Turn[]>([]);
  const [coach, setCoach] = useState("");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/pratique")
      .then((r) => r.json())
      .then((d: { available?: boolean }) => setAvailable(Boolean(d.available)))
      .catch(() => setAvailable(false));
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: Turn[] = [...history, { role: "user", content: text }];
    setHistory(next);
    setInput("");
    setBusy(true);
    setError("");
    const response = await fetch("/api/pratique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId: scenario.id, history: next }),
    }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as { client?: string; coach?: string; error?: string } | null;
    if (!response?.ok || !data?.client) {
      setError("L'IA ne répond pas. Réessaie ou reste sur les situations guidées.");
    } else {
      setHistory([...next, { role: "assistant", content: data.client }]);
      setCoach(data.coach ?? "");
    }
    setBusy(false);
  }

  if (available === null) return null;
  if (!available) {
    return <p className="muted">Pratique libre avec l'IA : disponible quand un modèle d'IA est configuré. Les situations guidées marchent sans connexion.</p>;
  }

  return (
    <section className="panel" aria-label="Pratique libre avec l'IA">
      <h3>Continue librement avec l'IA</h3>
      <p className="muted">L'IA joue {scenario.qui}. Écris ce que tu dirais. Un coach commente ton accueil. C'est un entraînement : aucun vrai client.</p>
      <ul className="stack">
        {history.map((t, i) => (
          <li key={i} className={`bubble ${t.role === "user" ? "user" : "bot"}`}>
            {t.content}
          </li>
        ))}
      </ul>
      {coach && <p className="notice">Coach : {coach}</p>}
      {error && <p className="notice alert">{error}</p>}
      <div className="field">
        <label htmlFor="pratique">Ta réponse</label>
        <textarea id="pratique" rows={2} maxLength={500} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <button type="button" className="btn primary" disabled={busy || input.trim().length === 0} onClick={send}>
        Envoyer
      </button>
    </section>
  );
}

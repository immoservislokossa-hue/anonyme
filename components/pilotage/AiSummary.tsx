"use client";

import { useState } from "react";

// Synthèse pour la réunion : écrite par l'IA à partir des chiffres agrégés seulement, ou par des règles si l'IA est indisponible.
export default function AiSummary() {
  const [text, setText] = useState<string[] | null>(null);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const response = await fetch("/api/pilotage/synthese", { method: "POST" }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as { lignes?: string[]; source?: string } | null;
    setText(data?.lignes ?? ["Synthèse indisponible."]);
    setSource(data?.source === "ia" ? "Rédigée par l'IA à partir des chiffres agrégés. À relire." : "Générée par des règles simples (IA non configurée).");
    setBusy(false);
  }

  return (
    <section className="panel" aria-labelledby="synthese">
      <h2 id="synthese">Synthèse pour la réunion</h2>
      {text ? (
        <>
          <ul className="plain">
            {text.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="muted">{source}</p>
        </>
      ) : (
        <button type="button" className="btn primary" disabled={busy} onClick={run}>
          Générer la synthèse
        </button>
      )}
    </section>
  );
}

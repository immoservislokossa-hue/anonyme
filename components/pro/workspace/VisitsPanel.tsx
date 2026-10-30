"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/pro/workspace/Workspace";

// Visites : le jeune montre son code, le service le saisit. Pas de nom.
export default function VisitsPanel() {
  const { active, setFlag } = useWorkspace();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [recent, setRecent] = useState<{ code: string; besoin: string }[]>([]);

  async function confirm(event: React.FormEvent) {
    event.preventDefault();
    if (!active) return;
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/visites/confirmer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId: active.id, jeton: active.jeton, code }) }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as { besoin?: string; error?: string } | null;
    setBusy(false);
    if (response?.ok) {
      setRecent((r) => [{ code, besoin: data?.besoin ?? "Visite" }, ...r].slice(0, 5));
      setMessage({ ok: true, text: `Visite confirmée. Le jeune vient pour : ${data?.besoin ?? "une visite"}.` });
      setCode("");
      setFlag("visite");
    } else {
      setMessage({ ok: false, text: data?.error ?? "Confirmation impossible. Vérifie le code." });
    }
  }

  if (!active) {
    return (
      <section className="ws-card">
        <h1>Visites</h1>
        <p className="lede">Inscris d'abord ton service pour confirmer des visites.</p>
        <a className="btn primary" href="/prestataires/mon-service/fiche">
          Remplir ma fiche
        </a>
      </section>
    );
  }

  return (
    <>
      <header className="ws-head">
        <h1>Visites</h1>
        <p className="lede">Un jeune te montre un code de 5 signes. Saisis-le : tu vois pourquoi il vient, et la visite est comptée, sans nom.</p>
      </header>
      <form className="ws-card ws-form" onSubmit={confirm}>
        <label className="field">
          <span>Code du jeune</span>
          <input className="ws-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={5} autoComplete="off" inputMode="text" aria-describedby="code-aide" />
        </label>
        <p id="code-aide" className="muted">5 lettres ou chiffres, par exemple K7M2X.</p>
        <div className="ws-actions">
          <button type="submit" className="btn primary" disabled={busy || code.trim().length !== 5}>
            Confirmer la visite
          </button>
        </div>
        {message && (
          <p className={message.ok ? "notice" : "notice alert"} role="status">
            {message.text}
          </p>
        )}
      </form>
      {recent.length > 0 && (
        <section className="ws-card" aria-labelledby="recents">
          <h2 id="recents">Confirmées pendant cette séance</h2>
          <ul className="ws-rows">
            {recent.map((r, i) => (
              <li key={`${r.code}-${i}`}>
                <strong>{r.code}</strong>
                <span className="muted">{r.besoin}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import AccountPanel from "@/components/AccountPanel";

export default function PilotageLogin() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/pilotage/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }).catch(() => null);
    if (response?.ok) {
      window.location.reload();
      return;
    }
    const data = (await response?.json().catch(() => null)) as { error?: string } | null;
    setError(data?.error ?? "Connexion impossible.");
    setBusy(false);
  }

  return (
    <>
    <AccountPanel audience="pilotage" />
    <form className="panel" onSubmit={submit}>
      <h2>Accès par jeton</h2>
      <p className="muted">Pour les responsables de district, les ministères et les partenaires. Demande le jeton d'accès à l'équipe du projet.</p>
      <label className="field">
        <span>Jeton d'accès</span>
        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="off" required />
      </label>
      {error && <p className="notice alert">{error}</p>}
      <div className="row">
        <button type="submit" className="btn primary" disabled={busy}>
          Entrer
        </button>
        <Link className="btn ghost" href="/pilotage/demo">
          Voir la démonstration
        </Link>
      </div>
    </form>
    </>
  );
}

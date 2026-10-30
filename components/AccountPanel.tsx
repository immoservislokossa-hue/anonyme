"use client";

import { useEffect, useState } from "react";

type Me = { enabled: boolean; account: { email: string; role: "prestataire" | "pilotage" } | null };

// Connexion et inscription par e-mail et mot de passe. Les comptes sont créés dans Supabase Auth ; rien n'est affiché si les comptes ne sont pas activés.
export default function AccountPanel({ audience, onChange }: { audience: "prestataire" | "pilotage"; onChange?: (me: Me) => void }) {
  const [me, setMe] = useState<Me | null>(null);
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/compte").catch(() => null);
    const data = (await response?.json().catch(() => null)) as Me | null;
    const next = data ?? { enabled: false, account: null };
    setMe(next);
    onChange?.(next);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/compte", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, email, password }) }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as { error?: string; confirm?: boolean; message?: string } | null;
    setBusy(false);
    if (response?.ok && !data?.confirm) {
      setPassword("");
      await load();
      if (audience === "pilotage") window.location.reload();
      return;
    }
    setMessage(data?.message ?? data?.error ?? "Connexion impossible.");
  }

  async function logout() {
    await fetch("/api/compte", { method: "DELETE" }).catch(() => null);
    await load();
    if (audience === "pilotage") window.location.reload();
  }

  if (!me || !me.enabled) return null;

  if (me.account) {
    const wrongRole = audience === "pilotage" && me.account.role !== "pilotage";
    return (
      <section className="panel" aria-label="Mon compte">
        <p>
          Connecté : <strong>{me.account.email}</strong>
        </p>
        {wrongRole && <p className="notice">Ce compte n'a pas l'accès Pilotage. Il est donné par l'équipe du projet aux ministères, districts et partenaires.</p>}
        <button type="button" className="btn ghost" onClick={logout}>
          Me déconnecter
        </button>
      </section>
    );
  }

  return (
    <form className="panel" onSubmit={submit} aria-label={mode === "connexion" ? "Connexion" : "Créer un compte"}>
      <h2>{mode === "connexion" ? "Me connecter" : "Créer mon compte"}</h2>
      <p className="muted">
        {audience === "pilotage"
          ? "Compte donné par l'équipe aux responsables de district, ministères et partenaires."
          : "Un compte pour gérer ton service : mises à jour, ruptures, visites confirmées. Tes données ne sont jamais montrées aux jeunes."}
      </p>
      <label className="field">
        <span>Adresse e-mail</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </label>
      <label className="field">
        <span>Mot de passe (8 signes au moins)</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "connexion" ? "current-password" : "new-password"} minLength={8} required />
      </label>
      {message && <p role="alert" className="notice alert">{message}</p>}
      <div className="row">
        <button type="submit" className="btn primary" disabled={busy}>
          {mode === "connexion" ? "Me connecter" : "Créer mon compte"}
        </button>
        {audience === "prestataire" && (
          <button type="button" className="btn ghost" onClick={() => setMode(mode === "connexion" ? "inscription" : "connexion")}>
            {mode === "connexion" ? "Je n'ai pas de compte" : "J'ai déjà un compte"}
          </button>
        )}
      </div>
    </form>
  );
}

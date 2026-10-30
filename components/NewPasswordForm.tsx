"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Page ouverte depuis le lien de l'e-mail « mot de passe oublié » : le jeton est dans l'adresse (après le #), il ne part jamais ailleurs.
export default function NewPasswordForm() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setToken(params.get("access_token") ?? "");
    // On efface le jeton de la barre d'adresse.
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    const response = await fetch("/api/compte/mot-de-passe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) }).catch(() => null);
    if (response?.ok) {
      setState("done");
      return;
    }
    const data = (await response?.json().catch(() => null)) as { error?: string } | null;
    setMessage(data?.error ?? "Impossible de changer le mot de passe.");
    setState("error");
  }

  if (state === "done") {
    return (
      <p className="panel" role="status">
        Mot de passe changé. <Link href="/connexion">Me connecter</Link>
      </p>
    );
  }

  if (!token) {
    return (
      <p className="panel">
        Ce lien n'est plus valable. <Link href="/connexion">Demande un nouveau lien</Link> avec « Mot de passe oublié ».
      </p>
    );
  }

  return (
    <form className="panel" onSubmit={submit}>
      <label className="field">
        <span>Nouveau mot de passe (8 signes au moins)</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required />
      </label>
      {state === "error" && <p role="alert" className="notice alert">{message}</p>}
      <button type="submit" className="btn primary" disabled={state === "sending"}>
        Changer mon mot de passe
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { BESOINS, type Besoin } from "@/lib/visits";

// Bon de visite : le jeune dit pourquoi il vient et reçoit un code à montrer à l'accueil. Pas de nom, pas de contact.
export default function VisitVoucher({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
  const [besoin, setBesoin] = useState<Besoin | "">("");
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  async function ask() {
    if (!besoin) return;
    setState("sending");
    const response = await fetch("/api/visites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId, besoin }) }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as { code?: string } | null;
    if (response?.status === 201 && data?.code) {
      setCode(data.code);
      setState("idle");
    } else {
      setState("error");
    }
  }

  if (code) {
    return (
      <section className="panel voucher" aria-labelledby="bon" role="status">
        <h2 id="bon">Ton bon de visite</h2>
        <p className="voucher-code" aria-label={`Code ${code.split("").join(" ")}`}>{code}</p>
        <p>Montre ce code à l'accueil de {serviceName}. Tu n'as pas besoin de donner ton nom.</p>
        <p className="muted">Le service saura seulement pourquoi tu viens. Garde le code : écris-le ou fais une capture d'écran. Il est valable 30 jours.</p>
      </section>
    );
  }

  return (
    <section className="panel" aria-labelledby="venir">
      <h2 id="venir">Je veux y aller</h2>
      <p className="muted">Dis pourquoi tu viens. Tu reçois un code à montrer à l'accueil, sans nom ni numéro.</p>
      <fieldset className="voucher-choices">
        <legend className="sr-only">Pourquoi tu viens</legend>
        {BESOINS.map((b) => (
          <label key={b.id} className="check">
            <input type="radio" name="besoin" value={b.id} checked={besoin === b.id} onChange={() => setBesoin(b.id)} /> {b.label}
          </label>
        ))}
      </fieldset>
      <button type="button" className="btn primary" disabled={!besoin || state === "sending"} onClick={ask}>
        Obtenir mon code
      </button>
      {state === "error" && <p role="alert" className="muted">Le code n'a pas pu être créé. Réessaie dans un moment, ou va directement au service.</p>}
    </section>
  );
}

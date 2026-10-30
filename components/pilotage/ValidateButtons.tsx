"use client";

import { useState } from "react";

export default function ValidateButtons({ id }: { id: string }) {
  const [state, setState] = useState<"idle" | "busy" | "valide" | "refuse" | "error">("idle");

  async function decide(decision: "valide" | "refuse") {
    setState("busy");
    const response = await fetch("/api/pilotage/valider", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, decision }) }).catch(() => null);
    setState(response?.ok ? decision : "error");
  }

  if (state === "valide" || state === "refuse") return <p role="status">{state === "valide" ? "Validé." : "Refusé."}</p>;
  return (
    <div className="row">
      <button type="button" className="btn primary" disabled={state === "busy"} onClick={() => decide("valide")}>
        Valider
      </button>
      <button type="button" className="btn ghost" disabled={state === "busy"} onClick={() => decide("refuse")}>
        Refuser
      </button>
      {state === "error" && <span className="error">Échec, réessaie.</span>}
    </div>
  );
}

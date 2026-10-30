"use client";

import Link from "next/link";
import { useState } from "react";
import { useWorkspace } from "@/components/pro/workspace/Workspace";

// Carte QR : à imprimer et à afficher. Elle n'existe qu'une fois le service validé.
export default function CardPanel() {
  const { service, setFlag } = useWorkspace();
  const [manual, setManual] = useState("");
  const code = service?.code ?? (/^[A-Za-z0-9]{6}$/.test(manual.trim()) ? manual.trim().toUpperCase() : null);
  const valid = service ? service.statut === "valide" : code !== null;

  return (
    <>
      <header className="ws-head">
        <h1>Carte QR</h1>
        <p className="lede">Une carte à imprimer et à afficher. Un jeune qui la scanne arrive sur la page de ton service pour préparer sa visite. Chaque passage est compté, sans identité.</p>
      </header>
      <section className="ws-card">
        {service && service.statut !== "valide" && <p className="notice">Ta carte sera disponible dès que ta fiche sera validée par un responsable.</p>}
        {!service && (
          <label className="field">
            <span>Code du service (6 signes)</span>
            <input value={manual} onChange={(e) => setManual(e.target.value.toUpperCase())} maxLength={6} autoComplete="off" />
          </label>
        )}
        {valid && code && (
          <div className="ws-actions">
            <Link className="btn primary" href={`/prestataires/carte/${code}`} onClick={() => setFlag("carte")}>
              Ouvrir ma carte à imprimer
            </Link>
          </div>
        )}
        {!service && !valid && <p className="muted">Le code s'affiche à l'inscription. Le service doit être validé.</p>}
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useBilan } from "@/components/pro/useBilan";
import { COUNSELING_CHECKS, emptyBilan, qualityRate, toPayload } from "@/lib/pro/consultation";

// Mon bilan : la qualité de mon conseil sur mon téléphone. L'envoi est facultatif, anonyme et remet les compteurs à zéro.
export default function BilanView({ zones }: { zones: string[] }) {
  const { bilan, ready, save } = useBilan();
  const [zone, setZone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  if (!ready) return null;

  async function send() {
    setState("sending");
    const response = await fetch("/api/bilan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(toPayload(bilan, zone || null)) }).catch(() => null);
    if (response && response.status === 204) {
      save(emptyBilan());
      setState("done");
    } else {
      setState("error");
    }
  }

  if (bilan.consultations === 0 && bilan.training.completed === 0) {
    return (
      <p className="panel">
        Ton bilan est vide. Fais une <Link href="/prestataires/consultation">consultation guidée</Link> ou un <Link href="/prestataires/entrainement">entraînement</Link>.
        {state === "done" && " Ton bilan a été envoyé en anonyme, merci."}
      </p>
    );
  }

  return (
    <div className="tool">
      <p className="muted">Depuis le {bilan.since}. {bilan.consultations} consultation{bilan.consultations > 1 ? "s" : ""}, {bilan.training.completed} entraînement{bilan.training.completed > 1 ? "s" : ""}.</p>
      <ul className="stack">
        {COUNSELING_CHECKS.map((c) => {
          const rate = qualityRate(bilan, c.id);
          return (
            <li key={c.id}>
              <div className="row-between">
                <span>{c.label}</span>
                <strong>{rate === null ? "-" : `${rate} %`}</strong>
              </div>
              <div className="bar">
                <span style={{ width: `${rate ?? 0}%` }} />
              </div>
            </li>
          );
        })}
      </ul>

      <section className="panel" aria-labelledby="envoyer">
        <h2 id="envoyer">Envoyer mon bilan en anonyme (facultatif)</h2>
        <p className="muted">Seuls des comptes partent, avec une zone si tu la choisis. Pas de nom, pas de service, rien sur les clients. Les responsables de district voient des totaux, jamais ton bilan seul.</p>
        <label className="field">
          <span>Ma zone (facultatif)</span>
          <select value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="">Je ne dis pas</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        {state === "error" && <p className="notice alert">Envoi impossible pour le moment. Réessaie plus tard (une fois par jour au maximum).</p>}
        <button type="button" className="btn primary" disabled={bilan.consultations === 0 || state === "sending"} onClick={send}>
          Envoyer et remettre à zéro
        </button>
      </section>
    </div>
  );
}

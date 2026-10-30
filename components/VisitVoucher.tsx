"use client";

import { useState } from "react";
import { visitIcs } from "@/lib/reminder";
import { BESOINS, type Besoin } from "@/lib/visits";

// Bon de visite : le jeune dit pourquoi il vient et reçoit un code à montrer à l'accueil. Pas de nom, pas de contact.
export default function VisitVoucher({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
  const [besoin, setBesoin] = useState<Besoin | "">("");
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState("09:00");
  const [neutral, setNeutral] = useState(true);

  function addToCalendar() {
    const ics = visitIcs({ date, time, serviceName, code, neutral, reviewUrl: `${window.location.origin}/orientation/${serviceId}#donner` });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    link.download = "rappel-visite.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  }

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
        <div className="fields">
          <label>
            <span>Quand tu comptes y aller</span>
            <input type="date" value={date} min={tomorrow} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            <span>Heure</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>
        <label className="check-line">
          <input type="checkbox" checked={neutral} onChange={(e) => setNeutral(e.target.checked)} />
          <span>Rappels discrets : le calendrier dit seulement « Rappel santé »</span>
        </label>
        <button type="button" className="btn ghost" onClick={addToCalendar}>
          Me rappeler dans mon calendrier
        </button>
        <p className="muted">Le rappel reste dans ton téléphone : Alviosa ne le voit pas. Un 2ᵉ rappel te propose de donner ton avis le lendemain.</p>
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

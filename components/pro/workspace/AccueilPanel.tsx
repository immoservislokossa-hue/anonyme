"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/pro/workspace/Workspace";
import { ACCUEIL_ITEMS, LEVEL_LABEL, evaluerAccueil, type AccueilId } from "@/lib/pro/accueil";

const KEY = "pro-accueil-v1";

// Mon accueil : dix questions pour savoir où progresser. C'est pour toi : rien n'est envoyé.
export default function AccueilPanel() {
  const { setFlag } = useWorkspace();
  const [yes, setYes] = useState<AccueilId[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as AccueilId[];
      if (Array.isArray(raw)) setYes(raw.filter((id) => ACCUEIL_ITEMS.some((i) => i.id === id)));
    } catch {
      // Rien de gardé.
    }
  }, []);

  function toggle(id: AccueilId) {
    const next = yes.includes(id) ? yes.filter((y) => y !== id) : [...yes, id];
    setYes(next);
    setFlag("accueil");
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Rien de gardé.
    }
  }

  const accueil = evaluerAccueil(yes);

  return (
    <>
      <header className="ws-head">
        <h1>Mon accueil</h1>
        <p className="lede">Dix questions pour savoir où progresser. C'est pour toi : rien n'est envoyé, tout reste sur cet appareil.</p>
      </header>
      <section className="ws-card" aria-label="Questions">
        <ul className="ws-rows ws-checklist">
          {ACCUEIL_ITEMS.map((item) => (
            <li key={item.id}>
              <label className="check">
                <input type="checkbox" checked={yes.includes(item.id)} onChange={() => toggle(item.id)} />
                <span>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
      <section className="ws-card" aria-live="polite">
        <h2>
          {accueil.score} sur {accueil.max} : {LEVEL_LABEL[accueil.level]}
        </h2>
        {accueil.pistes.length > 0 && (
          <>
            <h3>Pistes pour progresser</h3>
            <ul className="plain">
              {accueil.pistes.slice(0, 5).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

"use client";

import { useCallback, useState } from "react";
import Checklist from "@/components/Checklist";
import Reward from "@/components/Reward";
import { useProgress } from "@/components/useProgress";

const STEPS = [
  "J'ai noté mes questions sur un papier",
  "J'ai noté les méthodes que j'ai déjà utilisées",
  "J'ai noté les médicaments que je prends",
  "Je sais si je viens seul(e) ou accompagné(e)",
  "Je sais que je peux demander la confidentialité",
];

export default function VisitPrep() {
  const { progress, update } = useProgress();
  const [reward, setReward] = useState<string | null>(null);
  const clearReward = useCallback(() => setReward(null), []);

  function finish() {
    if (progress.visitPrepared) return;
    update((current) => ({ ...current, visitPrepared: true }));
    setReward("+20 points. Visite préparée");
  }

  return (
    <section className="panel" aria-label="Préparer ma visite">
      <h2>Préparer ma visite</h2>
      <p className="muted" style={{ marginBottom: 12 }}>
        Coche ce qui est prêt. Cette liste reste sur ton téléphone.
      </p>
      <Checklist id="visite" steps={STEPS} />
      <button
        type="button"
        className="btn indigo"
        style={{ marginTop: 14 }}
        onClick={finish}
        disabled={progress.visitPrepared}
      >
        {progress.visitPrepared ? "Visite préparée" : "J'ai préparé ma visite"}
      </button>
      <Reward message={reward} onDone={clearReward} />
    </section>
  );
}

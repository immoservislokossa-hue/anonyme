"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import Checklist from "@/components/Checklist";
import Reward from "@/components/Reward";
import { useProgress } from "@/components/useProgress";

const STEPS = [
  "J'ai réfléchi : est-ce que je veux un enfant bientôt, plus tard, ou pas du tout ?",
  "J'ai noté les méthodes que j'ai déjà utilisées",
  "J'ai noté si j'allaite un bébé de moins de 6 mois",
  "J'ai noté mes problèmes de santé et les médicaments que je prends",
  "Je sais si je veux que ce soit discret (partenaire, parents)",
  "J'ai noté mes inquiétudes sur les IST et le VIH/sida",
  "J'ai noté mes questions sur un papier",
  "Je sais que je peux dire « je veux y réfléchir » et repartir sans rien décider",
  "Je sais que je peux demander la confidentialité et venir accompagné(e)",
  "Je demande où trouver des préservatifs et la pilule d'urgence si besoin",
  "Je demande quand revenir, pour me réapprovisionner ou en cas de problème",
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
      <p className="muted" style={{ marginBottom: 12 }}>
        Pas sûr(e) par où commencer ? <Link href="/outils/choisir">Fais l'outil « Choisir ma méthode »</Link>, puis copie ton résumé pour le montrer au professionnel.
      </p>
      <Checklist id="visite" steps={STEPS} />
      <button
        type="button"
        className="btn primary"
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

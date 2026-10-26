"use client";

import { useCallback, useState } from "react";
import Reward from "@/components/Reward";
import { useProgress } from "@/components/useProgress";

export type QuizItem = {
  id: string;
  voie: string;
  enonce: string;
  reponse: boolean;
  explication: string;
  valide: boolean;
};

export default function Quiz({ items }: { items: QuizItem[] }) {
  const { progress, update } = useProgress();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [reward, setReward] = useState<string | null>(null);
  const clearReward = useCallback(() => setReward(null), []);

  const finished = index >= items.length;
  const item = items[index];

  function choose(value: boolean) {
    if (answer !== null || !item) return;
    setAnswer(value);
    const correct = value === item.reponse;
    // Seule la première réponse à une question compte pour les points.
    const firstTime = progress.quizAnswers[item.id] === undefined;
    if (firstTime) {
      update((current) => ({ ...current, quizAnswers: { ...current.quizAnswers, [item.id]: correct } }));
    }
    if (correct && firstTime) setReward("+10 points. Bonne réponse");
  }

  function next() {
    setAnswer(null);
    setIndex((current) => current + 1);
  }

  function restart() {
    setAnswer(null);
    setIndex(0);
  }

  if (finished) {
    const total = items.filter((entry) => progress.quizAnswers[entry.id] === true).length;
    return (
      <div className="panel">
        <h2>Bravo, vous avez terminé</h2>
        <p>
          {total} bonne{total > 1 ? "s" : ""} réponse{total > 1 ? "s" : ""} sur {items.length}.
        </p>
        <p className="muted" style={{ marginTop: 8 }}>
          Les points ne comptent que la première fois pour chaque question.
        </p>
        <div className="row" style={{ marginTop: 14 }}>
          <button type="button" className="btn" onClick={restart}>
            Recommencer
          </button>
          <a className="btn indigo" href="/chat">
            Poser une question
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bar" aria-hidden="true">
        <span style={{ width: `${(index / items.length) * 100}%` }} />
      </div>
      <p className="muted">
        Question {index + 1} sur {items.length}
      </p>

      <div className="panel">
        <h2>{item.enonce}</h2>
        <div className="row" style={{ marginTop: 14 }}>
          <button
            type="button"
            className={`btn${answer === true ? (item.reponse ? "" : " wrong") : ""}`}
            onClick={() => choose(true)}
            disabled={answer !== null}
          >
            Vrai
          </button>
          <button
            type="button"
            className={`btn${answer === false ? (!item.reponse ? "" : " wrong") : ""}`}
            onClick={() => choose(false)}
            disabled={answer !== null}
          >
            Faux
          </button>
        </div>

        {answer !== null && (
          <div className="feedback" role="status">
            <p>
              <strong>{answer === item.reponse ? "Bonne réponse." : "Pas tout à fait."}</strong>{" "}
              C'est {item.reponse ? "vrai" : "faux"}.
            </p>
            <p style={{ marginTop: 6 }}>{item.explication}</p>
            {!item.valide && <p className="tag" style={{ marginTop: 8 }}>Contenu à valider</p>}
            <button type="button" className="btn indigo" style={{ marginTop: 12 }} onClick={next}>
              {index + 1 === items.length ? "Voir mon résultat" : "Question suivante"}
            </button>
          </div>
        )}
      </div>

      <Reward message={reward} onDone={clearReward} />
    </>
  );
}

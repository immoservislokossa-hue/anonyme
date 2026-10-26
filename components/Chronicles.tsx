"use client";

import { useCallback, useState } from "react";
import Reward from "@/components/Reward";
import Speak from "@/components/Speak";
import { useProgress } from "@/components/useProgress";

export type Chronicle = {
  id: string;
  voie: string;
  titre: string;
  theme: string;
  duree: string;
  texte: string;
  audio: string | null;
  valide: boolean;
};

export default function Chronicles({ items }: { items: Chronicle[] }) {
  const { progress, ready, update } = useProgress();
  const [reward, setReward] = useState<string | null>(null);
  const clearReward = useCallback(() => setReward(null), []);

  const readCount = items.filter((item) => progress.chroniclesRead.includes(item.id)).length;

  function markRead(id: string) {
    if (progress.chroniclesRead.includes(id)) return;
    update((current) => ({ ...current, chroniclesRead: [...current.chroniclesRead, id] }));
    setReward("+15 points. Chronique terminée");
  }

  return (
    <>
      <div className="panel">
        <p>
          <strong>
            {ready ? readCount : 0} chronique{readCount > 1 ? "s" : ""} sur {items.length}
          </strong>{" "}
          terminée{readCount > 1 ? "s" : ""}
        </p>
        <div className="bar" style={{ marginTop: 8 }}>
          <span style={{ width: `${ready && items.length ? (readCount / items.length) * 100 : 0}%` }} />
        </div>
      </div>

      <ul className="stack">
        {items.map((item) => {
          const done = progress.chroniclesRead.includes(item.id);
          return (
            <li key={item.id} className="panel">
              <div className="row-between">
                <h3>{item.titre}</h3>
                {done && <span className="tag vert">Terminée</span>}
              </div>
              <p className="muted">{item.duree}</p>
              <p style={{ margin: "10px 0" }}>{item.texte}</p>
              {!item.valide && <p className="tag">Contenu à valider</p>}
              <div className="row" style={{ marginTop: 12 }}>
                <Speak text={item.texte} audio={item.audio} />
                <button type="button" className="btn" onClick={() => markRead(item.id)} disabled={done}>
                  {done ? "Terminée" : "J'ai terminé"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <Reward message={reward} onDone={clearReward} />
    </>
  );
}

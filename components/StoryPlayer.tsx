"use client";

import { useCallback, useEffect, useState } from "react";
import Reward from "@/components/Reward";
import StoryCards from "@/components/StoryCards";
import StoryCartoon from "@/components/StoryCartoon";
import StoryGame from "@/components/StoryGame";
import { useFormat } from "@/components/useFormat";
import { useProgress } from "@/components/useProgress";
import { FORMATS, type Format, type Story } from "@/lib/stories";

export default function StoryPlayer({ story, requested }: { story: Story; requested: Format | null }) {
  const { format: preferred, ready, choose } = useFormat();
  const { progress, update } = useProgress();
  const [format, setFormat] = useState<Format>(requested ?? "cartes");
  const [reward, setReward] = useState<string | null>(null);
  const clearReward = useCallback(() => setReward(null), []);
  const doneId = `histoire-${story.id}`;

  // Sans format demandé dans le lien, on propose celui que la personne préfère.
  useEffect(() => {
    if (ready && !requested && preferred) setFormat(preferred);
  }, [ready, requested, preferred]);

  const finish = useCallback(() => {
    if (progress.chroniclesRead.includes(doneId)) return;
    update((current) =>
      current.chroniclesRead.includes(doneId) ? current : { ...current, chroniclesRead: [...current.chroniclesRead, doneId] },
    );
    setReward("+15 points. Histoire terminée");
  }, [progress.chroniclesRead, doneId, update]);

  function pick(next: Format) {
    setFormat(next);
    choose(next);
  }

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Choisir le format">
        {FORMATS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={format === item.id}
            className={`tab${format === item.id ? " active" : ""}`}
            onClick={() => pick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="muted">{FORMATS.find((item) => item.id === format)?.hint}</p>

      {format === "cartes" && <StoryCards key="cartes" story={story} onDone={finish} onSwitch={() => pick("jeu")} />}
      {format === "jeu" && <StoryGame key="jeu" story={story} onDone={finish} />}
      {format === "anime" && <StoryCartoon key="anime" story={story} onDone={finish} />}

      {!story.valide && <p className="tag">Contenu à valider par des professionnels de santé</p>}
      <Reward message={reward} onDone={clearReward} />
    </>
  );
}

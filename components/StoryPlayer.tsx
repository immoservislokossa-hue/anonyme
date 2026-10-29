"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import NextEpisode from "@/components/NextEpisode";
import Reward from "@/components/Reward";
import StoryCards from "@/components/StoryCards";
import StoryCartoon from "@/components/StoryCartoon";
import StoryGame from "@/components/StoryGame";
import { useFormat } from "@/components/useFormat";
import { useProgress } from "@/components/useProgress";
import { FORMATS, type Format, type Story } from "@/lib/stories";

export default function StoryPlayer({ story, requested }: { story: Story; requested: Format | null }) {
  const { format: preferred, ready } = useFormat();
  const { progress, update } = useProgress();
  const [format, setFormat] = useState<Format>(requested ?? "anime");
  const [reward, setReward] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const clearReward = useCallback(() => setReward(null), []);
  const doneId = `histoire-${story.id}`;

  // Sans format demandé dans le lien, on propose celui que la personne préfère.
  useEffect(() => {
    if (ready && !requested && preferred) setFormat(preferred);
  }, [ready, requested, preferred]);

  const finish = useCallback(() => {
    setDone(true);
    if (progress.chroniclesRead.includes(doneId)) return;
    update((current) =>
      current.chroniclesRead.includes(doneId) ? current : { ...current, chroniclesRead: [...current.chroniclesRead, doneId] },
    );
    setReward("+15 points. Épisode terminé");
  }, [progress.chroniclesRead, doneId, update]);

  return (
    <>
      <p className="format-line">
        Format : <strong>{FORMATS.find((item) => item.id === format)?.label}</strong>
        <Link className="link-btn" href="/apprendre?onglet=serie#format">
          Changer
        </Link>
      </p>

      {format === "cartes" && <StoryCards key="cartes" story={story} onDone={finish} onSwitch={() => setFormat("jeu")} />}
      {format === "jeu" && <StoryGame key="jeu" story={story} onDone={finish} />}
      {format === "anime" && <StoryCartoon key="anime" story={story} onDone={finish} />}

      {done && <NextEpisode story={story} />}

      {!story.valide && <p className="tag">Contenu à valider par des professionnels de santé</p>}
      <Reward message={reward} onDone={clearReward} />
    </>
  );
}

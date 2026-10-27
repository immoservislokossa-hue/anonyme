"use client";

import { useProgress } from "@/components/useProgress";
import { stories } from "@/lib/stories";

// Avancement affiché sur la carte « Histoires » (calculé sur l'appareil).
export default function LearnCounts() {
  const { progress, ready } = useProgress();
  const done = ready ? stories.filter((story) => progress.chroniclesRead.includes(`histoire-${story.id}`)).length : 0;
  return (
    <span>
      {stories.length} histoires · {done} terminée{done > 1 ? "s" : ""}
    </span>
  );
}

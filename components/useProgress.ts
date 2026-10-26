"use client";

import { useCallback, useEffect, useState } from "react";
import { emptyProgress, parseProgress, registerVisit, type Progress } from "@/lib/progress";

const STORAGE_KEY = "progress-v1";

function read(): Progress {
  try {
    return parseProgress(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return emptyProgress;
  }
}

function write(progress: Progress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Stockage indisponible (navigation privée, par exemple) : la progression reste en mémoire.
  }
}

// La progression vit uniquement sur l'appareil. Elle n'est jamais envoyée au serveur.
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = registerVisit(read());
    write(next);
    setProgress(next);
    setReady(true);
  }, []);

  const update = useCallback((change: (current: Progress) => Progress) => {
    setProgress((current) => {
      const next = change(current);
      write(next);
      return next;
    });
  }, []);

  return { progress, ready, update };
}

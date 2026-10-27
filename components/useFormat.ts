"use client";

import { useCallback, useEffect, useState } from "react";
import { FORMAT_KEY, parseFormat } from "@/lib/format";
import type { Format } from "@/lib/stories";

export function useFormat() {
  const [format, setFormat] = useState<Format | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setFormat(parseFormat(window.localStorage.getItem(FORMAT_KEY)));
    } catch {
      setFormat(null);
    }
    setReady(true);
  }, []);

  const choose = useCallback((next: Format) => {
    setFormat(next);
    try {
      window.localStorage.setItem(FORMAT_KEY, next);
    } catch {
      // Stockage indisponible : le choix vaut pour cette visite seulement.
    }
  }, []);

  return { format, ready, choose };
}

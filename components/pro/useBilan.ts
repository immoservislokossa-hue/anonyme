"use client";

import { useCallback, useEffect, useState } from "react";
import { COUNSELING_CHECKS, emptyBilan, type Bilan } from "@/lib/pro/consultation";

const KEY = "pro-bilan-v1";

function parse(raw: string | null): Bilan {
  const fresh = emptyBilan();
  if (!raw) return fresh;
  try {
    const data = JSON.parse(raw) as Partial<Bilan>;
    if (typeof data.consultations !== "number" || typeof data.checks !== "object" || data.checks === null) return fresh;
    const checks = { ...fresh.checks };
    for (const c of COUNSELING_CHECKS) {
      const value = (data.checks as Record<string, unknown>)[c.id];
      if (typeof value === "number") checks[c.id] = value;
    }
    const t = data.training;
    return {
      consultations: data.consultations,
      checks,
      training: t && typeof t.completed === "number" ? { completed: t.completed, pointsSum: t.pointsSum ?? 0, maxSum: t.maxSum ?? 0 } : fresh.training,
      since: typeof data.since === "string" ? data.since : fresh.since,
    };
  } catch {
    return fresh;
  }
}

// Le bilan reste sur l'appareil du prestataire. Seuls des comptes partent, et seulement s'il choisit de les envoyer.
export function useBilan() {
  const [bilan, setBilan] = useState<Bilan>(emptyBilan());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setBilan(parse(window.localStorage.getItem(KEY)));
    } catch {
      // Stockage indisponible : bilan vide.
    }
    setReady(true);
  }, []);

  const save = useCallback((next: Bilan) => {
    setBilan(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Le bilan reste en mémoire pour cette visite.
    }
  }, []);

  return { bilan, ready, save };
}

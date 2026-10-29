"use client";

import { useCallback, useEffect, useState } from "react";
import { PLAN_KEY, parsePlan, type Plan } from "@/lib/tools/plan";

// Le plan de la personne reste sur son appareil : rien n'est envoyé à un serveur.
export function usePlan() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setPlan(parsePlan(window.localStorage.getItem(PLAN_KEY)));
    } catch {
      setPlan(null);
    }
    setReady(true);
  }, []);

  const save = useCallback((next: Plan | null) => {
    setPlan(next);
    try {
      if (next) window.localStorage.setItem(PLAN_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(PLAN_KEY);
    } catch {
      // Stockage indisponible : le plan vaut pour cette visite seulement.
    }
  }, []);

  return { plan, ready, save };
}

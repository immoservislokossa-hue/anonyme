"use client";

import Link from "next/link";
import { usePlan } from "@/components/usePlan";
import { PLAN_METHODS, statusOf } from "@/lib/tools/plan";

const DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });

// Pour qui a déjà noté sa méthode : la prochaine date, tout de suite sur l'accueil.
export default function MyPlanCard() {
  const { plan, ready } = usePlan();
  if (!ready || !plan) return null;

  const status = statusOf(plan);
  const name = PLAN_METHODS.find((m) => m.id === plan.method)?.name ?? "Ma méthode";
  const alert = status.standing === "trop-tard";
  const soon = status.standing === "bientot" || status.standing === "dans-le-delai";
  const line =
    status.standing === "quotidien"
      ? "Une pilule par jour."
      : status.step
        ? `${status.step.label} : ${DATE.format(status.step.due)}`
        : "";

  return (
    <Link href="/outils/plan" className={`plan-card${alert ? " alert" : soon ? " soon" : ""}`}>
      <span className="plan-kicker">Ma contraception</span>
      <strong>{name}</strong>
      <span>{line}</span>
      {(alert || soon) && <span className="plan-note">{status.message}</span>}
    </Link>
  );
}

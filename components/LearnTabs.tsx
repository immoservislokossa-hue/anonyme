"use client";

import { useEffect, useState, type ReactNode } from "react";

export type LearnTab = "sujets" | "methodes" | "serie";

const TABS: { id: LearnTab; label: string }[] = [
  { id: "sujets", label: "Sujets" },
  { id: "methodes", label: "Méthodes" },
  { id: "serie", label: "La série" },
];

function parse(value: string | null | undefined): LearnTab {
  return TABS.some((tab) => tab.id === value) ? (value as LearnTab) : "sujets";
}

// Un seul espace « Apprendre » avec trois onglets : on ne change plus de page pour passer d'un sujet à l'autre.
export default function LearnTabs({ initial, sujets, methodes, serie }: { initial?: string; sujets: ReactNode; methodes: ReactNode; serie: ReactNode }) {
  const [tab, setTab] = useState<LearnTab>(parse(initial));

  useEffect(() => setTab(parse(initial)), [initial]);

  function choose(next: LearnTab) {
    setTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("onglet", next);
    url.searchParams.delete("sujet");
    window.history.replaceState(null, "", url);
  }

  const panels: Record<LearnTab, ReactNode> = { sujets, methodes, serie };

  return (
    <>
      <div className="learn-tabs" role="tablist" aria-label="Apprendre">
        {TABS.map((item) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            className={tab === item.id ? "on" : ""}
            onClick={() => choose(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {TABS.map((item) => (
        <section key={item.id} id={`panel-${item.id}`} role="tabpanel" aria-labelledby={`tab-${item.id}`} hidden={tab !== item.id} className="learn-panel">
          {panels[item.id]}
        </section>
      ))}
    </>
  );
}

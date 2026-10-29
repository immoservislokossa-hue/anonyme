"use client";

import { useEffect, useState, type ReactNode } from "react";

export type LearnTab = "sujets" | "outils" | "methodes" | "serie";

const TABS: { id: LearnTab; label: string }[] = [
  { id: "sujets", label: "Sujets" },
  { id: "outils", label: "Outils" },
  { id: "methodes", label: "Méthodes" },
  { id: "serie", label: "Série" },
];

function parse(value: string | null | undefined): LearnTab {
  return TABS.some((tab) => tab.id === value) ? (value as LearnTab) : "sujets";
}

// Un seul espace « Apprendre » avec trois onglets : on ne change plus de page pour passer d'un sujet à l'autre.
export default function LearnTabs({ initial, sujets, outils, methodes, serie }: { initial?: string; sujets: ReactNode; outils: ReactNode; methodes: ReactNode; serie: ReactNode }) {
  const [tab, setTab] = useState<LearnTab>(parse(initial));

  useEffect(() => setTab(parse(initial)), [initial]);

  // Un lien vers une méthode (#implants) ouvre l'onglet Méthodes et déplie la fiche.
  useEffect(() => {
    function openFromHash() {
      const id = window.location.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target instanceof HTMLDetailsElement && target.classList.contains("method")) {
        setTab("methodes");
        window.requestAnimationFrame(() => {
          target.open = true;
          target.scrollIntoView({ block: "start" });
        });
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  function choose(next: LearnTab) {
    setTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("onglet", next);
    url.searchParams.delete("sujet");
    url.searchParams.delete("outil");
    window.history.replaceState(null, "", url);
  }

  const panels: Record<LearnTab, ReactNode> = { sujets, outils, methodes, serie };

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

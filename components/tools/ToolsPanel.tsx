"use client";

import { useEffect, useState } from "react";
import CycleTool from "@/components/tools/CycleTool";
import MethodChooser from "@/components/tools/MethodChooser";
import MethodHelp, { type HelpMethod } from "@/components/tools/MethodHelp";
import PregnancyCheck from "@/components/tools/PregnancyCheck";
import Icon, { type IconName } from "@/components/Icon";

export type ToolId = "choisir" | "commencer" | "cycle" | "souci";

const TOOLS: { id: ToolId; title: string; text: string; time: string; icon: IconName }[] = [
  { id: "choisir", title: "Choisir ma méthode", text: "Quelques questions, une liste de méthodes à discuter.", time: "2 minutes", icon: "check" },
  { id: "commencer", title: "Puis-je commencer aujourd'hui ?", text: "Être presque sûre de ne pas être enceinte.", time: "1 minute", icon: "heart" },
  { id: "cycle", title: "Mon cycle", text: "Voir mes jours fertiles (méthode des jours fixes).", time: "1 minute", icon: "sun" },
  { id: "souci", title: "J'ai un souci avec ma méthode", text: "Oubli, retard, effets gênants, changer.", time: "1 minute", icon: "alert" },
];

export function parseTool(value: string | null | undefined): ToolId | null {
  return TOOLS.some((tool) => tool.id === value) ? (value as ToolId) : null;
}

// Quatre outils tirés du guide de l'OMS : un seul ouvert à la fois.
export default function ToolsPanel({ methods, open }: { methods: HelpMethod[]; open?: string }) {
  const [current, setCurrent] = useState<ToolId | null>(parseTool(open));

  useEffect(() => setCurrent(parseTool(open)), [open]);

  return (
    <div className="topics">
      <p className="muted">Des outils pratiques, construits à partir du guide de la planification familiale de l'OMS. Ils t'aident à préparer ta visite, ils ne remplacent pas un professionnel.</p>
      <ul className="topic-list">
        {TOOLS.map((tool) => {
          const isOpen = current === tool.id;
          return (
            <li key={tool.id} id={`outil-${tool.id}`}>
              <button type="button" className="topic-head" aria-expanded={isOpen} onClick={() => setCurrent(isOpen ? null : tool.id)}>
                <span className="topic-icon">
                  <Icon name={tool.icon} size={22} />
                </span>
                <span className="topic-text">
                  <strong>{tool.title}</strong>
                  <span>
                    {tool.text} · {tool.time}
                  </span>
                </span>
                <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={isOpen ? "m6 15 6-6 6 6" : "m9 5 7 7-7 7"} />
                </svg>
              </button>
              {isOpen && (
                <div className="topic-body">
                  {tool.id === "choisir" && <MethodChooser />}
                  {tool.id === "commencer" && <PregnancyCheck />}
                  {tool.id === "cycle" && <CycleTool />}
                  {tool.id === "souci" && <MethodHelp methods={methods} />}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

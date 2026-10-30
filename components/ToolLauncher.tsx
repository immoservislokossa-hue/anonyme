"use client";

import { useRef, useState } from "react";
import CycleTool from "@/components/tools/CycleTool";
import MethodChooser from "@/components/tools/MethodChooser";
import MethodHelp, { type HelpMethod } from "@/components/tools/MethodHelp";
import PlanTool from "@/components/tools/PlanTool";
import PregnancyCheck from "@/components/tools/PregnancyCheck";
import RiskTool from "@/components/tools/RiskTool";
import TalkTool from "@/components/tools/TalkTool";
import VisitTool from "@/components/tools/VisitTool";
import type { ToolId } from "@/lib/catalog";

// Le grand bouton « Commencer », puis l'outil lui-même, sur sa propre page.
export default function ToolLauncher({ id, methods, minutes }: { id: ToolId; methods: HelpMethod[]; minutes: number }) {
  const [started, setStarted] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  function start() {
    setStarted(true);
    window.requestAnimationFrame(() => box.current?.scrollIntoView({ block: "start", behavior: "smooth" }));
  }

  return (
    <div ref={box} className="launcher" id="outil">
      {!started ? (
        <div className="launcher-cta">
          <button type="button" className="btn primary big" onClick={start}>
            Commencer · {minutes} min
          </button>
          <p className="muted">Tes réponses ne sont pas envoyées : elles restent sur ton téléphone.</p>
        </div>
      ) : (
        <div className="launcher-tool">
          {id === "risque" && <RiskTool />}
          {id === "choisir" && <MethodChooser />}
          {id === "commencer" && <PregnancyCheck />}
          {id === "plan" && <PlanTool />}
          {id === "cycle" && <CycleTool />}
          {id === "souci" && <MethodHelp methods={methods} />}
          {id === "visite" && <VisitTool />}
          {id === "parler" && <TalkTool />}
        </div>
      )}
    </div>
  );
}

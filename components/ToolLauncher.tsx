"use client";

import CycleTool from "@/components/tools/CycleTool";
import MethodChooser from "@/components/tools/MethodChooser";
import MethodHelp, { type HelpMethod } from "@/components/tools/MethodHelp";
import PlanTool from "@/components/tools/PlanTool";
import PregnancyCheck from "@/components/tools/PregnancyCheck";
import RiskTool from "@/components/tools/RiskTool";
import TalkTool from "@/components/tools/TalkTool";
import VisitTool from "@/components/tools/VisitTool";
import type { ToolId } from "@/lib/catalog";

// L'outil s'affiche tout de suite, sans bouton intermédiaire : un clic de moins.
export default function ToolLauncher({ id, methods }: { id: ToolId; methods: HelpMethod[] }) {
  return (
    <div className="launcher" id="outil">
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
    </div>
  );
}

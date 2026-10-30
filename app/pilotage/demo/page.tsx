import type { Metadata } from "next";
import Dashboard from "@/components/pilotage/Dashboard";
import { demoDataset } from "@/lib/demo";

export const metadata: Metadata = { title: "Pilotage : démonstration" };
export const dynamic = "force-dynamic";

export default function DemoPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Démonstration publique</p>
        <h1>Tableau de bord (exemple)</h1>
        <p className="lede">Voici ce que voit un responsable de district. Les données sont fabriquées pour la démonstration.</p>
      </header>
      <Dashboard ds={demoDataset()} />
    </>
  );
}

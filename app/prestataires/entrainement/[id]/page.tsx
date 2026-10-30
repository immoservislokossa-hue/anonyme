import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import RolePlay from "@/components/pro/RolePlay";
import { SCENARIOS, getScenario } from "@/lib/pro/scenarios";

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getScenario(id)?.titre ?? "Entraînement" };
}

export default async function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) notFound();
  return (
    <>
      <Crumbs trail={[{ href: "/prestataires", label: "Prestataires" }, { href: "/prestataires/entrainement", label: "Entraînement" }]} current={scenario.titre} />
      <header>
        <h1>{scenario.titre}</h1>
      </header>
      <RolePlay scenario={scenario} />
    </>
  );
}

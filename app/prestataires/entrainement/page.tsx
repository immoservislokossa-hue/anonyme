import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import RowList from "@/components/RowList";
import { SCENARIOS } from "@/lib/pro/scenarios";

export const metadata: Metadata = { title: "Entraînement" };

export default function EntrainementPage() {
  return (
    <>
      <Crumbs trail={[{ href: "/prestataires", label: "Prestataires" }]} current="Entraînement" />
      <header>
        <h1>Entraînement avec de faux clients</h1>
        <p className="lede">Trois réponses possibles à chaque étape, un retour tout de suite. Dix minutes par situation. Marche sans connexion.</p>
      </header>
      <RowList rows={SCENARIOS.map((s) => ({ href: `/prestataires/entrainement/${s.id}`, title: s.titre, text: s.contexte }))} label="Situations" />
    </>
  );
}

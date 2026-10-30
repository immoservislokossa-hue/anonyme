import ProviderGate from "@/components/ProviderGate";
import type { Metadata } from "next";
import Chat from "@/components/Chat";
import Crumbs from "@/components/Crumbs";

export const metadata: Metadata = { title: "Assistant OMS" };

const TIPS = [
  "Que dire à une jeune qui demande la pilule sans être mariée ?",
  "Quels problèmes de santé excluent la pilule ?",
  "Une cliente a oublié 2 pilules : que faire ?",
  "Injection en retard de 5 semaines : que faire ?",
];

function AssistantPage() {
  return (
    <>
      <Crumbs trail={[{ href: "/prestataires", label: "Prestataires" }]} current="Assistant OMS" />
      <header>
        <h1>Assistant OMS</h1>
        <p className="lede">Réponses courtes tirées du guide de l'OMS. Sans connexion, tu reçois la fiche la plus proche.</p>
      </header>
      <Chat audience="prestataire" tips={TIPS} embedded />
    </>
  );
}

export default function Page() {
  return (
    <ProviderGate>
      <AssistantPage />
    </ProviderGate>
  );
}

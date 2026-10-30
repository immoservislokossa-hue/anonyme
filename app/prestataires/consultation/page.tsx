import ProviderGate from "@/components/ProviderGate";
import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import ConsultationFlow from "@/components/pro/ConsultationFlow";
import { METHODES } from "@/lib/catalog";

export const metadata: Metadata = { title: "Consultation guidée" };

function ConsultationPage() {
  const methods = METHODES.map(({ id, nom, comment, peut_arriver, a_retenir, ou_aller }) => ({ id, nom, comment, peut_arriver, a_retenir, ou_aller }));
  return (
    <>
      <Crumbs trail={[{ href: "/prestataires", label: "Prestataires" }]} current="Consultation guidée" />
      <header>
        <h1>Consultation guidée</h1>
        <p className="lede">Accueillir, écarter une grossesse, proposer des méthodes, vérifier la qualité de ton conseil. Rien sur le client n'est enregistré.</p>
      </header>
      <ConsultationFlow methods={methods} />
    </>
  );
}

export default function Page() {
  return (
    <ProviderGate>
      <ConsultationPage />
    </ProviderGate>
  );
}

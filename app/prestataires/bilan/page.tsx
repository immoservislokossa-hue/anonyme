import ProviderGate from "@/components/ProviderGate";
import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import BilanView from "@/components/pro/BilanView";
import { getPays } from "@/lib/pays";

export const metadata: Metadata = { title: "Mon bilan" };

function BilanPage() {
  return (
    <>
      <Crumbs trail={[{ href: "/prestataires", label: "Prestataires" }]} current="Mon bilan" />
      <header>
        <h1>Mon bilan</h1>
        <p className="lede">La part de tes consultations où tu as présenté plusieurs méthodes, expliqué les effets, fixé un retour. Pour progresser.</p>
      </header>
      <BilanView zones={getPays().zones} />
    </>
  );
}

export default function Page() {
  return (
    <ProviderGate>
      <BilanPage />
    </ProviderGate>
  );
}

import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import ServiceManager from "@/components/pro/ServiceManager";
import { getPays } from "@/lib/pays";

export const metadata: Metadata = { title: "Mon service" };

export default function MonServicePage() {
  return (
    <>
      <Crumbs trail={[{ href: "/prestataires", label: "Prestataires" }]} current="Mon service" />
      <header>
        <h1>Mon service</h1>
        <p className="lede">Inscris ton service pour que les jeunes le trouvent, signale les ruptures et vois où progresser dans l'accueil.</p>
      </header>
      <ServiceManager zones={getPays().zones} />
    </>
  );
}

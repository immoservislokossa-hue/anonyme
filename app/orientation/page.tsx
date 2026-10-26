import type { Metadata } from "next";
import Orientation from "@/components/Orientation";
import VisitPrep from "@/components/VisitPrep";
import { structures } from "@/lib/structures";

export const metadata: Metadata = { title: "Trouver un centre" };

export default function OrientationPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Orientation</p>
        <h1>Trouver un centre de santé</h1>
        <p className="lede">
          Voici les structures partenaires. Les informations marquées « À confirmer » doivent être vérifiées avant de
          vous déplacer.
        </p>
      </header>
      <Orientation structures={structures} />
      <VisitPrep />
    </>
  );
}

import type { Metadata } from "next";
import NearbyCentres from "@/components/NearbyCentres";
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
          Cherchez un centre près de vous, ou voyez nos centres partenaires. Les informations marquées « À confirmer »
          doivent être vérifiées avant de vous déplacer.
        </p>
      </header>

      <NearbyCentres />

      <section aria-label="Centres partenaires">
        <h2>Nos centres partenaires</h2>
        <Orientation structures={structures} />
      </section>

      <VisitPrep />
    </>
  );
}

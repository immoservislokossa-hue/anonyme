import type { Metadata } from "next";
import Link from "next/link";
import NearbyCentres from "@/components/NearbyCentres";
import ServiceDirectory from "@/components/ServiceDirectory";
import ZoneChoice from "@/components/ZoneChoice";
import { getPays } from "@/lib/pays";

export const metadata: Metadata = { title: "Trouver un centre" };
export const dynamic = "force-dynamic";

type Search = { zone?: string; methode?: string; accueil?: string };

export default async function OrientationPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { zone, methode, accueil } = await searchParams;
  return (
    <>
      <header>
        <p className="eyebrow">Orientation</p>
        <h1>Trouver un centre de santé</h1>
        <p className="lede">Cherche près de toi, ou vois les services qui accueillent les jeunes. Appelle avant de te déplacer.</p>
        <p>
          <Link className="link-btn" href="/outils/visite">
            Préparer ma visite : les bonnes questions à poser
          </Link>
        </p>
      </header>

      <NearbyCentres />

      <ServiceDirectory zone={zone} methode={methode} accueil={accueil === "1"} />

      <ZoneChoice zones={getPays().zones} />
    </>
  );
}

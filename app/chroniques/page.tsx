import type { Metadata } from "next";
import Chronicles, { type Chronicle } from "@/components/Chronicles";
import VoieTabs from "@/components/VoieTabs";
import chroniclesData from "@/data/chronicles.json";
import { TEAM_NAMES } from "@/lib/brand";
import { isVoie } from "@/lib/domain";

export const metadata: Metadata = { title: "Chroniques" };

const allItems = chroniclesData as Chronicle[];

export default async function ChroniclesPage({ searchParams }: { searchParams: Promise<{ voie?: string }> }) {
  const { voie } = await searchParams;
  const current = isVoie(voie) ? voie : undefined;
  const items = current ? allItems.filter((item) => item.voie === current || item.voie === "commun") : allItems;

  return (
    <>
      <header>
        <p className="eyebrow">Chroniques de {TEAM_NAMES}</p>
        <h1>De courts récits à écouter</h1>
        <p className="lede">
          Chaque chronique prend environ une minute. Appuyez sur « Écouter » pour l'entendre avec la voix de votre
          téléphone.
        </p>
      </header>
      <VoieTabs current={current} basePath="/chroniques" />
      <Chronicles key={current ?? "tout"} items={items} />
    </>
  );
}

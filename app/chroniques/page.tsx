import type { Metadata } from "next";
import Link from "next/link";
import ProgressCard from "@/components/ProgressCard";
import StoriesHub from "@/components/StoriesHub";
import Chronicles, { type Chronicle } from "@/components/Chronicles";
import VoieTabs from "@/components/VoieTabs";
import chroniclesData from "@/data/chronicles.json";
import { TEAM_NAMES } from "@/lib/brand";
import { isVoie } from "@/lib/domain";

export const metadata: Metadata = { title: "Histoires et chroniques" };

const allItems = chroniclesData as Chronicle[];

export default async function ChroniclesPage({ searchParams }: { searchParams: Promise<{ voie?: string }> }) {
  const { voie } = await searchParams;
  const current = isVoie(voie) ? voie : undefined;
  const items = current ? allItems.filter((item) => item.voie === current || item.voie === "commun") : allItems;

  return (
    <>
      <header>
        <p className="eyebrow">Histoires de {TEAM_NAMES}</p>
        <h1>Des histoires à vivre</h1>
        <p className="lede">
          Trois amies parlent de ce qui se passe vraiment dans la vie. Vis l'histoire en images, en faisant tes choix ou en
          dessin animé.
        </p>
      </header>

      <ProgressCard />
      <StoriesHub />

      <p>
        <Link className="btn ghost" href="/quiz">
          Jouer au vrai ou faux
        </Link>
      </p>

      <section aria-label="Chroniques">
        <h2>Chroniques à écouter</h2>
        <p className="muted">
          Des récits d'une minute. Appuyez sur « Écouter » pour les entendre avec la voix de votre téléphone.
        </p>
        <VoieTabs current={current} basePath="/chroniques" />
        <Chronicles key={current ?? "tout"} items={items} />
      </section>
    </>
  );
}

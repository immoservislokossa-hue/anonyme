import type { Metadata } from "next";
import Chronicles, { type Chronicle } from "@/components/Chronicles";
import chroniclesData from "@/data/chronicles.json";
import { ASSISTANT_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "Chroniques" };

const items: Chronicle[] = chroniclesData;

export default function ChroniclesPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Chroniques de {ASSISTANT_NAME}</p>
        <h1>De courts récits à écouter</h1>
        <p className="lede">
          Chaque chronique prend environ une minute. Appuyez sur « Écouter » pour l'entendre avec la voix de votre
          téléphone.
        </p>
      </header>
      <Chronicles items={items} />
    </>
  );
}

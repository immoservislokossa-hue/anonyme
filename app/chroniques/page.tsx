import type { Metadata } from "next";
import Chronicles, { type Chronicle } from "@/components/Chronicles";
import Crumbs from "@/components/Crumbs";
import StoriesHub from "@/components/StoriesHub";
import chroniclesData from "@/data/chronicles.json";

export const metadata: Metadata = { title: "Histoires" };

const items = chroniclesData as Chronicle[];

export default function ChroniclesPage() {
  return (
    <>
      <Crumbs current="Histoires" />
      <header>
        <h1>Histoires</h1>
      </header>

      <StoriesHub />

      <details className="chronicles-more">
        <summary>Chroniques à écouter ({items.length})</summary>
        <Chronicles items={items} />
      </details>
    </>
  );
}

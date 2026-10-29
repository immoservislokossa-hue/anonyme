import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import StoriesHub from "@/components/StoriesHub";

export const metadata: Metadata = { title: "La série" };

export default function SeriePage() {
  return (
    <>
      <Crumbs current="La série" />
      <header>
        <h1>La série</h1>
        <p className="lede">Trois amies, la vie de tous les jours. Chaque épisode finit par une chose à retenir.</p>
      </header>
      <StoriesHub />
    </>
  );
}

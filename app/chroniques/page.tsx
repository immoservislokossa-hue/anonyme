import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import StoriesHub from "@/components/StoriesHub";

export const metadata: Metadata = { title: "La série" };

export default function StoriesPage() {
  return (
    <>
      <Crumbs current="La série" />
      <header>
        <h1>La série</h1>
      </header>

      <StoriesHub />
    </>
  );
}

import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import StoriesHub from "@/components/StoriesHub";

export const metadata: Metadata = { title: "Histoires" };

export default function StoriesPage() {
  return (
    <>
      <Crumbs current="Histoires" />
      <header>
        <h1>Histoires</h1>
      </header>

      <StoriesHub />
    </>
  );
}

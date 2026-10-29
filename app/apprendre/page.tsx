import type { Metadata } from "next";
import LearnTabs from "@/components/LearnTabs";
import Methods from "@/components/Methods";
import StoriesHub from "@/components/StoriesHub";
import Topics from "@/components/Topics";
import { TOPICS, topicViews } from "@/lib/topics";

export const metadata: Metadata = { title: "Apprendre" };

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ onglet?: string; sujet?: string }> }) {
  const { onglet, sujet } = await searchParams;
  const open = TOPICS.some((topic) => topic.id === sujet) ? sujet : undefined;

  return (
    <>
      <header>
        <p className="eyebrow">Planification familiale et santé sexuelle</p>
        <h1>Apprendre</h1>
      </header>

      <LearnTabs
        initial={open ? "sujets" : onglet}
        sujets={<Topics topics={topicViews()} open={open} />}
        methodes={<Methods />}
        serie={<StoriesHub />}
      />
    </>
  );
}

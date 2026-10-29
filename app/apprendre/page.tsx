import type { Metadata } from "next";
import Link from "next/link";
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
        sujets={
          <>
            <Topics topics={topicViews()} open={open} />
            <section className="panel" aria-label="Parler d'autre chose">
              <h3>Parler d'autre chose ?</h3>
              <p className="muted">Fallone écoute ce qui pèse. Chimène aide à retrouver du calme et de l'énergie.</p>
              <div className="row" style={{ marginTop: 12 }}>
                <Link className="chip-btn" href="/chat?voie=mentale">
                  Santé mentale avec Fallone
                </Link>
                <Link className="chip-btn" href="/chat?voie=bien-etre">
                  Bien-être avec Chimène
                </Link>
              </div>
            </section>
          </>
        }
        methodes={<Methods />}
        serie={<StoriesHub />}
      />
    </>
  );
}

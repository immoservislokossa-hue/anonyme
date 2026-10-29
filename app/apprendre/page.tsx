import type { Metadata } from "next";
import Link from "next/link";
import QuickExitButton from "@/components/QuickExit";
import LearnTabs from "@/components/LearnTabs";
import Methods from "@/components/Methods";
import ToolsPanel from "@/components/tools/ToolsPanel";
import methodesData from "@/data/methodes.json";
import StoriesHub from "@/components/StoriesHub";
import Topics from "@/components/Topics";
import { TOPICS, topicViews } from "@/lib/topics";

export const metadata: Metadata = { title: "Apprendre" };

const helpMethods = (methodesData as { id: string; nom: string; comment: string[]; peut_arriver: string[]; a_retenir: string[]; ou_aller: string }[]).map(
  ({ id, nom, comment, peut_arriver, a_retenir, ou_aller }) => ({ id, nom, comment, peut_arriver, a_retenir, ou_aller }),
);

export default async function LearnPage({ searchParams }: { searchParams: Promise<{ onglet?: string; sujet?: string; outil?: string }> }) {
  const { onglet, sujet, outil } = await searchParams;
  const open = TOPICS.some((topic) => topic.id === sujet) ? sujet : undefined;

  return (
    <>
      <header className="learn-head">
        <div>
          <p className="eyebrow">Planification familiale et santé sexuelle</p>
          <h1>Apprendre</h1>
        </div>
        <QuickExitButton />
      </header>

      <LearnTabs
        initial={open ? "sujets" : outil ? "outils" : onglet}
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
        outils={<ToolsPanel methods={helpMethods} open={outil} />}
        methodes={<Methods />}
        serie={<StoriesHub />}
      />
    </>
  );
}

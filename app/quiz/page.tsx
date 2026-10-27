import type { Metadata } from "next";
import Quiz, { type QuizItem } from "@/components/Quiz";
import Crumbs from "@/components/Crumbs";
import VoieTabs from "@/components/VoieTabs";
import quizData from "@/data/quiz.json";
import { isVoie } from "@/lib/domain";

export const metadata: Metadata = { title: "Vrai ou faux" };

const allItems = quizData as QuizItem[];

export default async function QuizPage({ searchParams }: { searchParams: Promise<{ voie?: string }> }) {
  const { voie } = await searchParams;
  const current = isVoie(voie) ? voie : undefined;
  const items = current ? allItems.filter((item) => item.voie === current || item.voie === "commun") : allItems;

  return (
    <>
      <Crumbs current="Vrai ou faux" />
      <header>
        <p className="eyebrow">Quiz</p>
        <h1>Vrai ou faux</h1>
        <p className="lede">{items.length} affirmations fréquentes. Réponds, puis lis l'explication.</p>
      </header>
      <VoieTabs current={current} basePath="/quiz" />
      <Quiz key={current ?? "tout"} items={items} />
    </>
  );
}

import type { Metadata } from "next";
import Quiz, { type QuizItem } from "@/components/Quiz";
import quizData from "@/data/quiz.json";

export const metadata: Metadata = { title: "Vrai ou faux" };

const items: QuizItem[] = quizData;

export default function QuizPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Quiz</p>
        <h1>Vrai ou faux</h1>
        <p className="lede">Six affirmations fréquentes. Répondez, puis lisez l'explication.</p>
      </header>
      <Quiz items={items} />
    </>
  );
}

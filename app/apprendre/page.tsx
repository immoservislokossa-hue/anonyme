import type { Metadata } from "next";
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import LearnCounts from "@/components/LearnCounts";
import methodes from "@/data/methodes.json";
import quiz from "@/data/quiz.json";

export const metadata: Metadata = { title: "Apprendre" };

const entries: { href: string; icon: IconName; title: string; text: string; meta: React.ReactNode; hint?: string }[] = [
  {
    href: "/methodes",
    icon: "shield",
    title: "Les méthodes",
    text: "Comprendre chaque méthode de contraception : comment elle fonctionne, ses effets possibles, ce qu'il faut demander.",
    meta: <span>{methodes.length} méthodes comparées</span>,
    hint: "Pour commencer",
  },
  {
    href: "/chroniques",
    icon: "book",
    title: "Les histoires",
    text: "Trois amies parlent de situations vraies. Choisis ta façon de les vivre : en images, en faisant des choix ou en dessin animé.",
    meta: <LearnCounts />,
  },
  {
    href: "/quiz",
    icon: "quiz",
    title: "Vrai ou faux",
    text: "Teste tes connaissances et démonte les rumeurs en quelques minutes.",
    meta: <span>{quiz.length} affirmations</span>,
  },
];

export default function LearnPage() {
  return (
    <>
      <header>
        <h1>Apprendre</h1>
        <p className="lede">Des informations claires sur la planification familiale, à ton rythme. Choisis par où commencer.</p>
      </header>

      <ul className="learn-list">
        {entries.map((entry) => (
          <li key={entry.href}>
            <Link href={entry.href} className="learn-card">
              <span className="learn-icon">
                <Icon name={entry.icon} size={22} />
              </span>
              <span className="learn-body">
                <span className="learn-title">
                  <strong>{entry.title}</strong>
                  {entry.hint && <em className="learn-hint">{entry.hint}</em>}
                </span>
                <span className="learn-text">{entry.text}</span>
                <span className="learn-meta">{entry.meta}</span>
              </span>
              <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>

      <p className="notice">
        <Icon name="shield" size={18} />
        <span>Contenu en cours de validation par des professionnels de santé.</span>
      </p>
    </>
  );
}

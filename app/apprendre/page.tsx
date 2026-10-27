import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Apprendre" };

const entries = [
  { href: "/methodes", title: "Les méthodes", text: "Comprendre chaque méthode de contraception." },
  { href: "/chroniques", title: "Les histoires", text: "Des situations vraies, à lire ou à regarder." },
];

export default function LearnPage() {
  return (
    <>
      <header>
        <h1>Apprendre</h1>
      </header>

      <ul className="learn-list">
        {entries.map((entry) => (
          <li key={entry.href}>
            <Link href={entry.href} className="learn-card">
              <span className="learn-body">
                <strong>{entry.title}</strong>
                <span>{entry.text}</span>
              </span>
              <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

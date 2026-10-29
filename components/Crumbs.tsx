import Link from "next/link";

type Crumb = { href?: string; label: string };

// Fil d'Ariane : on sait où l'on est et on revient en arrière en un geste.
export default function Crumbs({ current, trail }: { current: string; trail?: Crumb[] }) {
  const parts: Crumb[] = trail ?? [{ href: "/apprendre", label: "Apprendre" }];
  return (
    <nav className="crumbs" aria-label="Fil d'Ariane">
      {parts.map((part) => (
        <span key={part.label} className="crumb">
          {part.href ? <Link href={part.href}>{part.label}</Link> : part.label}
          <span aria-hidden="true">/</span>
        </span>
      ))}
      <span aria-current="page">{current}</span>
    </nav>
  );
}

import Link from "next/link";

// Fil d'Ariane : on sait où l'on est et on revient à « Apprendre » en un geste.
export default function Crumbs({ current }: { current: string }) {
  return (
    <nav className="crumbs" aria-label="Fil d'Ariane">
      <Link href="/apprendre">Apprendre</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

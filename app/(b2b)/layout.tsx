import type { Metadata } from "next";

// Pages destinées aux professionnels et aux partenaires : elles ne sont liées depuis aucun menu public
// et demandent à ne pas être indexées par les moteurs de recherche.
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b2b">
      <p className="b2b-banner">Espace réservé aux professionnels de santé et aux partenaires</p>
      {children}
    </div>
  );
}

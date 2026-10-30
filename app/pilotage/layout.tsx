import type { Metadata } from "next";
import Link from "next/link";

// Espace des décideurs : pas d'indexation par les moteurs de recherche.
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

export default function PilotageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="b2b">
      <div data-space="pilotage" hidden />
      <p className="b2b-banner">Alviosa Pilotage : chiffres anonymes pour agir. Aucun message ni aucune personne n'y apparaît. <Link href="/connexion">Se connecter</Link></p>
      {children}
    </div>
  );
}

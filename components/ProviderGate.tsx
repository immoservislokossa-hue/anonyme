import Link from "next/link";
import { providerAllowed } from "@/lib/gate";

// Réserve une page de l'espace Prestataires aux personnes connectées.
export default async function ProviderGate({ children }: { children: React.ReactNode }) {
  if (await providerAllowed()) return <>{children}</>;
  return (
    <section className="panel" aria-labelledby="reserve">
      <h1 id="reserve">Espace réservé aux professionnels de santé</h1>
      <p className="lede">Connecte-toi ou crée ton compte pour utiliser la consultation guidée, l'entraînement, les aide-mémoire et la gestion de ton service. C'est gratuit.</p>
      <div className="row">
        <Link className="btn primary" href="/connexion">
          Me connecter ou créer un compte
        </Link>
        <Link className="btn ghost" href="/prestataires/offres">
          Voir les offres
        </Link>
      </div>
      <p className="muted">Tu cherches un centre de santé ? Va sur <Link href="/orientation">l'annuaire des services</Link> : il est ouvert à tous.</p>
    </section>
  );
}

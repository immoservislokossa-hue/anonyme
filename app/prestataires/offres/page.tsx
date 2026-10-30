import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";

export const metadata: Metadata = { title: "Offres pour les services" };

const ESSENTIEL = [
  "Inscription dans l'annuaire des services accueillants",
  "Carte avec QR code à afficher",
  "Bons de visite anonymes confirmés à l'accueil",
  "Signal de rupture et de retour de stock",
  "Consultation guidée, aide-mémoire, jeux de rôle",
  "Bilan personnel anonyme",
];

const PRO = [
  "Plusieurs sites et plusieurs comptes d'équipe pour une même structure",
  "Tableau du centre : bons, visites, avis, ruptures, semaine après semaine",
  "Rappels aux jeunes par WhatsApp ou SMS, avec leur accord",
  "Export des données du centre et des codes pour le système d'information sanitaire",
  "Parcours d'entraînement pour l'équipe, avec attestation",
];

export default function OffresPage() {
  return (
    <>
      <Crumbs trail={[{ href: "/prestataires", label: "Prestataires" }]} current="Offres" />
      <header>
        <h1>Une base gratuite, des options pour les structures</h1>
        <p className="lede">Alviosa se prépare à fonctionner comme un service pour les centres de santé, les cliniques et les pharmacies. Voici ce qui est prévu, et ce qui existe déjà.</p>
      </header>

      <section className="panel" aria-labelledby="essentiel">
        <h2 id="essentiel">Essentiel : gratuit, disponible maintenant</h2>
        <ul className="plain">
          {ESSENTIEL.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <Link className="btn primary" href="/prestataires/mon-service">
          Inscrire mon service
        </Link>
      </section>

      <section className="panel" aria-labelledby="pro">
        <h2 id="pro">Pro : prévu, pas encore en vente</h2>
        <ul className="plain">
          {PRO.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="muted">Le paiement par mobile money est prévu après le pilote. Aujourd'hui, rien n'est facturé.</p>
      </section>

      <section className="panel" aria-labelledby="regles">
        <h2 id="regles">Nos règles</h2>
        <ul className="plain">
          <li>Les jeunes ne paient jamais, et n'ont pas besoin de compte.</li>
          <li>Payer ne change pas la place d'un service dans l'annuaire. L'ordre ne dépend ni d'un abonnement ni d'une publicité.</li>
          <li>Seuls les services validés par un responsable apparaissent, abonnés ou non.</li>
          <li>Les données des jeunes restent anonymes. Un abonnement ne donne accès à aucun nom ni contact.</li>
        </ul>
      </section>
    </>
  );
}

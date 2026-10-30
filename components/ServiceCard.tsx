import Link from "next/link";
import { methodLabel, typeLabel, type ReviewSummary, type Service } from "@/lib/services";

// Une carte de service : ce qui est déclaré par le service, et ce que les jeunes en disent (si assez d'avis).
export default function ServiceCard({ service, summary, ruptures = [] }: { service: Service; summary?: ReviewSummary; ruptures?: string[] }) {
  const accueil = summary?.indicators.sansJugement;
  return (
    <article className="panel service-card">
      <div className="row-between">
        <h3>
          <Link href={`/orientation/${service.id}`}>{service.nom}</Link>
        </h3>
        <span className="tag">{typeLabel(service.type)}</span>
      </div>
      <p className="muted">
        {service.commune} · {service.zone}
      </p>
      <ul className="pills" aria-label="Méthodes proposées">
        {service.methodes.map((m) => (
          <li key={m}>{methodLabel(m)}</li>
        ))}
      </ul>
      <ul className="service-flags">
        {service.accueilJeunes && <li>Accueil des jeunes (déclaré)</li>}
        {service.confidentialite && <li>Confidentialité assurée (déclaré)</li>}
        {service.gratuitJeunes === "oui" && <li>Gratuit pour les jeunes (déclaré)</li>}
        {accueil?.pct != null && <li className="ok">{accueil.pct} % des jeunes se sont sentis accueillis sans jugement</li>}
        {ruptures.length > 0 && <li className="warn">Rupture signalée : {ruptures.join(", ")}</li>}
      </ul>
      {service.telephone && (
        <p>
          <a className="btn ghost" href={`tel:${service.telephone.replace(/[^\d+]/g, "")}`}>
            Appeler {service.telephone}
          </a>
        </p>
      )}
    </article>
  );
}

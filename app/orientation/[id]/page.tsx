import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import ReviewForm from "@/components/ReviewForm";
import ServiceCard from "@/components/ServiceCard";
import { getService, stockFor, summaryFor } from "@/lib/directory";
import { MIN_REVIEWS, REVIEW_QUESTIONS, isStale, methodLabel } from "@/lib/services";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Service" };

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service || service.statut !== "valide") notFound();
  const [summary, stock] = await Promise.all([summaryFor(id), stockFor(id)]);
  const ruptures = stock.filter((s) => s.etat === "rupture" && !isStale(s)).map((s) => methodLabel(s.methode));

  return (
    <article>
      <Crumbs trail={[{ href: "/orientation", label: "Centres" }]} current={service.nom} />
      <ServiceCard service={service} summary={summary} ruptures={ruptures} />
      {service.horaires && (
        <p>
          <strong>Horaires :</strong> {service.horaires}
        </p>
      )}
      {service.adresse && (
        <p>
          <strong>Adresse :</strong> {service.adresse}
        </p>
      )}

      <section className="panel" aria-labelledby="avis">
        <h2 id="avis">Ce que disent les jeunes</h2>
        {summary.enough ? (
          <ul className="plain">
            {REVIEW_QUESTIONS.map((q) => {
              const ind = summary.indicators[q.id];
              return ind.pct === null ? null : (
                <li key={q.id}>
                  {q.label} : <strong>{ind.pct} %</strong> <span className="muted">({ind.total} avis)</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted">Pas encore assez d'avis ({summary.n} sur {MIN_REVIEWS}) pour afficher des chiffres. Cela protège les personnes qui répondent.</p>
        )}
      </section>

      <ReviewForm serviceId={service.id} />
      <p className="muted">
        Un problème avec ce service ? <Link href="/aide">Voir l'aide</Link>.
      </p>
    </article>
  );
}

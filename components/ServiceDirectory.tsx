import ServiceCard from "@/components/ServiceCard";
import { stockFor, summaryFor, validatedServices } from "@/lib/directory";
import { getPays } from "@/lib/pays";
import { METHOD_LIST, isStale, methodLabel, summarizeReviews } from "@/lib/services";

// L'annuaire des services validés, avec un filtre simple par zone et par méthode.
export default async function ServiceDirectory({ zone, methode, accueil }: { zone?: string; methode?: string; accueil?: boolean }) {
  const pays = getPays();
  let services: Awaited<ReturnType<typeof validatedServices>> = [];
  let down = false;
  try {
    services = await validatedServices({ zone, methode, accueilJeunes: accueil });
  } catch {
    down = true;
  }
  const cards = await Promise.all(
    services.map(async (service) => {
      const [summary, stock] = await Promise.all([summaryFor(service.id), stockFor(service.id)]).catch(() => [summarizeReviews([]), []] as [ReturnType<typeof summarizeReviews>, never[]]);
      const ruptures = stock.filter((s) => s.etat === "rupture" && !isStale(s)).map((s) => methodLabel(s.methode));
      return { service, summary, ruptures };
    }),
  );

  return (
    <section aria-labelledby="annuaire">
      <h2 id="annuaire">Services qui accueillent les jeunes</h2>
      <form method="get" className="svc-filters" action="/orientation">
        <label>
          Zone
          <select name="zone" defaultValue={zone ?? ""}>
            <option value="">Toutes</option>
            {pays.zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        <label>
          Méthode
          <select name="methode" defaultValue={methode ?? ""}>
            <option value="">Toutes</option>
            {METHOD_LIST.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" name="accueil" value="1" defaultChecked={accueil} /> Accueil des jeunes déclaré
        </label>
        <button type="submit" className="btn primary">
          Chercher
        </button>
      </form>

      {down ? (
        <p className="panel" role="status">
          La liste des services ne répond pas pour le moment. Réessaie dans quelques minutes, ou va au centre de santé le plus proche.
        </p>
      ) : cards.length === 0 ? (
        <p className="panel">
          Aucun service validé ne correspond pour l'instant. Les services s'inscrivent eux-mêmes puis sont validés : cette liste va grandir.
          En attendant, cherche un centre près de toi avec la carte ci-dessus, ou va au centre de santé le plus proche.
        </p>
      ) : (
        <ul className="stack cols">
          {cards.map(({ service, summary, ruptures }) => (
            <li key={service.id}>
              <ServiceCard service={service} summary={summary} ruptures={ruptures} />
            </li>
          ))}
        </ul>
      )}
      <p className="muted">
        Les informations sont déclarées par les services puis validées par un responsable. Appelle avant de te déplacer. Les avis des jeunes sont
        anonymes et n'apparaissent qu'à partir de 5 avis.
      </p>
    </section>
  );
}

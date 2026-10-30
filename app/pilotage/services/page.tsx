import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { typeLabel, methodLabel } from "@/lib/services";
import { allServices } from "@/lib/directory";
import { sessionAccess } from "@/lib/pilotageData";

export const metadata: Metadata = { title: "Pilotage : services" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  if ((await sessionAccess()) !== "ok") redirect("/pilotage");
  const services = (await allServices()).sort((a, b) => a.zone.localeCompare(b.zone) || a.nom.localeCompare(b.nom));
  return (
    <>
      <header>
        <h1>Services inscrits</h1>
        <p className="lede">{services.length} service{services.length > 1 ? "s" : ""}, toutes zones et tous statuts.</p>
      </header>
      {services.length === 0 ? (
        <p className="panel">Aucun service inscrit. Les services s'inscrivent dans Alviosa Prestataires.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Type</th>
                <th scope="col">Zone</th>
                <th scope="col">Méthodes</th>
                <th scope="col">Jeunes</th>
                <th scope="col">Statut</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <th scope="row">{s.nom}</th>
                  <td>{typeLabel(s.type)}</td>
                  <td>{s.zone}</td>
                  <td>{s.methodes.map(methodLabel).join(", ")}</td>
                  <td>{s.accueilJeunes ? "Oui" : "Non déclaré"}</td>
                  <td>{s.statut === "valide" ? "Validé" : s.statut === "en-attente" ? "En attente" : "Refusé"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ValidateButtons from "@/components/pilotage/ValidateButtons";
import { allServices } from "@/lib/directory";
import { sessionAccess } from "@/lib/pilotageData";
import { methodLabel, typeLabel } from "@/lib/services";

export const metadata: Metadata = { title: "Pilotage : inscriptions à valider" };
export const dynamic = "force-dynamic";

export default async function ValiderPage() {
  if ((await sessionAccess()) !== "ok") redirect("/pilotage");
  const pending = (await allServices()).filter((s) => s.statut === "en-attente").sort((a, b) => a.creeLe.localeCompare(b.creeLe));
  return (
    <>
      <header>
        <h1>Inscriptions de services à valider</h1>
        <p className="lede">Vérifie par téléphone ou par une visite avant de valider. Un service validé apparaît dans l'annuaire des jeunes.</p>
      </header>
      {pending.length === 0 ? (
        <p className="panel">Aucune inscription en attente.</p>
      ) : (
        <ul className="stack">
          {pending.map((s) => (
            <li key={s.id} className="panel">
              <h2>{s.nom}</h2>
              <p className="muted">
                {typeLabel(s.type)} · {s.commune}, {s.zone} · inscrit le {s.creeLe.slice(0, 10)}
              </p>
              <p>Méthodes déclarées : {s.methodes.map(methodLabel).join(", ")}</p>
              <p>
                {s.accueilJeunes ? "Déclare accueillir les jeunes." : "Ne déclare pas d'accueil des jeunes."} {s.confidentialite ? "Déclare assurer la confidentialité." : ""}
                {s.telephone ? ` Téléphone : ${s.telephone}.` : ""}
              </p>
              <ValidateButtons id={s.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

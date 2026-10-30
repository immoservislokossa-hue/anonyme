import type { Metadata } from "next";
import Dashboard from "@/components/pilotage/Dashboard";
import PilotageLogin from "@/components/pilotage/PilotageLogin";
import { loadDataset, sessionAccess } from "@/lib/pilotageData";
import { getStore } from "@/lib/store";

export const metadata: Metadata = { title: "Alviosa Pilotage" };
export const dynamic = "force-dynamic";

export default async function PilotagePage() {
  const access = await sessionAccess();
  if (access === "missing-config") {
    return (
      <>
        <h1>Accès fermé</h1>
        <p className="panel">Cet espace n'est pas encore configuré. Définis PARTNER_TOKEN sur le serveur.</p>
      </>
    );
  }
  if (access === "denied") {
    return (
      <>
        <header>
          <h1>Alviosa Pilotage</h1>
          <p className="lede">Voir ce que les jeunes demandent, la qualité du conseil et les services disponibles, avec des données anonymes.</p>
        </header>
        <PilotageLogin />
      </>
    );
  }

  const ds = await loadDataset();
  const store = getStore().kind;
  return (
    <>
      <header>
        <p className="eyebrow">Responsables de district · ministères · partenaires</p>
        <h1>Tableau de bord</h1>
        {store === "memory" && <p className="notice">Stockage temporaire : les données disparaissent au redémarrage. Configure SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY avant le pilote.</p>}
      </header>
      <Dashboard ds={ds} />
    </>
  );
}

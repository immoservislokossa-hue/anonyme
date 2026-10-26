import type { Metadata } from "next";
import { summary } from "@/lib/metrics";

export const metadata: Metadata = { title: "Suivi des partenaires" };
export const dynamic = "force-dynamic";

const KIND_LABELS: Record<string, string> = {
  question: "Questions posées",
  urgence: "Situations urgentes orientées",
  diagnostic: "Demandes de diagnostic refusées",
  protocole: "Protocoles consultés",
  orientation: "Orientations",
};

const THEME_LABELS: Record<string, string> = {
  methodes: "Méthodes",
  effets: "Effets secondaires",
  orientation: "Orientation",
  rumeurs: "Rumeurs",
};

function authorized(token: string | undefined): "ok" | "missing-config" | "denied" {
  const expected = process.env.PARTNER_TOKEN;
  if (!expected) return process.env.NODE_ENV === "production" ? "missing-config" : "ok";
  return token === expected ? "ok" : "denied";
}

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const access = authorized(token);

  if (access !== "ok") {
    return (
      <>
        <h1>Accès réservé</h1>
        <p className="panel">
          {access === "missing-config"
            ? "Cet espace n'est pas encore configuré. Définissez PARTNER_TOKEN sur le serveur."
            : "Ce lien n'est pas valide. Demandez le lien d'accès à l'équipe du projet."}
        </p>
      </>
    );
  }

  const data = summary();
  const themes = Object.entries(data.byTheme).sort((a, b) => b[1] - a[1]);
  const maxTheme = themes[0]?.[1] ?? 1;

  return (
    <>
      <header>
        <p className="eyebrow">Suivi des partenaires</p>
        <h1>Chiffres agrégés</h1>
        <p className="lede">
          Aucun message ni aucune personne n'apparaît ici. Seuls les compteurs par type et par thème sont conservés.
        </p>
      </header>

      <p className="notice">
        Version de démonstration : les compteurs sont en mémoire et repartent à zéro au redémarrage du serveur. Une
        base de données est nécessaire avant le pilote.
      </p>

      <section className="panel">
        <h2>Activité</h2>
        {Object.keys(data.byKind).length === 0 ? (
          <p className="muted">Aucune activité pour le moment.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Indicateur</th>
                  <th scope="col">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.byKind).map(([kind, count]) => (
                  <tr key={kind}>
                    <td>{KIND_LABELS[kind] ?? kind}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Thèmes les plus demandés</h2>
        {themes.length === 0 ? (
          <p className="muted">Aucun thème pour le moment.</p>
        ) : (
          <ul className="stack">
            {themes.map(([theme, count]) => (
              <li key={theme}>
                <div className="row-between">
                  <span>{THEME_LABELS[theme] ?? theme}</span>
                  <span>{count}</span>
                </div>
                <div className="bar">
                  <span style={{ width: `${(count / maxTheme) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

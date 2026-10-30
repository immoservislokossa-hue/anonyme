import Link from "next/link";
import AiSummary from "@/components/pilotage/AiSummary";
import { MIN_CELL, PMA_BASELINE, alerts, coverage, overview, quality, synthese, themeRanking, type Dataset, type QualityRow } from "@/lib/analytics";
import { DOMAIN } from "@/lib/domain";
import { methodLabel } from "@/lib/services";

function Kpi({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <li className="kpi">
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{value}</strong>
      {note && <span className="kpi-note">{note}</span>}
    </li>
  );
}

function Rows({ rows }: { rows: QualityRow[] }) {
  return (
    <ul className="stack">
      {rows.map((r) => (
        <li key={r.id}>
          <div className="row-between">
            <span>{r.label}</span>
            <strong>{r.pct === null ? `< ${MIN_CELL} obs. : masqué` : `${r.pct} %`}</strong>
          </div>
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${r.pct ?? 0}%` }} />
          </div>
          {r.baseline !== undefined && <p className="muted small">Repère : {r.baseline} % ({PMA_BASELINE.source}, autre pays et autre année)</p>}
        </li>
      ))}
    </ul>
  );
}

// Le tableau de bord, avec les mêmes calculs pour les vraies données et pour la démonstration.
export default function Dashboard({ ds, now = new Date() }: { ds: Dataset; now?: Date }) {
  const o = overview(ds, now);
  const themes = themeRanking(ds, now);
  const maxTheme = themes[0]?.raw ?? 1;
  const list = alerts(ds, now);
  const q = quality(ds);
  const cover = coverage(ds, now);
  const lines = synthese(ds, now);

  return (
    <>
      {ds.demo && (
        <p className="notice demo-banner" role="note">
          <strong>Données de démonstration.</strong> Elles sont fabriquées pour montrer le tableau de bord. Aucune n'est réelle.
        </p>
      )}

      <ul className="kpis" aria-label="Chiffres clés">
        <Kpi label="Questions de jeunes (7 jours)" value={o.questions.semaine} note={o.questions.hausse != null ? `${o.questions.hausse >= 0 ? "+" : ""}${o.questions.hausse} % sur la semaine précédente` : undefined} />
        <Kpi label="Outils utilisés (7 jours)" value={o.outils} />
        <Kpi label="Consultations déclarées" value={o.consultations} note={`${o.prestataires} prestataire${o.prestataires > 1 ? "s" : ""}`} />
        <Kpi label="Avis de jeunes" value={o.avis} />
        <Kpi label="Services validés" value={o.services.valides} note={`${o.services.accueilJeunes} accueillent les jeunes · ${o.services.enAttente} en attente`} />
      </ul>

      <section aria-labelledby="alertes">
        <h2 id="alertes">Alertes</h2>
        {list.length === 0 ? (
          <p className="panel">Aucune alerte. Les alertes apparaissent quand une hausse, une rupture, un conseil incomplet ou une zone sans service est détecté.</p>
        ) : (
          <ul className="stack">
            {list.map((a) => (
              <li key={a.id} className={`alert-card niveau-${a.niveau}`}>
                <strong>{a.titre}</strong>
                <span>{a.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="questions">
        <h2 id="questions">Ce que demandent les jeunes (30 jours)</h2>
        {themes.length === 0 ? (
          <p className="panel">Pas encore assez de questions (au moins {MIN_CELL} par thème) pour afficher un classement.</p>
        ) : (
          <ul className="stack">
            {themes.map((t) => (
              <li key={t.theme}>
                <div className="row-between">
                  <span>{DOMAIN.themes[t.theme] ?? t.theme}</span>
                  <strong>{t.count}</strong>
                </div>
                <div className="bar" aria-hidden="true">
                  <span style={{ width: `${(t.raw / maxTheme) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="qualite">
        <h2 id="qualite">Qualité du conseil</h2>
        <h3>Déclarée par les prestataires</h3>
        {q.enough ? <Rows rows={q.providerRows} /> : <p className="panel">Pas encore assez de bilans (au moins 3 prestataires et {MIN_CELL} consultations). {q.prestataires} prestataire(s), {q.consultations} consultation(s).</p>}
        <h3>Vue par les jeunes (avis anonymes)</h3>
        {q.youthEnough ? <Rows rows={q.youthRows} /> : <p className="panel">Pas encore assez d'avis ({q.reviews}). Chaque question n'est affichée qu'à partir de {MIN_CELL} réponses.</p>}
      </section>

      <section aria-labelledby="couverture">
        <h2 id="couverture">Couverture par zone</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Zone</th>
                <th scope="col">Services validés</th>
                <th scope="col">Accueil des jeunes</th>
                <th scope="col">Méthodes absentes</th>
                <th scope="col">Ruptures</th>
              </tr>
            </thead>
            <tbody>
              {cover.map((c) => (
                <tr key={c.zone} className={c.services === 0 ? "row-empty" : undefined}>
                  <th scope="row">{c.zone}</th>
                  <td>{c.services}</td>
                  <td>{c.accueilJeunes}</td>
                  <td>{c.services === 0 ? "-" : c.manquantes.length === 0 ? "Aucune" : c.manquantes.map(methodLabel).join(", ")}</td>
                  <td>{c.ruptures.length === 0 ? "-" : c.ruptures.map((r) => `${methodLabel(r.methode)} (${r.services})`).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">Les zones sans service validé sont en gris : c'est là que l'annuaire reste à construire.</p>
      </section>

      {ds.demo ? (
        <section className="panel" aria-labelledby="synthese">
          <h2 id="synthese">Synthèse pour la réunion</h2>
          <ul className="plain">
            {lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="muted">Générée par des règles simples. En production, l'IA peut la rédiger à partir des chiffres agrégés.</p>
        </section>
      ) : (
        <AiSummary />
      )}

      <section className="panel" aria-labelledby="export">
        <h2 id="export">Exporter</h2>
        {ds.demo ? (
          <p className="muted">Les exports CSV et JSON sont disponibles dans l'espace connecté. Les codes d'indicateurs commencent par ALV_ et se font correspondre aux éléments de données du système d'information sanitaire du pays (par exemple DHIS2).</p>
        ) : (
          <div className="row">
            <a className="btn primary" href="/api/pilotage/export?format=csv">
              Télécharger en CSV
            </a>
            <a className="btn ghost" href="/api/pilotage/export?format=json">
              Télécharger en JSON
            </a>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="methode">
        <h2 id="methode">Comment lire ces chiffres</h2>
        <ul className="plain">
          <li>Aucun message, aucune personne : seulement des comptes. Toute valeur sur moins de {MIN_CELL} observations est masquée.</li>
          <li>Les services s'inscrivent eux-mêmes ; un responsable les valide. Les informations sont déclaratives.</li>
          <li>La qualité du conseil déclarée par les prestataires est une auto-évaluation. Les avis des jeunes sont anonymes et non vérifiés : à croiser avec des visites de supervision.</li>
          <li>Les repères PMA2020 viennent du Burkina Faso en 2017-18 : ils situent l'ordre de grandeur, ils ne sont pas une cible pour votre pays.</li>
          <li>
            <Link href="/a-propos">Sources et limites de la plateforme</Link>.
          </li>
        </ul>
      </section>
    </>
  );
}

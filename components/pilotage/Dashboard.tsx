import Link from "next/link";
import AiSummary from "@/components/pilotage/AiSummary";
import { MIN_CELL, PMA_BASELINE, alerts, coverage, funnel, knowledgeGaps, overview, quality, synthese, themeRanking, type Dataset, type QualityRow } from "@/lib/analytics";
import { titleOfEntry } from "@/lib/knowledgeTitles";
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
  const fu = funnel(ds, now);
  const gaps = knowledgeGaps(ds, now, titleOfEntry);

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

      <section aria-labelledby="qr">
        <h2 id="qr">Des recommandations aux visites (30 jours)</h2>
        <ul className="kpis" aria-label="Entonnoir">
          <Kpi label="Passages par QR (7 jours)" value={fu.scans7} />
          <Kpi label="Passages par QR (30 jours)" value={fu.scans30} />
          <Kpi label="Bons de visite demandés (30 jours)" value={fu.visites.demandes30} />
          <Kpi label="Visites confirmées par les services" value={fu.visites.venues30} note={fu.visites.tauxVenue === null ? undefined : `${fu.visites.tauxVenue} % des bons`} />
          <Kpi label="Avis donnés (30 jours)" value={fu.avis30} />
          <Kpi label="Avis pour 100 passages" value={fu.avisPour100 === null ? "-" : fu.avisPour100} note="Mesure approximative" />
        </ul>
        {fu.services.length > 0 ? (
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Passages par service">
            <table>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Passages</th>
                  <th scope="col">Avis</th>
                </tr>
              </thead>
              <tbody>
                {fu.services.map((r) => (
                  <tr key={r.nom}>
                    <th scope="row">{r.nom}</th>
                    <td>{r.scans}</td>
                    <td>{r.avis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="panel">Pas encore de service avec au moins {MIN_CELL} passages. Les prestataires affichent leur carte QR (Prestataires, Mon service).</p>
        )}
        {fu.autres > 0 && <p className="muted">{fu.autres} autre(s) service(s) avec moins de {MIN_CELL} passages : non détaillés.</p>}
      </section>

      <section aria-labelledby="lacunes">
        <h2 id="lacunes">Ce que la base ne couvre pas</h2>
        {gaps.sansFichePct === null ? (
          <p className="panel">Pas encore assez de questions (au moins {MIN_CELL}) pour mesurer ce que la base ne couvre pas.</p>
        ) : (
          <>
            <p>
              <strong>{gaps.sansFichePct} %</strong> des questions n'ont trouvé aucune fiche ({gaps.questions} questions sur 30 jours). Seul le fait d'avoir trouvé une fiche est compté : le texte des questions n'est jamais gardé.
            </p>
            {gaps.fichesTop.length > 0 && (
              <>
                <h3>Les fiches les plus consultées</h3>
                <ul className="plain">
                  {gaps.fichesTop.map((f) => (
                    <li key={f.id}>
                      {f.titre} <span className="muted">({f.count})</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
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
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Tableau : couverture par zone">
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

import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import Checklist from "@/components/Checklist";
import protocolsData from "@/data/protocols.json";
import { METHODES } from "@/lib/catalog";
import { CONDITIONS } from "@/lib/tools/chooser";

export const metadata: Metadata = { title: "Aide-mémoire OMS" };

type Protocol = { id: string; titre: string; resume: string; etapes: string[]; source: string; dateVersion: string; valide: boolean };
const protocols: Protocol[] = protocolsData;

const RULE_KEY: Record<string, "pilule" | "injectables" | "minidosee"> = { pilule: "pilule", injectables: "injectables", "pilule-minidosee": "minidosee" };

const DELAIS = [
  ["Pilule d'urgence", "La plus tôt possible, jusqu'à 5 jours après le rapport."],
  ["Traitement d'urgence du VIH", "À commencer dans les 72 heures."],
  ["Injection tous les 3 mois", "Encore possible jusqu'à 4 semaines de retard ; au-delà, préservatif et retour rapide."],
  ["Injection tous les 2 mois", "Encore possible jusqu'à 2 semaines de retard ; au-delà, préservatif et retour rapide."],
  ["Après un accouchement", "Stérilet : tout de suite ou dès 4 semaines. Implants, injectables, minidosée : 6 semaines si on allaite. Pilule : 6 mois si on allaite, sinon 6 semaines."],
  ["Entre deux enfants", "Attendre au moins 2 ans est plus sain (guide OMS)."],
];

export default function AideMemoirePage() {
  return (
    <>
      <Crumbs trail={[{ href: "/prestataires", label: "Prestataires" }]} current="Aide-mémoire OMS" />
      <header>
        <h1>Aide-mémoire OMS</h1>
        <p className="lede">D'après le guide de la planification familiale de l'OMS (2012). Le protocole national de ton pays passe avant : suis-le s'il existe.</p>
      </header>

      <section aria-labelledby="delais">
        <h2 id="delais">Délais à connaître</h2>
        <dl className="facts">
          {DELAIS.map(([k, v]) => (
            <div key={k} className="fact">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="methodes">
        <h2 id="methodes">Une fiche par méthode</h2>
        <div className="stack">
          {METHODES.map((m) => {
            const key = RULE_KEY[m.id];
            const excluded = key ? CONDITIONS.filter((c) => c[key] === "non") : [];
            return (
              <details key={m.id} className="know" id={m.id}>
                <summary>{m.nom}</summary>
                <h3>Ce que c'est</h3>
                <ul className="plain">{m.ce_que_cest.map((t) => <li key={t}>{t}</li>)}</ul>
                <h3>À dire au client</h3>
                <ul className="plain">{m.a_retenir.map((t) => <li key={t}>{t}</li>)}</ul>
                {m.mode_emploi.length > 0 && (
                  <>
                    <h3>Mode d'emploi</h3>
                    <ol className="plain">{m.mode_emploi.map((t) => <li key={t}>{t}</li>)}</ol>
                  </>
                )}
                <h3>Si le client revient avec un souci</h3>
                <ul className="plain">{m.peut_arriver.map((t) => <li key={t}>{t}</li>)}</ul>
                {excluded.length > 0 && (
                  <>
                    <h3>Ne pas proposer en cas de (guide, p. 19)</h3>
                    <ul className="plain">{excluded.map((c) => <li key={c.id}>{c.label.split(" (")[0]}</li>)}</ul>
                  </>
                )}
                {m.accouchement && (
                  <>
                    <h3>Après un accouchement</h3>
                    <p>{m.accouchement}</p>
                  </>
                )}
                <p className="muted">
                  Où : {m.ou_aller}. Source : {m.source}, p. {m.page}.
                </p>
              </details>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="listes">
        <h2 id="listes">Listes de contrôle</h2>
        <ul className="stack">
          {protocols.map((protocol) => (
            <li key={protocol.id} className="panel">
              <div className="row-between">
                <h3>{protocol.titre}</h3>
                <span className={protocol.valide ? "tag vert" : "tag"}>{protocol.valide ? "Validé" : "À valider"}</span>
              </div>
              <p className="muted">{protocol.resume}</p>
              <Checklist id={protocol.id} steps={protocol.etapes} />
              <p className="muted">
                Source : {protocol.source} · Version : {protocol.dateVersion}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

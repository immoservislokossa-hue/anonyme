import type { Metadata } from "next";
import Checklist from "@/components/Checklist";
import protocolsData from "@/data/protocols.json";

export const metadata: Metadata = { title: "Espace agent de santé" };

type Protocol = {
  id: string;
  titre: string;
  resume: string;
  etapes: string[];
  source: string;
  dateVersion: string;
  valide: boolean;
};

const protocols: Protocol[] = protocolsData;

export default function ProPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Espace agent de santé</p>
        <h1>Aide-mémoire pour la consultation</h1>
        <p className="lede">
          Des listes de vérification pour structurer l'échange. Elles ne remplacent ni l'évaluation de la patiente, ni
          le consentement éclairé, ni la décision du professionnel.
        </p>
      </header>

      <p className="notice">
        Ces protocoles sont des brouillons. Ils doivent être remplacés par les protocoles nationaux en vigueur avant
        tout usage en consultation.
      </p>

      <ul className="stack">
        {protocols.map((protocol) => (
          <li key={protocol.id} className="panel">
            <div className="row-between">
              <h2 style={{ marginBottom: 0 }}>{protocol.titre}</h2>
              <span className={protocol.valide ? "tag vert" : "tag"}>{protocol.valide ? "Validé" : "À valider"}</span>
            </div>
            <p className="muted" style={{ margin: "6px 0 12px" }}>
              {protocol.resume}
            </p>
            <Checklist id={protocol.id} steps={protocol.etapes} />
            <p className="muted" style={{ marginTop: 12 }}>
              Source : {protocol.source} · Version : {protocol.dateVersion}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

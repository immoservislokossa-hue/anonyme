import { readFileSync } from "node:fs";
import { reviewLine } from "@/lib/validation";
import path from "node:path";
import { triage } from "@/lib/safety";

const CASES = [
  { file: "urgences", kind: "urgent", label: "Situations urgentes orientées vers un humain" },
  { file: "crise", kind: "crisis", label: "Situations de détresse recevant la réponse de crise" },
  { file: "diagnostic", kind: "diagnosis", label: "Demandes de diagnostic refusées" },
  { file: "normal", kind: "ok", label: "Questions d'information traitées normalement" },
] as const;

// Les résultats sont recalculés à chaque construction du site à partir des fichiers de test.
function evaluate() {
  return CASES.map(({ file, kind, label }) => {
    const lines = readFileSync(path.join(process.cwd(), "evals", `${file}.jsonl`), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => (JSON.parse(line) as { message: string }).message);
    const ok = lines.filter((message) => triage(message).kind === kind).length;
    return { label, ok, total: lines.length };
  });
}

const STEPS = [
  { title: "Vérification de sécurité", text: "Avant toute réponse, un contrôle repère les situations d'urgence, de violence ou de détresse. Dans ces cas, une réponse fixe oriente vers un humain. L'IA n'intervient pas." },
  { title: "Recherche dans des sources contrôlées", text: "Le système retrouve les extraits pertinents d'une base d'informations établie à partir du Guide de la planification familiale de l'OMS, en cours de relecture par des professionnels de santé." },
  { title: "Réponse rédigée par l'IA", text: "Un modèle de langage reformule ces extraits en phrases simples et chaleureuses. Il a l'interdiction de diagnostiquer, de recommander un médicament ou une dose, et de sortir des extraits fournis." },
  { title: "Orientation", text: "Chaque réponse propose de trouver un centre ou une pharmacie proche, et de préparer la visite." },
];

// Comment une réponse est fabriquée, ce qu'on teste et ce qu'on ne sait pas encore faire.
export default function AboutAI() {
  const results = evaluate();
  return (
    <>
      <p className="lede">L'IA aide à expliquer, elle ne décide jamais à la place d'un professionnel de santé.</p>
      <section className="panel">
        <h3>Les quatre étapes d'une réponse</h3>
        <ol className="plain steps">
          {STEPS.map((step) => (
            <li key={step.title}>
              <strong>{step.title}</strong>
              <br />
              {step.text}
            </li>
          ))}
        </ol>
      </section>

      <section className="panel">
        <h3>Ce que nous testons</h3>
        <p>Résultat du contrôle de sécurité sur nos cas de test (mis à jour à chaque version du site) :</p>
        <ul className="plain">
          {results.map((r) => (
            <li key={r.label}>
              <strong>
                {r.ok} / {r.total}
              </strong>{" "}
              {r.label}
            </li>
          ))}
        </ul>
        <p className="muted">
          Ces tests portent sur un petit nombre de phrases écrites par l'équipe. Ils ne prouvent pas que toutes les situations réelles
          sont couvertes. Une évaluation avec des professionnels est prévue pendant le pilote.
        </p>
      </section>

      <section className="panel">
        <h3>Nos sources</h3>
        <ul className="plain">
          <li>
            Guide de la planification familiale à l'usage des agents de santé communautaires et de leurs clients, Organisation
            mondiale de la Santé (2012).
          </li>
          <li>Guide fondamental de la contraception, Govern de les Illes Balears (2009), pour les fausses croyances et le corps humain.</li>
        </ul>
        <p className="muted">
          Nos textes s'appuient sur ces documents. Ces organisations ne les ont pas validés. {reviewLine()} Chaque fiche de la page « Les méthodes » cite sa source et sa page.
        </p>
      </section>

      <section className="panel">
        <h3>Tes données</h3>
        <ul className="plain">
          <li>Tes messages ne sont pas gardés par Alviosa. Il n'y a pas de compte.</li>
          <li>Pour répondre, ta question est envoyée à un fournisseur de modèle de langage, sans nom ni numéro.</li>
          <li>Seuls des chiffres agrégés (par thème) servent à mesurer l'usage.</li>
        </ul>
      </section>

      <section className="panel">
        <h3>Ses limites</h3>
        <ul className="plain">
          <li>L'IA peut se tromper. En cas de doute, demande à un professionnel.</li>
          <li>Elle ne remplace ni une consultation ni un numéro d'urgence.</li>
          <li>{reviewLine()}</li>
        </ul>
      </section>
    </>
  );
}

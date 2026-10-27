import type { Metadata } from "next";
import Link from "next/link";
import { EMERGENCY_NUMBER } from "@/lib/brand";

export const metadata: Metadata = { title: "Urgence" };

export default function UrgencePage() {
  return (
    <>
      <header>
        <p className="eyebrow">Urgence</p>
        <h1>Si c'est urgent, n'attends pas</h1>
      </header>

      <div className="urgent">
        <p>
          <strong>Va tout de suite au centre de santé le plus proche.</strong> Si tu ne peux pas te déplacer,
          appelle le numéro d'urgence : {EMERGENCY_NUMBER}.
        </p>
      </div>

      <section className="panel">
        <h2>Va au centre sans attendre si tu as</h2>
        <ul className="plain">
          <li>des saignements très abondants</li>
          <li>une douleur très forte ou qui ne passe pas</li>
          <li>de la fièvre avec des douleurs au ventre</li>
          <li>un malaise ou un évanouissement</li>
          <li>des saignements ou des douleurs pendant une grossesse</li>
          <li>subi une violence ou une relation forcée</li>
        </ul>
        <p className="muted" style={{ marginTop: 10 }}>
          Cette liste n'est pas complète. Si tu as un doute, va au centre.
        </p>
      </section>

      <section className="panel">
        <h2>Tu n'es pas seul(e)</h2>
        <p>
          Demande à une personne de confiance de t'accompagner. Tu peux aussi{" "}
          <Link href="/orientation">trouver un centre partenaire</Link>.
        </p>
      </section>
    </>
  );
}

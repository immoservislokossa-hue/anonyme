import type { Metadata } from "next";
import Link from "next/link";
import { EMERGENCY_NUMBER } from "@/lib/brand";

export const metadata: Metadata = { title: "Urgence" };

export default function UrgencePage() {
  return (
    <>
      <header>
        <p className="eyebrow">Urgence</p>
        <h1>Si c'est urgent, n'attendez pas</h1>
      </header>

      <div className="urgent">
        <p>
          <strong>Allez tout de suite au centre de santé le plus proche.</strong> Si vous ne pouvez pas vous déplacer,
          appelez le numéro d'urgence : {EMERGENCY_NUMBER}.
        </p>
      </div>

      <section className="panel">
        <h2>Allez au centre sans attendre si vous avez</h2>
        <ul className="plain">
          <li>des saignements très abondants</li>
          <li>une douleur très forte ou qui ne passe pas</li>
          <li>de la fièvre avec des douleurs au ventre</li>
          <li>un malaise ou un évanouissement</li>
          <li>des saignements ou des douleurs pendant une grossesse</li>
          <li>subi une violence ou une relation forcée</li>
        </ul>
        <p className="muted" style={{ marginTop: 10 }}>
          Cette liste n'est pas complète. Si vous avez un doute, allez au centre.
        </p>
      </section>

      <section className="panel">
        <h2>Vous n'êtes pas seule</h2>
        <p>
          Demandez à une personne de confiance de vous accompagner. Vous pouvez aussi{" "}
          <Link href="/orientation">trouver un centre partenaire</Link>.
        </p>
      </section>
    </>
  );
}

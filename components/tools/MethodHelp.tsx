"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { track } from "@/lib/track";

export type HelpMethod = {
  id: string;
  nom: string;
  comment: string[];
  peut_arriver: string[];
  a_retenir: string[];
  ou_aller: string;
};

const CHECK = [
  "Es-tu satisfaite de ta méthode ?",
  "L'utilises-tu comme il faut ? (oublis de pilule, problèmes de préservatif, injection en retard)",
  "Ressens-tu des effets gênants (règles qui changent, vertiges, légers maux de tête, humeur, acné) ?",
  "As-tu une question, ou un problème avec ton ou ta partenaire à ce sujet ?",
];

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="m-block">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// « J'utilise déjà une méthode et j'ai un souci » : oubli, retard, effets, changement de méthode.
export default function MethodHelp({ methods }: { methods: HelpMethod[] }) {
  const [id, setId] = useState("");
  const method = methods.find((m) => m.id === id);
  useEffect(() => {
    if (method) track("outil-souci");
  }, [method]);

  return (
    <div className="tool">
      <label className="fields single">
        <span>Quelle méthode utilises-tu ?</span>
        <select value={id} onChange={(event) => setId(event.target.value)}>
          <option value="">Choisis une méthode</option>
          {methods.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nom}
            </option>
          ))}
        </select>
      </label>

      {method && (
        <div className="method-help">
          <List title="Comment bien l'utiliser, et que faire en cas d'oubli ou de retard" items={method.comment} />
          <List title="Ce qui peut arriver" items={method.peut_arriver} />
          <List title="À retenir" items={method.a_retenir} />
          <p className="m-where">
            <strong>Où aller : </strong>
            {method.ou_aller}.
          </p>
        </div>
      )}

      <div className="panel">
        <h3>Fais le point sur ta méthode</h3>
        <ul className="plain">
          {CHECK.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
        <p className="muted">
          Les effets secondaires sont courants et sans gravité, et ils disparaissent souvent d'eux-mêmes. Si tu veux changer de méthode, un professionnel t'aide à en choisir une autre.
        </p>
      </div>

      <div className="row">
        <Link className="chip-btn" href="/apprendre?sujet=apres-risque">
          <Icon name="alert" size={18} />
          Contraception d'urgence
        </Link>
        <Link className="chip-btn" href="/apprendre?onglet=outils&outil=choisir">
          <Icon name="check" size={18} />
          Changer de méthode
        </Link>
        <Link className="chip-btn" href="/orientation">
          <Icon name="pin" size={18} />
          Trouver un centre
        </Link>
      </div>
      <p className="muted tool-source">Source : Guide de la planification familiale de l'OMS (2012), pages de chaque méthode et p. 28. Brouillon en cours de validation.</p>
    </div>
  );
}

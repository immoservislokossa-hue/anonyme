"use client";

import { useState } from "react";
import type { Structure } from "@/lib/structures";

export default function Orientation({ structures }: { structures: Structure[] }) {
  const [commune, setCommune] = useState("");

  const query = commune.trim().toLowerCase();
  const visible = query ? structures.filter((s) => s.commune.toLowerCase().includes(query)) : structures;

  return (
    <section aria-label="Structures partenaires">
      <div className="field">
        <label htmlFor="commune">Votre commune</label>
        <input
          id="commune"
          value={commune}
          onChange={(event) => setCommune(event.target.value)}
          placeholder="Écrivez le nom de votre commune"
          autoComplete="off"
        />
      </div>

      <p className="muted" role="status" style={{ margin: "12px 0" }}>
        {visible.length} structure{visible.length > 1 ? "s" : ""} trouvée{visible.length > 1 ? "s" : ""}
      </p>

      <ul className="stack cols">
        {visible.map((structure) => (
          <li key={structure.id} className="panel">
            <div className="row-between">
              <h3>{structure.nom}</h3>
              {structure.verifie ? (
                <span className="tag vert">Vérifié le {structure.dateVerification}</span>
              ) : (
                <span className="tag">À confirmer</span>
              )}
            </div>
            <p className="muted">
              {structure.type} · {structure.commune}
            </p>
            <dl className="facts">
              <dt>Horaires</dt>
              <dd>{structure.horaires}</dd>
              <dt>Contact</dt>
              <dd>{structure.contact}</dd>
              <dt>Services</dt>
              <dd>{structure.services.join(", ")}</dd>
            </dl>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="panel">Aucune structure partenaire pour cette commune. Allez au centre de santé le plus proche.</p>
      )}
    </section>
  );
}

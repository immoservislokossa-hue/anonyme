"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MethodArt } from "@/components/art/Art";

export type MethodCardData = {
  id: string;
  nom: string;
  niveau: number;
  niveau_label: string;
  frequence: string;
  ist: boolean;
  hormonale: boolean;
  reversible: boolean;
  ou: "centre" | "communaute";
  pour: "toutes" | "femmes" | "hommes";
  accroche: string;
};

const FILTERS: { id: string; label: string; test: (m: MethodCardData) => boolean }[] = [
  { id: "tout", label: "Toutes", test: () => true },
  { id: "sans-penser", label: "Sans y penser tous les jours", test: (m) => ["implants", "sterilet", "sterilisation-feminine", "vasectomie", "injectables"].includes(m.id) },
  { id: "ist", label: "Protègent des IST", test: (m) => m.ist },
  { id: "sans-hormones", label: "Sans hormones", test: (m) => !m.hormonale && m.id !== "contraception-urgence" },
  { id: "hommes", label: "Pour les hommes", test: (m) => m.pour !== "femmes" },
];

const ROWS: { label: string; value: (m: MethodCardData) => string }[] = [
  { label: "Efficacité", value: (m) => m.niveau_label },
  { label: "À quelle fréquence", value: (m) => m.frequence },
  { label: "Protège des IST", value: (m) => (m.ist ? "Oui" : "Non") },
  { label: "Avec hormones", value: (m) => (m.hormonale ? "Oui" : "Non") },
  { label: "Définitive", value: (m) => (m.reversible ? "Non" : "Oui") },
  { label: "Où l'obtenir", value: (m) => (m.ou === "centre" ? "Centre de santé ou hôpital" : "Agent de santé, centre ou pharmacie") },
];

const MAX_COMPARE = 3;

// Toutes les méthodes, filtrables, avec un comparateur côte à côte (jusqu'à 3).
export default function MethodsBrowser({ methods, tiers }: { methods: MethodCardData[]; tiers: { niveau: number; titre: string }[] }) {
  const [filter, setFilter] = useState("tout");
  const [picked, setPicked] = useState<string[]>([]);
  const test = FILTERS.find((f) => f.id === filter)?.test ?? (() => true);
  const shown = useMemo(() => methods.filter(test), [methods, test]);
  const chosen = picked.map((id) => methods.find((m) => m.id === id)).filter((m): m is MethodCardData => Boolean(m));

  function toggle(id: string) {
    setPicked((current) => (current.includes(id) ? current.filter((x) => x !== id) : current.length >= MAX_COMPARE ? current : [...current, id]));
  }

  return (
    <div className="methods-browser">
      <div className="filters" role="group" aria-label="Filtrer les méthodes">
        {FILTERS.map((item) => (
          <button key={item.id} type="button" className={`chip-btn${filter === item.id ? " on" : ""}`} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {tiers.map((tier) => {
        const list = shown.filter((m) => m.niveau === tier.niveau);
        if (list.length === 0) return null;
        return (
          <section key={tier.niveau} className="tier" aria-label={tier.titre}>
            <h2 className={`tier-title tier-${tier.niveau}`}>{tier.titre}</h2>
            <ul className="method-grid">
              {list.map((m) => (
                <li key={m.id} className="method-card">
                  <Link href={`/methodes/${m.id}`} className="method-link">
                    <MethodArt id={m.id} />
                    <strong>{m.nom}</strong>
                    <span className="method-freq">{m.frequence}</span>
                    <span className="method-hook">{m.accroche}</span>
                    {m.ist && <span className="tag vert">Protège aussi des IST</span>}
                  </Link>
                  <label className="compare-pick">
                    <input type="checkbox" checked={picked.includes(m.id)} disabled={!picked.includes(m.id) && picked.length >= MAX_COMPARE} onChange={() => toggle(m.id)} />
                    <span>Comparer</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {shown.length === 0 && <p className="muted">Aucune méthode ne correspond.</p>}

      {chosen.length >= 2 && (
        <section className="compare" aria-label="Comparaison" id="comparer">
          <h2>Comparer</h2>
          <div className="compare-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col"></th>
                  {chosen.map((m) => (
                    <th key={m.id} scope="col">
                      <Link href={`/methodes/${m.id}`}>{m.nom}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {chosen.map((m) => (
                      <td key={m.id}>{row.value(m)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn ghost" onClick={() => setPicked([])}>
            Effacer la comparaison
          </button>
        </section>
      )}

      {chosen.length === 1 && <p className="muted compare-hint">Choisis une deuxième méthode pour les comparer.</p>}
    </div>
  );
}

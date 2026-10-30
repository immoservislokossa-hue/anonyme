"use client";

import { useEffect, useState } from "react";
import { readZone, writeZone } from "@/lib/zone";

// « Ma zone » : facultatif. Aide à placer les services où les jeunes en ont besoin. Se retire quand on veut.
export default function ZoneChoice({ zones }: { zones: string[] }) {
  const [zone, setZone] = useState("");

  useEffect(() => setZone(readZone() ?? ""), []);

  function change(value: string) {
    setZone(value);
    writeZone(value || null);
  }

  return (
    <section className="panel" aria-labelledby="zone-title">
      <h2 id="zone-title">Ma zone (facultatif)</h2>
      <p className="muted">
        Si tu choisis ta zone, nous comptons tes questions par zone, de façon anonyme, pour que les services soient là où les jeunes en ont besoin. Ce n'est pas ta position : seulement un nom de département.
        Tu peux la retirer à tout moment.
      </p>
      <label className="field">
        <span>Département</span>
        <select value={zone} onChange={(e) => change(e.target.value)}>
          <option value="">Je ne dis pas</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

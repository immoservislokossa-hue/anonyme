"use client";

import { useState } from "react";

// Liste de vérification. L'état reste dans la page : rien n'est envoyé ni enregistré.
export default function Checklist({ id, steps }: { id: string; steps: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => steps.map(() => false));

  return (
    <ul className="checklist">
      {steps.map((step, index) => (
        <li key={`${id}-${index}`}>
          <label>
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={() =>
                setChecked((current) => current.map((value, i) => (i === index ? !value : value)))
              }
            />
            <span>{step}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

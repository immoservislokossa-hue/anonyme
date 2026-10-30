"use client";

import { useState } from "react";
import { track } from "@/lib/track";

// « Cette page t'a aidé ? » : un seul clic, aucun texte, rien d'identifiant. Sert à savoir si les pages sont claires.
export default function PageFeedback() {
  const [done, setDone] = useState(false);

  function answer(useful: boolean) {
    track(useful ? "avis-oui" : "avis-non");
    setDone(true);
  }

  return (
    <section className="feedback" aria-label="Ton avis sur cette page">
      {done ? (
        <p role="status">Merci, ça nous aide à améliorer les pages.</p>
      ) : (
        <>
          <p>Cette page t'a aidé ?</p>
          <div className="row">
            <button type="button" className="chip-btn" onClick={() => answer(true)}>
              Oui
            </button>
            <button type="button" className="chip-btn" onClick={() => answer(false)}>
              Pas vraiment
            </button>
          </div>
        </>
      )}
    </section>
  );
}

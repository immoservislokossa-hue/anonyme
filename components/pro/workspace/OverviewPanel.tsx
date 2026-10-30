"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/pro/workspace/Workspace";
import { onboarding } from "@/lib/pro/workspace";

const WELCOME_KEY = "pro-welcome-v1";

export default function OverviewPanel() {
  const { enabled, account, service, hasToken, flags } = useWorkspace();
  const [welcome, setWelcome] = useState(false);
  const { steps, done, total, next } = onboarding({ enabled, loggedIn: account !== null, hasToken, service, flags });

  useEffect(() => {
    try {
      setWelcome(window.localStorage.getItem(WELCOME_KEY) !== "1");
    } catch {
      setWelcome(false);
    }
  }, []);

  function closeWelcome() {
    try {
      window.localStorage.setItem(WELCOME_KEY, "1");
    } catch {
      // Le choix ne sera pas gardé.
    }
    setWelcome(false);
  }

  return (
    <>
      <header className="ws-head">
        <h1>{service ? service.nom : "Bienvenue sur Alviosa Prestataires"}</h1>
        <p className="lede">Ton espace pour que les jeunes te trouvent, sachent ce que tu as en stock et viennent préparés.</p>
      </header>

      {welcome && (
        <section className="ws-card ws-welcome" aria-labelledby="bienvenue">
          <h2 id="bienvenue">Comment ça marche, en 3 idées</h2>
          <ul className="plain">
            <li>Ta fiche est vérifiée par un responsable, puis les jeunes te trouvent dans l'annuaire.</li>
            <li>Tu signales tes ruptures : les jeunes ne se déplacent pas pour rien.</li>
            <li>Un jeune te montre un code, tu le confirmes. Personne n'a besoin de donner son nom.</li>
          </ul>
          <div className="ws-actions">
            <button type="button" className="btn primary" onClick={closeWelcome}>
              J'ai compris
            </button>
          </div>
        </section>
      )}

      <section className="ws-card" aria-labelledby="demarrage">
        <div className="ws-card-head">
          <h2 id="demarrage">Démarrage</h2>
          <p className="muted" aria-live="polite">
            {done} étape{done > 1 ? "s" : ""} sur {total}
          </p>
        </div>
        <div className="ws-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label="Avancement du démarrage">
          <span style={{ width: `${Math.round((done / total) * 100)}%` }} />
        </div>
        <ol className="ws-steps">
          {steps.map((step) => (
            <li key={step.id} className={step.fait ? "done" : step === next ? "next" : undefined}>
              <span className="ws-step-mark" aria-hidden="true">{step.fait ? "✓" : ""}</span>
              <div>
                <strong>{step.titre}</strong>
                <p className="muted">{step.texte}</p>
              </div>
              {!step.fait && step === next && (
                <Link className="btn primary small" href={step.href}>
                  {step.cta}
                </Link>
              )}
              <span className="sr-only">{step.fait ? "Fait" : "À faire"}</span>
            </li>
          ))}
        </ol>
        {!next && <p className="notice">Ton service est prêt. Reviens chaque semaine mettre à jour ton stock.</p>}
      </section>

      <section className="ws-card" aria-labelledby="plus">
        <h2 id="plus">Pour aller plus loin</h2>
        <div className="ws-links">
          <Link href="/prestataires/consultation">Consultation guidée</Link>
          <Link href="/prestataires/entrainement">Jeux de rôle pour l'équipe</Link>
          <Link href="/prestataires/offres">Les offres Pro, prévues</Link>
        </div>
      </section>
    </>
  );
}

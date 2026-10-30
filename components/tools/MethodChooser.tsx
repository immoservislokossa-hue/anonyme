"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { track } from "@/lib/track";
import {
  CONDITIONS,
  EMPTY_ANSWERS,
  STATUS_LABEL,
  chooseMethods,
  consultationSummary,
  type Answers,
  type ConditionId,
  type Fit,
  type Status,
} from "@/lib/tools/chooser";

type StepId = "sex" | "children" | "birth" | "priorities" | "cycle" | "health" | "result";

const TIER_LABEL: Record<number, string> = {
  1: "Parmi les plus efficaces",
  2: "Très efficace, avec de l'attention",
  3: "Efficace, avec de l'attention",
  4: "Moins efficace",
};

function stepsFor(answers: Answers): StepId[] {
  return answers.sex === "femme" ? ["sex", "children", "birth", "priorities", "cycle", "health", "result"] : ["sex", "children", "priorities", "result"];
}

function Option({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={`opt${on ? " on" : ""}`} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}

const GROUPS: { status: Status; title: string }[] = [
  { status: "possible", title: "À discuter en priorité" },
  { status: "attendre", title: "À attendre un peu" },
  { status: "discuter", title: "À confirmer avec un professionnel" },
  { status: "deconseille", title: "Pas adaptées à ta situation" },
];

function FitCard({ fit }: { fit: Fit }) {
  return (
    <li className={`fit fit-${fit.status}`}>
      <div className="fit-head">
        <strong>{fit.name}</strong>
        <span className={`fit-badge fit-${fit.status}`}>{STATUS_LABEL[fit.status]}</span>
      </div>
      <p className="fit-tier">{TIER_LABEL[fit.tier]}</p>
      <ul className="plain">
        {fit.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <Link className="link-btn" href={`/methodes/${fit.id}`}>
        Tout savoir sur cette méthode
      </Link>
    </li>
  );
}

// Outil d'aide à la décision : on répond à quelques questions du guide OMS, on obtient une liste à discuter avec un professionnel.
export default function MethodChooser() {
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = stepsFor(answers);
  const step = steps[Math.min(index, steps.length - 1)];
  const fits = useMemo(() => (step === "result" ? chooseMethods(answers) : []), [answers, step]);

  useEffect(() => {
    if (step === "result") track("outil-choisir");
  }, [step]);

  function patch(next: Partial<Answers>) {
    setAnswers((current) => ({ ...current, ...next }));
  }

  function toggleCondition(id: ConditionId) {
    setAnswers((current) => ({
      ...current,
      conditions: current.conditions.includes(id) ? current.conditions.filter((c) => c !== id) : [...current.conditions, id],
    }));
  }

  async function copySummary() {
    const text = consultationSummary(answers, fits);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copie ce résumé :", text);
    }
  }

  function restart() {
    setAnswers(EMPTY_ANSWERS);
    setIndex(0);
  }

  const total = steps.length - 1;

  return (
    <div className="tool">
      {step !== "result" && (
        <div className="tool-progress" role="progressbar" aria-label="Avancement" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1} aria-valuetext={`Question ${index + 1} sur ${total}`}>
          <span style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      )}

      {step === "sex" && (
        <fieldset className="tool-step">
          <legend>Tu cherches une méthode pour…</legend>
          <div className="opts">
            <Option on={answers.sex === "femme"} onClick={() => patch({ sex: "femme" })}>
              Une femme (moi ou ma partenaire)
            </Option>
            <Option on={answers.sex === "homme"} onClick={() => patch({ sex: "homme" })}>
              Un homme (moi)
            </Option>
          </div>
        </fieldset>
      )}

      {step === "children" && (
        <fieldset className="tool-step">
          <legend>Veux-tu avoir des enfants un jour ?</legend>
          <div className="opts">
            <Option on={answers.children === "plus-tard"} onClick={() => patch({ children: "plus-tard" })}>
              Oui, ou je ne sais pas encore
            </Option>
            <Option on={answers.children === "plus-du-tout"} onClick={() => patch({ children: "plus-du-tout" })}>
              Non, je ne veux plus d'enfants du tout
            </Option>
          </div>
          <p className="muted">Les méthodes définitives (stérilisation, vasectomie) ne sont pas pour quelqu'un qui veut peut-être des enfants plus tard.</p>
        </fieldset>
      )}

      {step === "birth" && (
        <fieldset className="tool-step">
          <legend>As-tu accouché récemment ?</legend>
          <div className="opts">
            <Option on={answers.birth === "non"} onClick={() => patch({ birth: "non", breastfeeding: "non" })}>
              Non
            </Option>
            <Option on={answers.birth === "moins-6-semaines"} onClick={() => patch({ birth: "moins-6-semaines" })}>
              Oui, il y a moins de 6 semaines
            </Option>
            <Option on={answers.birth === "6-semaines-6-mois"} onClick={() => patch({ birth: "6-semaines-6-mois" })}>
              Oui, il y a 6 semaines à 6 mois
            </Option>
          </div>
          {answers.birth !== "non" && (
            <>
              <p className="tool-sub">Allaites-tu ton bébé ?</p>
              <div className="opts">
                <Option on={answers.breastfeeding === "non"} onClick={() => patch({ breastfeeding: "non" })}>
                  Non
                </Option>
                <Option on={answers.breastfeeding === "exclusif-sans-regles"} onClick={() => patch({ breastfeeding: "exclusif-sans-regles" })}>
                  Oui, il ne boit que mon lait et mes règles ne sont pas revenues
                </Option>
                <Option on={answers.breastfeeding === "autre"} onClick={() => patch({ breastfeeding: "autre" })}>
                  Oui, mais pas seulement mon lait, ou mes règles sont revenues
                </Option>
              </div>
            </>
          )}
        </fieldset>
      )}

      {step === "priorities" && (
        <fieldset className="tool-step">
          <legend>Qu'est-ce qui compte pour toi ?</legend>
          <div className="opts">
            <Option on={answers.protectIst} onClick={() => patch({ protectIst: !answers.protectIst })}>
              Me protéger aussi des IST et du VIH/sida
            </Option>
            <Option on={answers.noDaily} onClick={() => patch({ noDaily: !answers.noDaily })}>
              Ne pas avoir à y penser tous les jours
            </Option>
          </div>
          <p className="muted">Tu peux ne rien choisir. Seuls les préservatifs protègent à la fois de la grossesse et des IST.</p>
        </fieldset>
      )}

      {step === "cycle" && (
        <fieldset className="tool-step">
          <legend>Tes règles sont-elles régulières ?</legend>
          <div className="opts">
            <Option on={answers.cycle === "regulier"} onClick={() => patch({ cycle: "regulier" })}>
              Oui, un cycle de 26 à 32 jours
            </Option>
            <Option on={answers.cycle === "irregulier"} onClick={() => patch({ cycle: "irregulier" })}>
              Non, elles changent beaucoup
            </Option>
            <Option on={answers.cycle === "inconnu"} onClick={() => patch({ cycle: "inconnu" })}>
              Je ne sais pas
            </Option>
          </div>
        </fieldset>
      )}

      {step === "health" && (
        <fieldset className="tool-step">
          <legend>As-tu un de ces problèmes de santé ?</legend>
          <p className="muted">Coche seulement ce qui te concerne. Si tu hésites, laisse vide et parles-en à un professionnel.</p>
          <div className="opts">
            {CONDITIONS.map((condition) => (
              <Option key={condition.id} on={answers.conditions.includes(condition.id)} onClick={() => toggleCondition(condition.id)}>
                {condition.label}
              </Option>
            ))}
          </div>
          <p className="muted">Si tu vis avec le VIH, presque toutes les méthodes sont possibles, et le préservatif reste recommandé (p. 17).</p>
        </fieldset>
      )}

      {step === "result" && (
        <div className="tool-result">
          <p className="notice">
            <Icon name="shield" size={18} />
            <span>Cette liste aide à préparer la discussion. Un professionnel de santé confirme le choix.</span>
          </p>

          {GROUPS.map((group) => {
            const list = fits.filter((fit) => fit.status === group.status);
            if (list.length === 0) return null;
            if (group.status === "deconseille") {
              return (
                <details key={group.status} className="fits-more">
                  <summary>
                    {group.title} ({list.length})
                  </summary>
                  <ul className="fits">
                    {list.map((fit) => (
                      <FitCard key={fit.id} fit={fit} />
                    ))}
                  </ul>
                </details>
              );
            }
            return (
              <section key={group.status} aria-label={group.title}>
                <h3>{group.title}</h3>
                <ul className="fits">
                  {list.map((fit) => (
                    <FitCard key={fit.id} fit={fit} />
                  ))}
                </ul>
              </section>
            );
          })}

          <p className="muted">
            Dans tous les cas : garde des préservatifs, et sache que la contraception d'urgence existe, jusqu'à 5 jours après un rapport non protégé.
          </p>

          <div className="row">
            <button type="button" className="btn primary" onClick={copySummary}>
              {copied ? "Résumé copié" : "Copier mon résumé pour la consultation"}
            </button>
            <Link className="btn ghost" href="/orientation">
              <Icon name="pin" size={18} />
              Trouver un centre
            </Link>
            <button type="button" className="btn ghost" onClick={restart}>
              Recommencer
            </button>
          </div>
          <p className="muted tool-source">Source : Guide de la planification familiale de l'OMS (2012), p. 3, 6, 11-14, 17-19.</p>
        </div>
      )}

      {step !== "result" && (
        <div className="row tool-nav">
          {index > 0 && (
            <button type="button" className="btn ghost" onClick={() => setIndex(index - 1)}>
              Retour
            </button>
          )}
          <button type="button" className="btn primary" onClick={() => setIndex(index + 1)}>
            {index === steps.length - 2 ? "Voir mes résultats" : "Continuer"}
          </button>
        </div>
      )}
    </div>
  );
}

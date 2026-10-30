"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBilan } from "@/components/pro/useBilan";
import { COUNSELING_CHECKS, WELCOME_REMINDERS, recordConsultation, type CheckId } from "@/lib/pro/consultation";
import { CONDITIONS, EMPTY_ANSWERS, STATUS_LABEL, chooseMethods, type Answers, type ConditionId, type Status } from "@/lib/tools/chooser";
import { PREGNANCY_QUESTIONS, PREGNANCY_SIGNS, evaluatePregnancy } from "@/lib/tools/pregnancy";

export type ProMethod = { id: string; nom: string; comment: string[]; peut_arriver: string[]; a_retenir: string[]; ou_aller: string };

const AGE_BANDS = ["Moins de 18 ans", "18 à 24 ans", "25 à 35 ans", "Plus de 35 ans"] as const;
const GROUPS: Status[] = ["possible", "attendre", "discuter", "deconseille"];

function Choice<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <fieldset className="tool-step">
      <legend>{label}</legend>
      <div className="opts">
        {options.map((o) => (
          <button key={o.id} type="button" className={`opt${value === o.id ? " on" : ""}`} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// Consultation guidée : du profil aux méthodes possibles, puis la liste de qualité du conseil.
export default function ConsultationFlow({ methods }: { methods: ProMethod[] }) {
  const { bilan, save } = useBilan();
  const [step, setStep] = useState<"profil" | "methodes" | "conseil" | "fin">("profil");
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [age, setAge] = useState<string>("");
  const [pregnancy, setPregnancy] = useState<Record<string, boolean | undefined>>({});
  const [signs, setSigns] = useState(false);
  const [done, setDone] = useState<CheckId[]>([]);

  const woman = answers.sex === "femme";
  const outcome = evaluatePregnancy(pregnancy, signs);
  const fits = useMemo(() => chooseMethods(answers), [answers]);
  const young = age === AGE_BANDS[0] || age === AGE_BANDS[1];
  const set = (patch: Partial<Answers>) => setAnswers((a) => ({ ...a, ...patch }));

  function toggleCondition(id: ConditionId) {
    set({ conditions: answers.conditions.includes(id) ? answers.conditions.filter((c) => c !== id) : [...answers.conditions, id] });
  }

  function finish() {
    save(recordConsultation(bilan, done));
    setStep("fin");
  }

  function restart() {
    setAnswers(EMPTY_ANSWERS);
    setAge("");
    setPregnancy({});
    setSigns(false);
    setDone([]);
    setStep("profil");
  }

  if (step === "fin") {
    return (
      <div className="tool-result" role="status">
        <h2>Consultation enregistrée dans ton bilan</h2>
        <p>Seuls des comptes sont gardés sur ton téléphone : aucun nom, aucune réponse du client.</p>
        <div className="row">
          <button type="button" className="btn primary" onClick={restart}>
            Nouvelle consultation
          </button>
          <Link className="btn ghost" href="/prestataires/bilan">
            Voir mon bilan
          </Link>
          <Link className="btn ghost" href="/orientation">
            Orienter vers un service
          </Link>
        </div>
      </div>
    );
  }

  if (step === "conseil") {
    return (
      <div className="tool">
        <h2>Qualité du conseil</h2>
        <p className="muted">Coche ce que tu as réellement fait. C'est pour toi : personne d'autre ne voit tes réponses, sauf si tu envoies ton bilan anonyme.</p>
        <ul className="checklist">
          {COUNSELING_CHECKS.map((c) => (
            <li key={c.id}>
              <label>
                <input type="checkbox" checked={done.includes(c.id)} onChange={() => setDone(done.includes(c.id) ? done.filter((d) => d !== c.id) : [...done, c.id])} />
                <span>{c.label}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="row">
          <button type="button" className="btn primary" onClick={finish}>
            Terminer la consultation
          </button>
          <button type="button" className="btn ghost" onClick={() => setStep("methodes")}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (step === "methodes") {
    return (
      <div className="tool">
        <h2>Méthodes à proposer</h2>
        <p className="muted">D'après le guide OMS (2012). Les raisons sont écrites pour être lues au client. Tu décides, avec lui ou elle.</p>
        {woman && outcome !== "peut-commencer" && (
          <p className={`notice${outcome === "signes" ? " alert" : ""}`}>
            {outcome === "signes"
              ? "Signes de grossesse : fais un test ou oriente avant de commencer une méthode hormonale."
              : outcome === "attendre"
                ? "Impossible d'être raisonnablement sûr qu'elle n'est pas enceinte : une méthode hormonale ne se commence pas aujourd'hui sans test. Propose le préservatif en attendant."
                : "Grossesse possible non écartée : réponds aux questions de la page précédente."}
          </p>
        )}
        {GROUPS.map((status) => {
          const list = fits.filter((f) => f.status === status);
          if (list.length === 0) return null;
          return (
            <section key={status} aria-label={STATUS_LABEL[status]}>
              <h3>{STATUS_LABEL[status]}</h3>
              <ul className="stack">
                {list.map((fit) => {
                  const detail = methods.find((m) => m.id === fit.id);
                  return (
                    <li key={fit.id} className="panel">
                      <strong>{fit.name}</strong>
                      <ul className="plain">
                        {fit.reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                      {detail && status !== "deconseille" && (
                        <details className="know">
                          <summary>Points à dire au client</summary>
                          <h3>À retenir</h3>
                          <ul className="plain">
                            {detail.a_retenir.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                          <h3>Ce qui peut arriver</h3>
                          <ul className="plain">
                            {detail.peut_arriver.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                          <p className="muted">Où : {detail.ou_aller}.</p>
                        </details>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        <p className="notice">
          Rappelle toujours : la pilule d'urgence existe (jusqu'à 5 jours) et seul le préservatif protège aussi des IST. Présente au moins deux ou trois méthodes.
        </p>
        <div className="row">
          <button type="button" className="btn primary" onClick={() => setStep("conseil")}>
            Passer à la qualité du conseil
          </button>
          <button type="button" className="btn ghost" onClick={() => setStep("profil")}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool">
      <section className="panel" aria-label="Accueillir">
        <h2>Accueillir</h2>
        <ul className="plain">
          {WELCOME_REMINDERS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <Choice label="Qui consulte ?" value={answers.sex} onChange={(v) => set({ sex: v })} options={[{ id: "femme", label: "Une femme" }, { id: "homme", label: "Un homme" }]} />

      <fieldset className="tool-step">
        <legend>Tranche d'âge (facultatif)</legend>
        <p className="muted">Ne sert qu'à t'afficher les bons rappels. Ne la demande pas pour refuser une aide.</p>
        <div className="opts">
          {AGE_BANDS.map((band) => (
            <button key={band} type="button" className={`opt${age === band ? " on" : ""}`} aria-pressed={age === band} onClick={() => setAge(age === band ? "" : band)}>
              {band}
            </button>
          ))}
        </div>
        {young && <p className="notice">Jeune : accueil sans jugement, temps seul(e) si besoin, confidentialité, protection contre les IST. Vérifie les règles légales du pays pour les mineurs et oriente si tu ne peux pas aider.</p>}
      </fieldset>

      <Choice
        label="Veut-elle ou veut-il des enfants ?"
        value={answers.children}
        onChange={(v) => set({ children: v })}
        options={[{ id: "plus-tard", label: "Peut-être plus tard" }, { id: "plus-du-tout", label: "Plus du tout" }]}
      />

      {woman && (
        <>
          <fieldset className="tool-step">
            <legend>Peut-elle être enceinte ? (liste OMS, 6 questions)</legend>
            {PREGNANCY_QUESTIONS.map((q) => (
              <div key={q.id} className="yn">
                <span>{q.text}</span>
                <span className="opts inline">
                  <button type="button" className={`opt${pregnancy[q.id] === true ? " on" : ""}`} aria-pressed={pregnancy[q.id] === true} onClick={() => setPregnancy({ ...pregnancy, [q.id]: true })}>
                    Oui
                  </button>
                  <button type="button" className={`opt${pregnancy[q.id] === false ? " on" : ""}`} aria-pressed={pregnancy[q.id] === false} onClick={() => setPregnancy({ ...pregnancy, [q.id]: false })}>
                    Non
                  </button>
                </span>
              </div>
            ))}
            <label className="check">
              <input type="checkbox" checked={signs} onChange={(e) => setSigns(e.target.checked)} /> Signes de grossesse ({PREGNANCY_SIGNS.precoces.slice(0, 3).join(", ").toLowerCase()}…)
            </label>
          </fieldset>

          <Choice
            label="Accouchement récent ?"
            value={answers.birth}
            onChange={(v) => set({ birth: v, breastfeeding: v === "non" ? "non" : answers.breastfeeding })}
            options={[{ id: "non", label: "Non" }, { id: "moins-6-semaines", label: "Moins de 6 semaines" }, { id: "6-semaines-6-mois", label: "6 semaines à 6 mois" }]}
          />
          {answers.birth !== "non" && (
            <Choice
              label="Allaitement"
              value={answers.breastfeeding}
              onChange={(v) => set({ breastfeeding: v })}
              options={[{ id: "non", label: "Non" }, { id: "exclusif-sans-regles", label: "Exclusif, règles absentes" }, { id: "autre", label: "Non exclusif ou règles revenues" }]}
            />
          )}
          <Choice
            label="Cycle"
            value={answers.cycle}
            onChange={(v) => set({ cycle: v })}
            options={[{ id: "inconnu", label: "Je ne sais pas" }, { id: "regulier", label: "Régulier (26 à 32 jours)" }, { id: "irregulier", label: "Irrégulier" }]}
          />

          <fieldset className="tool-step">
            <legend>Problèmes de santé (guide OMS, p. 19)</legend>
            {CONDITIONS.map((c) => (
              <label key={c.id} className="check">
                <input type="checkbox" checked={answers.conditions.includes(c.id)} onChange={() => toggleCondition(c.id)} /> {c.label}
              </label>
            ))}
          </fieldset>
        </>
      )}

      <fieldset className="tool-step">
        <legend>Ce qui compte pour la personne</legend>
        <label className="check">
          <input type="checkbox" checked={answers.protectIst} onChange={(e) => set({ protectIst: e.target.checked })} /> Se protéger aussi des IST
        </label>
        <label className="check">
          <input type="checkbox" checked={answers.noDaily} onChange={(e) => set({ noDaily: e.target.checked })} /> Ne pas y penser tous les jours
        </label>
      </fieldset>

      <button type="button" className="btn primary big" onClick={() => setStep("methodes")}>
        Voir les méthodes possibles
      </button>
    </div>
  );
}

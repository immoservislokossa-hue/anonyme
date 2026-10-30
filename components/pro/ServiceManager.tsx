"use client";

import { useEffect, useState } from "react";
import { ACCUEIL_ITEMS, LEVEL_LABEL, evaluerAccueil, type AccueilId } from "@/lib/pro/accueil";
import { METHOD_LIST, SERVICE_TYPES, type ServiceMethod } from "@/lib/services";

const KEY = "pro-service-v1";
type Saved = { id: string; jeton: string };

type FormState = {
  nom: string;
  type: string;
  zone: string;
  commune: string;
  adresse: string;
  telephone: string;
  horaires: string;
  methodes: ServiceMethod[];
  accueilJeunes: boolean;
  gratuitJeunes: "oui" | "non" | "inconnu";
  confidentialite: boolean;
  siteWeb: string;
};

const EMPTY: FormState = { nom: "", type: "centre-sante", zone: "", commune: "", adresse: "", telephone: "", horaires: "", methodes: [], accueilJeunes: false, gratuitJeunes: "inconnu", confidentialite: false, siteWeb: "" };

// Mon service : inscrire, mettre à jour, signaler une rupture, évaluer l'accueil des jeunes.
export default function ServiceManager({ zones }: { zones: string[] }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Saved | null>(null);
  const [fresh, setFresh] = useState<(Saved & { code?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [manageId, setManageId] = useState("");
  const [manageToken, setManageToken] = useState("");
  const [stockMethod, setStockMethod] = useState<ServiceMethod>("pilule");
  const [yes, setYes] = useState<AccueilId[]>([]);

  useEffect(() => {
    try {
      const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "null") as Saved | null;
      if (raw && typeof raw.id === "string" && typeof raw.jeton === "string") setSaved(raw);
    } catch {
      // Rien d'enregistré sur cet appareil.
    }
  }, []);

  const accueil = evaluerAccueil(yes);
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const toggleMethod = (id: ServiceMethod) => set("methodes", form.methodes.includes(id) ? form.methodes.filter((m) => m !== id) : [...form.methodes, id]);

  async function register() {
    setBusy(true);
    setErrors({});
    setNotice("");
    const response = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as { id?: string; code?: string; jeton?: string; errors?: Record<string, string>; error?: string } | null;
    if (response?.status === 201 && data?.id && data.jeton) {
      setFresh({ id: data.id, jeton: data.jeton, code: data.code });
    } else if (data?.errors) {
      setErrors(data.errors);
    } else {
      setNotice(data?.error ?? "L'inscription n'a pas pu être envoyée. Réessaie plus tard.");
    }
    setBusy(false);
  }

  function remember(value: Saved) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      // Stockage indisponible.
    }
    setSaved(value);
  }

  const active: Saved | null = saved ?? (manageId && manageToken ? { id: manageId.trim(), jeton: manageToken.trim() } : null);

  async function signalStock(etat: "disponible" | "rupture") {
    if (!active) return;
    const response = await fetch("/api/stock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId: active.id, jeton: active.jeton, methode: stockMethod, etat }) }).catch(() => null);
    setNotice(response && response.status === 204 ? "Signal enregistré. Merci." : "Signal non enregistré : vérifie l'identifiant et le jeton.");
  }

  return (
    <div className="tool">
      <section className="panel" aria-labelledby="inscrire">
        <h2 id="inscrire">Inscrire mon service</h2>
        <p className="muted">Les jeunes verront ton service dans l'annuaire après validation par un responsable. Les informations sont déclaratives : dis la vérité.</p>
        {fresh ? (
          <div className="notice" role="status">
            <p>
              <strong>Inscription reçue : en attente de validation.</strong>
            </p>
            <p>
              Identifiant : <code>{fresh.id}</code>
              <br />
              Jeton de gestion : <code>{fresh.jeton}</code>
              {fresh.code && (
                <>
                  <br />
                  Code du service : <code>{fresh.code}</code>
                </>
              )}
            </p>
            {fresh.code && <p>Quand ton service sera validé, ta carte avec un QR sera ici : <code>/prestataires/carte/{fresh.code}</code></p>}
            <p>Note-le maintenant : il ne sera plus affiché. Il sert à mettre à jour ton service et à signaler les ruptures.</p>
            <button type="button" className="btn primary" onClick={() => remember(fresh)}>
              Garder sur cet appareil
            </button>
          </div>
        ) : (
          <form
            className="fields"
            onSubmit={(e) => {
              e.preventDefault();
              void register();
            }}
          >
            <label className="field">
              <span>Nom du service</span>
              <input value={form.nom} onChange={(e) => set("nom", e.target.value)} maxLength={120} required />
              {errors.nom && <em className="error">{errors.nom}</em>}
            </label>
            <label className="field">
              <span>Type</span>
              <select value={form.type} onChange={(e) => set("type", e.target.value)}>
                {SERVICE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Zone</span>
              <select value={form.zone} onChange={(e) => set("zone", e.target.value)} required>
                <option value="">Choisis</option>
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
              {errors.zone && <em className="error">{errors.zone}</em>}
            </label>
            <label className="field">
              <span>Commune ou village</span>
              <input value={form.commune} onChange={(e) => set("commune", e.target.value)} maxLength={80} required />
              {errors.commune && <em className="error">{errors.commune}</em>}
            </label>
            <label className="field">
              <span>Adresse ou repère (facultatif)</span>
              <input value={form.adresse} onChange={(e) => set("adresse", e.target.value)} maxLength={160} />
            </label>
            <label className="field">
              <span>Téléphone (facultatif)</span>
              <input value={form.telephone} onChange={(e) => set("telephone", e.target.value)} inputMode="tel" maxLength={20} />
              {errors.telephone && <em className="error">{errors.telephone}</em>}
            </label>
            <label className="field">
              <span>Horaires (facultatif)</span>
              <input value={form.horaires} onChange={(e) => set("horaires", e.target.value)} maxLength={120} />
            </label>
            <fieldset className="tool-step">
              <legend>Méthodes proposées aujourd'hui</legend>
              {METHOD_LIST.map((m) => (
                <label key={m.id} className="check">
                  <input type="checkbox" checked={form.methodes.includes(m.id)} onChange={() => toggleMethod(m.id)} /> {m.label}
                </label>
              ))}
              {errors.methodes && <em className="error">{errors.methodes}</em>}
            </fieldset>
            <label className="check">
              <input type="checkbox" checked={form.accueilJeunes} onChange={(e) => set("accueilJeunes", e.target.checked)} /> Nous accueillons les jeunes sans condition d'âge ni de statut (dans le cadre de la loi)
            </label>
            <label className="check">
              <input type="checkbox" checked={form.confidentialite} onChange={(e) => set("confidentialite", e.target.checked)} /> La confidentialité est assurée
            </label>
            <label className="field">
              <span>Gratuit pour les jeunes ?</span>
              <select value={form.gratuitJeunes} onChange={(e) => set("gratuitJeunes", e.target.value as FormState["gratuitJeunes"])}>
                <option value="inconnu">Je ne sais pas</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </label>
            {/* Champ piège : invisible pour les personnes, rempli par les robots. */}
            <div aria-hidden="true" className="hp">
              <input tabIndex={-1} autoComplete="off" value={form.siteWeb} onChange={(e) => set("siteWeb", e.target.value)} />
            </div>
            {notice && <p className="notice alert">{notice}</p>}
            <button type="submit" className="btn primary" disabled={busy}>
              Envoyer l'inscription
            </button>
          </form>
        )}
      </section>

      <section className="panel" aria-labelledby="gerer">
        <h2 id="gerer">Signaler une rupture ou un retour de stock</h2>
        {!saved && (
          <div className="fields">
            <label className="field">
              <span>Identifiant du service</span>
              <input value={manageId} onChange={(e) => setManageId(e.target.value)} autoComplete="off" />
            </label>
            <label className="field">
              <span>Jeton de gestion</span>
              <input value={manageToken} onChange={(e) => setManageToken(e.target.value)} autoComplete="off" />
            </label>
          </div>
        )}
        <label className="field">
          <span>Méthode</span>
          <select value={stockMethod} onChange={(e) => setStockMethod(e.target.value as ServiceMethod)}>
            {METHOD_LIST.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <div className="row">
          <button type="button" className="btn ghost" disabled={!active} onClick={() => signalStock("rupture")}>
            En rupture
          </button>
          <button type="button" className="btn primary" disabled={!active} onClick={() => signalStock("disponible")}>
            Disponible
          </button>
        </div>
        {notice && <p role="status" className="muted">{notice}</p>}
        <p className="muted">Les ruptures aident les jeunes à ne pas se déplacer pour rien, et les responsables de district à agir.</p>
      </section>

      <section className="panel" aria-labelledby="carte">
        <h2 id="carte">Ma carte avec QR</h2>
        <p className="muted">Une carte à imprimer : un jeune qui la scanne arrive sur la page de ton service pour préparer sa visite. Chaque scan est compté, sans identité. Tu vois ensuite combien ont donné un avis.</p>
        <CardLink />
      </section>

      <section className="panel" aria-labelledby="accueil">
        <h2 id="accueil">Mon service accueille-t-il bien les jeunes ?</h2>
        <p className="muted">Dix questions pour savoir où progresser. C'est pour toi : rien n'est envoyé.</p>
        <ul className="checklist">
          {ACCUEIL_ITEMS.map((item) => (
            <li key={item.id}>
              <label>
                <input type="checkbox" checked={yes.includes(item.id)} onChange={() => setYes(yes.includes(item.id) ? yes.filter((y) => y !== item.id) : [...yes, item.id])} />
                <span>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
        <p>
          <strong>
            {accueil.score} sur {accueil.max} : {LEVEL_LABEL[accueil.level]}
          </strong>
        </p>
        {accueil.pistes.length > 0 && (
          <>
            <h3>Pistes pour progresser</h3>
            <ul className="plain">
              {accueil.pistes.slice(0, 5).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

function CardLink() {
  const [code, setCode] = useState("");
  const valid = /^[A-Za-z0-9]{6}$/.test(code.trim());
  return (
    <div className="fields">
      <label className="field">
        <span>Code du service (6 signes)</span>
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} autoComplete="off" />
      </label>
      {valid ? (
        <a className="btn primary" href={`/prestataires/carte/${code.trim()}`}>
          Ouvrir ma carte
        </a>
      ) : (
        <p className="muted">Le code s'affiche à l'inscription. Le service doit être validé.</p>
      )}
    </div>
  );
}

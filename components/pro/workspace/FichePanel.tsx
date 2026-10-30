"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/components/pro/workspace/Workspace";
import { METHOD_LIST, SERVICE_TYPES, type ServiceMethod } from "@/lib/services";

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

// Ma fiche : l'inscription du service, puis sa mise à jour. Le nom, le type, la zone et la commune ne changent plus après l'inscription.
export default function FichePanel() {
  const { service, zones, reload, remember, hasToken, active } = useWorkspace();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [fresh, setFresh] = useState<{ id: string; jeton: string; code?: string } | null>(null);
  const editing = service !== null;

  useEffect(() => {
    if (service) {
      setForm({
        nom: service.nom,
        type: service.type,
        zone: service.zone,
        commune: service.commune,
        adresse: service.adresse ?? "",
        telephone: service.telephone ?? "",
        horaires: service.horaires ?? "",
        methodes: service.methodes,
        accueilJeunes: service.accueilJeunes,
        gratuitJeunes: service.gratuitJeunes,
        confidentialite: service.confidentialite,
        siteWeb: "",
      });
    }
  }, [service]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const toggle = (id: ServiceMethod) => set("methodes", form.methodes.includes(id) ? form.methodes.filter((m) => m !== id) : [...form.methodes, id]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setNotice("");
    const url = editing ? `/api/services/${service.id}` : "/api/services";
    const body = editing ? { ...form, jeton: active?.jeton ?? "" } : form;
    const response = await fetch(url, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const data = (await response?.json().catch(() => null)) as { id?: string; code?: string; jeton?: string; errors?: Record<string, string>; error?: string } | null;
    setBusy(false);
    if (editing && response?.ok) {
      setNotice("Fiche mise à jour.");
      await reload();
    } else if (!editing && response?.status === 201 && data?.id && data.jeton) {
      remember({ id: data.id, jeton: data.jeton });
      setFresh({ id: data.id, jeton: data.jeton, code: data.code });
      await reload();
    } else if (data?.errors) {
      setErrors(data.errors);
    } else {
      setNotice(data?.error ?? "L'envoi n'a pas marché. Réessaie dans un moment.");
    }
  }

  if (fresh && !editing) {
    return (
      <section className="ws-card" role="status">
        <h1>Inscription reçue</h1>
        <p className="lede">Ta fiche attend la validation d'un responsable. Tu seras visible des jeunes juste après.</p>
        <p>
          Code du service : <code>{fresh.code}</code>
        </p>
        <p className="muted">Ce code est gardé sur cet appareil. Garde aussi ce jeton de secours : <code>{fresh.jeton}</code></p>
      </section>
    );
  }

  return (
    <>
      <header className="ws-head">
        <h1>{editing ? "Ma fiche" : "Inscrire mon service"}</h1>
        <p className="lede">Les jeunes voient ces informations dans l'annuaire, après validation. Elles sont déclaratives : dis la vérité.</p>
      </header>
      <form className="ws-form" onSubmit={submit}>
        <section className="ws-card" aria-labelledby="f-id">
          <h2 id="f-id">Qui es-tu ?</h2>
          <div className="ws-grid">
            <label className="field">
              <span>Nom du service</span>
              <input value={form.nom} onChange={(e) => set("nom", e.target.value)} maxLength={120} required disabled={editing} />
              {errors.nom && <em className="error">{errors.nom}</em>}
            </label>
            <label className="field">
              <span>Type</span>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} disabled={editing}>
                {SERVICE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="ws-card" aria-labelledby="f-lieu">
          <h2 id="f-lieu">Où et quand ?</h2>
          <div className="ws-grid">
            <label className="field">
              <span>Zone sanitaire</span>
              <select value={form.zone} onChange={(e) => set("zone", e.target.value)} required disabled={editing}>
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
              <input value={form.commune} onChange={(e) => set("commune", e.target.value)} maxLength={80} required disabled={editing} />
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
            <label className="field ws-wide">
              <span>Horaires (facultatif)</span>
              <input value={form.horaires} onChange={(e) => set("horaires", e.target.value)} maxLength={120} />
            </label>
          </div>
        </section>

        <section className="ws-card" aria-labelledby="f-meth">
          <h2 id="f-meth">Ce que tu proposes aujourd'hui</h2>
          <fieldset className="ws-checks">
            <legend className="sr-only">Méthodes proposées</legend>
            {METHOD_LIST.map((m) => (
              <label key={m.id} className="check">
                <input type="checkbox" checked={form.methodes.includes(m.id)} onChange={() => toggle(m.id)} /> {m.label}
              </label>
            ))}
          </fieldset>
          {errors.methodes && <em className="error">{errors.methodes}</em>}
        </section>

        <section className="ws-card" aria-labelledby="f-eng">
          <h2 id="f-eng">Ton accueil des jeunes</h2>
          <div className="ws-checks">
            <label className="check">
              <input type="checkbox" checked={form.accueilJeunes} onChange={(e) => set("accueilJeunes", e.target.checked)} /> Nous accueillons les jeunes sans condition d'âge ni de statut (dans le cadre de la loi)
            </label>
            <label className="check">
              <input type="checkbox" checked={form.confidentialite} onChange={(e) => set("confidentialite", e.target.checked)} /> La confidentialité est assurée
            </label>
          </div>
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
        </section>

        {notice && <p className="notice" role="status">{notice}</p>}
        <div className="ws-actions">
          <button type="submit" className="btn primary" disabled={busy}>
            {editing ? "Enregistrer" : "Envoyer l'inscription"}
          </button>
        </div>
        {!editing && hasToken && <p className="muted">Un accès existe déjà sur cet appareil pour un service inscrit.</p>}
      </form>
    </>
  );
}

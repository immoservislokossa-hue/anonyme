"use client";

import { useRef, useState } from "react";
import Icon from "@/components/Icon";
import type { Centre, PlaceKind } from "@/lib/places";

type State =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "loading" }
  | { status: "done"; centres: Centre[]; configured: boolean; byPosition: boolean; source: Centre["source"] }
  | { status: "error"; message: string };

type Search = { lat?: number; lng?: number; query?: string };

const KINDS: { id: PlaceKind; label: string; singular: string }[] = [
  { id: "centre", label: "Centres de santé", singular: "centre de santé" },
  { id: "pharmacie", label: "Pharmacies", singular: "pharmacie" },
];

const SOURCE_NOTES: Record<Centre["source"], string> = {
  google: "Résultats de Google Maps.",
  scrappa: "Résultats issus de Google Maps, fournis par Scrappa.",
};

function sourceNotes(centres: Centre[]): string {
  const sources = new Set(centres.map((centre) => centre.source ?? "scrappa"));
  return [...sources].map((source) => SOURCE_NOTES[source]).join(" ");
}

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`;
}

// Recherche des centres de santé ou des pharmacies proches, par position (si la personne l'accepte) ou par nom de lieu.
export default function NearbyCentres() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [place, setPlace] = useState("");
  const [kind, setKind] = useState<PlaceKind>("centre");
  // Précision de la position donnée par l'appareil, en mètres (null si la recherche se fait par nom de lieu).
  const [accuracy, setAccuracy] = useState<number | null>(null);
  // La dernière recherche reste en mémoire le temps de la visite, pour changer de type sans redemander la position.
  const lastSearch = useRef<Search | null>(null);

  const current = KINDS.find((item) => item.id === kind) ?? KINDS[0];

  async function search(payload: Search, wanted: PlaceKind = kind) {
    lastSearch.current = payload;
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/centres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, kind: wanted }),
      });

      if (response.status === 429) {
        setState({ status: "error", message: "Trop de recherches en peu de temps. Réessaie dans une minute." });
        return;
      }
      if (!response.ok) {
        setState({ status: "error", message: "La recherche ne fonctionne pas pour le moment. Vois nos centres partenaires plus bas." });
        return;
      }

      const data = (await response.json()) as { configured?: boolean; centres?: Centre[]; source?: Centre["source"] };
      setState({
        status: "done",
        centres: data.centres ?? [],
        configured: data.configured !== false,
        byPosition: payload.lat !== undefined,
        source: data.source ?? "scrappa",
      });
    } catch {
      setState({ status: "error", message: "Pas de connexion. Réessaie, ou vois nos centres partenaires plus bas." });
    }
  }

  function chooseKind(next: PlaceKind) {
    if (next === kind) return;
    setKind(next);
    if (lastSearch.current) search(lastSearch.current, next);
  }

  function useMyPosition() {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", message: "Ton appareil ne permet pas de partager la position. Écris le nom de ta commune." });
      return;
    }

    setState({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAccuracy(Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null);
        search({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        setState({
          status: "error",
          message: denied
            ? "Tu as refusé de partager ta position. Pas de problème : écris le nom de ta commune."
            : "Ta position n'a pas pu être trouvée. Écris le nom de ta commune.",
        });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  }

  const busy = state.status === "locating" || state.status === "loading";

  return (
    <section className="panel nearby" aria-label="Autour de moi">
      <div>
        <h2>Autour de moi</h2>
        <p className="muted">
          Ta position sert à calculer les distances sur ton téléphone. Rien n'est enregistré par ce service. Tu
          peux aussi écrire le nom de ta commune.
        </p>
      </div>

      <div className="tabs" role="group" aria-label="Type de lieu">
        {KINDS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`tab${item.id === kind ? " active" : ""}`}
            aria-pressed={item.id === kind}
            onClick={() => chooseKind(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="nearby-actions">
        <button type="button" className="btn primary" onClick={useMyPosition} disabled={busy}>
          <Icon name="pin" size={20} />
          Utiliser ma position
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (place.trim()) {
            setAccuracy(null);
            search({ query: place });
          }
        }}
      >
        <label htmlFor="lieu" className="sr-only">
          Commune ou quartier
        </label>
        <input
          id="lieu"
          value={place}
          maxLength={80}
          onChange={(event) => setPlace(event.target.value)}
          placeholder="Commune ou quartier"
          autoComplete="off"
        />
        <button type="submit" className="btn" disabled={busy || place.trim().length === 0}>
          Chercher
        </button>
      </form>

      <div aria-live="polite">
        {accuracy !== null && accuracy > 0 && (state.status === "loading" || state.status === "done") && (
          <p className={accuracy > 1500 ? "notice" : "muted"}>
            {accuracy > 1500 && <Icon name="alert" size={18} />}
            <span>
              Position détectée avec une précision d'environ {formatDistance(accuracy / 1000)}.
              {accuracy > 1500 &&
                " C'est trop approximatif : sur ordinateur, la position vient souvent du Wi-Fi ou de l'opérateur. Sur téléphone, active le GPS, ou écris le nom de ton quartier."}
            </span>
          </p>
        )}
        {state.status === "locating" && <p className="muted">Recherche de ta position…</p>}
        {state.status === "loading" && <p className="muted">Recherche de {current.singular === "pharmacie" ? "pharmacies" : "centres"} proches…</p>}
        {state.status === "error" && <p className="urgent">{state.message}</p>}

        {state.status === "done" && !state.configured && (
          <p className="notice">
            <Icon name="shield" size={18} />
            <span>La recherche Google Maps n'est pas encore activée. Vois nos centres partenaires plus bas.</span>
          </p>
        )}

        {state.status === "done" && state.configured && state.centres.length === 0 && (
          <p className="notice">
            <Icon name="shield" size={18} />
            <span>
              Aucun résultat. Essaie un autre nom de lieu, ou vois nos centres partenaires plus bas.
            </span>
          </p>
        )}
      </div>

      {state.status === "done" && state.centres.length > 0 && (
        <>
          <ul className="stack cols">
            {state.centres.map((centre) => (
              <li key={centre.id} className="result">
                <div className="row-between">
                  <h3>{centre.nom}</h3>
                  {state.byPosition && centre.distanceKm !== null && (
                    <span className="tag vert">à {formatDistance(centre.distanceKm)}</span>
                  )}
                </div>
                {centre.adresse && <p className="muted">{centre.adresse}</p>}
                {centre.telephone && (
                  <p>
                    <a href={`tel:${centre.telephone.replace(/\s+/g, "")}`}>{centre.telephone}</a>
                  </p>
                )}
                <div className="actions">
                  <a className="btn primary small" href={centre.itineraireUrl} target="_blank" rel="noopener noreferrer">
                    Itinéraire
                  </a>
                  <a className="chip-btn" href={centre.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Voir sur Google Maps
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <p className="muted">
            {sourceNotes(state.centres)} Ils ne garantissent pas que le lieu propose le service : vérifie les horaires
            et ce qui est disponible avant de te déplacer.
            {kind === "pharmacie" &&
              " Selon le pays, une pharmacie peut proposer préservatifs, tests de grossesse et contraception d'urgence : demande conseil au pharmacien."}
          </p>
        </>
      )}
    </section>
  );
}

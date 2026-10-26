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
  osm: "Données © contributeurs OpenStreetMap, une carte libre : un lieu absent de la carte n'apparaît pas.",
  google: "Résultats de Google Maps.",
  scrappa: "Résultats issus de Google Maps, fournis par Scrappa.",
};

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`;
}

// Recherche des centres de santé ou des pharmacies proches, par position (si la personne l'accepte) ou par nom de lieu.
export default function NearbyCentres() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [place, setPlace] = useState("");
  const [kind, setKind] = useState<PlaceKind>("centre");
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
        setState({ status: "error", message: "Trop de recherches en peu de temps. Réessayez dans une minute." });
        return;
      }
      if (!response.ok) {
        setState({ status: "error", message: "La recherche ne fonctionne pas pour le moment. Voyez nos centres partenaires plus bas." });
        return;
      }

      const data = (await response.json()) as { configured?: boolean; centres?: Centre[]; source?: Centre["source"] };
      setState({
        status: "done",
        centres: data.centres ?? [],
        configured: data.configured !== false,
        byPosition: payload.lat !== undefined,
        source: data.source ?? "osm",
      });
    } catch {
      setState({ status: "error", message: "Pas de connexion. Réessayez, ou voyez nos centres partenaires plus bas." });
    }
  }

  function chooseKind(next: PlaceKind) {
    if (next === kind) return;
    setKind(next);
    if (lastSearch.current) search(lastSearch.current, next);
  }

  function useMyPosition() {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", message: "Votre appareil ne permet pas de partager la position. Écrivez le nom de votre commune." });
      return;
    }

    setState({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (position) => search({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        setState({
          status: "error",
          message: denied
            ? "Vous avez refusé de partager votre position. Pas de problème : écrivez le nom de votre commune."
            : "Votre position n'a pas pu être trouvée. Écrivez le nom de votre commune.",
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
          Votre position est envoyée à un service de cartes pour trouver les lieux proches. Elle n'est pas enregistrée
          par ce service. Vous pouvez aussi écrire le nom de votre commune.
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
        <button type="button" className="btn indigo" onClick={useMyPosition} disabled={busy}>
          <Icon name="pin" size={20} />
          Utiliser ma position
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (place.trim()) search({ query: place });
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
        {state.status === "locating" && <p className="muted">Recherche de votre position…</p>}
        {state.status === "loading" && <p className="muted">Recherche de {current.singular === "pharmacie" ? "pharmacies" : "centres"} proches…</p>}
        {state.status === "error" && <p className="urgent">{state.message}</p>}

        {state.status === "done" && !state.configured && (
          <p className="notice">
            <Icon name="shield" size={18} />
            <span>La recherche Google Maps n'est pas encore activée. Voyez nos centres partenaires plus bas.</span>
          </p>
        )}

        {state.status === "done" && state.configured && state.centres.length === 0 && (
          <p className="notice">
            <Icon name="shield" size={18} />
            <span>
              Aucun résultat. Essayez un autre nom de lieu, ou voyez nos centres partenaires plus bas.
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
                  <a className="btn indigo small" href={centre.itineraireUrl} target="_blank" rel="noopener noreferrer">
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
            {SOURCE_NOTES[state.source]} Ils ne garantissent pas que le lieu propose le service : vérifiez les horaires
            et ce qui est disponible avant de vous déplacer.
            {kind === "pharmacie" &&
              " Selon le pays, une pharmacie peut proposer préservatifs, tests de grossesse et contraception d'urgence : demandez conseil au pharmacien."}
          </p>
        </>
      )}
    </section>
  );
}

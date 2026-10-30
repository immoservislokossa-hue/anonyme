"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AFI_OPEN_EVENT } from "@/components/AskAfi";
import Chat, { type AutoMessage } from "@/components/Chat";
import Silhouette from "@/components/Silhouette";
import { contextFor } from "@/lib/afi";
import { espaceOf } from "@/lib/espaces";

type Place = { side: "left" | "right"; bottom: number | null };

const KEY = "afi-place-v1";
const SIZE = 64;
const MOVE_THRESHOLD = 6;

function readPlace(): Place {
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "null") as Partial<Place> | null;
    if (raw && (raw.side === "left" || raw.side === "right")) {
      return { side: raw.side, bottom: typeof raw.bottom === "number" ? raw.bottom : null };
    }
  } catch {
    // Stockage indisponible : position par défaut.
  }
  return { side: "right", bottom: null };
}

// Afi, sur toutes les pages : une bulle qu'on peut déplacer (elle se colle au bord), ouvrir et fermer.
// La conversation reste là quand on change de page, et Afi propose des questions adaptées à la page.
export default function AfiBubble() {
  const pathname = usePathname();
  const context = useMemo(() => contextFor(pathname), [pathname]);
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [place, setPlace] = useState<Place>({ side: "right", bottom: null });
  const [dragAt, setDragAt] = useState<{ x: number; y: number } | null>(null);
  const [auto, setAuto] = useState<AutoMessage | null>(null);
  const drag = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);
  const justDragged = useRef(false);
  const counter = useRef(0);

  useEffect(() => setPlace(readPlace()), []);

  const show = useCallback(() => {
    setEverOpened(true);
    setOpen(true);
  }, []);

  // Les boutons « Demander à Afi » des pages ouvrent la bulle, avec la question déjà posée.
  useEffect(() => {
    function onOpen(event: Event) {
      const message = (event as CustomEvent<{ message?: string }>).detail?.message;
      show();
      if (message) {
        counter.current += 1;
        setAuto({ id: counter.current, text: message });
      }
    }
    window.addEventListener(AFI_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(AFI_OPEN_EVENT, onOpen);
  }, [show]);

  function save(next: Place) {
    setPlace(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Rien à faire.
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    drag.current = { startX: event.clientX, startY: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const state = drag.current;
    if (!state) return;
    if (!state.moved && Math.hypot(event.clientX - state.startX, event.clientY - state.startY) < MOVE_THRESHOLD) return;
    state.moved = true;
    const x = Math.min(Math.max(event.clientX - state.offsetX, 8), window.innerWidth - SIZE - 8);
    const y = Math.min(Math.max(event.clientY - state.offsetY, 8), window.innerHeight - SIZE - 8);
    setDragAt({ x, y });
  }

  function onPointerUp() {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved || !dragAt) return;
    justDragged.current = true;
    window.setTimeout(() => (justDragged.current = false), 0);
    // Elle se colle au bord le plus proche, à la hauteur où on l'a lâchée.
    const side = dragAt.x + SIZE / 2 < window.innerWidth / 2 ? "left" : "right";
    const bottom = Math.max(12, window.innerHeight - dragAt.y - SIZE);
    setDragAt(null);
    save({ side, bottom });
  }

  function onClick() {
    if (justDragged.current) return;
    if (open) setOpen(false);
    else show();
  }

  const style: React.CSSProperties = dragAt
    ? { left: dragAt.x, top: dragAt.y, right: "auto", bottom: "auto" }
    : { [place.side]: 14, ...(place.bottom !== null ? { bottom: place.bottom } : {}) };

  // Afi est l'assistante des jeunes : dans les espaces prestataires et pilotage, elle n'apparaît pas.
  if (espaceOf(pathname) !== "jeunes") return null;

  return (
    <div className={`afi side-${place.side}${open ? " open" : ""}`} style={style}>
      {everOpened && (
        <section className="afi-panel" role="dialog" aria-label="Afi" hidden={!open}>
          <header className="afi-head">
            <strong>Afi</strong>
            <button type="button" className="afi-close" onClick={() => setOpen(false)} aria-label="Fermer Afi">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>
          <div className="afi-body">
            <Chat
              embedded
              tips={context.tips}
              context={context.key}
              auto={auto}
              greeting={context.label ? `Tu es sur « ${context.label} ». Je peux t'aider ? Choisis une idée ou écris ta question.` : undefined}
            />
          </div>
        </section>
      )}

      <button
        type="button"
        className="afi-fab"
        data-tour="tab-chat"
        aria-label={open ? "Fermer Afi" : "Parler à Afi"}
        aria-expanded={open}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
      >
        <Silhouette who="afi" size={SIZE - 8} bust />
        <span className="afi-label">Afi</span>
      </button>
    </div>
  );
}

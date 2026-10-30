"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import SearchBox from "@/components/SearchBox";
import type { SearchItem } from "@/lib/catalog";

// La recherche de tout le site, ouverte depuis l'en-tête ou avec la touche « / ». L'index est un petit fichier gardé hors connexion.
export default function SearchDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const pathname = usePathname();

  const open = useCallback(() => {
    dialog.current?.showModal();
    window.setTimeout(() => dialog.current?.querySelector("input")?.focus(), 30);
    if (items === null) {
      fetch("/search-index.json")
        .then((r) => r.json())
        .then((d: { items: SearchItem[] }) => setItems(d.items))
        .catch(() => setFailed(true));
    }
  }, [items]);

  useEffect(() => dialog.current?.close(), [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="icon-btn search-btn" onClick={open} aria-label="Chercher dans Alviosa" aria-keyshortcuts="/">
        <Icon name="search" size={20} />
      </button>
      <dialog ref={dialog} className="search-dialog" aria-label="Recherche" onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="search-dialog-body">
          <div className="row-between">
            <strong>Chercher</strong>
            <button type="button" className="chip-btn" onClick={() => dialog.current?.close()}>
              Fermer
            </button>
          </div>
          {failed && <p className="notice alert">La recherche n'est pas disponible pour le moment.</p>}
          {items ? <SearchBox items={items} /> : !failed && <p className="muted">Chargement…</p>}
        </div>
      </dialog>
    </>
  );
}

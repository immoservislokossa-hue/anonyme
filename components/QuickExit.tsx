"use client";

import { useEffect } from "react";

const SAFE_PAGE = "https://www.google.com";

export function leaveQuickly() {
  // replace : la page n'apparaît plus dans l'historique de retour.
  window.location.replace(SAFE_PAGE);
}

// Sortie rapide : deux fois la touche Échap, de n'importe où, pour quitter le site si quelqu'un arrive.
export function QuickExitKey() {
  useEffect(() => {
    let last = 0;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const now = Date.now();
      if (now - last < 900) leaveQuickly();
      last = now;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}

export default function QuickExitButton({ className = "quick-exit" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={leaveQuickly} title="Quitter ce site tout de suite">
      Quitter vite
    </button>
  );
}

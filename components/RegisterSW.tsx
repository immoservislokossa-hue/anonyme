"use client";

import { useEffect } from "react";

// Enregistre le service worker pour que le shell de l'application reste disponible hors connexion.
export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // L'application reste utilisable sans service worker.
    });
  }, []);

  return null;
}

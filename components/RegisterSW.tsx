"use client";

import { useEffect, useState } from "react";

const READY_KEY = "offline-ready-v2";

// Enregistre le service worker : il garde toutes les pages sur l'appareil, pour que tout marche sans connexion.
export default function RegisterSW() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    function onMessage(event: MessageEvent) {
      if (event.data?.type !== "offline-ready") return;
      try {
        if (localStorage.getItem(READY_KEY)) return;
        localStorage.setItem(READY_KEY, "1");
      } catch {
        // Sans stockage, on affiche le message à chaque fois.
      }
      setMessage("Prêt : Alviosa marche maintenant sans connexion.");
      window.setTimeout(() => setMessage(null), 6000);
    }

    navigator.serviceWorker.addEventListener("message", onMessage);
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // L'application reste utilisable sans service worker.
    });
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, []);

  if (!message) return null;
  return (
    <p className="offline-toast" role="status">
      {message}
    </p>
  );
}

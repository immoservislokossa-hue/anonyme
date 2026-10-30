"use client";

import { useEffect, useState } from "react";

type State = "check" | "ready" | "wait" | "none";

// Dit honnêtement si ce téléphone a déjà tout gardé pour marcher sans internet.
export default function OfflineStatus() {
  const [state, setState] = useState<State>("check");

  useEffect(() => {
    let alive = true;
    async function check() {
      try {
        if (!("serviceWorker" in navigator) || !("caches" in window)) return alive && setState("none");
        const names = await caches.keys();
        const name = names.find((n) => n.startsWith("shell-"));
        const count = name ? (await (await caches.open(name)).keys()).length : 0;
        if (alive) setState(count >= 30 ? "ready" : "wait");
      } catch {
        if (alive) setState("none");
      }
    }
    void check();
    const timer = window.setInterval(check, 4000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  if (state === "check") return null;
  const text =
    state === "ready"
      ? "Prêt : tout marche sans connexion sur ce téléphone."
      : state === "wait"
        ? "Préparation en cours : reste connecté(e) encore une minute."
        : "Ce navigateur ne permet pas le mode sans connexion.";
  return (
    <p className={`offline-status ${state}`} role="status">
      {text}
    </p>
  );
}

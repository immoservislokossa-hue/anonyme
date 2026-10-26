"use client";

import { useEffect } from "react";

// Petit retour positif affiché quelques secondes après une action utile.
export default function Reward({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(timer);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="reward" role="status">
      {message}
    </div>
  );
}

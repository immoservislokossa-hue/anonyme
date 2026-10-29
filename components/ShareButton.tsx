"use client";

import { useState } from "react";
import { track } from "@/lib/track";

// Envoyer Alviosa à une amie : le partage du téléphone, ou la copie du lien.
export default function ShareButton({ label = "Partager avec une amie", className = "chip-btn" }: { label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    track("partage");
    const url = window.location.origin;
    const data = { title: "Alviosa", text: "Des réponses claires sur la contraception, sans honte et sans jugement.", url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Partage annulé : rien à faire.
    }
  }

  return (
    <button type="button" className={className} onClick={share}>
      {copied ? "Lien copié" : label}
    </button>
  );
}

"use client";

import { track } from "@/lib/track";

// Un seul appui pour envoyer la page à quelqu'un sur WhatsApp, là où les jeunes sont déjà.
export default function WhatsAppShare({ title, className = "chip-btn" }: { title: string; className?: string }) {
  function open() {
    track("partage");
    const text = `${title} : une information claire, sans jugement. ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }
  return (
    <button type="button" className={className} onClick={open}>
      Envoyer sur WhatsApp
    </button>
  );
}

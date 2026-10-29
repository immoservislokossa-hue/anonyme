"use client";

import { useRouter } from "next/navigation";

// Retour à la page d'avant ; si la personne est arrivée directement sur cette page, retour à l'accueil.
export default function BackButton({ className = "back" }: { className?: string }) {
  const router = useRouter();

  function back() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <button type="button" className={className} onClick={back} aria-label="Retour">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m15 5-7 7 7 7" />
      </svg>
    </button>
  );
}

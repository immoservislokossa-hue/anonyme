"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/ia", label: "Comment fonctionne l'IA" },
  { href: "/consentement", label: "Confidentialité" },
  { href: "/aide", label: "Aide" },
];

// Menu du haut pour téléphone : les pages secondaires, hors de la barre du bas.
export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="more-menu">
      <button type="button" className="more-btn" aria-expanded={open} aria-controls="more-panel" onClick={() => setOpen((v) => !v)}>
        <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <>
          <button type="button" className="more-scrim" aria-label="Fermer le menu" onClick={() => setOpen(false)} />
          <nav id="more-panel" className="more-panel" aria-label="Autres pages">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}

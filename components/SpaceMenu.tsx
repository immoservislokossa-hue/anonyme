"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ESPACES, espaceOf } from "@/lib/espaces";

// Le sélecteur d'espace : on voit toujours dans lequel des trois on est, et on passe de l'un à l'autre en un geste.
export default function SpaceMenu() {
  const pathname = usePathname();
  const current = espaceOf(pathname);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const label = ESPACES.find((e) => e.id === current)?.nom.replace("Alviosa ", "") ?? "Toutes les parties";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="space-menu" ref={box}>
      <button type="button" className="space-btn" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((v) => !v)}>
        <span className="space-dot" data-space-id={current} aria-hidden="true" />
        {label}
        <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="space-list">
          {ESPACES.map((e) => (
            <li key={e.id}>
              <Link href={e.href} aria-current={e.id === current ? "page" : undefined}>
                <strong>{e.nom}</strong>
                <span>{e.pour}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/all">
              <strong>Toutes les parties</strong>
              <span>Comment les trois espaces se relient</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

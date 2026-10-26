"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Accueil" },
  { href: "/chat", label: "Parler" },
  { href: "/quiz", label: "Quiz" },
  { href: "/orientation", label: "Centres" },
  { href: "/urgence", label: "Urgence" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`${active ? "active" : ""}${item.href === "/urgence" ? " alert" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

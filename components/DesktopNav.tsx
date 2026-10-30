"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { NAV, espaceOf } from "@/lib/espaces";
import { isActive } from "@/lib/nav";

// Menu du haut : il change selon l'espace (jeunes, prestataires, pilotage). Sur téléphone, seules les icônes restent.
export default function DesktopNav() {
  const pathname = usePathname();
  const espace = espaceOf(pathname);

  return (
    <nav className="desktop-nav" aria-label="Menu principal">
      {NAV[espace].map((item) => {
        const active = espace === "jeunes" ? isActive(pathname, item.href) : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            data-tour={item.tour}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={`${active ? "active" : ""}${item.href === "/urgence" ? " alert" : ""}`}
          >
            <Icon name={item.icon} size={18} />
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive } from "@/lib/nav";
import Icon, { type IconName } from "@/components/Icon";

const items: { href: string; label: string; icon: IconName; tour: string }[] = [
  { href: "/apprendre", label: "Apprendre", icon: "book", tour: "tab-learn" },
  { href: "/orientation", label: "Centres", icon: "pin", tour: "tab-centres" },
  { href: "/urgence", label: "Urgence", icon: "alert", tour: "urgent" },
];

// Menu du haut, visible seulement sur grand écran (sur téléphone, seules les icônes restent).
export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="desktop-nav" aria-label="Menu principal">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            data-tour={item.tour}
            aria-label={item.label}
            href={item.href}
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

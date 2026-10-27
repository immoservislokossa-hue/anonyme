"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive } from "@/lib/nav";
import Icon, { type IconName } from "@/components/Icon";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/chat", label: "Parler", icon: "chat" },
  { href: "/apprendre", label: "Apprendre", icon: "book" },
  { href: "/orientation", label: "Centres", icon: "pin" },
  { href: "/urgence", label: "Urgence", icon: "alert" },
];

// Menu du haut, visible seulement sur grand écran (la barre du bas prend le relais sur téléphone).
export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="desktop-nav" aria-label="Menu principal">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`${active ? "active" : ""}${item.href === "/urgence" ? " alert" : ""}`}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

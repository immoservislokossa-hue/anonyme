"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive } from "@/lib/nav";
import Icon, { type IconName } from "@/components/Icon";

const items: { href: string; label: string; icon: IconName; tour: string }[] = [
  { href: "/", label: "Accueil", icon: "home", tour: "tab-home" },
  { href: "/apprendre", label: "Apprendre", icon: "book", tour: "tab-learn" },
  { href: "/orientation", label: "Centres", icon: "pin", tour: "tab-centres" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Dans la conversation, la barre du bas laisse la place à la zone de saisie.
  if (pathname.startsWith("/chat")) return null;

  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            data-tour={item.tour}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`${active ? "active" : ""}${item.href === "/urgence" ? " alert" : ""}`}
          >
            <span className="tab-icon">
              <Icon name={item.icon} size={24} />
            </span>
            <span className="tab-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

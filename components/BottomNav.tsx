"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive } from "@/lib/nav";
import Icon, { type IconName } from "@/components/Icon";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/chat", label: "Parler", icon: "chat" },
  { href: "/apprendre", label: "Apprendre", icon: "book" },
  { href: "/orientation", label: "Centres", icon: "pin" },
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

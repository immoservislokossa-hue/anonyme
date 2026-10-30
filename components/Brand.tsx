"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { ESPACE_LABEL, brandHref, espaceOf } from "@/lib/espaces";

// Le logo mène à l'accueil de l'espace où l'on est.
export default function Brand() {
  const espace = espaceOf(usePathname());
  const name = ESPACE_LABEL[espace];
  return (
    <Link href={brandHref(espace)} className="brand" aria-label={`${name}, accueil`}>
      <Logo size={36} />
      <span>{name}</span>
    </Link>
  );
}

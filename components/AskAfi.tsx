"use client";

import type { ReactNode } from "react";
import Icon from "@/components/Icon";

export const AFI_OPEN_EVENT = "afi:open";

// Ouvre la bulle d'Afi, avec ou sans question déjà écrite.
export function openAfi(message?: string) {
  window.dispatchEvent(new CustomEvent(AFI_OPEN_EVENT, { detail: { message } }));
}

export default function AskAfi({ message, className = "chip-btn", children }: { message?: string; className?: string; children?: ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => openAfi(message)}>
      {className.includes("link-btn") ? null : <Icon name="chat" size={18} />}
      {children ?? "Demander à Afi"}
    </button>
  );
}

"use client";

import { useState } from "react";
import { openAfi } from "@/components/AskAfi";
import Icon from "@/components/Icon";
import VoiceInput from "@/components/VoiceInput";

// L'entrée de l'accueil : dire ce qui se passe, avec ses mots, au clavier ou à la voix. Afi répond tout de suite.
export default function AskBar({ placeholder = "Dis-moi ce qui se passe…" }: { placeholder?: string }) {
  const [value, setValue] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    openAfi(text);
    setValue("");
  }

  return (
    <form className="askbar" onSubmit={submit} role="search" aria-label="Poser une question à Afi">
      <label htmlFor="askbar" className="sr-only">
        Dis-moi ce qui se passe
      </label>
      <input id="askbar" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} maxLength={300} autoComplete="off" enterKeyHint="send" />
      <VoiceInput onText={(text) => setValue((current) => `${current} ${text}`.trim())} />
      <button type="submit" className="askbar-send" aria-label="Envoyer à Afi" disabled={value.trim().length === 0}>
        <Icon name="send" size={20} />
      </button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";

// Lecture à voix haute avec la voix du téléphone. Le rendu dépend de l'appareil et de la langue installée.
export default function Speak({ text, label = "Écouter" }: { text: string; label?: string }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const available = "speechSynthesis" in window;
    setSupported(available);
    return () => {
      if (available) window.speechSynthesis.cancel();
    };
  }, []);

  if (!supported) return null;

  function toggle() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  }

  return (
    <button type="button" className="btn ghost small" onClick={toggle} aria-pressed={speaking}>
      {speaking ? "Arrêter" : label}
    </button>
  );
}

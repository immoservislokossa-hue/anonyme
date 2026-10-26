"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

// Lecture à voix haute. Si un fichier audio enregistré existe, il est joué ; sinon la voix du téléphone
// prend le relais (le rendu dépend alors de l'appareil et de la langue installée).
export default function Speak({ text, label = "Écouter", audio }: { text: string; label?: string; audio?: string | null }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const player = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const available = "speechSynthesis" in window;
    setSupported(available);
    return () => {
      if (available) window.speechSynthesis.cancel();
      player.current?.pause();
    };
  }, []);

  if (!supported && !audio) return null;

  function speakWithDevice() {
    if (!("speechSynthesis" in window)) {
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    player.current?.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function toggle() {
    if (speaking) {
      stop();
      return;
    }
    setSpeaking(true);
    if (audio) {
      const element = new Audio(audio);
      player.current = element;
      element.onended = () => setSpeaking(false);
      element.onerror = () => speakWithDevice();
      element.play().catch(() => speakWithDevice());
      return;
    }
    speakWithDevice();
  }

  return (
    <button type="button" className={`chip-btn${speaking ? " on" : ""}`} onClick={toggle} aria-pressed={speaking}>
      <Icon name="speaker" size={18} />
      {speaking ? "Arrêter" : label}
    </button>
  );
}

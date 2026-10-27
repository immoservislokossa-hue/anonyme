"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LANGS, pickVoice, type Lang } from "@/lib/i18n";

// Lit une suite de phrases l'une après l'autre : un enregistrement s'il existe, sinon la voix de l'appareil.
// Un minuteur de secours fait avancer la lecture si la voix ne signale pas la fin d'une phrase.
export function useNarrator(lines: string[], lang: Lang, recordings?: string[]) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [approx, setApprox] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const audio = useRef<HTMLAudioElement | null>(null);
  const total = lines.length;

  const stopSound = useCallback(() => {
    window.clearTimeout(timer.current);
    audio.current?.pause();
    audio.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const goNext = useCallback(
    (from: number) => {
      if (from + 1 >= total) {
        setPlaying(false);
        setDone(true);
      } else {
        setIndex(from + 1);
      }
    },
    [total],
  );

  useEffect(() => {
    if (!playing) return;
    const line = lines[index];
    if (line === undefined) return;
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      window.clearTimeout(timer.current);
      goNext(index);
    };
    const fallbackMs = 1800 + line.length * 90;

    const recording = recordings?.[index];
    if (recording) {
      const element = new Audio(recording);
      audio.current = element;
      element.onended = advance;
      element.onerror = () => speak();
      element.play().catch(() => speak());
      timer.current = window.setTimeout(advance, 60000);
    } else {
      speak();
    }

    function speak() {
      if (!("speechSynthesis" in window)) {
        timer.current = (window as Window).setTimeout(advance, fallbackMs);
        return;
      }
      const synth = window.speechSynthesis;
      synth.cancel();
      const tag = LANGS[lang].tts;
      const choice = pickVoice(synth.getVoices(), tag);
      setApprox(choice.approx);
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.lang = choice.voice?.lang ?? (choice.approx ? "fr-FR" : tag);
      if (choice.voice) utterance.voice = choice.voice;
      utterance.rate = 0.92;
      utterance.onend = () => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(advance, 250);
      };
      // Voix en échec (langue non prise en charge, par exemple) : on laisse le temps de lire à l'écran.
      utterance.onerror = () => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(advance, 1500 + line.length * 55);
      };
      synth.speak(utterance);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(advance, fallbackMs * 1.6);
    }

    return () => {
      advanced = true;
      stopSound();
    };
  }, [playing, index, lines, lang, recordings, goNext, stopSound]);

  useEffect(() => stopSound, [stopSound]);

  const play = useCallback((from?: number) => {
    setDone(false);
    if (from !== undefined) setIndex(from);
    setPlaying(true);
  }, []);
  const pause = useCallback(() => {
    setPlaying(false);
    stopSound();
  }, [stopSound]);
  const next = useCallback(() => {
    setDone(false);
    setIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);
  const prev = useCallback(() => {
    setDone(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);
  const reset = useCallback(() => {
    stopSound();
    setPlaying(false);
    setDone(false);
    setIndex(0);
  }, [stopSound]);

  return { index, playing, done, approx, play, pause, next, prev, reset, total };
}

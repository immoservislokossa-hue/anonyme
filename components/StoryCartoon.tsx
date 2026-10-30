"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Decor from "@/components/Decor";
import Icon from "@/components/Icon";
import Silhouette from "@/components/Silhouette";
import {
  SEASON,
  SERIES_TITLE,
  readingTime,
  speakerInfo,
  stageScenes,
  characterOf,
  type Shot,
  type Speaker,
  type Story,
} from "@/lib/stories";

const TYPE_MS = 26;

// Position horizontale (en %) des personnages selon leur nombre.
function slotsFor(present: Speaker[]): Record<string, number> {
  const spots = present.length === 1 ? [50] : present.length === 2 ? [30, 70] : [18, 50, 82];
  const out: Record<string, number> = {};
  present.forEach((who, i) => {
    out[who] = spots[i] ?? 50;
  });
  return out;
}

// Réglage de la caméra : zoom et décalage pour garder le personnage qui parle dans le cadre.
function camera(shot: Shot, x: number): { z: number; dx: number; sx: number } {
  if (shot === "gros") return { z: 1.55, dx: 50 - x, sx: 50 };
  if (shot === "duo") {
    const dx = (50 - x) * 0.35;
    return { z: 1.08, dx, sx: 50 + 1.08 * (x + dx - 50) };
  }
  return { z: 1, dx: 0, sx: x };
}

// Format « dessin animé » : un petit film. Plans qui changent, expressions, décors, bulles de bande dessinée.
// La lecture est automatique ; la voix de l'appareil est facultative.
export default function StoryCartoon({ story, onDone }: { story: Story; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [typed, setTyped] = useState(0);
  const [voice, setVoice] = useState(false);
  const [voiceOk, setVoiceOk] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  
  const staged = useMemo(() => stageScenes(story), [story]);
  const total = staged.length;
  const finished = index >= total;
  const shot = staged[Math.min(index, total - 1)];
  const scene = shot.scene;

  useEffect(() => {
    setVoiceOk("speechSynthesis" in window);
    return () => {
      window.clearTimeout(timer.current);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (finished) onDone();
  }, [finished, onDone]);

  const next = useCallback(() => setIndex((i) => Math.min(total, i + 1)), [total]);

  // Apparition progressive du texte dans la bulle.
  useEffect(() => {
    if (!started || finished) return;
    setTyped(0);
    const interval = window.setInterval(() => {
      setTyped((n) => {
        if (n >= scene.text.length) {
          window.clearInterval(interval);
          return n;
        }
        return n + 1;
      });
    }, TYPE_MS);
    return () => window.clearInterval(interval);
  }, [index, started, finished, scene.text]);

  // Passage automatique à la réplique suivante.
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!started || !playing || finished) return;

    if (voice && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(scene.text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.95;
      utterance.onend = () => {
        timer.current = window.setTimeout(next, 500);
      };
      utterance.onerror = () => {
        timer.current = window.setTimeout(next, readingTime(scene.text));
      };
      synth.speak(utterance);
      return () => synth.cancel();
    }

    timer.current = window.setTimeout(next, readingTime(scene.text));
    return () => window.clearTimeout(timer.current);
  }, [index, started, playing, finished, voice, scene.text, next]);

  function start() {
    setStarted(true);
    setPlaying(true);
    setIndex(0);
  }

  function quit() {
    window.clearTimeout(timer.current);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setStarted(false);
    setPlaying(false);
    setIndex(0);
  }

  // Plein écran pendant l'épisode : rien ne cache les bulles, la page ne défile plus.
  useEffect(() => {
    if (!started) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") quit();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [started]);

  function replay() {
    setIndex(0);
    setPlaying(true);
  }

  // Toucher l'écran : finir la phrase, puis passer à la suivante.
  function tap() {
    if (!started || finished) return;
    if (typed < scene.text.length) setTyped(scene.text.length);
    else next();
  }

  const slots = slotsFor(shot.present);
  const speakerX = scene.who === "narrateur" ? 50 : (slots[scene.who] ?? 50);
  const cam = camera(scene.who === "narrateur" ? "large" : shot.shot, speakerX);
  const talking = started && !finished && scene.who !== "narrateur" && typed < scene.text.length ? scene.who : null;
  const info = speakerInfo(scene.who);
  const bubbleBelow = shot.shot === "gros" && scene.who !== "narrateur";
  const tail = Math.max(12, Math.min(88, ((cam.sx - 7) / 86) * 100));
  const mood = scene.mood ?? "neutre";

  return (
    <section className={`story-cartoon${started ? " immersive" : ""}`} aria-label={`Dessin animé : ${story.titre}`}>
      <div className="stage cinema" onClick={tap}>
        <div className="cam bgcam" style={{ ["--z" as string]: cam.z }}>
          <div className="bg" key={shot.decor}>
            <Decor name={shot.decor} />
          </div>
        </div>
        <div className="cam" style={{ ["--z" as string]: cam.z, ["--dx" as string]: `${cam.dx}%` }}>
          <div className="actors">
            {shot.present.map((who) => {
              const character = characterOf(who);
              if (!character) return null;
              const isSpeaker = !finished && scene.who === who;
              const face = isSpeaker ? scene.mood : (scene.others ?? undefined);
              return (
                <div
                  key={who}
                  className={`actor${isSpeaker ? " active" : ""}${!isSpeaker && scene.who !== "narrateur" ? " dim" : ""}`}
                  style={{ left: `${slots[who]}%` }}
                >
                  <Silhouette who={character} size={230} framed={false} talking={talking === who} mood={started ? face : "neutre"} />
                </div>
              );
            })}
          </div>
        </div>

        {started && (
          <button
            type="button"
            className="cinema-close"
            aria-label="Quitter l'épisode"
            onClick={(e) => {
              e.stopPropagation();
              quit();
            }}
          >
            ✕
          </button>
        )}
        <div className="bar-top" aria-hidden="true" />
        <div className="bar-bottom" aria-hidden="true" />

        {started && !finished && scene.who === "narrateur" && (
          <p className="narr-box" key={index} aria-live="polite">
            {scene.text.slice(0, typed)}
          </p>
        )}

        {started && !finished && scene.who !== "narrateur" && (
          <div
            className={`toon-bubble mood-${mood}${bubbleBelow ? " below" : ""}`}
            key={index}
            style={{ ["--tail" as string]: `${tail}%` }}
            aria-live="polite"
          >
            <strong>{info.name}</strong>
            <p>{scene.text.slice(0, typed)}</p>
          </div>
        )}

        {!started && (
          <div className="stage-overlay title-card">
            <p className="eyebrow">
              {SERIES_TITLE} · Saison {SEASON}
            </p>
            <h2>
              Épisode {story.episode} · {story.titre}
            </h2>
            <p className="recap">{story.resume}</p>
            <button type="button" className="btn primary big" onClick={(e) => { e.stopPropagation(); start(); }}>
              <Icon name="send" size={20} />
              Lancer l&apos;épisode
            </button>
          </div>
        )}

        {finished && (
          <div className="stage-overlay end" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow">À retenir</p>
            <h2>{story.lecon}</h2>
            <div className="row">
              <Link className="btn primary" href={story.action.href}>
                <Icon name="pin" size={18} />
                {story.action.label}
              </Link>
              <button type="button" className="btn ghost" onClick={replay}>
                Revoir
              </button>
            </div>
          </div>
        )}
      </div>

      {started && (
        <div className="cartoon-controls">
          <button type="button" className="chip-btn" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
            Précédent
          </button>
          <button type="button" className="chip-btn" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
            {playing ? "Pause" : "Lecture"}
          </button>
          <button type="button" className="chip-btn" onClick={next} disabled={finished}>
            Suivant
          </button>
          {voiceOk && (
            <button type="button" className={`chip-btn${voice ? " on" : ""}`} onClick={() => setVoice((v) => !v)} aria-pressed={voice}>
              <Icon name="speaker" size={18} />
              {voice ? "Voix activée" : "Activer la voix"}
            </button>
          )}
          <div className="bar cartoon-bar" aria-hidden="true">
            <span style={{ width: `${(Math.min(index, total) / total) * 100}%` }} />
          </div>
        </div>
      )}
    </section>
  );
}

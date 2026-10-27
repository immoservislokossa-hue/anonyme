"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Decor from "@/components/Decor";
import Icon from "@/components/Icon";
import Silhouette from "@/components/Silhouette";
import { readingTime, speakerInfo, voieOf, type Speaker, type Story } from "@/lib/stories";

const TYPE_MS = 28;

// Format « dessin animé » : les personnages parlent à tour de rôle dans un décor, avec sous-titres.
// La lecture est automatique ; la voix de l'appareil est facultative.
export default function StoryCartoon({ story, onDone }: { story: Story; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [typed, setTyped] = useState(0);
  const [voice, setVoice] = useState(false);
  const [voiceOk, setVoiceOk] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const total = story.scenes.length;
  const finished = index >= total;
  const scene = story.scenes[Math.min(index, total - 1)];
  const cast = useMemo(
    () => (["fallone", "afi", "chimene"] as Speaker[]).filter((who) => story.cast.includes(who)),
    [story.cast],
  );

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

  // Apparition progressive du texte.
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

  function replay() {
    setIndex(0);
    setPlaying(true);
  }

  const speaking = started && !finished && scene.who !== "narrateur" && typed < scene.text.length ? scene.who : null;
  const active = !finished && scene.who !== "narrateur" ? scene.who : null;
  const info = speakerInfo(scene.who);

  return (
    <section className="story-cartoon" aria-label={`Dessin animé : ${story.titre}`}>
      <div className={`stage decor-${story.decor}`}>
        <Decor name={story.decor} />

        <div className="actors">
          {cast.map((who) => {
            const voie = voieOf(who);
            if (!voie) return null;
            return (
              <div key={who} className={`actor${active === who ? " active" : ""}${active && active !== who ? " dim" : ""}`}>
                <Silhouette voie={voie} size={190} framed={false} talking={speaking === who} />
                <span className="actor-name">{speakerInfo(who).name}</span>
              </div>
            );
          })}
        </div>

        {!started && (
          <div className="stage-overlay">
            <h2>{story.titre}</h2>
            <p>{story.accroche}</p>
            <button type="button" className="btn indigo big" onClick={start}>
              <Icon name="send" size={20} />
              Lancer le dessin animé
            </button>
          </div>
        )}

        {started && !finished && (
          <div className={`caption${scene.who === "narrateur" ? " narr" : ""}`} aria-live="polite">
            {scene.who !== "narrateur" && (
              <strong>
                {info.name}
                <em>{info.role}</em>
              </strong>
            )}
            <p>{scene.text.slice(0, typed)}</p>
          </div>
        )}

        {finished && (
          <div className="stage-overlay end">
            <p className="eyebrow">À retenir</p>
            <h2>{story.lecon}</h2>
            <div className="row">
              <Link className="btn indigo" href={story.action.href}>
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

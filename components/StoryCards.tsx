"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import StoryAvatar from "@/components/StoryAvatar";
import { readingTime, speakerInfo, type Speaker, type Story } from "@/lib/stories";

const TYPING_MS = 1300;

// Format « en images » : une discussion de groupe. Les messages arrivent un par un, avec « est en train d'écrire… ».
export default function StoryCards({ story, onDone, onSwitch }: { story: Story; onDone: () => void; onSwitch: () => void }) {
  const [shown, setShown] = useState(1);
  const [typing, setTyping] = useState(false);
  const [auto, setAuto] = useState(true);
  const [voice, setVoice] = useState(false);
  const thread = useRef<HTMLDivElement>(null);
  const total = story.scenes.length;
  const atEnd = shown >= total;
  const people = (["fallone", "afi", "chimene"] as Speaker[]).filter((who) => story.cast.includes(who));

  useEffect(() => {
    if (atEnd) onDone();
  }, [atEnd, onDone]);

  // Le fil descend tout seul à chaque nouveau message.
  useEffect(() => {
    const box = thread.current;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [shown, typing, atEnd]);

  // Lecture automatique : le prochain personnage « écrit », puis son message arrive.
  useEffect(() => {
    if (!auto || atEnd) return;
    const last = story.scenes[shown - 1];
    const upcoming = story.scenes[shown];
    const reading = readingTime(last.text);
    const typingTime = upcoming.who === "narrateur" ? 0 : TYPING_MS;
    let timer = 0;
    let synth: SpeechSynthesis | null = null;

    const startTyping = () => {
      if (typingTime > 0) setTyping(true);
      timer = window.setTimeout(() => {
        setTyping(false);
        setShown((n) => Math.min(total, n + 1));
      }, typingTime);
    };

    if (voice && "speechSynthesis" in window) {
      synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(last.text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.95;
      utterance.onend = () => {
        timer = window.setTimeout(startTyping, 400);
      };
      utterance.onerror = () => {
        timer = window.setTimeout(startTyping, reading);
      };
      synth.speak(utterance);
      timer = window.setTimeout(startTyping, reading * 2.2);
    } else {
      timer = window.setTimeout(startTyping, reading);
    }
    return () => {
      window.clearTimeout(timer);
      setTyping(false);
      synth?.cancel();
    };
  }, [auto, voice, atEnd, shown, story.scenes, total]);

  const next = () => {
    setTyping(false);
    setShown((n) => Math.min(total, n + 1));
  };

  const typist = !atEnd && typing ? story.scenes[shown].who : null;

  return (
    <section className="story-chat" aria-label={`Histoire en discussion : ${story.titre}`}>
      <header className="chat-head">
        <div className="chat-faces" aria-hidden="true">
          {people.map((who) => (
            <StoryAvatar key={who} who={who} size={34} />
          ))}
        </div>
        <div>
          <strong>{story.titre}</strong>
          <span>{people.map((who) => speakerInfo(who).name).join(", ")} · en ligne</span>
        </div>
      </header>

      <div className="chat-thread" role="log" aria-live="polite" ref={thread}>
        {story.scenes.slice(0, shown).map((scene, i) =>
          scene.who === "narrateur" ? (
            <p key={i} className="chat-system">
              {scene.text}
            </p>
          ) : (
            <div key={i} className={`chat-msg who-${scene.who}${scene.who === "afi" ? " mine" : ""}`}>
              <StoryAvatar who={scene.who} size={34} mood={scene.mood} />
              <div className="chat-bubble">
                <strong>{speakerInfo(scene.who).name}</strong>
                <span>{scene.text}</span>
              </div>
            </div>
          ),
        )}
        {typist && typist !== "narrateur" && (
          <div className={`chat-msg who-${typist}${typist === "afi" ? " mine" : ""}`}>
            <StoryAvatar who={typist} size={34} />
            <div className="chat-bubble typing" aria-label={`${speakerInfo(typist).name} écrit`}>
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>

      {!atEnd ? (
        <div className="story-controls">
          <button type="button" className={`chip-btn${auto ? " on" : ""}`} onClick={() => setAuto((v) => !v)} aria-pressed={auto}>
            {auto ? "Pause" : "Lecture auto"}
          </button>
          <button type="button" className={`chip-btn${voice ? " on" : ""}`} onClick={() => setVoice((v) => !v)} aria-pressed={voice}>
            <Icon name="speaker" size={18} />
            {voice ? "Voix activée" : "Voix"}
          </button>
          <button type="button" className="btn primary" onClick={next}>
            Suivant
          </button>
        </div>
      ) : (
        <div className="story-end panel">
          <p className="eyebrow">À retenir</p>
          <h2>{story.lecon}</h2>
          <div className="row">
            <Link className="btn primary" href={story.action.href}>
              <Icon name="pin" size={18} />
              {story.action.label}
            </Link>
            <button type="button" className="btn ghost" onClick={() => setShown(1)}>
              Revoir
            </button>
            <button type="button" className="btn ghost" onClick={onSwitch}>
              Essayer en jeu
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

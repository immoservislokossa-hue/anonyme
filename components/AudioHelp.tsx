"use client";

import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import Icon, { type IconName } from "@/components/Icon";
import Silhouette from "@/components/Silhouette";
import { useLang, useOfferedLanguages } from "@/components/useLang";
import { useNarrator } from "@/components/useNarrator";
import { TOUR, guideForPath, linesFor, type Guide, type Visual } from "@/lib/guides";
import { LANGS, type Lang } from "@/lib/i18n";

const SEEN_KEY = "onboarded-v1";
const OPEN_EVENT = "open-tour";

const VISUAL_ICONS: Record<Exclude<Visual, "afi">, IconName> = {
  chat: "chat",
  learn: "book",
  pin: "pin",
  alert: "alert",
  lock: "shield",
  speaker: "speaker",
};

function StepVisual({ visual }: { visual: Visual }) {
  if (visual === "afi") {
    return (
      <span className="ah-visual">
        <Silhouette voie="sexuelle" size={150} framed={false} />
      </span>
    );
  }
  return (
    <span className={`ah-visual ah-icon${visual === "alert" ? " alert" : ""}`}>
      <Icon name={VISUAL_ICONS[visual]} size={64} />
    </span>
  );
}

function LangChips({ lang, setLang, active }: { lang: Lang; setLang: (lang: Lang) => void; active: boolean }) {
  const offered = useOfferedLanguages(active);
  return (
    <div className="ah-langs" role="group" aria-label="Langue de l'audio">
      {offered.map((code) => (
        <button key={code} type="button" className={`chip-btn${lang === code ? " on" : ""}`} aria-pressed={lang === code} onClick={() => setLang(code)}>
          {LANGS[code].label}
          {LANGS[code].status === "demo" && <em>démo</em>}
          {LANGS[code].status === "bientot" && <em>bientôt</em>}
        </button>
      ))}
    </div>
  );
}

// Présentation audio : la voix lit chaque étape pendant qu'un grand dessin et la phrase s'affichent.
function Player({ guide, lang, autoStart, onFinish, finishLabel }: { guide: Guide; lang: Lang; autoStart: boolean; onFinish: () => void; finishLabel: string }) {
  const { lines, translated, audio } = useMemo(() => linesFor(guide, lang), [guide, lang]);
  const narrator = useNarrator(lines, lang, audio);
  const { play, reset } = narrator;

  useEffect(() => {
    reset();
    if (autoStart) play(0);
  }, [guide, lang, autoStart, play, reset]);

  const last = narrator.index === narrator.total - 1;

  return (
    <div className="ah-player">
      <StepVisual visual={guide.steps[narrator.index].visual} />
      <p className="ah-line" aria-live="polite">
        {lines[narrator.index]}
      </p>
      <div className="ah-dots" aria-hidden="true">
        {guide.steps.map((_, i) => (
          <span key={i} className={i === narrator.index ? "on" : i < narrator.index ? "past" : ""} />
        ))}
      </div>
      {!translated && <p className="muted">Cette langue arrive bientôt. Lecture en français.</p>}
      {translated && lang !== "fr" && (
        <p className="muted">Démonstration : traduction à valider. {narrator.approx ? "La voix de l'appareil peut mal prononcer cette langue." : ""}</p>
      )}
      <div className="ah-controls">
        <button type="button" className="chip-btn" onClick={narrator.prev} disabled={narrator.index === 0}>
          Précédent
        </button>
        <button type="button" className="btn indigo" onClick={() => (narrator.playing ? narrator.pause() : narrator.play())}>
          <Icon name="speaker" size={18} />
          {narrator.playing ? "Pause" : narrator.done ? "Réécouter" : narrator.index > 0 ? "Reprendre" : "Écouter"}
        </button>
        <button type="button" className="chip-btn" onClick={narrator.next} disabled={last}>
          Suivant
        </button>
      </div>
      {(last || narrator.done) && (
        <button type="button" className="btn indigo big" onClick={onFinish}>
          {finishLabel}
        </button>
      )}
    </div>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Rendu directement dans la page : l'en-tête a un flou d'arrière-plan qui enfermerait un affichage fixe.
  return createPortal(
    <div className="ah-backdrop">
      <div className="ah-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <div className="ah-top">
          <strong>{title}</strong>
          <button type="button" className="chip-btn" onClick={onClose}>
            Fermer
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export default function AudioHelp() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [mode, setMode] = useState<"closed" | "tour" | "page">("closed");
  const [started, setStarted] = useState(false);

  const eligible = !(pathname.startsWith("/urgence") || pathname.startsWith("/pro") || pathname.startsWith("/partenaires"));

  // Première visite : la présentation s'ouvre d'elle-même (la voix démarre après un appui).
  useEffect(() => {
    if (!eligible) return;
    try {
      if (!window.localStorage.getItem(SEEN_KEY)) setMode("tour");
    } catch {
      // Stockage indisponible : on ne bloque pas la personne.
    }
  }, [eligible]);

  useEffect(() => {
    const open = () => {
      setStarted(false);
      setMode("tour");
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  function markSeen() {
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Sans stockage, la présentation pourra revenir : sans gravité.
    }
  }

  function closeTour() {
    markSeen();
    setStarted(false);
    setMode("closed");
  }

  const pageGuide = guideForPath(pathname);

  return (
    <>
      <button
        type="button"
        className="audio-btn"
        aria-label="Aide audio : écouter comment utiliser cette page"
        onClick={() => setMode("page")}
      >
        <Icon name="speaker" size={20} />
        <span>Aide audio</span>
      </button>

      {mode === "tour" && (
        <Dialog title="Bienvenue sur Alviosa" onClose={closeTour}>
          {!started ? (
            <div className="ah-intro">
              <Silhouette voie="sexuelle" size={130} framed={false} />
              <h2>Écoute comment ça marche</h2>
              <p>Appuie sur le grand bouton. Une voix t'explique tout, étape par étape. Tu n'as pas besoin de savoir lire.</p>
              <button type="button" className="ah-bigplay" onClick={() => setStarted(true)} autoFocus>
                <Icon name="speaker" size={40} />
                <span>Écouter</span>
              </button>
              <p className="muted">Choisis ta langue :</p>
              <LangChips lang={lang} setLang={setLang} active />
              <button type="button" className="btn ghost" onClick={closeTour}>
                Passer
              </button>
            </div>
          ) : (
            <Player guide={TOUR} lang={lang} autoStart onFinish={closeTour} finishLabel="Commencer" />
          )}
        </Dialog>
      )}

      {mode === "page" && (
        <Dialog title={`Aide audio : ${pageGuide.title}`} onClose={() => setMode("closed")}>
          <Player guide={pageGuide} lang={lang} autoStart={false} onFinish={() => setMode("closed")} finishLabel="J'ai compris" />
          <LangChips lang={lang} setLang={setLang} active />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setStarted(false);
              setMode("tour");
            }}
          >
            Revoir la présentation de l'application
          </button>
        </Dialog>
      )}
    </>
  );
}

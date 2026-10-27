"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/Icon";
import { useOfferedLanguages } from "@/components/useLang";
import { useNarrator, type Line } from "@/components/useNarrator";
import { hasTranslation, stepTexts, type Guide } from "@/lib/guides";
import { LANGS, type Lang } from "@/lib/i18n";

type Box = { top: number; left: number; width: number; height: number };

const PAD = 6;
const CARD_MAX = 360;

// Premier élément visible qui correspond au sélecteur (la barre du bas et le menu du haut existent tous deux).
function findTarget(selector?: string): HTMLElement | null {
  if (!selector) return null;
  for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
    const rect = el.getBoundingClientRect();
    if (el.getClientRects().length > 0 && rect.width > 0 && rect.height > 0) return el;
  }
  return null;
}

function measure(el: HTMLElement): Box {
  const r = el.getBoundingClientRect();
  return { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 };
}

// Visite guidée : la voix explique chaque élément pendant qu'il est entouré à l'écran, puis passe au suivant.
export default function Coach({
  guide,
  lang,
  setLang,
  needsTap,
  onClose,
}: {
  guide: Guide;
  lang: Lang;
  setLang: (lang: Lang) => void;
  needsTap: boolean;
  onClose: (completed: boolean) => void;
}) {
  const texts = useMemo(() => stepTexts(guide, lang), [guide, lang]);
  // Pour chaque étape : le français d'abord, puis la langue choisie, avant de passer à l'élément suivant.
  const { lines, stepOfLine, firstLine } = useMemo(() => {
    const lines: Line[] = [];
    const stepOfLine: number[] = [];
    const firstLine: number[] = [];
    texts.forEach((t, i) => {
      firstLine.push(lines.length);
      lines.push({ text: t.fr, lang: "fr", audio: t.frAudio });
      stepOfLine.push(i);
      if (t.local) {
        lines.push({ text: t.local, lang, audio: t.localAudio });
        stepOfLine.push(i);
      }
    });
    return { lines, stepOfLine, firstLine };
  }, [texts, lang]);
  const translated = hasTranslation(guide, lang);
  const narrator = useNarrator(lines);
  const { play, reset } = narrator;
  const [waiting, setWaiting] = useState(needsTap);
  const [box, setBox] = useState<Box | null>(null);
  const [showLangs, setShowLangs] = useState(false);
  const [viewport, setViewport] = useState({ w: 360, h: 640 });
  const closing = useRef(false);
  const offered = useOfferedLanguages(showLangs);

  const stepIndex = stepOfLine[narrator.index] ?? 0;
  const step = guide.steps[stepIndex];
  const text = texts[stepIndex];
  const last = stepIndex === guide.steps.length - 1;

  // La voix démarre tout de suite, sauf si le navigateur exige d'abord un toucher.
  useEffect(() => {
    reset();
    if (!waiting) play(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guide, lang, waiting]);

  const finish = useCallback(
    (completed: boolean) => {
      if (closing.current) return;
      closing.current = true;
      onClose(completed);
    },
    [onClose],
  );

  // À la fin de la dernière phrase, la visite se ferme toute seule.
  useEffect(() => {
    if (!narrator.done) return;
    const timer = window.setTimeout(() => finish(true), 1500);
    return () => window.clearTimeout(timer);
  }, [narrator.done, finish]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && finish(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Place le cadre sur l'élément de l'étape, et le suit si l'écran change.
  useLayoutEffect(() => {
    let tries = 0;
    let frame = 0;
    let poll = 0;
    const update = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      const el = findTarget(step?.target);
      if (!el) {
        setBox(null);
        return false;
      }
      const r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight - 70) {
        const fixed = getComputedStyle(el).position === "fixed" || el.closest(".topbar, .bottom-nav");
        if (!fixed) el.scrollIntoView({ block: "center", behavior: "auto" });
      }
      setBox(measure(el));
      return true;
    };
    if (!update()) {
      poll = window.setInterval(() => {
        tries += 1;
        if (update() || tries > 8) window.clearInterval(poll);
      }, 150);
    }
    const onChange = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.clearInterval(poll);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [step?.target, stepIndex]);

  const cardW = Math.min(CARD_MAX, viewport.w - 24);
  let cardStyle: React.CSSProperties = {};
  if (box) {
    const below = box.top + box.height + 12 + 230 < viewport.h;
    const left = Math.min(Math.max(box.left + box.width / 2 - cardW / 2, 12), viewport.w - cardW - 12);
    cardStyle = below
      ? { top: box.top + box.height + 12, left, width: cardW }
      : { bottom: viewport.h - box.top + 12, left, width: cardW };
  }

  return createPortal(
    <div className={`coach${box ? "" : " no-target"}`} role="dialog" aria-modal="true" aria-label={guide.title}>
      <div className="coach-blocker" />
      {box && <div className="coach-spot" style={{ top: box.top, left: box.left, width: box.width, height: box.height }} />}

      <div className="coach-card" style={cardStyle}>
        <div className="coach-head">
          <div className="ah-dots" aria-hidden="true">
            {guide.steps.map((_, i) => (
              <span key={i} className={i === stepIndex ? "on" : i < stepIndex ? "past" : ""} />
            ))}
          </div>
          <button type="button" className="chip-btn" onClick={() => finish(false)}>
            Passer
          </button>
        </div>

        <p className={`coach-line${text?.local && narrator.index !== firstLine[stepIndex] ? " dim" : ""}`} aria-live="polite">
          {text?.fr}
        </p>
        {text?.local && (
          <p className={`coach-line local${narrator.index === firstLine[stepIndex] ? " dim" : ""}`} lang={lang}>
            {text.local}
          </p>
        )}

        {!translated && <p className="muted">Cette langue arrive bientôt. Lecture en français.</p>}
        {translated && lang !== "fr" && (
          <p className="muted">Démonstration : traduction à valider.{narrator.approx ? " La voix peut mal prononcer cette langue." : ""}</p>
        )}

        {waiting ? (
          <button type="button" className="btn indigo big" onClick={() => setWaiting(false)} autoFocus>
            <Icon name="speaker" size={22} />
            Écouter
          </button>
        ) : (
          <div className="coach-controls">
            <button type="button" className="chip-btn" onClick={() => narrator.jump(firstLine[Math.max(0, stepIndex - 1)])} disabled={stepIndex === 0}>
              Précédent
            </button>
            <button type="button" className="chip-btn" onClick={() => (narrator.playing ? narrator.pause() : narrator.play())}>
              <Icon name="speaker" size={18} />
              {narrator.playing ? "Pause" : "Reprendre"}
            </button>
            <button type="button" className="btn indigo" onClick={() => (last ? finish(true) : narrator.jump(firstLine[stepIndex + 1]))}>
              {last ? "Compris" : "Suivant"}
            </button>
          </div>
        )}

        <div className="coach-foot">
          <button type="button" className="link-btn" onClick={() => setShowLangs((v) => !v)} aria-expanded={showLangs}>
            Langue : {LANGS[lang].label}
          </button>
        </div>
        {showLangs && (
          <div className="ah-langs" role="group" aria-label="Langue de l'audio">
            {offered.map((code) => (
              <button key={code} type="button" className={`chip-btn${lang === code ? " on" : ""}`} aria-pressed={lang === code} onClick={() => setLang(code)}>
                {LANGS[code].label}
                {LANGS[code].status === "demo" && <em>démo</em>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Coach from "@/components/Coach";
import Icon from "@/components/Icon";
import { useLang } from "@/components/useLang";
import { defaultLangFor } from "@/lib/i18n";
import { TOUR, guideForPath, type Guide } from "@/lib/guides";

const TOUR_KEY = "tour-v2";
const PAGES_KEY = "pages-seen-v1";

type Session = { guide: Guide; replay: boolean; needsTap: boolean };

function readSeen(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(PAGES_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function remember(id: string) {
  try {
    const seen = new Set(readSeen());
    seen.add(id);
    window.localStorage.setItem(PAGES_KEY, JSON.stringify([...seen]));
  } catch {
    // Sans stockage, l'explication pourra revenir : sans gravité.
  }
}

// Un navigateur n'autorise la voix qu'après un premier toucher de la personne sur la page.
function needsFirstTap(): boolean {
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  return activation ? !activation.hasBeenActive : false;
}

// Charge les voix de l'appareil dès l'arrivée, pour que la lecture démarre sans attente.
function warmVoices() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => window.speechSynthesis.getVoices(), { once: true });
}

export default function AudioHelp() {
  const pathname = usePathname();
  const { lang: chosenLang, setLang, chosen } = useLang();
  const [geoLang, setGeoLang] = useState<ReturnType<typeof defaultLangFor>>("fr");
  // Sans choix de la personne, on propose la langue locale de son pays (déduit par l'hébergeur).
  const lang = chosen && chosenLang ? chosenLang : geoLang;
  const [session, setSession] = useState<Session | null>(null);
  const pending = useRef<Guide | null>(null);

  const eligible = !(pathname.startsWith("/urgence") || pathname.startsWith("/pro") || pathname.startsWith("/partenaires"));

  useEffect(warmVoices, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { country?: string | null } | null) => {
        if (!cancelled && data) setGeoLang(defaultLangFor(data.country));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // Première visite : l'explication démarre d'elle-même, une seule fois. D'abord la présentation de
  // l'application, puis, la première fois qu'on arrive sur une page, ce qu'elle permet de faire.
  useEffect(() => {
    if (!eligible) return;
    const timer = window.setTimeout(() => {
      let tourDone = false;
      try {
        tourDone = window.localStorage.getItem(TOUR_KEY) === "1";
      } catch {
        tourDone = true;
      }
      const page = guideForPath(pathname);
      if (!tourDone) {
        try {
          window.localStorage.setItem(TOUR_KEY, "1");
        } catch {
          // Sans stockage : on ne relancera pas la visite pendant cette session.
        }
        remember("home");
        pending.current = page.id === "home" ? null : page;
        setSession({ guide: TOUR, replay: false, needsTap: needsFirstTap() });
      } else if (!readSeen().includes(page.id)) {
        remember(page.id);
        setSession({ guide: page, replay: false, needsTap: needsFirstTap() });
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [pathname, eligible]);

  const close = useCallback(() => {
    const next = pending.current;
    pending.current = null;
    if (next) {
      remember(next.id);
      setSession({ guide: next, replay: false, needsTap: false });
    } else {
      setSession(null);
    }
  }, []);

  return (
    <>
      <button
        type="button"
        className="audio-btn"
        data-tour="audio"
        aria-label="Aide audio : écouter comment utiliser cette page"
        onClick={() => {
          pending.current = null;
          setSession({ guide: guideForPath(pathname), replay: true, needsTap: false });
        }}
      >
        <Icon name="speaker" size={20} />
        <span>Aide audio</span>
      </button>

      {session && (
        <Coach
          key={`${session.guide.id}-${session.replay}`}
          guide={session.guide}
          lang={lang}
          setLang={setLang}
          needsTap={session.needsTap}
          replay={session.replay}
          onClose={close}
          onTour={() => {
            pending.current = null;
            setSession({ guide: TOUR, replay: true, needsTap: false });
          }}
        />
      )}
    </>
  );
}

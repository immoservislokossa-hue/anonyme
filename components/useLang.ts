"use client";

import { useCallback, useEffect, useState } from "react";
import { LANG_KEY, isLang, languagesForCountry, type Lang } from "@/lib/i18n";

const EVENT = "lang-change";

function read(): Lang | null {
  try {
    const value = window.localStorage.getItem(LANG_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
}

// Langue de l'audio choisie par la personne, gardée sur son appareil.
export function useLang() {
  const [lang, setLangState] = useState<Lang | null>(null);

  useEffect(() => {
    setLangState(read());
    const sync = () => setLangState(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      // Stockage indisponible : le choix vaut pour cette visite seulement.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  // `chosen` : la personne a choisi une langue elle-même. Sinon, on propose celle de son pays.
  return { lang, setLang, chosen: lang !== null };
}

// Langues proposées selon le pays détecté par l'hébergeur ; le français seul si on ne sait pas.
export function useOfferedLanguages(active: boolean): Lang[] {
  const [langs, setLangs] = useState<Lang[]>(languagesForCountry(null));

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetch("/api/geo")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { country?: string | null } | null) => {
        if (!cancelled && data) setLangs(languagesForCountry(data.country));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [active]);

  return langs;
}

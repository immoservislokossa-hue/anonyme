"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Coach from "@/components/Coach";
import Icon from "@/components/Icon";
import { useLang } from "@/components/useLang";
import { TOUR } from "@/lib/guides";
import { defaultLangFor } from "@/lib/i18n";

const TOUR_KEY = "tour-v3";

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

// Une seule présentation, à la première visite : la barre du bas et l'en-tête (5 étapes au plus).
// Le bouton haut-parleur de l'en-tête la rejoue.
export default function AudioHelp() {
  const pathname = usePathname();
  const { lang: chosenLang, setLang, chosen } = useLang();
  const [geoLang, setGeoLang] = useState<ReturnType<typeof defaultLangFor>>("fr");
  const [open, setOpen] = useState<{ needsTap: boolean } | null>(null);
  const lang = chosen && chosenLang ? chosenLang : geoLang;

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

  useEffect(() => {
    if (!eligible) return;
    const timer = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem(TOUR_KEY) === "1") return;
        window.localStorage.setItem(TOUR_KEY, "1");
      } catch {
        return;
      }
      setOpen({ needsTap: needsFirstTap() });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [eligible]);

  return (
    <>
      <button type="button" className="audio-btn" data-tour="audio" aria-label="Écouter la présentation de l'application" onClick={() => setOpen({ needsTap: false })}>
        <Icon name="speaker" size={20} />
        <span>Aide audio</span>
      </button>

      {open && <Coach guide={TOUR} lang={lang} setLang={setLang} needsTap={open.needsTap} onClose={() => setOpen(null)} />}
    </>
  );
}

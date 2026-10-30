import { NextResponse } from "next/server";
import { hrefOf, METHODES, SUJETS, TOOLS } from "@/lib/catalog";
import { stories } from "@/lib/stories";
import { SCENARIOS } from "@/lib/pro/scenarios";

export const dynamic = "force-static";

// Liste des pages à garder sur l'appareil pour que tout marche sans connexion.
export function GET() {
  const pages = [
    "/",
    "/apprendre",
    "/sujets",
    "/outils",
    "/methodes",
    "/serie",
    "/orientation",
    "/urgence",
    "/aide",
    "/chat",
    "/a-propos",
    "/all",
    "/accessibilite",
    "/search-index.json",
    "/prestataires",
    "/prestataires/consultation",
    "/prestataires/entrainement",
    "/prestataires/aide-memoire",
    "/prestataires/mon-service",
    "/prestataires/bilan",
    "/prestataires/assistant",
    "/pilotage/demo",
    ...SCENARIOS.map((s) => `/prestataires/entrainement/${s.id}`),
    ...SUJETS.map((s) => hrefOf.sujet(s.id)),
    ...TOOLS.map((t) => hrefOf.outil(t.id)),
    ...METHODES.map((m) => hrefOf.methode(m.id)),
    ...stories.map((s) => hrefOf.episode(s.id)),
  ];
  return NextResponse.json({ pages });
}

import { NextResponse } from "next/server";
import { hrefOf, METHODES, SUJETS, TOOLS } from "@/lib/catalog";
import { stories } from "@/lib/stories";

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
    ...SUJETS.map((s) => hrefOf.sujet(s.id)),
    ...TOOLS.map((t) => hrefOf.outil(t.id)),
    ...METHODES.map((m) => hrefOf.methode(m.id)),
    ...stories.map((s) => hrefOf.episode(s.id)),
  ];
  return NextResponse.json({ pages });
}

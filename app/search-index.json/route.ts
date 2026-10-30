import { NextResponse } from "next/server";
import { searchIndex } from "@/lib/catalog";
import { SITE_PAGES } from "@/lib/site";

export const dynamic = "force-static";

// L'index de la recherche, en un fichier léger : il est gardé sur le téléphone avec le reste, donc la recherche marche sans connexion.
export function GET() {
  const pages = SITE_PAGES.map((p) => ({ href: p.href, titre: p.titre, texte: p.texte, type: p.espace === "prestataires" ? "Prestataires" : p.espace === "pilotage" ? "Pilotage" : "Page" }));
  return NextResponse.json({ items: [...searchIndex(), ...pages] });
}

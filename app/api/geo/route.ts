import { NextResponse } from "next/server";

// Pays approximatif du visiteur, déduit de sa connexion par l'hébergeur : sert seulement à proposer
// les langues locales du pays. Rien n'est enregistré.
export function GET(request: Request) {
  const raw = request.headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  const country = raw && /^[A-Z]{2}$/.test(raw) ? raw : null;
  return NextResponse.json({ country }, { headers: { "Cache-Control": "private, no-store" } });
}

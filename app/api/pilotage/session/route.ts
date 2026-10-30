import { NextResponse } from "next/server";
import { SESSION_COOKIE, accessFor, sessionValue } from "@/lib/auth";
import { limited, readJson } from "@/lib/http";

export const runtime = "nodejs";

// Échange le jeton partagé contre un cookie de session (HttpOnly). Le jeton n'est jamais renvoyé ni placé dans une adresse.
export async function POST(request: Request) {
  const limit = limited(request, "pilotage-login", 10, 600_000);
  if (limit) return limit;
  const body = await readJson(request);
  const token = typeof body?.token === "string" ? body.token : undefined;
  const access = accessFor(token);
  if (access === "missing-config") return NextResponse.json({ error: "Espace non configuré : définir PARTNER_TOKEN." }, { status: 503 });
  if (access !== "ok" || !process.env.PARTNER_TOKEN) {
    if (access === "ok") return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Jeton non valide." }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, sessionValue(process.env.PARTNER_TOKEN), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

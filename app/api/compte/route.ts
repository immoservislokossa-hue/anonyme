import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { ACCOUNT_COOKIE, accountsEnabled, authenticate } from "@/lib/account";
import { currentAccount } from "@/lib/accountSession";
import { limited, readJson } from "@/lib/http";

export const runtime = "nodejs";

// Qui est connecté ? Les comptes sont-ils activés ?
async function handleGET() {
  if (!accountsEnabled()) return NextResponse.json({ enabled: false, account: null });
  const account = await currentAccount();
  return NextResponse.json({ enabled: true, account: account ? { email: account.email, role: account.role } : null });
}

// Inscription ou connexion (e-mail + mot de passe, Supabase Auth). Le jeton de session reste dans un cookie HttpOnly.
async function handlePOST(request: Request) {
  if (!accountsEnabled()) return NextResponse.json({ error: "Les comptes ne sont pas encore activés." }, { status: 503 });
  const limit = limited(request, "compte", 10, 600_000);
  if (limit) return limit;
  const body = await readJson(request);
  if (!body || (body.mode !== "inscription" && body.mode !== "connexion") || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const result = await authenticate(body.mode, body.email.trim().toLowerCase(), body.password);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 401 });
  if (result.token === null) return NextResponse.json({ confirm: true, message: "Regarde ta boîte mail et confirme ton adresse, puis connecte-toi." });
  const response = NextResponse.json({ account: { email: result.account.email, role: result.account.role } });
  response.cookies.set(ACCOUNT_COOKIE, result.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: result.expiresIn });
  return response;
}

async function handleDELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCOUNT_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

export const GET = guarded(handleGET);
export const POST = guarded(handlePOST);
export const DELETE = guarded(handleDELETE);

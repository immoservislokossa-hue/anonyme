import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { accountsEnabled, setPassword } from "@/lib/account";
import { limited, readJson } from "@/lib/http";

export const runtime = "nodejs";

// Choisir un nouveau mot de passe avec le jeton du lien reçu par e-mail.
async function handlePOST(request: Request) {
  if (!accountsEnabled()) return NextResponse.json({ error: "Les comptes ne sont pas encore activés." }, { status: 503 });
  const limit = limited(request, "mot-de-passe", 10, 600_000);
  if (limit) return limit;
  const body = await readJson(request);
  if (!body || typeof body.token !== "string" || typeof body.password !== "string") return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const ok = await setPassword(body.token, body.password);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Lien expiré ou mot de passe trop court (8 signes au moins). Demande un nouveau lien." }, { status: 400 });
}

export const POST = guarded(handlePOST);

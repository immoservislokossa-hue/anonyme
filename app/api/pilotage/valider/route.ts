import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, accessFromSession } from "@/lib/auth";
import { limited, readJson } from "@/lib/http";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";

// Un responsable valide ou refuse un service inscrit. Réservé aux personnes connectées à l'espace Pilotage.
export async function POST(request: Request) {
  const limit = limited(request, "valider", 60, 600_000);
  if (limit) return limit;
  const jar = await cookies();
  if (accessFromSession(jar.get(SESSION_COOKIE)?.value) !== "ok") return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await readJson(request);
  if (!body || typeof body.id !== "string" || (body.decision !== "valide" && body.decision !== "refuse")) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const row = await getStore().update("services", body.id, { statut: body.decision, majLe: new Date().toISOString() });
  return row ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Service inconnu." }, { status: 404 });
}

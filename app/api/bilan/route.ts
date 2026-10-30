import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { limited, readJson } from "@/lib/http";
import { getPays } from "@/lib/pays";
import { validatePayload } from "@/lib/pro/consultation";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";

// Bilan anonyme d'un prestataire : des comptes, jamais de nom ni de réponse de client. Une zone facultative, du découpage officiel.
async function handlePOST(request: Request) {
  const limit = limited(request, "bilan", 5, 86_400_000);
  if (limit) return limit;
  const payload = validatePayload(await readJson(request), getPays().zones);
  if (!payload) return NextResponse.json({ error: "Bilan non valide." }, { status: 400 });
  await getStore().insert("bilans", { ...payload });
  return new NextResponse(null, { status: 204 });
}

export const POST = guarded(handlePOST);

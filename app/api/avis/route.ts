import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { getService } from "@/lib/directory";
import { clientIp, limited, readJson } from "@/lib/http";
import { checkRate } from "@/lib/rateLimit";
import { validateAnswers } from "@/lib/services";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";

// Avis anonyme d'un jeune sur un service. On ne garde ni adresse, ni identifiant : seulement les réponses.
async function handlePOST(request: Request) {
  const limit = limited(request, "avis", 10, 3_600_000);
  if (limit) return limit;
  const body = await readJson(request);
  const answers = validateAnswers(body?.answers);
  if (!body || typeof body.serviceId !== "string" || !answers) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  // Un seul avis par personne et par service et par jour (adresse gardée seulement en mémoire, pour la limite).
  if (!checkRate(`avis:${body.serviceId}:${clientIp(request)}`, 1, 86_400_000).allowed) {
    return NextResponse.json({ error: "Merci, ton avis est déjà enregistré." }, { status: 429 });
  }

  const service = await getService(body.serviceId);
  if (!service || service.statut !== "valide") return NextResponse.json({ error: "Service inconnu." }, { status: 404 });

  await getStore().insert("reviews", { serviceId: service.id, answers });
  return new NextResponse(null, { status: 204 });
}

export const POST = guarded(handlePOST);

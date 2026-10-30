import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { getService } from "@/lib/directory";
import { limited, readJson } from "@/lib/http";
import { getStore } from "@/lib/store";
import { newVoucher } from "@/lib/tokens";
import { isBesoin } from "@/lib/visits";

export const runtime = "nodejs";

// Un jeune demande un bon de visite pour un service validé. Pas de nom, pas de contact : un code court à montrer à l'accueil.
async function handlePOST(request: Request) {
  const limit = limited(request, "visite", 8, 3_600_000);
  if (limit) return limit;
  const body = await readJson(request);
  if (!body || typeof body.serviceId !== "string" || !isBesoin(body.besoin)) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const service = await getService(body.serviceId);
  if (!service || service.statut !== "valide") return NextResponse.json({ error: "Service introuvable." }, { status: 404 });
  const code = newVoucher();
  await getStore().insert("events", { kind: "visite-demande", service: service.id, zone: service.zone, code, besoin: body.besoin });
  return NextResponse.json({ code }, { status: 201 });
}

export const POST = guarded(handlePOST);

import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { getService } from "@/lib/directory";
import { mayManage } from "@/lib/manage";
import { limited, readJson } from "@/lib/http";
import { METHOD_LIST } from "@/lib/services";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";

// Un service signale la disponibilité ou la rupture d'une méthode. Il faut son jeton.
async function handlePOST(request: Request) {
  const limit = limited(request, "stock", 60, 3_600_000);
  if (limit) return limit;
  const body = await readJson(request);
  const known = METHOD_LIST.some((m) => m.id === body?.methode);
  if (!body || typeof body.serviceId !== "string" || !known || (body.etat !== "disponible" && body.etat !== "rupture")) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const service = await getService(body.serviceId);
  if (!service || !(await mayManage(body.serviceId, body.jeton))) return NextResponse.json({ error: "Accès refusé : connecte-toi au compte du service." }, { status: 403 });

  await getStore().insert("stock", { serviceId: service.id, methode: body.methode, etat: body.etat });
  return new NextResponse(null, { status: 204 });
}

export const POST = guarded(handlePOST);

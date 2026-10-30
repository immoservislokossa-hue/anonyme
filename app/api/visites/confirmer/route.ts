import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { safeEqual } from "@/lib/auth";
import { getService, storedHash } from "@/lib/directory";
import { limited, readJson } from "@/lib/http";
import { getStore } from "@/lib/store";
import { hashToken, isVoucher } from "@/lib/tokens";
import { besoinLabel, findVoucher } from "@/lib/visits";

export const runtime = "nodejs";

// Le service confirme la visite d'un jeune à partir de son code. Il faut le jeton du service.
async function handlePOST(request: Request) {
  const limit = limited(request, "confirmer", 120, 3_600_000);
  if (limit) return limit;
  const body = await readJson(request);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!body || typeof body.serviceId !== "string" || typeof body.jeton !== "string" || !isVoucher(code)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const hash = await storedHash(body.serviceId);
  const service = await getService(body.serviceId);
  if (!hash || !service || !safeEqual(hashToken(body.jeton), hash)) return NextResponse.json({ error: "Jeton non valide." }, { status: 403 });

  const store = getStore();
  const found = findVoucher(await store.list("events"), service.id, code);
  if (found.status === "inconnu") return NextResponse.json({ error: "Code inconnu pour ce service, ou trop ancien." }, { status: 404 });
  if (found.status === "deja") return NextResponse.json({ error: "Ce code a déjà été confirmé." }, { status: 409 });
  await store.insert("events", { kind: "visite-venue", service: service.id, zone: service.zone, code, besoin: found.besoin });
  return NextResponse.json({ besoin: besoinLabel(found.besoin) });
}

export const POST = guarded(handlePOST);

import { NextResponse } from "next/server";
import { serviceByCode } from "@/lib/directory";
import { clientIp } from "@/lib/http";
import { record } from "@/lib/metrics";
import { checkRate } from "@/lib/rateLimit";
import { isCode } from "@/lib/tokens";

export const runtime = "nodejs";

// L'adresse du QR d'un service : on compte le passage (sans identité, une fois par heure et par appareil), puis on ouvre la page du service.
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const upper = code.toUpperCase();
  const service = isCode(upper) ? await serviceByCode(upper).catch(() => null) : null;
  if (!service) return NextResponse.redirect(new URL("/orientation", request.url));
  if (checkRate(`scan:${service.id}:${clientIp(request)}`, 1, 3_600_000).allowed) record("scan", undefined, service.zone, { service: service.id });
  return NextResponse.redirect(new URL(`/orientation/${service.id}?src=qr`, request.url));
}

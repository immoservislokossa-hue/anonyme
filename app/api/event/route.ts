import { NextResponse } from "next/server";
import { isUsageEvent, record } from "@/lib/metrics";
import { isZone } from "@/lib/pays";
import { checkRate } from "@/lib/rateLimit";

export const runtime = "nodejs";

// Compte l'usage d'un outil. Aucun contenu, aucun identifiant : seulement le nom de l'événement.
// Chaque événement est aussi écrit sur la sortie du serveur, où l'hébergeur le conserve : c'est de là
// qu'on peut compter l'usage dans la durée, tant que les compteurs ne sont pas dans une base.
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnu";
  if (!checkRate(`event:${ip}`, 60, 60_000).allowed) return new NextResponse(null, { status: 429 });

  let name: unknown;
  let zone: unknown;
  try {
    const body = (await request.json()) as { event?: unknown; zone?: unknown };
    name = body.event;
    zone = body.zone;
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!isUsageEvent(name)) return new NextResponse(null, { status: 400 });

  // La zone est facultative et ne vient que d'un choix volontaire de la personne : seulement un nom de zone officiel, jamais une position.
  record(name, undefined, isZone(zone) ? zone : undefined);
  console.info(JSON.stringify({ kind: "usage", event: name, at: new Date().toISOString() }));
  return new NextResponse(null, { status: 204 });
}

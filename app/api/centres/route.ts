import { NextResponse } from "next/server";
import { record } from "@/lib/metrics";
import { cleanQuery, isPlaceKind, isValidOrigin, type Origin } from "@/lib/places";
import { planProviders, searchWithFallback } from "@/lib/providers";
import { checkRate } from "@/lib/rateLimit";

export const runtime = "nodejs";

const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return `centres:${forwarded?.split(",")[0]?.trim() || "inconnu"}`;
}

// Les sources et leur ordre sont décidés dans lib/providers.ts : Google (clé officielle) puis Scrappa.
export async function POST(request: Request) {
  const rate = checkRate(clientKey(request), RATE_LIMIT, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop de demandes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const body = (await request.json().catch(() => null)) as { lat?: unknown; lng?: unknown; query?: unknown; kind?: unknown } | null;
  const origin: Origin | undefined = isValidOrigin(body?.lat, body?.lng)
    ? { lat: body?.lat as number, lng: body?.lng as number }
    : undefined;
  const query = cleanQuery(body?.query);
  const kind = isPlaceKind(body?.kind) ? body.kind : "centre";

  if (!origin && !query) {
    return NextResponse.json({ error: "Position ou lieu manquant." }, { status: 400 });
  }

  // Aucune clé de lieux : la page l'indique et renvoie vers les centres partenaires.
  if (planProviders(process.env).length === 0) {
    return NextResponse.json({ configured: false, centres: [] });
  }

  try {
    const { source, centres } = await searchWithFallback({ origin, query, kind });
    record("orientation");
    return NextResponse.json({ configured: true, source, centres });
  } catch {
    // On ne renvoie aucun détail : ils pourraient contenir une clé ou la position.
    return NextResponse.json({ configured: true, centres: [], error: "unavailable" }, { status: 502 });
  }
}

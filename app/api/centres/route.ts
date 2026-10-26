import { NextResponse } from "next/server";
import { record } from "@/lib/metrics";
import { cleanQuery, isPlaceKind, isValidOrigin, searchCentres, type Origin } from "@/lib/places";
import { checkRate } from "@/lib/rateLimit";

export const runtime = "nodejs";

const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return `centres:${forwarded?.split(",")[0]?.trim() || "inconnu"}`;
}

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

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ configured: false, centres: [] });
  }

  try {
    const centres = await searchCentres({ origin, query, kind }, { apiKey });
    record("orientation");
    return NextResponse.json({ configured: true, centres });
  } catch {
    // On ne renvoie aucun détail : ils pourraient contenir la clé ou la position.
    return NextResponse.json({ configured: true, centres: [], error: "unavailable" }, { status: 502 });
  }
}

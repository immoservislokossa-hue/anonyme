import { NextResponse } from "next/server";
import { checkRate } from "@/lib/rateLimit";

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
}

export function tooMany(retryAfterSeconds: number): NextResponse {
  return NextResponse.json({ error: "Trop de demandes. Réessaie plus tard." }, { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } });
}

// Limite par adresse et par route. Renvoie une réponse 429 si la limite est dépassée, sinon null.
export function limited(request: Request, route: string, limit: number, windowMs: number): NextResponse | null {
  const rate = checkRate(`${route}:${clientIp(request)}`, limit, windowMs);
  return rate.allowed ? null : tooMany(rate.retryAfterSeconds);
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const body = await request.json().catch(() => null);
  return typeof body === "object" && body !== null && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
}

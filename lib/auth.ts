import { createHash, timingSafeEqual } from "node:crypto";

// Accès à l'espace Pilotage : un jeton partagé (PARTNER_TOKEN) échangé contre un cookie de session.
// En production, sans jeton configuré, l'accès est fermé.

export const SESSION_COOKIE = "alviosa-pilotage";
type Env = Record<string, string | undefined>;

export type Access = "ok" | "missing-config" | "denied";

function digest(value: string): Buffer {
  return createHash("sha256").update(`alviosa:${value}`).digest();
}

export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

export function sessionValue(token: string): string {
  return digest(`session:${token}`).toString("hex");
}

export function accessFor(token: string | undefined, env: Env = process.env): Access {
  const expected = env.PARTNER_TOKEN;
  if (!expected) return env.NODE_ENV === "production" ? "missing-config" : "ok";
  if (!token) return "denied";
  return safeEqual(token, expected) ? "ok" : "denied";
}

export function accessFromSession(cookie: string | undefined, env: Env = process.env): Access {
  const expected = env.PARTNER_TOKEN;
  if (!expected) return env.NODE_ENV === "production" ? "missing-config" : "ok";
  if (!cookie) return "denied";
  return safeEqual(cookie, sessionValue(expected)) ? "ok" : "denied";
}

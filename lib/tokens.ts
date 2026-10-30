import { createHash, randomBytes } from "node:crypto";

// Jeton de gestion d'un service : montré une seule fois, seule son empreinte est conservée. Côté serveur uniquement.
export function newToken(): string {
  return randomBytes(16).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(`service:${token}`).digest("hex");
}

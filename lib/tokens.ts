import { createHash, randomBytes } from "node:crypto";

// Jeton de gestion d'un service : montré une seule fois, seule son empreinte est conservée. Côté serveur uniquement.
export function newToken(): string {
  return randomBytes(16).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(`service:${token}`).digest("hex");
}

// Code court d'un service (6 signes, sans caractères qu'on confond) : il sert dans le QR et la carte à imprimer.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newCode(): string {
  const bytes = randomBytes(6);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

export function isCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-HJ-NP-Z2-9]{6}$/.test(value);
}

// Bon de visite d'un jeune : 5 signes, sans nom ni contact. Il ne sert qu'à compter la visite.
export function newVoucher(): string {
  const bytes = randomBytes(5);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

export function isVoucher(value: unknown): value is string {
  return typeof value === "string" && /^[A-HJ-NP-Z2-9]{5}$/.test(value);
}

// Comptes des prestataires et des responsables, avec Supabase Auth (email + mot de passe).
// Le rôle « pilotage » (ministère, district, partenaire) est donné par l'équipe dans app_metadata : une personne ne peut pas se l'attribuer.
// Sans SUPABASE_ANON_KEY, les comptes sont désactivés et l'ancien accès par jeton continue de fonctionner.

export const ACCOUNT_COOKIE = "alviosa-compte";
export type Role = "prestataire" | "pilotage";
export type Account = { id: string; email: string; role: Role };
type Env = Record<string, string | undefined>;

export function accountsEnabled(env: Env = process.env): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}

function endpoint(env: Env, path: string): string {
  return `${env.SUPABASE_URL?.replace(/\/+$/, "")}/auth/v1${path}`;
}

function headers(env: Env, bearer?: string): Record<string, string> {
  return { apikey: env.SUPABASE_ANON_KEY ?? "", "Content-Type": "application/json", ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) };
}

export function toAccount(user: unknown): Account | null {
  if (!user || typeof user !== "object") return null;
  const u = user as { id?: unknown; email?: unknown; app_metadata?: { role?: unknown } };
  if (typeof u.id !== "string" || typeof u.email !== "string") return null;
  return { id: u.id, email: u.email, role: u.app_metadata?.role === "pilotage" ? "pilotage" : "prestataire" };
}

export type AuthResult =
  | { ok: true; token: string; expiresIn: number; account: Account }
  | { ok: true; token: null; confirm: true }
  | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function authenticate(mode: "inscription" | "connexion", email: string, password: string, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<AuthResult> {
  if (!EMAIL.test(email) || email.length > 120) return { ok: false, error: "Écris une adresse e-mail valide." };
  if (password.length < 8 || password.length > 72) return { ok: false, error: "Le mot de passe doit avoir entre 8 et 72 signes." };
  const url = mode === "inscription" ? endpoint(env, "/signup") : endpoint(env, "/token?grant_type=password");
  const response = await fetchImpl(url, { method: "POST", headers: headers(env), body: JSON.stringify({ email, password }) });
  const data = (await response.json().catch(() => null)) as { access_token?: unknown; expires_in?: unknown; user?: unknown } | null;
  if (!response.ok) {
    return { ok: false, error: mode === "connexion" ? "E-mail ou mot de passe incorrect." : "Inscription impossible : cette adresse a peut-être déjà un compte, ou le mot de passe est trop simple." };
  }
  if (typeof data?.access_token !== "string") return { ok: true, token: null, confirm: true };
  const account = toAccount(data.user);
  if (!account) return { ok: false, error: "Compte illisible. Réessaie." };
  return { ok: true, token: data.access_token, expiresIn: typeof data.expires_in === "number" ? data.expires_in : 3600, account };
}

export async function accountFromToken(token: string, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<Account | null> {
  const response = await fetchImpl(endpoint(env, "/user"), { headers: headers(env, token) });
  if (!response.ok) return null;
  return toAccount(await response.json().catch(() => null));
}

// « Mot de passe oublié » : Supabase envoie un lien par e-mail. La réponse ne dit jamais si l'adresse a un compte.
export async function recover(email: string, redirectTo: string, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<void> {
  if (!EMAIL.test(email) || email.length > 120) return;
  await fetchImpl(endpoint(env, `/recover?redirect_to=${encodeURIComponent(redirectTo)}`), { method: "POST", headers: headers(env), body: JSON.stringify({ email }) });
}

// Nouveau mot de passe, avec le jeton reçu dans le lien de l'e-mail.
export async function setPassword(token: string, password: string, env: Env = process.env, fetchImpl: typeof fetch = fetch): Promise<boolean> {
  if (password.length < 8 || password.length > 72) return false;
  const response = await fetchImpl(endpoint(env, "/user"), { method: "PUT", headers: headers(env, token), body: JSON.stringify({ password }) });
  return response.ok;
}

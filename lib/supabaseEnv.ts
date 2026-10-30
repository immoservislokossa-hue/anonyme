// Noms des variables Supabase. Vercel crée ceux de l'intégration (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) ;
// on accepte aussi les noms courts. La clé « service_role » (écriture des données) ne doit JAMAIS avoir le préfixe NEXT_PUBLIC_.
type Env = Record<string, string | undefined>;

const clean = (v: string | undefined): string | undefined => v?.trim() || undefined;

export function supabaseUrl(env: Env = process.env): string | undefined {
  return clean(env.SUPABASE_URL) ?? clean(env.NEXT_PUBLIC_SUPABASE_URL);
}

export function supabaseAnonKey(env: Env = process.env): string | undefined {
  return clean(env.SUPABASE_ANON_KEY) ?? clean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ?? clean(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ?? clean(env.SUPABASE_PUBLISHABLE_KEY);
}

export function supabaseServiceKey(env: Env = process.env): string | undefined {
  return clean(env.SUPABASE_SERVICE_ROLE_KEY) ?? clean(env.SUPABASE_SECRET_KEY);
}

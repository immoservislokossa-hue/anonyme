// Limite simple par clé (adresse IP), en mémoire. Protège le coût du modèle contre les abus.
// À remplacer par un stockage partagé si le service tourne sur plusieurs instances.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateResult = { allowed: boolean; retryAfterSeconds: number };

export function checkRate(key: string, limit: number, windowMs: number, now: number = Date.now()): RateResult {
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRateLimits(): void {
  buckets.clear();
}

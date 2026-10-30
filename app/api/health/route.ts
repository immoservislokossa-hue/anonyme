import { NextResponse } from "next/server";
import { pickProvider } from "@/lib/llm";
import { scrappaApiKey } from "@/lib/scrappa";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// État du service, sans aucun secret : le stockage (mémoire ou Supabase) répond-il ? un modèle d'IA est-il configuré ?
export async function GET() {
  const store = getStore();
  let storageOk = true;
  try {
    await store.list("events", 1);
  } catch {
    storageOk = false;
  }
  return NextResponse.json(
    {
      status: storageOk ? "ok" : "degraded",
      storage: { kind: store.kind, ok: storageOk, durable: store.kind === "supabase" },
      ai: pickProvider() !== "none",
      model: pickProvider(),
      places: { google: Boolean(process.env.GOOGLE_MAPS_API_KEY), scrappa: Boolean(scrappaApiKey(process.env)) },
      pilotageConfigured: Boolean(process.env.PARTNER_TOKEN),
    },
    { status: storageOk ? 200 : 503 },
  );
}

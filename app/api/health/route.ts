import { NextResponse } from "next/server";
import { pickProvider } from "@/lib/llm";

export const runtime = "nodejs";

// Indique ce qui est configuré, sans jamais révéler une clé.
export function GET() {
  return NextResponse.json({
    status: "ok",
    model: pickProvider(),
    places: {
      osm: true, // toujours disponible, sans clé
      google: Boolean(process.env.GOOGLE_MAPS_API_KEY),
      scrappa: Boolean(process.env.SCRAPPA_API_KEY),
    },
    partnerPage: Boolean(process.env.PARTNER_TOKEN),
  });
}

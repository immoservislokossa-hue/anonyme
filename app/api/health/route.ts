import { NextResponse } from "next/server";
import { pickProvider } from "@/lib/llm";

export const runtime = "nodejs";

// Indique ce qui est configuré, sans jamais révéler une clé : le fournisseur d'IA retenu et la présence de la clé Google.
export function GET() {
  return NextResponse.json({
    status: "ok",
    model: pickProvider(),
    maps: Boolean(process.env.GOOGLE_MAPS_API_KEY),
    partnerPage: Boolean(process.env.PARTNER_TOKEN),
  });
}

import { NextResponse } from "next/server";
import { indicatorRows, toCsv } from "@/lib/analytics";
import { limited } from "@/lib/http";
import { loadDataset, sessionAccess } from "@/lib/pilotageData";

export const runtime = "nodejs";

// Export des indicateurs agrégés. Réservé aux personnes connectées. Aucune ligne individuelle.
export async function GET(request: Request) {
  const limit = limited(request, "export", 30, 600_000);
  if (limit) return limit;
  if ((await sessionAccess()) !== "ok") return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const rows = indicatorRows(await loadDataset());
  const format = new URL(request.url).searchParams.get("format");
  const stamp = new Date().toISOString().slice(0, 10);
  if (format === "json") {
    return NextResponse.json({ genereLe: new Date().toISOString(), indicateurs: rows }, { headers: { "Content-Disposition": `attachment; filename="alviosa-indicateurs-${stamp}.json"` } });
  }
  return new NextResponse(toCsv(rows), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="alviosa-indicateurs-${stamp}.csv"` } });
}

import { NextResponse } from "next/server";
import { alerts, overview, quality, synthese, themeRanking } from "@/lib/analytics";
import { limited } from "@/lib/http";
import { generateReply, pickProvider } from "@/lib/llm";
import { loadDataset, sessionAccess } from "@/lib/pilotageData";

export const runtime = "nodejs";

const SYSTEM = `Tu aides un responsable de district ou un ministère de la santé à préparer une réunion sur la planification familiale des jeunes.
À partir des chiffres agrégés fournis (JSON), écris 5 phrases courtes en français simple : ce qui progresse, ce qui inquiète, et 2 actions concrètes.
Règles : n'invente aucun chiffre ; cite seulement ceux du JSON ; si une valeur est « <5 », dis qu'elle est trop faible pour être interprétée ; ne parle d'aucune personne ni d'aucun service nommé ; rappelle une fois que ces données sont déclaratives.
Une phrase par ligne, sans titre ni liste à puces.`;

// Synthèse de la semaine. Les chiffres ont déjà été masqués sous le seuil d'anonymat avant d'être donnés à l'IA.
export async function POST(request: Request) {
  const limit = limited(request, "synthese", 10, 600_000);
  if (limit) return limit;
  if ((await sessionAccess()) !== "ok") return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const ds = await loadDataset();
  const fallback = synthese(ds);
  if (pickProvider() === "none") return NextResponse.json({ lignes: fallback, source: "regles" });

  const facts = { apercu: overview(ds), themes: themeRanking(ds).map((t) => ({ theme: t.theme, nombre: t.count })), qualite: quality(ds), alertes: alerts(ds).map((a) => a.titre) };
  try {
    const text = await generateReply(SYSTEM, [{ role: "user", content: JSON.stringify(facts) }]);
    const lignes = text.split(/\n+/).map((l) => l.trim()).filter(Boolean).slice(0, 8);
    if (lignes.length === 0) return NextResponse.json({ lignes: fallback, source: "regles" });
    return NextResponse.json({ lignes, source: "ia" });
  } catch {
    return NextResponse.json({ lignes: fallback, source: "regles" });
  }
}

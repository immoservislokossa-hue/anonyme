import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { allServices, validatedServices } from "@/lib/directory";
import { limited, readJson } from "@/lib/http";
import { validateServiceInput } from "@/lib/services";
import { hashToken, newCode, newToken } from "@/lib/tokens";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";

const MAX_PENDING = 500;

// Liste publique : seulement les services validés, sans aucune donnée de gestion.
async function handleGET(request: Request) {
  const limit = limited(request, "services-get", 60, 60_000);
  if (limit) return limit;
  const url = new URL(request.url);
  const services = await validatedServices({
    zone: url.searchParams.get("zone") ?? undefined,
    methode: url.searchParams.get("methode") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
    accueilJeunes: url.searchParams.get("accueil") === "1",
  });
  return NextResponse.json({ services });
}

// Inscription d'un service. Il reste « en attente » jusqu'à la validation par un responsable.
async function handlePOST(request: Request) {
  const limit = limited(request, "services-post", 5, 3_600_000);
  if (limit) return limit;
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  // Champ piège : un humain ne le voit pas, un robot le remplit.
  if (typeof body.siteWeb === "string" && body.siteWeb.length > 0) return new NextResponse(null, { status: 204 });

  const checked = validateServiceInput(body);
  if (!checked.ok) return NextResponse.json({ errors: checked.errors }, { status: 422 });

  const known = await allServices();
  const pending = known.filter((s) => s.statut === "en-attente").length;
  if (pending >= MAX_PENDING) return NextResponse.json({ error: "Trop d'inscriptions en attente. Réessaie plus tard." }, { status: 503 });

  const jeton = newToken();
  let code = newCode();
  for (let i = 0; i < 5 && known.some((s) => s.code === code); i += 1) code = newCode();
  const now = new Date().toISOString();
  const row = await getStore().insert("services", { ...checked.value, code, statut: "en-attente", jetonHash: hashToken(jeton), majLe: now });
  return NextResponse.json({ id: row.id, code, jeton }, { status: 201 });
}

export const GET = guarded(handleGET);

export const POST = guarded(handlePOST);

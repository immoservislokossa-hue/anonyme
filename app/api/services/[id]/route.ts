import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { getService, storedHash } from "@/lib/directory";
import { limited, readJson } from "@/lib/http";
import { validateServiceInput } from "@/lib/services";
import { hashToken } from "@/lib/tokens";
import { safeEqual } from "@/lib/auth";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";

// Mise à jour par le service lui-même, avec son jeton. Le nom, le type et la zone ne changent pas ici.
async function handlePATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limit = limited(request, "services-patch", 20, 3_600_000);
  if (limit) return limit;
  const { id } = await params;
  const body = await readJson(request);
  if (!body || typeof body.jeton !== "string") return NextResponse.json({ error: "Jeton manquant." }, { status: 400 });

  const hash = await storedHash(id);
  const service = await getService(id);
  if (!hash || !service || !safeEqual(hashToken(body.jeton), hash)) return NextResponse.json({ error: "Jeton non valide." }, { status: 403 });

  const merged = {
    nom: service.nom,
    type: service.type,
    zone: service.zone,
    commune: service.commune,
    adresse: body.adresse ?? service.adresse,
    telephone: body.telephone ?? service.telephone,
    horaires: body.horaires ?? service.horaires,
    methodes: body.methodes ?? service.methodes,
    accueilJeunes: body.accueilJeunes ?? service.accueilJeunes,
    gratuitJeunes: body.gratuitJeunes ?? service.gratuitJeunes,
    confidentialite: body.confidentialite ?? service.confidentialite,
  };
  const checked = validateServiceInput(merged);
  if (!checked.ok) return NextResponse.json({ errors: checked.errors }, { status: 422 });

  await getStore().update("services", id, { ...checked.value, majLe: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}

export const PATCH = guarded(handlePATCH);

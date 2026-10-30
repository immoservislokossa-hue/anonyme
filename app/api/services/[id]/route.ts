import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { getService } from "@/lib/directory";
import { mayManage } from "@/lib/manage";
import { limited, readJson } from "@/lib/http";
import { validateServiceInput } from "@/lib/services";
import { getStore } from "@/lib/store";

export const runtime = "nodejs";

// Mise à jour par le service lui-même, avec son jeton. Le nom, le type et la zone ne changent pas ici.
async function handlePATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const limit = limited(request, "services-patch", 20, 3_600_000);
  if (limit) return limit;
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const service = await getService(id);
  if (!service || !(await mayManage(id, body.jeton))) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

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

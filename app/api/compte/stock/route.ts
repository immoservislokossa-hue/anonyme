import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/accountSession";
import { servicesOf, stockFor } from "@/lib/directory";

export const runtime = "nodejs";

// L'état actuel des stocks du service de la personne connectée (dernier signal par méthode).
async function handleGET() {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ stock: [] });
  const [service] = await servicesOf(account.id);
  if (!service) return NextResponse.json({ stock: [] });
  return NextResponse.json({ stock: await stockFor(service.id) });
}

export const GET = guarded(handleGET);

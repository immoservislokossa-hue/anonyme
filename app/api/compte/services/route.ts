import { guarded } from "@/lib/safe";
import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/accountSession";
import { servicesOf } from "@/lib/directory";

export const runtime = "nodejs";

// Les services inscrits par la personne connectée.
async function handleGET() {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ services: [] });
  const services = await servicesOf(account.id);
  return NextResponse.json({ services });
}

export const GET = guarded(handleGET);

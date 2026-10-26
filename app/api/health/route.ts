import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ status: "ok", model: Boolean(process.env.ANTHROPIC_API_KEY) });
}

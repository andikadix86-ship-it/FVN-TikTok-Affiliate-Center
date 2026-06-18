import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = getRequestSession(request);
  return NextResponse.json({ authenticated: Boolean(session), user: session?.user ?? null });
}

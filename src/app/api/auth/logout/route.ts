import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true, redirectTo: "/login" });
  clearAuthCookie(response);
  return response;
}

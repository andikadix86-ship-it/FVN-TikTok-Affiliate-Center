import { NextRequest, NextResponse } from "next/server";
import { inferNameFromEmail, setAuthCookie } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { email?: string; password?: string; remember?: boolean } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Masukkan email yang valid." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
  setAuthCookie(response, {
    id: `email:${email}`,
    name: inferNameFromEmail(email),
    email,
    provider: "email"
  }, Boolean(body?.remember));

  return response;
}

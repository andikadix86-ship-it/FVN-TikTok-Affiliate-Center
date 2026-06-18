import { NextRequest, NextResponse } from "next/server";
import { inferNameFromEmail, setAuthCookie } from "@/lib/auth-session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { name?: string; email?: string; password?: string; agreeTerms?: boolean; remember?: boolean } | null;
  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (name.length < 2) {
    return NextResponse.json({ error: "Nama minimal 2 karakter." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Masukkan email yang valid." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password baru minimal 8 karakter." }, { status: 400 });
  }

  if (!body?.agreeTerms) {
    return NextResponse.json({ error: "Setujui Terms dan Privacy Policy untuk membuat akun." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
  setAuthCookie(response, {
    id: `email:${email}`,
    name: name || inferNameFromEmail(email),
    email,
    provider: "email"
  }, Boolean(body?.remember));

  return response;
}

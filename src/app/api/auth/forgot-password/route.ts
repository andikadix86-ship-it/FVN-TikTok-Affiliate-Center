import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Masukkan email yang valid." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Jika email terdaftar, instruksi reset password akan dikirim."
  });
}

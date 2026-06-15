import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  return NextResponse.json({
    connected: Boolean(code),
    provider: "tiktok",
    state,
    message: code
      ? "TikTok authorization code received. Exchange flow can be enabled after app credentials are configured."
      : "Missing TikTok authorization code."
  });
}

import { NextRequest, NextResponse } from "next/server";
import {
  exchangeTikTokCode,
  TIKTOK_CONNECTED_COOKIE,
  TIKTOK_STATE_COOKIE
} from "@/modules/tiktok/oauth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(TIKTOK_STATE_COOKIE)?.value;

  if (!code) {
    return NextResponse.json(
      {
        connected: false,
        provider: "tiktok",
        message: "Missing TikTok authorization code."
      },
      { status: 400 }
    );
  }

  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.json(
      {
        connected: false,
        provider: "tiktok",
        message: "Invalid TikTok OAuth state."
      },
      { status: 400 }
    );
  }

  const tokenResult = await exchangeTikTokCode(code);

  if (!tokenResult.ok) {
    return NextResponse.json(
      {
        connected: false,
        provider: "tiktok",
        message: "TikTok token exchange failed.",
        status: tokenResult.status,
        details: tokenResult.payload
      },
      { status: 502 }
    );
  }

  const response = NextResponse.json({
    connected: true,
    provider: "tiktok",
    state,
    message: "TikTok token exchange completed."
  });

  response.cookies.delete(TIKTOK_STATE_COOKIE);
  response.cookies.set(TIKTOK_CONNECTED_COOKIE, "true", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}

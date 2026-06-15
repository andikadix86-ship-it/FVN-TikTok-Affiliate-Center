import { NextResponse } from "next/server";
import { buildTikTokLoginUrl, createOAuthState, TIKTOK_STATE_COOKIE } from "@/modules/tiktok/oauth";

export async function GET() {
  const state = createOAuthState();
  const response = NextResponse.redirect(buildTikTokLoginUrl(state));

  response.cookies.set(TIKTOK_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}

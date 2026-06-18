import { NextRequest, NextResponse } from "next/server";
import { AUTH_GOOGLE_STATE_COOKIE, createOAuthState } from "@/lib/auth-session";

export const runtime = "nodejs";

function getLoginRedirectUri(request: NextRequest) {
  const configured = process.env.GOOGLE_REDIRECT_URI;
  if (configured?.includes("/api/auth/login/google/callback")) return configured;
  return new URL("/api/auth/login/google/callback", request.url).toString();
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google-not-configured", request.url));
  }

  const state = createOAuthState();
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", getLoginRedirectUri(request));
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(AUTH_GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600
  });
  return response;
}

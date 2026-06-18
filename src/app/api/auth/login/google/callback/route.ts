import { NextRequest, NextResponse } from "next/server";
import { AUTH_GOOGLE_STATE_COOKIE, setAuthCookie } from "@/lib/auth-session";

export const runtime = "nodejs";

type GoogleUserInfo = {
  sub: string;
  name?: string;
  email?: string;
};

function getLoginRedirectUri(request: NextRequest) {
  const configured = process.env.GOOGLE_REDIRECT_URI;
  if (configured?.includes("/api/auth/login/google/callback")) return configured;
  return new URL("/api/auth/login/google/callback", request.url).toString();
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = request.cookies.get(AUTH_GOOGLE_STATE_COOKIE)?.value;

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=google-auth-failed", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google-not-configured", request.url));
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: getLoginRedirectUri(request)
      })
    });

    if (!tokenResponse.ok) throw new Error("Google token exchange failed.");
    const token = await tokenResponse.json() as { access_token?: string };
    if (!token.access_token) throw new Error("Google access token is missing.");

    const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { authorization: `Bearer ${token.access_token}` }
    });
    if (!userResponse.ok) throw new Error("Google profile request failed.");
    const profile = await userResponse.json() as GoogleUserInfo;
    if (!profile.email) throw new Error("Google email is missing.");

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(AUTH_GOOGLE_STATE_COOKIE, "", { path: "/", maxAge: 0 });
    setAuthCookie(response, {
      id: `google:${profile.sub}`,
      name: profile.name || profile.email,
      email: profile.email,
      provider: "google"
    }, true);
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=google-auth-failed", request.url));
  }
}

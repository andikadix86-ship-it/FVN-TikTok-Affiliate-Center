import { NextResponse } from "next/server";
import {
  buildTikTokLoginUrl,
  createOAuthState,
  generatePkceChallenge,
  generatePkceVerifier,
  TIKTOK_CODE_VERIFIER_COOKIE,
  TIKTOK_OAUTH_ERROR_COOKIE,
  TIKTOK_STATE_COOKIE,
  validateTikTokEnv
} from "@/modules/tiktok/oauth";
import { env } from "@/lib/env";
import { writeTikTokOAuthLog } from "@/modules/tiktok/account-service";

export async function GET() {
  const envStatus = validateTikTokEnv();

  if (!envStatus.valid) {
    const message = "TikTok OAuth environment is missing or invalid.";
    const response = NextResponse.json({
      error: message,
      details: envStatus.errors
    }, { status: 500 });

    response.cookies.set(TIKTOK_OAUTH_ERROR_COOKIE, message, {
      httpOnly: true,
      maxAge: 60 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
    await writeTikTokOAuthLog("ERROR", message, envStatus.errors, "env_invalid");

    return response;
  }

  const state = createOAuthState();
  const pkceEnabled = env.TIKTOK_OAUTH_PKCE_ENABLED === "true";
  const codeVerifier = pkceEnabled ? generatePkceVerifier() : undefined;
  const codeChallenge = codeVerifier ? generatePkceChallenge(codeVerifier) : undefined;
  const response = NextResponse.redirect(buildTikTokLoginUrl(state, {
    pkceEnabled,
    codeChallenge
  }));

  response.cookies.set(TIKTOK_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  if (codeVerifier) {
    response.cookies.set(TIKTOK_CODE_VERIFIER_COOKIE, codeVerifier, {
      httpOnly: true,
      maxAge: 60 * 10,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });
  }
  response.cookies.delete(TIKTOK_OAUTH_ERROR_COOKIE);
  await writeTikTokOAuthLog("SUCCESS", "TikTok login URL generated.", {
    pkceEnabled,
    endpoint: "v2 authorize"
  });

  return response;
}

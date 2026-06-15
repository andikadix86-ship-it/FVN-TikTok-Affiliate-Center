import { NextRequest, NextResponse } from "next/server";
import {
  exchangeTikTokCode,
  TIKTOK_CONNECTED_COOKIE,
  TIKTOK_OAUTH_ERROR_COOKIE,
  TIKTOK_STATE_COOKIE
} from "@/modules/tiktok/oauth";
import { buildSafeOAuthError } from "@/modules/tiktok/production-oauth";

function oauthErrorResponse(message: string, status: number, details?: unknown) {
  const payload = buildSafeOAuthError(message, details);
  const response = NextResponse.json(
    payload,
    { status }
  );

  response.cookies.set(TIKTOK_OAUTH_ERROR_COOKIE, payload.details ? `${message} ${payload.details}` : message, {
    httpOnly: true,
    maxAge: 60 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");
  const oauthErrorDescription = request.nextUrl.searchParams.get("error_description");
  const expectedState = request.cookies.get(TIKTOK_STATE_COOKIE)?.value;

  if (oauthError) {
    return oauthErrorResponse(
      oauthErrorDescription ? `TikTok returned an error: ${oauthError}. ${oauthErrorDescription}` : `TikTok returned an error: ${oauthError}.`,
      400
    );
  }

  if (!code) {
    return oauthErrorResponse("TikTok callback is missing authorization code.", 400);
  }

  if (!state || !expectedState || state !== expectedState) {
    return oauthErrorResponse("TikTok OAuth state mismatch. Please retry the connection from this app.", 400);
  }

  const tokenResult = await exchangeTikTokCode(code);

  if (!tokenResult.ok) {
    return oauthErrorResponse("TikTok token exchange failed. Check OAuth app credentials and redirect URI.", 502, {
      status: tokenResult.status,
      payload: tokenResult.payload
    });
  }

  const response = NextResponse.json({
    connected: true,
    provider: "tiktok",
    state,
    message: "TikTok token exchange completed."
  });

  response.cookies.delete(TIKTOK_STATE_COOKIE);
  response.cookies.delete(TIKTOK_OAUTH_ERROR_COOKIE);
  response.cookies.set(TIKTOK_CONNECTED_COOKIE, "true", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}

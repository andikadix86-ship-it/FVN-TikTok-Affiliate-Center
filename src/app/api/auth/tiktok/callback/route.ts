import { NextRequest, NextResponse } from "next/server";
import {
  exchangeTikTokCode,
  TIKTOK_CONNECTED_COOKIE,
  TIKTOK_OAUTH_ERROR_COOKIE,
  TIKTOK_STATE_COOKIE
} from "@/modules/tiktok/oauth";

function oauthErrorResponse(message: string, status: number, details?: unknown) {
  const response = NextResponse.json(
    {
      connected: false,
      provider: "tiktok",
      message,
      details
    },
    { status }
  );

  response.cookies.set(TIKTOK_OAUTH_ERROR_COOKIE, message, {
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
      oauthErrorDescription ? `${oauthError}: ${oauthErrorDescription}` : oauthError,
      400
    );
  }

  if (!code) {
    return oauthErrorResponse("Missing TikTok authorization code.", 400);
  }

  if (!state || !expectedState || state !== expectedState) {
    return oauthErrorResponse("Invalid TikTok OAuth state.", 400);
  }

  const tokenResult = await exchangeTikTokCode(code);

  if (!tokenResult.ok) {
    return oauthErrorResponse("TikTok token exchange failed.", 502, {
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

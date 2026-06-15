import { NextRequest, NextResponse } from "next/server";
import {
  exchangeTikTokCodeForToken,
  fetchTikTokUserInfo,
  parseTikTokCallback,
  TIKTOK_CODE_VERIFIER_COOKIE,
  TIKTOK_CONNECTED_COOKIE,
  TIKTOK_OAUTH_ERROR_COOKIE,
  TIKTOK_OAUTH_SUCCESS_COOKIE,
  TIKTOK_STATE_COOKIE,
  validateTikTokEnv
} from "@/modules/tiktok/oauth";
import { buildSafeOAuthError } from "@/modules/tiktok/production-oauth";
import {
  buildTokenStorageWarning,
  saveTikTokAccountConnection,
  writeTikTokOAuthLog
} from "@/modules/tiktok/account-service";

function setOAuthErrorCookie(response: NextResponse, message: string) {
  response.cookies.set(TIKTOK_OAUTH_ERROR_COOKIE, message, {
    httpOnly: true,
    maxAge: 60 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

function oauthErrorResponse(message: string, status: number, details?: unknown, errorCode?: string) {
  const payload = buildSafeOAuthError(message, details);
  const response = NextResponse.json(payload, { status });

  setOAuthErrorCookie(response, payload.details ? `${message} ${payload.details}` : message);
  void writeTikTokOAuthLog("ERROR", message, details, errorCode);

  return response;
}

function getTokenPayloadValue(payload: unknown, key: string) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const root = payload as Record<string, unknown>;
  const direct = root[key];
  const nested = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>)[key] : undefined;
  return direct ?? nested;
}

function getUserPayloadValue(payload: unknown, key: string) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const root = payload as Record<string, unknown>;
  const user = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>).user : undefined;
  return user && typeof user === "object" ? (user as Record<string, unknown>)[key] : root[key];
}

export async function GET(request: NextRequest) {
  const envStatus = validateTikTokEnv();

  if (!envStatus.valid) {
    return oauthErrorResponse("TikTok OAuth environment is missing or invalid.", 500, envStatus.errors, "env_invalid");
  }

  const parsed = parseTikTokCallback({
    code: request.nextUrl.searchParams.get("code"),
    state: request.nextUrl.searchParams.get("state"),
    expectedState: request.cookies.get(TIKTOK_STATE_COOKIE)?.value,
    error: request.nextUrl.searchParams.get("error"),
    errorDescription: request.nextUrl.searchParams.get("error_description")
  });

  if (!parsed.ok) {
    return oauthErrorResponse(parsed.message, parsed.status, parsed.details, parsed.errorCode);
  }

  const codeVerifier = request.cookies.get(TIKTOK_CODE_VERIFIER_COOKIE)?.value;
  const tokenResult = await exchangeTikTokCodeForToken(parsed.code, envStatus.pkceEnabled ? codeVerifier : undefined);

  if (!tokenResult.ok) {
    return oauthErrorResponse("TikTok token exchange failed. Check OAuth app credentials and redirect URI.", 502, {
      status: tokenResult.status,
      payload: tokenResult.payload
    }, "token_exchange_failed");
  }

  const accessToken = getTokenPayloadValue(tokenResult.payload, "access_token");
  const refreshToken = getTokenPayloadValue(tokenResult.payload, "refresh_token");
  const openIdFromToken = getTokenPayloadValue(tokenResult.payload, "open_id");
  const expiresIn = getTokenPayloadValue(tokenResult.payload, "expires_in");
  let openId = typeof openIdFromToken === "string" ? openIdFromToken : `connected_${Date.now()}`;
  let displayName: string | undefined;
  let avatarUrl: string | undefined;
  let profileDeepLink: string | undefined;
  let profileWarning: string | undefined;

  if (typeof accessToken === "string") {
    const profile = await fetchTikTokUserInfo(accessToken);

    if (profile.ok) {
      const profileOpenId = getUserPayloadValue(profile.payload, "open_id");
      const profileDisplayName = getUserPayloadValue(profile.payload, "display_name");
      const profileAvatarUrl = getUserPayloadValue(profile.payload, "avatar_url");

      openId = typeof profileOpenId === "string" ? profileOpenId : openId;
      displayName = typeof profileDisplayName === "string" ? profileDisplayName : undefined;
      avatarUrl = typeof profileAvatarUrl === "string" ? profileAvatarUrl : undefined;
      profileDeepLink = openId ? `https://www.tiktok.com/@${openId}` : undefined;
    } else {
      profileWarning = "Akun terhubung, tetapi profil belum bisa dibaca. Cek scope TikTok Developer.";
      await writeTikTokOAuthLog("ERROR", "TikTok profile fetch failed.", {
        status: profile.status,
        payload: profile.payload
      }, "profile_fetch_failed");
    }
  }

  try {
    await saveTikTokAccountConnection({
      openId,
      displayName,
      avatarUrl,
      profileDeepLink,
      accessToken: typeof accessToken === "string" ? accessToken : undefined,
      refreshToken: typeof refreshToken === "string" ? refreshToken : undefined,
      expiresIn: typeof expiresIn === "number" ? expiresIn : undefined
    });
  } catch (error) {
    await writeTikTokOAuthLog("ERROR", "TikTok account save failed.", error, "account_save_failed");
  }

  await writeTikTokOAuthLog("SUCCESS", "TikTok token exchange success.", {
    hasAccessToken: Boolean(accessToken),
    openId
  }, "token_exchange_success");

  const tokenWarning = buildTokenStorageWarning();
  const message = profileWarning ? `${profileWarning} ${tokenWarning}` : `TikTok account connected. ${tokenWarning}`;
  const response = NextResponse.json({
    connected: true,
    provider: "tiktok",
    state: parsed.state,
    message,
    tokenStatus: "not_stored"
  });

  response.cookies.delete(TIKTOK_STATE_COOKIE);
  response.cookies.delete(TIKTOK_CODE_VERIFIER_COOKIE);
  response.cookies.delete(TIKTOK_OAUTH_ERROR_COOKIE);
  response.cookies.set(TIKTOK_OAUTH_SUCCESS_COOKIE, message, {
    httpOnly: true,
    maxAge: 60 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  response.cookies.set(TIKTOK_CONNECTED_COOKIE, "true", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return response;
}

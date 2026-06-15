import { env } from "@/lib/env";

export const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
export const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
export const TIKTOK_STATE_COOKIE = "fvn_tiktok_oauth_state";
export const TIKTOK_CONNECTED_COOKIE = "fvn_tiktok_connected";
export const TIKTOK_OAUTH_ERROR_COOKIE = "fvn_tiktok_oauth_error";

export function createOAuthState() {
  return crypto.randomUUID();
}

export function buildTikTokLoginUrl(state: string) {
  const url = new URL(TIKTOK_AUTH_URL);
  url.searchParams.set("client_key", env.TIKTOK_CLIENT_KEY ?? "");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "user.info.basic");
  url.searchParams.set("redirect_uri", env.TIKTOK_REDIRECT_URI);
  url.searchParams.set("state", state);

  return url;
}

export function buildTikTokTokenRequestBody(code: string) {
  const body = new URLSearchParams();
  body.set("client_key", env.TIKTOK_CLIENT_KEY ?? "");
  body.set("client_secret", env.TIKTOK_CLIENT_SECRET ?? "");
  body.set("code", code);
  body.set("grant_type", "authorization_code");
  body.set("redirect_uri", env.TIKTOK_REDIRECT_URI);

  return body;
}

export async function exchangeTikTokCode(code: string) {
  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: buildTikTokTokenRequestBody(code)
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      payload
    };
  }

  return {
    ok: true,
    status: response.status,
    payload
  };
}

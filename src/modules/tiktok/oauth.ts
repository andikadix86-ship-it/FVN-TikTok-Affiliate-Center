import crypto from "crypto";
import { env } from "@/lib/env";

export const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
export const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
export const TIKTOK_USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";
export const TIKTOK_STATE_COOKIE = "fvn_tiktok_oauth_state";
export const TIKTOK_CONNECTED_COOKIE = "fvn_tiktok_connected";
export const TIKTOK_OAUTH_ERROR_COOKIE = "fvn_tiktok_oauth_error";
export const TIKTOK_OAUTH_SUCCESS_COOKIE = "fvn_tiktok_oauth_success";
export const TIKTOK_CODE_VERIFIER_COOKIE = "fvn_tiktok_code_verifier";

const optionalScopes = ["user.info.profile", "user.info.stats", "video.list"] as const;
const tokenRedactionPattern = /(access_token|refresh_token|client_secret|code_verifier)(["'=:\s]+)([^"',\s&}]+)/gi;

export type RedirectUriValidation = {
  configured: boolean;
  absolute: boolean;
  https: boolean;
  static: boolean;
  hasQuery: boolean;
  hasHash: boolean;
  valid: boolean;
  errors: string[];
};

export type TikTokEnvValidation = {
  clientKey: "configured" | "missing";
  clientSecret: "configured" | "missing";
  redirectUri: "configured" | "missing" | "invalid";
  appUrl: "configured" | "missing" | "invalid";
  pkceEnabled: boolean;
  valid: boolean;
  errors: string[];
  redirect: RedirectUriValidation;
};

export type TikTokCallbackParseResult =
  | { ok: true; code: string; state: string }
  | { ok: false; status: number; errorCode: string; message: string; details?: Record<string, string> };

export function redactOAuthSecrets(value: unknown) {
  if (!value) {
    return "";
  }

  return (typeof value === "string" ? value : JSON.stringify(value))
    .replace(tokenRedactionPattern, "$1$2[redacted]")
    .replace(/(client_secret=)[^&\s]+/gi, "$1[redacted]")
    .replace(/(access_token=)[^&\s]+/gi, "$1[redacted]")
    .replace(/(refresh_token=)[^&\s]+/gi, "$1[redacted]")
    .slice(0, 1000);
}

export function validateRedirectUri(redirectUri = env.TIKTOK_REDIRECT_URI, {
  requireHttps = process.env.NODE_ENV === "production",
  expectedRedirectUri = env.TIKTOK_REDIRECT_URI
}: {
  requireHttps?: boolean;
  expectedRedirectUri?: string;
} = {}): RedirectUriValidation {
  const errors: string[] = [];
  let absolute = false;
  let https = false;
  let hasQuery = false;
  let hasHash = false;

  if (!redirectUri) {
    errors.push("PLATFORM_REDIRECT_URI is missing.");
    return {
      configured: false,
      absolute,
      https,
      static: false,
      hasQuery,
      hasHash,
      valid: false,
      errors
    };
  }

  try {
    const url = new URL(redirectUri);
    absolute = true;
    https = url.protocol === "https:";
    hasQuery = Boolean(url.search);
    hasHash = Boolean(url.hash);
  } catch {
    errors.push("Redirect URI harus berupa URL absolut.");
  }

  if (requireHttps && !https) {
    errors.push("Redirect URI harus diawali https://");
  }

  if (hasQuery) {
    errors.push("Redirect URI tidak boleh memakai query parameter");
  }

  if (hasHash) {
    errors.push("Redirect URI tidak boleh memakai tanda #");
  }

  if (expectedRedirectUri && redirectUri !== expectedRedirectUri) {
    errors.push("Redirect URI harus sama persis dengan yang didaftarkan di developer portal");
  }

  return {
    configured: true,
    absolute,
    https,
    static: absolute && !hasQuery && !hasHash,
    hasQuery,
    hasHash,
    valid: errors.length === 0,
    errors
  };
}

export function validateTikTokEnv({
  clientKey = env.TIKTOK_CLIENT_KEY,
  clientSecret = env.TIKTOK_CLIENT_SECRET,
  redirectUri = env.TIKTOK_REDIRECT_URI,
  appUrl = env.NEXT_PUBLIC_APP_URL,
  pkceEnabled = env.TIKTOK_OAUTH_PKCE_ENABLED === "true",
  nodeEnv = process.env.NODE_ENV
}: {
  clientKey?: string;
  clientSecret?: string;
  redirectUri?: string;
  appUrl?: string;
  pkceEnabled?: boolean;
  nodeEnv?: string;
} = {}): TikTokEnvValidation {
  const redirect = validateRedirectUri(redirectUri, {
    requireHttps: nodeEnv === "production",
    expectedRedirectUri: redirectUri
  });
  const errors = [...redirect.errors];
  let appUrlStatus: "configured" | "missing" | "invalid" = appUrl ? "configured" : "missing";

  if (!clientKey) {
    errors.push("PLATFORM_CLIENT_KEY is missing.");
  }

  if (!clientSecret) {
    errors.push("PLATFORM_CLIENT_SECRET is missing.");
  }

  if (!appUrl) {
    errors.push("NEXT_PUBLIC_APP_URL is missing.");
  } else {
    try {
      const parsed = new URL(appUrl);
      if (nodeEnv === "production" && parsed.protocol !== "https:") {
        appUrlStatus = "invalid";
        errors.push("NEXT_PUBLIC_APP_URL must start with https:// in production.");
      }
    } catch {
      appUrlStatus = "invalid";
      errors.push("NEXT_PUBLIC_APP_URL must be a valid URL.");
    }
  }

  return {
    clientKey: clientKey ? "configured" : "missing",
    clientSecret: clientSecret ? "configured" : "missing",
    redirectUri: !redirect.configured ? "missing" : redirect.valid ? "configured" : "invalid",
    appUrl: appUrlStatus,
    pkceEnabled,
    valid: errors.length === 0,
    errors,
    redirect
  };
}

export function generateTikTokState() {
  return crypto.randomBytes(24).toString("hex");
}

export function createOAuthState() {
  return generateTikTokState();
}

export function generatePkceVerifier() {
  return crypto.randomBytes(48).toString("base64url");
}

export function generatePkceChallenge(verifier: string) {
  return crypto.createHash("sha256").update(verifier).digest("hex");
}

export function buildTikTokLoginUrl(
  state: string,
  {
    clientKey = env.TIKTOK_CLIENT_KEY ?? "",
    redirectUri = env.TIKTOK_REDIRECT_URI,
    pkceEnabled = env.TIKTOK_OAUTH_PKCE_ENABLED === "true",
    codeChallenge,
    extraScopes = []
  }: {
    clientKey?: string;
    redirectUri?: string;
    pkceEnabled?: boolean;
    codeChallenge?: string;
    extraScopes?: Array<(typeof optionalScopes)[number]>;
  } = {}
) {
  const url = new URL(TIKTOK_AUTH_URL);
  const scope = ["user.info.basic", ...extraScopes.filter((item) => item !== "video.list")].join(",");
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);

  if (pkceEnabled && codeChallenge) {
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");
  }

  return url;
}

export function parseTikTokCallback({
  code,
  state,
  expectedState,
  error,
  errorDescription
}: {
  code?: string | null;
  state?: string | null;
  expectedState?: string | null;
  error?: string | null;
  errorDescription?: string | null;
}): TikTokCallbackParseResult {
  if (error) {
    return {
      ok: false,
      status: 400,
      errorCode: error,
      message: errorDescription ? `Platform returned an error: ${error}. ${errorDescription}` : `Platform returned an error: ${error}.`
    };
  }

  if (!code) {
    return {
      ok: false,
      status: 400,
      errorCode: "missing_code",
      message: "Platform callback is missing authorization code."
    };
  }

  if (!state || !expectedState || state !== expectedState) {
    return {
      ok: false,
      status: 400,
      errorCode: "state_mismatch",
      message: "Platform OAuth state mismatch. Please retry the connection from this app."
    };
  }

  return { ok: true, code, state };
}

export function buildTikTokTokenRequestBody(code: string, codeVerifier?: string) {
  const body = new URLSearchParams();
  body.set("client_key", env.TIKTOK_CLIENT_KEY ?? "");
  body.set("client_secret", env.TIKTOK_CLIENT_SECRET ?? "");
  body.set("code", code);
  body.set("grant_type", "authorization_code");
  body.set("redirect_uri", env.TIKTOK_REDIRECT_URI);

  if (codeVerifier) {
    body.set("code_verifier", codeVerifier);
  }

  return body;
}

export async function exchangeTikTokCodeForToken(code: string, codeVerifier?: string) {
  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: buildTikTokTokenRequestBody(code, codeVerifier)
  });
  const payload = await response.json().catch(() => null);

  return {
    ok: response.ok,
    status: response.status,
    payload
  };
}

export async function exchangeTikTokCode(code: string, codeVerifier?: string) {
  return exchangeTikTokCodeForToken(code, codeVerifier);
}

export async function refreshTikTokToken(refreshToken: string) {
  const body = new URLSearchParams();
  body.set("client_key", env.TIKTOK_CLIENT_KEY ?? "");
  body.set("client_secret", env.TIKTOK_CLIENT_SECRET ?? "");
  body.set("grant_type", "refresh_token");
  body.set("refresh_token", refreshToken);

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  return {
    ok: response.ok,
    status: response.status,
    payload: await response.json().catch(() => null)
  };
}

export async function revokeTikTokToken(accessToken: string) {
  const body = new URLSearchParams();
  body.set("client_key", env.TIKTOK_CLIENT_KEY ?? "");
  body.set("client_secret", env.TIKTOK_CLIENT_SECRET ?? "");
  body.set("token", accessToken);

  const response = await fetch("https://open.tiktokapis.com/v2/oauth/revoke/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  return {
    ok: response.ok,
    status: response.status,
    payload: await response.json().catch(() => null)
  };
}

export async function fetchTikTokUserInfo(accessToken: string) {
  const url = new URL(TIKTOK_USER_INFO_URL);
  url.searchParams.set("fields", "open_id,union_id,avatar_url,display_name");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return {
    ok: response.ok,
    status: response.status,
    payload: await response.json().catch(() => null)
  };
}

export function maskOpenId(openId?: string | null) {
  if (!openId) {
    return "Not connected";
  }

  if (openId.length <= 8) {
    return `${openId.slice(0, 2)}***`;
  }

  return `${openId.slice(0, 4)}...${openId.slice(-4)}`;
}

export function buildSafeOAuthLog(status: "SUCCESS" | "ERROR", message: string, details?: unknown, errorCode?: string) {
  return {
    status,
    errorCode,
    message: redactOAuthSecrets(message),
    safeDetails: details ? { detail: redactOAuthSecrets(details) } : undefined
  };
}

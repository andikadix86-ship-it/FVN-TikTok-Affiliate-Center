export type ProductionOAuthStatus = "configured" | "missing" | "invalid";

export type ProductionOAuthValidation = {
  status: ProductionOAuthStatus;
  errors: string[];
};

export function sanitizeOAuthError(value: unknown) {
  if (!value) {
    return undefined;
  }

  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text
    .replace(/client_secret=[^&\s]+/gi, "client_secret=[redacted]")
    .replace(/client_secret[\"=: ]+[^\",\s}]+/gi, "client_secret=[redacted]")
    .replace(/access_token[\"=: ]+[^\",\s}]+/gi, "access_token=[redacted]")
    .replace(/refresh_token[\"=: ]+[^\",\s}]+/gi, "refresh_token=[redacted]")
    .slice(0, 500);
}

export function buildSafeOAuthError(message: string, details?: unknown) {
  const safeDetails = sanitizeOAuthError(details);

  return {
    connected: false,
    provider: "tiktok",
    message,
    ...(safeDetails ? { details: safeDetails } : {})
  };
}

export function validateTikTokProductionOAuth({
  clientKey,
  clientSecret,
  redirectUri,
  appUrl,
  nodeEnv
}: {
  clientKey?: string;
  clientSecret?: string;
  redirectUri?: string;
  appUrl?: string;
  nodeEnv?: string;
}): ProductionOAuthValidation {
  const errors: string[] = [];

  if (!clientKey) {
    errors.push("TIKTOK_CLIENT_KEY is missing.");
  }

  if (!clientSecret) {
    errors.push("TIKTOK_CLIENT_SECRET is missing.");
  }

  if (!redirectUri) {
    errors.push("TIKTOK_REDIRECT_URI is missing.");
  } else {
    try {
      const url = new URL(redirectUri);

      if (url.protocol !== "https:") {
        errors.push("TIKTOK_REDIRECT_URI must start with https://.");
      }

      if (url.search) {
        errors.push("TIKTOK_REDIRECT_URI must not include a query string.");
      }

      if (url.hash) {
        errors.push("TIKTOK_REDIRECT_URI must not include a # fragment.");
      }
    } catch {
      errors.push("TIKTOK_REDIRECT_URI must be a valid URL.");
    }
  }

  if (nodeEnv === "production") {
    if (!appUrl) {
      errors.push("NEXT_PUBLIC_APP_URL is missing.");
    } else {
      try {
        const url = new URL(appUrl);

        if (url.protocol !== "https:") {
          errors.push("NEXT_PUBLIC_APP_URL must start with https:// in production.");
        }
      } catch {
        errors.push("NEXT_PUBLIC_APP_URL must be a valid URL.");
      }
    }
  }

  const missingOnly = errors.length > 0 && errors.every((error) => error.includes("missing"));

  return {
    status: errors.length === 0 ? "configured" : missingOnly ? "missing" : "invalid",
    errors
  };
}

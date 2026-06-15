export type ProductionEnvStatus = "configured" | "missing" | "invalid";

export type ProductionEnvValidation = {
  status: ProductionEnvStatus;
  errors: string[];
};

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isStaticHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.search && !url.hash;
  } catch {
    return false;
  }
}

export function validateProductionEnv({
  databaseUrl,
  directUrl,
  appUrl,
  tiktokClientKey,
  tiktokClientSecret,
  tiktokRedirectUri,
  tiktokPkceEnabled
}: {
  databaseUrl?: string;
  directUrl?: string;
  appUrl?: string;
  tiktokClientKey?: string;
  tiktokClientSecret?: string;
  tiktokRedirectUri?: string;
  tiktokPkceEnabled?: string;
}): ProductionEnvValidation {
  const errors: string[] = [];

  if (!databaseUrl) errors.push("DATABASE_URL is missing.");
  if (!directUrl) errors.push("DIRECT_URL is missing.");
  if (!appUrl) errors.push("NEXT_PUBLIC_APP_URL is missing.");
  if (appUrl && !isHttpsUrl(appUrl)) errors.push("NEXT_PUBLIC_APP_URL must be an https:// URL in production.");
  if (!tiktokClientKey) errors.push("TIKTOK_CLIENT_KEY is missing.");
  if (!tiktokClientSecret) errors.push("TIKTOK_CLIENT_SECRET is missing.");
  if (!tiktokRedirectUri) errors.push("TIKTOK_REDIRECT_URI is missing.");
  if (tiktokRedirectUri && !isStaticHttpsUrl(tiktokRedirectUri)) errors.push("TIKTOK_REDIRECT_URI must be https:// with no query string and no # fragment.");
  if (tiktokPkceEnabled && !["true", "false"].includes(tiktokPkceEnabled)) errors.push("TIKTOK_OAUTH_PKCE_ENABLED must be true or false.");

  const missingOnly = errors.length > 0 && errors.every((error) => error.endsWith("is missing."));

  return {
    status: errors.length === 0 ? "configured" : missingOnly ? "missing" : "invalid",
    errors
  };
}

import { describe, expect, it } from "vitest";
import { sanitizeOAuthError, validateTikTokProductionOAuth } from "./production-oauth";

describe("production OAuth validation", () => {
  it("accepts a valid HTTPS TikTok OAuth configuration", () => {
    const result = validateTikTokProductionOAuth({
      clientKey: "key",
      clientSecret: "secret",
      redirectUri: "https://app.vercel.app/api/auth/tiktok/callback",
      appUrl: "https://app.vercel.app",
      nodeEnv: "production"
    });

    expect(result.status).toBe("configured");
    expect(result.errors).toEqual([]);
  });

  it("rejects invalid redirect URIs", () => {
    const result = validateTikTokProductionOAuth({
      clientKey: "key",
      clientSecret: "secret",
      redirectUri: "http://localhost:3000/api/auth/tiktok/callback?x=1#bad",
      appUrl: "https://app.vercel.app",
      nodeEnv: "production"
    });

    expect(result.status).toBe("invalid");
    expect(result.errors).toContain("TIKTOK_REDIRECT_URI must start with https://.");
    expect(result.errors).toContain("TIKTOK_REDIRECT_URI must not include a query string.");
    expect(result.errors).toContain("TIKTOK_REDIRECT_URI must not include a # fragment.");
  });

  it("requires HTTPS app URL in production", () => {
    const result = validateTikTokProductionOAuth({
      clientKey: "key",
      clientSecret: "secret",
      redirectUri: "https://app.vercel.app/api/auth/tiktok/callback",
      appUrl: "http://app.vercel.app",
      nodeEnv: "production"
    });

    expect(result.status).toBe("invalid");
    expect(result.errors).toContain("NEXT_PUBLIC_APP_URL must start with https:// in production.");
  });

  it("redacts secrets and tokens from error output", () => {
    const safe = sanitizeOAuthError("client_secret=abc access_token: xyz refresh_token=123");

    expect(safe).not.toContain("abc");
    expect(safe).not.toContain("xyz");
    expect(safe).not.toContain("123");
  });
});

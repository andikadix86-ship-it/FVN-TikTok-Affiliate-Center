import { describe, expect, it } from "vitest";
import {
  buildSafeOAuthLog,
  buildTikTokLoginUrl,
  buildTikTokTokenRequestBody,
  parseTikTokCallback,
  redactOAuthSecrets,
  TIKTOK_AUTH_URL,
  validateRedirectUri
} from "./oauth";

describe("TikTok OAuth Web Login Kit", () => {
  it("generates the required authorization URL without a broken code_challenge", () => {
    const url = buildTikTokLoginUrl("state-test-123", { pkceEnabled: false });

    expect(url.origin + url.pathname).toBe(TIKTOK_AUTH_URL);
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toBe("user.info.basic");
    expect(url.searchParams.get("state")).toBe("state-test-123");
    expect(url.searchParams.has("client_key")).toBe(true);
    expect(url.searchParams.has("redirect_uri")).toBe(true);
    expect(url.searchParams.has("code_challenge")).toBe(false);
    expect(url.searchParams.has("code_challenge_method")).toBe(false);
  });

  it("adds code_challenge only when PKCE is enabled and challenge exists", () => {
    const disabled = buildTikTokLoginUrl("state-test-123", { pkceEnabled: true });
    const enabled = buildTikTokLoginUrl("state-test-123", { pkceEnabled: true, codeChallenge: "abc123" });

    expect(disabled.searchParams.has("code_challenge")).toBe(false);
    expect(enabled.searchParams.get("code_challenge")).toBe("abc123");
    expect(enabled.searchParams.get("code_challenge_method")).toBe("S256");
  });

  it("uses a form-encoded token request body with the same redirect_uri config", () => {
    const body = buildTikTokTokenRequestBody("auth-code-123");

    expect(body.get("grant_type")).toBe("authorization_code");
    expect(body.get("code")).toBe("auth-code-123");
    expect(body.get("redirect_uri")).toBe("https://your-vercel-domain.vercel.app/api/auth/tiktok/callback");
  });

  it("validates redirect URI rules with friendly errors", () => {
    const invalid = validateRedirectUri("http://example.com/callback?x=1#hash", {
      requireHttps: true,
      expectedRedirectUri: "https://example.com/callback"
    });

    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toContain("Redirect URI harus diawali https://");
    expect(invalid.errors).toContain("Redirect URI tidak boleh memakai query parameter");
    expect(invalid.errors).toContain("Redirect URI tidak boleh memakai tanda #");
    expect(invalid.errors).toContain("Redirect URI harus sama persis dengan yang didaftarkan di TikTok Developer Portal");
  });

  it("handles state mismatch and missing code in callback parsing", () => {
    expect(parseTikTokCallback({ code: null, state: "a", expectedState: "a" })).toMatchObject({
      ok: false,
      errorCode: "missing_code"
    });
    expect(parseTikTokCallback({ code: "code", state: "a", expectedState: "b" })).toMatchObject({
      ok: false,
      errorCode: "state_mismatch"
    });
  });

  it("redacts secrets and tokens from logs", () => {
    const text = redactOAuthSecrets({
      client_secret: "secret",
      access_token: "access",
      refresh_token: "refresh"
    });
    const log = buildSafeOAuthLog("ERROR", "client_secret=secret access_token=access", {
      refresh_token: "refresh"
    });

    expect(text).not.toContain('"secret"');
    expect(text).not.toContain('"access"');
    expect(text).not.toContain('"refresh"');
    expect(JSON.stringify(log)).not.toContain("client_secret=secret");
    expect(JSON.stringify(log)).not.toContain("access_token=access");
    expect(JSON.stringify(log)).not.toContain("refresh_token=refresh");
  });
});

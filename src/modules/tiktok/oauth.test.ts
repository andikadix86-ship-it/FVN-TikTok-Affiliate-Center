import { describe, expect, it } from "vitest";
import { buildTikTokLoginUrl, buildTikTokTokenRequestBody, TIKTOK_AUTH_URL } from "./oauth";

describe("TikTok OAuth Web Login Kit", () => {
  it("generates the required authorization URL without a broken code_challenge", () => {
    const url = buildTikTokLoginUrl("state-test-123");

    expect(url.origin + url.pathname).toBe(TIKTOK_AUTH_URL);
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toBe("user.info.basic");
    expect(url.searchParams.get("state")).toBe("state-test-123");
    expect(url.searchParams.has("client_key")).toBe(true);
    expect(url.searchParams.has("redirect_uri")).toBe(true);
    expect(url.searchParams.has("code_challenge")).toBe(false);
    expect(url.searchParams.has("code_challenge_method")).toBe(false);
  });

  it("uses a form-encoded token request body with the same redirect_uri config", () => {
    const body = buildTikTokTokenRequestBody("auth-code-123");

    expect(body.get("grant_type")).toBe("authorization_code");
    expect(body.get("code")).toBe("auth-code-123");
    expect(body.get("redirect_uri")).toBe("https://your-domain.vercel.app/api/auth/tiktok/callback");
  });
});

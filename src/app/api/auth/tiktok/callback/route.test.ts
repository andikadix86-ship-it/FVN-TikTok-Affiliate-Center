import { describe, expect, it } from "vitest";
import { buildSafeOAuthError } from "@/modules/tiktok/production-oauth";

describe("TikTok callback OAuth errors", () => {
  it("does not leak client secret or tokens in UI-safe errors", () => {
    const error = buildSafeOAuthError("TikTok token exchange failed.", {
      client_secret: "super-secret",
      access_token: "access-token",
      refresh_token: "refresh-token"
    });

    const serialized = JSON.stringify(error);

    expect(serialized).toContain("TikTok token exchange failed.");
    expect(serialized).not.toContain("super-secret");
    expect(serialized).not.toContain("access-token");
    expect(serialized).not.toContain("refresh-token");
  });
});

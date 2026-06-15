import { describe, expect, it } from "vitest";
import { buildDisconnectedAccountView, buildTokenStorageWarning, safeOAuthDetails } from "./account-service";

describe("TikTok account service", () => {
  it("returns an honest disconnected account state", () => {
    expect(buildDisconnectedAccountView()).toEqual({
      connected: false,
      displayName: "Not connected",
      avatarUrl: "",
      openIdMasked: "Not connected",
      connectedAt: "Not connected",
      tokenStatus: "not_stored",
      scopeStatus: "unknown",
      lastSyncStatus: "not_synced"
    });
  });

  it("does not expose raw token storage in MVP mode", () => {
    expect(buildTokenStorageWarning()).toBe("Token encryption is not configured, token was not stored.");
  });

  it("redacts OAuth details before display or logging", () => {
    const safe = safeOAuthDetails({
      client_secret: "secret-value",
      access_token: "access-value",
      refresh_token: "refresh-value"
    });

    expect(safe).not.toContain("secret-value");
    expect(safe).not.toContain("access-value");
    expect(safe).not.toContain("refresh-value");
  });
});

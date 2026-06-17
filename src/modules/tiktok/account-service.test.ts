import { describe, expect, it } from "vitest";
import { buildDemoTikTokAccountView, buildDisconnectedAccountView, buildTokenStorageWarning, safeOAuthDetails } from "./account-service";

describe("TikTok account service", () => {
  it("returns an honest disconnected account state", () => {
    expect(buildDisconnectedAccountView()).toEqual({
      connected: false,
      demoMode: false,
      connectionStatus: "Not Connected",
      username: "Not connected",
      displayName: "Not connected",
      avatarUrl: "",
      followerCount: "Not connected",
      videoCount: "Not connected",
      openIdMasked: "Not connected",
      connectedAt: "Not connected",
      tokenStatus: "not_stored",
      scopeStatus: "unknown",
      lastSyncStatus: "not_synced"
    });
  });

  it("provides demo connected account data for review mode", () => {
    const account = buildDemoTikTokAccountView();

    expect(account.connected).toBe(true);
    expect(account.demoMode).toBe(true);
    expect(account.displayName).toBe("Demo TikTok Account");
    expect(account.username).toBe("@fvn_demo_creator");
    expect(account.connectionStatus).toBe("Connected");
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

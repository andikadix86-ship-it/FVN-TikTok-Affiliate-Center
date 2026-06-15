import { describe, expect, it } from "vitest";
import { getTikTokEnvStatus } from "./env-status";

describe("TikTok env status helper", () => {
  it("shows missing when env values are absent", () => {
    const status = getTikTokEnvStatus({});

    expect(status.clientKey).toBe("Missing");
    expect(status.clientSecret).toBe("Missing");
    expect(status.redirectUri).toBe("Missing");
    expect(status.oauth).toBe("Missing");
  });

  it("shows configured when all OAuth env values are present", () => {
    const status = getTikTokEnvStatus({
      clientKey: "key",
      clientSecret: "secret",
      redirectUri: "https://example.com/api/auth/tiktok/callback"
    });

    expect(status.clientKey).toBe("Configured");
    expect(status.clientSecret).toBe("Configured");
    expect(status.redirectUri).toBe("Configured");
    expect(status.oauth).toBe("Configured");
  });
});

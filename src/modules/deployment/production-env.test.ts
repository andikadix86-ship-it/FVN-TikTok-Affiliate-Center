import { describe, expect, it } from "vitest";
import { validateProductionEnv } from "./production-env";

describe("production env validation", () => {
  it("returns configured when required production env is valid", () => {
    const status = validateProductionEnv({
      databaseUrl: "postgres://user:pass@example.com/db",
      directUrl: "postgres://user:pass@example.com/db",
      appUrl: "https://app.vercel.app",
      tiktokClientKey: "key",
      tiktokClientSecret: "secret",
      tiktokRedirectUri: "https://app.vercel.app/api/auth/tiktok/callback",
      tiktokPkceEnabled: "false"
    });

    expect(status.status).toBe("configured");
    expect(status.errors).toHaveLength(0);
  });

  it("flags localhost and query redirect as invalid for production", () => {
    const status = validateProductionEnv({
      databaseUrl: "postgres://user:pass@example.com/db",
      directUrl: "postgres://user:pass@example.com/db",
      appUrl: "http://localhost:3000",
      tiktokClientKey: "key",
      tiktokClientSecret: "secret",
      tiktokRedirectUri: "https://app.vercel.app/api/auth/tiktok/callback?bad=1",
      tiktokPkceEnabled: "false"
    });

    expect(status.status).toBe("invalid");
    expect(status.errors.join(" ")).toContain("NEXT_PUBLIC_APP_URL");
    expect(status.errors.join(" ")).toContain("TIKTOK_REDIRECT_URI");
  });
});

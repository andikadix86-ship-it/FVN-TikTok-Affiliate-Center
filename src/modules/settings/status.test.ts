import { describe, expect, it } from "vitest";
import { getSettingsStatus } from "./status";

describe("settings status helper", () => {
  it("returns demo mode and missing statuses", () => {
    const status = getSettingsStatus({
      appUrl: "",
      databaseUrl: "",
      tiktokOAuthConfigured: false,
      tiktokConnected: false,
      promptEngineMode: "TEMPLATE_MODE",
      productSource: "DEMO"
    });

    expect(status.appUrl).toBe("Missing");
    expect(status.database).toBe("Missing");
    expect(status.tiktokOAuth).toBe("Missing");
    expect(status.aiProvider).toBe("Not Connected");
    expect(status.productDataSource).toBe("Demo Mode");
  });

  it("returns configured and connected statuses", () => {
    const status = getSettingsStatus({
      appUrl: "https://example.com",
      databaseUrl: "postgres://example",
      tiktokOAuthConfigured: true,
      tiktokConnected: true,
      promptEngineMode: "AI_CONNECTED",
      productSource: "MANUAL"
    });

    expect(status.appUrl).toBe("Configured");
    expect(status.database).toBe("Configured");
    expect(status.tiktokOAuth).toBe("Connected");
    expect(status.aiProvider).toBe("Connected");
    expect(status.productDataSource).toBe("Manual");
  });

  it("returns CSV and real API source modes", () => {
    expect(getSettingsStatus({
      appUrl: "https://example.com",
      databaseUrl: "postgres://example",
      tiktokOAuthConfigured: true,
      tiktokConnected: false,
      promptEngineMode: "TEMPLATE_MODE",
      productSource: "CSV_IMPORT"
    }).productDataSource).toBe("CSV");

    expect(getSettingsStatus({
      appUrl: "https://example.com",
      databaseUrl: "postgres://example",
      tiktokOAuthConfigured: true,
      tiktokConnected: false,
      promptEngineMode: "TEMPLATE_MODE",
      productSource: "REAL_API"
    }).productDataSource).toBe("Real API");
  });
});

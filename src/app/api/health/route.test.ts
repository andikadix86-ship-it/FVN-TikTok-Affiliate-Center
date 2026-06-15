import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns deployment health status", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(payload.app).toBe("ok");
    expect(["connected", "error"]).toContain(payload.database);
    expect(["configured", "missing", "invalid"]).toContain(payload.tiktokOAuth);
    expect(["configured", "missing"]).toContain(payload.tiktokShopApi);
    expect(["configured", "template_mode"]).toContain(payload.aiProvider);
    expect(["demo", "manual", "csv", "real_api"]).toContain(payload.productSource);
  });
});

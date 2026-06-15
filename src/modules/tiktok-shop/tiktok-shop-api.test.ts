import { describe, expect, it } from "vitest";
import { fetchTikTokShopProductById, fetchTikTokShopProducts, isTikTokShopApiConfigured } from "./tiktok-shop-api";

describe("TikTok Shop API adapter", () => {
  it("returns not configured when env is missing", () => {
    const status = isTikTokShopApiConfigured({
      appKey: "",
      appSecret: "",
      accessToken: "",
      region: "ID"
    });

    expect(status.configured).toBe(false);
    expect(status.status).toBe("Not Connected");
    expect(status.message).toBe("TikTok Shop API belum terhubung");
  });

  it("does not fake REAL_API products", async () => {
    await expect(fetchTikTokShopProducts()).resolves.toEqual([]);
    await expect(fetchTikTokShopProductById("product-id")).resolves.toBeNull();
  });
});

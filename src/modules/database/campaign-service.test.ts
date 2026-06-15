import { describe, expect, it } from "vitest";
import {
  buildCampaignCreateData,
  buildCampaignPerformanceUpsert,
  campaignInputSchema,
  campaignPerformanceInputSchema
} from "./campaign-service";

describe("campaign save logic", () => {
  it("validates and maps campaign create data", () => {
    const input = campaignInputSchema.parse({
      productId: "product-1",
      contentPackId: "content-1",
      name: "Test Campaign",
      durationDays: 7,
      goal: "orders",
      status: "DRAFT",
      dailyPlan: [{ day: 1, hook: "Test hook" }]
    });
    const data = buildCampaignCreateData(input);

    expect(data.productId).toBe("product-1");
    expect(data.contentPackId).toBe("content-1");
    expect(data.durationDays).toBe(7);
    expect(data.status).toBe("DRAFT");
  });

  it("maps campaign performance upsert data", () => {
    const input = campaignPerformanceInputSchema.parse({
      dayNumber: 1,
      views: 100,
      clicks: 10,
      orders: 1,
      revenue: 25
    });
    const upsert = buildCampaignPerformanceUpsert("campaign-1", input);

    expect(upsert.where.campaignId_dayNumber.campaignId).toBe("campaign-1");
    expect(upsert.where.campaignId_dayNumber.dayNumber).toBe(1);
    expect(upsert.create.orders).toBe(1);
    expect(upsert.update.revenue).toBe(25);
  });
});

import { describe, expect, it } from "vitest";
import {
  aggregateByCampaign,
  calculateAnalyticsSummary,
  exportAnalyticsCsv,
  getBestContent,
  getBestProduct
} from "./analytics";
import { generateAffiliateInsight } from "./insight-engine";
import { AnalyticsContentItem } from "./analytics";

const items: AnalyticsContentItem[] = [
  {
    id: "posted-1",
    productId: "product-1",
    productName: "Mini Mic",
    productSource: "MANUAL",
    productScore: 88,
    productRecommendation: "Promote",
    contentHook: "Hook A",
    postedAt: "2026-06-15T00:00:00.000Z",
    campaignId: "campaign-1",
    campaignName: "Campaign Mic",
    campaignStatus: "ACTIVE",
    campaignDurationDays: 7,
    campaignDayNumber: 1,
    views: 1000,
    likes: 100,
    comments: 20,
    shares: 10,
    saves: 5,
    clicks: 50,
    orders: 5,
    revenue: 250000
  },
  {
    id: "posted-2",
    productId: "product-2",
    productName: "Blender",
    productSource: "CSV_IMPORT",
    productScore: 72,
    productRecommendation: "Test First",
    contentHook: "Hook B",
    postedAt: "2026-06-14T00:00:00.000Z",
    campaignId: "campaign-1",
    campaignName: "Campaign Mic",
    campaignStatus: "ACTIVE",
    campaignDurationDays: 7,
    campaignDayNumber: 2,
    views: 500,
    likes: 10,
    comments: 5,
    shares: 5,
    saves: 0,
    clicks: 10,
    orders: 0,
    revenue: 0
  }
];

describe("affiliate analytics", () => {
  it("calculates CTR, conversion rate, engagement rate, revenue per order, and revenue per 1000 views", () => {
    const summary = calculateAnalyticsSummary([items[0]]);

    expect(summary.ctr).toBe(5);
    expect(summary.conversionRate).toBe(10);
    expect(summary.engagementRate).toBe(13.5);
    expect(summary.revenuePerOrder).toBe(50000);
    expect(summary.revenuePerThousandViews).toBe(250000);
  });

  it("handles zero division safely", () => {
    const summary = calculateAnalyticsSummary([{ views: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, orders: 0, revenue: 0 }]);

    expect(summary.ctr).toBe(0);
    expect(summary.conversionRate).toBe(0);
    expect(summary.engagementRate).toBe(0);
    expect(summary.revenuePerOrder).toBe(0);
    expect(summary.revenuePerThousandViews).toBe(0);
  });

  it("selects best product and best content", () => {
    expect(getBestProduct(items, "orders")?.productName).toBe("Mini Mic");
    expect(getBestProduct(items, "revenue")?.productName).toBe("Mini Mic");
    expect(getBestContent(items, "views")?.contentHook).toBe("Hook A");
    expect(getBestContent(items, "ctr")?.contentHook).toBe("Hook A");
  });

  it("aggregates campaign performance", () => {
    const campaigns = aggregateByCampaign(items);

    expect(campaigns[0].campaignName).toBe("Campaign Mic");
    expect(campaigns[0].views).toBe(1500);
    expect(campaigns[0].orders).toBe(5);
    expect(campaigns[0].bestDay).toBe(1);
  });

  it("generates template insight", () => {
    const insight = generateAffiliateInsight(items, false);

    expect(insight.providerMode).toBe("TEMPLATE");
    expect(insight.masalahUtama.length).toBeGreaterThan(0);
    expect(insight.langkahTigaHari).toHaveLength(3);
  });

  it("exports analytics CSV", () => {
    const csv = exportAnalyticsCsv(items);

    expect(csv).toContain("productName");
    expect(csv).toContain("contentHook");
    expect(csv).toContain("Mini Mic");
    expect(csv).toContain("Hook A");
  });
});

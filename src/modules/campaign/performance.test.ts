import { describe, expect, it } from "vitest";
import {
  calculateConversionRate,
  calculateCtr,
  calculatePerformanceSummary,
  CampaignPerformanceDay,
  isPoorCampaignPerformance
} from "./performance";

const day = (overrides: Partial<CampaignPerformanceDay>): CampaignPerformanceDay => ({
  views: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  clicks: 0,
  orders: 0,
  revenue: 0,
  ...overrides
});

describe("campaign performance", () => {
  it("calculates CTR", () => {
    expect(calculateCtr(50, 1000)).toBe(5);
    expect(calculateCtr(10, 0)).toBe(0);
  });

  it("calculates conversion rate", () => {
    expect(calculateConversionRate(5, 100)).toBe(5);
    expect(calculateConversionRate(5, 0)).toBe(0);
  });

  it("summarizes campaign performance", () => {
    const summary = calculatePerformanceSummary([
      day({ views: 100, clicks: 10, orders: 1, revenue: 20 }),
      day({ views: 200, clicks: 20, orders: 2, revenue: 40 })
    ]);

    expect(summary.totalViews).toBe(300);
    expect(summary.totalClicks).toBe(30);
    expect(summary.totalOrders).toBe(3);
    expect(summary.estimatedRevenue).toBe(60);
    expect(summary.ctr).toBe(10);
    expect(summary.conversionRate).toBe(10);
  });

  it("detects poor performance after at least 5 days", () => {
    expect(isPoorCampaignPerformance(Array.from({ length: 4 }, () => day({ views: 100 })))).toBe(false);
    expect(isPoorCampaignPerformance(Array.from({ length: 5 }, () => day({ views: 100, clicks: 1, orders: 0 })))).toBe(true);
    expect(isPoorCampaignPerformance(Array.from({ length: 5 }, () => day({ views: 1000, clicks: 40, orders: 3 })))).toBe(false);
  });
});

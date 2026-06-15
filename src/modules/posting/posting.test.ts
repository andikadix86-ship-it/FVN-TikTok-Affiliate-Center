import { describe, expect, it } from "vitest";
import { buildContentPackUpdateData } from "@/modules/database/content-service";
import { aggregatePostedPerformance, buildPostedContentCreateData, calculatePostedPerformanceSummary } from "./posted-content";
import { calculatePostedDashboardStats } from "./dashboard";
import { getPostingChecklistStatus } from "./posting-checklist";

describe("manual posting workflow", () => {
  it("calculates posting checklist status", () => {
    expect(getPostingChecklistStatus(0)).toBe("Belum Siap");
    expect(getPostingChecklistStatus(4)).toBe("Belum Siap");
    expect(getPostingChecklistStatus(5)).toBe("Hampir Siap");
    expect(getPostingChecklistStatus(8)).toBe("Hampir Siap");
    expect(getPostingChecklistStatus(9)).toBe("Siap Posting");
    expect(getPostingChecklistStatus(10)).toBe("Siap Posting");
  });

  it("marks content ready and posted through content status update", () => {
    expect(buildContentPackUpdateData({ status: "READY" }).status).toBe("READY");
    expect(buildContentPackUpdateData({ status: "POSTED" }).status).toBe("POSTED");
  });

  it("builds posted content creation data without TikTok API credentials", () => {
    const data = buildPostedContentCreateData({
      contentPackId: "content-1",
      productId: "product-1",
      tiktokVideoUrl: "https://www.tiktok.com/@demo/video/123",
      postedAt: "2026-06-15",
      accountUsed: "@manual",
      notes: "Uploaded manually"
    });

    expect(data.contentPackId).toBe("content-1");
    expect(data.productId).toBe("product-1");
    expect(data.tiktokVideoUrl).toContain("tiktok.com");
    expect(data.accountUsed).toBe("@manual");
  });

  it("calculates manual performance rates safely", () => {
    const summary = calculatePostedPerformanceSummary({
      views: 1000,
      likes: 100,
      comments: 20,
      shares: 10,
      saves: 5,
      clicks: 50,
      orders: 5,
      revenue: 250
    });

    expect(summary.engagementRate).toBe(13.5);
    expect(summary.ctr).toBe(5);
    expect(summary.conversionRate).toBe(10);
    expect(summary.revenue).toBe(250);
  });

  it("handles zero division safely", () => {
    const summary = calculatePostedPerformanceSummary({
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      clicks: 0,
      orders: 0,
      revenue: 0
    });

    expect(summary.engagementRate).toBe(0);
    expect(summary.ctr).toBe(0);
    expect(summary.conversionRate).toBe(0);
  });

  it("aggregates posted content performance for campaigns", () => {
    const total = aggregatePostedPerformance([
      { views: 100, likes: 10, comments: 1, shares: 1, saves: 1, clicks: 5, orders: 1, revenue: 20 },
      { views: 200, likes: 20, comments: 2, shares: 2, saves: 2, clicks: 10, orders: 2, revenue: 40 }
    ]);

    expect(total.views).toBe(300);
    expect(total.orders).toBe(3);
    expect(total.revenue).toBe(60);
    expect(total.ctr).toBe(5);
  });

  it("calculates dashboard posted content counts", () => {
    const stats = calculatePostedDashboardStats([
      { postedAt: "2026-06-15T02:00:00.000Z", views: 500, orders: 1, productName: "A" },
      { postedAt: "2026-06-14T02:00:00.000Z", views: 900, orders: 4, productName: "B" }
    ], new Date("2026-06-15T10:00:00.000Z"));

    expect(stats.postedToday).toBe(1);
    expect(stats.bestByViews).toBe("B");
    expect(stats.bestByOrders).toBe("B");
  });
});

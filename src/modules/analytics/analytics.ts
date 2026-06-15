import { ProductSource } from "@/modules/affiliate/types";

export type AnalyticsPerformance = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  orders: number;
  revenue: number;
};

export type AnalyticsContentItem = AnalyticsPerformance & {
  id: string;
  productId: string;
  productName: string;
  productSource: ProductSource;
  productScore: number;
  productRecommendation: string;
  contentHook: string;
  postedAt: string;
  campaignId?: string;
  campaignName?: string;
  campaignStatus?: string;
  campaignDurationDays?: number;
  campaignDayNumber?: number;
};

export type AnalyticsSummary = AnalyticsPerformance & {
  ctr: number;
  conversionRate: number;
  engagementRate: number;
  revenuePerOrder: number;
  revenuePerThousandViews: number;
};

export function safeDivide(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

export function calculateAnalyticsSummary(items: AnalyticsPerformance[]): AnalyticsSummary {
  const total = items.reduce(
    (summary, item) => ({
      views: summary.views + item.views,
      likes: summary.likes + item.likes,
      comments: summary.comments + item.comments,
      shares: summary.shares + item.shares,
      saves: summary.saves + item.saves,
      clicks: summary.clicks + item.clicks,
      orders: summary.orders + item.orders,
      revenue: summary.revenue + item.revenue
    }),
    { views: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, orders: 0, revenue: 0 }
  );
  const engagement = total.likes + total.comments + total.shares + total.saves;

  return {
    ...total,
    ctr: safeDivide(total.clicks, total.views) * 100,
    conversionRate: safeDivide(total.orders, total.clicks) * 100,
    engagementRate: safeDivide(engagement, total.views) * 100,
    revenuePerOrder: safeDivide(total.revenue, total.orders),
    revenuePerThousandViews: safeDivide(total.revenue, total.views) * 1000
  };
}

export function filterByDays(items: AnalyticsContentItem[], days: number | "all", now = new Date()) {
  if (days === "all") {
    return items;
  }

  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);

  return items.filter((item) => new Date(item.postedAt) >= cutoff);
}

function maxBy<T>(items: T[], getValue: (item: T) => number): T | null {
  return items.reduce<T | null>((best, item) => (!best || getValue(item) > getValue(best) ? item : best), null);
}

export function getBestProduct(items: AnalyticsContentItem[], field: "orders" | "revenue" = "orders") {
  const grouped = aggregateByProduct(items);
  return maxBy(grouped, (item) => item[field]);
}

export function getBestContent(items: AnalyticsContentItem[], field: "views" | "ctr" = "views") {
  const enriched = items.map((item) => ({
    ...item,
    ...calculateAnalyticsSummary([item])
  }));

  return maxBy(enriched, (item) => item[field]);
}

export function getBestCampaign(items: AnalyticsContentItem[]) {
  const grouped = aggregateByCampaign(items);
  return maxBy(grouped, (item) => item.revenue);
}

export function getProductRecommendation(summary: AnalyticsSummary) {
  if (summary.views === 0) {
    return "Belum ada data performa";
  }

  if (summary.orders >= 3 || summary.conversionRate >= 5) {
    return "Produk layak dilanjutkan";
  }

  if (summary.views >= 1000 && summary.ctr < 1) {
    return "Hook bagus, CTA perlu diperbaiki";
  }

  if (summary.clicks >= 20 && summary.orders === 0) {
    return "Minat ada, demo/trust perlu diperkuat";
  }

  if (summary.views < 300) {
    return "Hook 3 detik pertama perlu diperbaiki";
  }

  return "Produk masih layak ditest";
}

export function aggregateByProduct(items: AnalyticsContentItem[]) {
  const groups = new Map<string, AnalyticsContentItem[]>();
  items.forEach((item) => groups.set(item.productId, [...(groups.get(item.productId) ?? []), item]));

  return Array.from(groups.values()).map((group) => {
    const first = group[0];
    const summary = calculateAnalyticsSummary(group);

    return {
      productId: first.productId,
      productName: first.productName,
      source: first.productSource,
      score: first.productScore,
      productRecommendation: first.productRecommendation,
      ...summary,
      recommendation: getProductRecommendation(summary)
    };
  });
}

export function aggregateByCampaign(items: AnalyticsContentItem[]) {
  const campaignItems = items.filter((item) => item.campaignId);
  const groups = new Map<string, AnalyticsContentItem[]>();
  campaignItems.forEach((item) => groups.set(item.campaignId ?? "", [...(groups.get(item.campaignId ?? "") ?? []), item]));

  return Array.from(groups.values()).map((group) => {
    const first = group[0];
    const summary = calculateAnalyticsSummary(group);
    const dayGroups = new Map<number, AnalyticsContentItem[]>();
    group.forEach((item) => dayGroups.set(item.campaignDayNumber ?? 0, [...(dayGroups.get(item.campaignDayNumber ?? 0) ?? []), item]));
    const days = Array.from(dayGroups.entries()).map(([day, dayItems]) => ({ day, ...calculateAnalyticsSummary(dayItems) }));
    const bestDay = maxBy(days, (day) => day.revenue || day.orders || day.views)?.day ?? 0;
    const worstDay = maxBy(days, (day) => -day.views)?.day ?? 0;

    return {
      campaignId: first.campaignId ?? "",
      campaignName: first.campaignName ?? "Campaign",
      productName: first.productName,
      status: first.campaignStatus ?? "DRAFT",
      durationDays: first.campaignDurationDays ?? 7,
      bestDay,
      worstDay,
      insight: getCampaignInsight(summary),
      ...summary
    };
  });
}

export function getCampaignInsight(summary: AnalyticsSummary) {
  if (summary.orders >= 5 || summary.revenue > 0) {
    return "Hari terbaik";
  }

  if (summary.views >= 1000 && summary.clicks < 10) {
    return "Konten perlu diperbaiki";
  }

  if (summary.clicks >= 10 && summary.orders === 0) {
    return "Produk masih layak ditest";
  }

  if (summary.views > 0 && summary.ctr < 0.5) {
    return "Campaign bisa dihentikan";
  }

  return "Produk masih layak ditest";
}

export function exportAnalyticsCsv(items: AnalyticsContentItem[]) {
  const headers = [
    "productName",
    "contentHook",
    "postedAt",
    "views",
    "likes",
    "comments",
    "shares",
    "saves",
    "clicks",
    "orders",
    "revenue",
    "ctr",
    "conversionRate",
    "engagementRate"
  ];
  const rows = items.map((item) => {
    const summary = calculateAnalyticsSummary([item]);
    return [
      item.productName,
      item.contentHook,
      item.postedAt,
      item.views,
      item.likes,
      item.comments,
      item.shares,
      item.saves,
      item.clicks,
      item.orders,
      item.revenue,
      summary.ctr,
      summary.conversionRate,
      summary.engagementRate
    ];
  });

  return [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

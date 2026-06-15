import { buildImprovementSuggestions } from "@/modules/prompt-engine/improvement-suggestion.prompt";

export type CampaignStatus = "Draft" | "Active" | "Paused" | "Completed";
export type CampaignGoal = "awareness" | "clicks" | "orders" | "testing product";
export type CampaignDuration = 7 | 14;

export type CampaignPerformanceDay = {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  orders: number;
  revenue: number;
};

export type CampaignPerformanceSummary = {
  totalViews: number;
  totalClicks: number;
  totalOrders: number;
  estimatedRevenue: number;
  ctr: number;
  conversionRate: number;
};

export const emptyCampaignPerformanceDay: CampaignPerformanceDay = {
  views: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  clicks: 0,
  orders: 0,
  revenue: 0
};

export function calculateCtr(clicks: number, views: number) {
  if (views <= 0) {
    return 0;
  }

  return (clicks / views) * 100;
}

export function calculateConversionRate(orders: number, clicks: number) {
  if (clicks <= 0) {
    return 0;
  }

  return (orders / clicks) * 100;
}

export function calculatePerformanceSummary(days: CampaignPerformanceDay[]): CampaignPerformanceSummary {
  const totals = days.reduce(
    (sum, day) => ({
      totalViews: sum.totalViews + day.views,
      totalClicks: sum.totalClicks + day.clicks,
      totalOrders: sum.totalOrders + day.orders,
      estimatedRevenue: sum.estimatedRevenue + day.revenue
    }),
    {
      totalViews: 0,
      totalClicks: 0,
      totalOrders: 0,
      estimatedRevenue: 0
    }
  );

  return {
    ...totals,
    ctr: calculateCtr(totals.totalClicks, totals.totalViews),
    conversionRate: calculateConversionRate(totals.totalOrders, totals.totalClicks)
  };
}

export function isPoorCampaignPerformance(days: CampaignPerformanceDay[]) {
  const firstFive = days.slice(0, 5);

  if (firstFive.length < 5) {
    return false;
  }

  const summary = calculatePerformanceSummary(firstFive);
  return summary.totalViews < 1500 || summary.ctr < 1.5 || summary.conversionRate < 1 || summary.totalOrders === 0;
}

export function getImprovementSuggestions(aiConnected: boolean, days: CampaignPerformanceDay[] = []) {
  const suggestions = days.length > 0
    ? buildImprovementSuggestions(days)
    : [
        "Low views: perbaiki hook dan 3 detik pertama.",
        "Low clicks: perjelas CTA dan benefit produk.",
        "Low orders: tambah trust dan demo produk.",
        "Low engagement: pakai angle yang lebih relatable.",
        "High views low orders: cek product match atau perkuat demo."
      ];

  return aiConnected ? suggestions : suggestions.map((suggestion) => `${suggestion} (template suggestion)`);
}

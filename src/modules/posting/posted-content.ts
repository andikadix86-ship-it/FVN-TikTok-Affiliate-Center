import { z } from "zod";

export const postedContentInputSchema = z.object({
  contentPackId: z.string().min(1),
  campaignId: z.string().optional().nullable(),
  campaignDayNumber: z.coerce.number().int().min(1).optional().nullable(),
  productId: z.string().min(1),
  tiktokAccountId: z.string().optional().nullable(),
  tiktokVideoUrl: z.string().url("Link Video TikTok harus berupa URL"),
  postedAt: z.string().min(1),
  accountUsed: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const postedPerformanceInputSchema = z.object({
  views: z.coerce.number().int().nonnegative().default(0),
  likes: z.coerce.number().int().nonnegative().default(0),
  comments: z.coerce.number().int().nonnegative().default(0),
  shares: z.coerce.number().int().nonnegative().default(0),
  saves: z.coerce.number().int().nonnegative().default(0),
  clicks: z.coerce.number().int().nonnegative().default(0),
  orders: z.coerce.number().int().nonnegative().default(0),
  revenue: z.coerce.number().nonnegative().default(0)
});

export type PostedPerformanceInput = z.infer<typeof postedPerformanceInputSchema>;

export type PostedPerformanceSummary = {
  engagementRate: number;
  ctr: number;
  conversionRate: number;
  revenue: number;
};

function percentage(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }

  return (numerator / denominator) * 100;
}

export function calculatePostedPerformanceSummary(input: PostedPerformanceInput): PostedPerformanceSummary {
  const performance = postedPerformanceInputSchema.parse(input);
  const engagement = performance.likes + performance.comments + performance.shares + performance.saves;

  return {
    engagementRate: percentage(engagement, performance.views),
    ctr: percentage(performance.clicks, performance.views),
    conversionRate: percentage(performance.orders, performance.clicks),
    revenue: performance.revenue
  };
}

export function aggregatePostedPerformance(items: PostedPerformanceInput[]) {
  const total = items.reduce(
    (summary, item) => {
      const performance = postedPerformanceInputSchema.parse(item);

      return {
        views: summary.views + performance.views,
        likes: summary.likes + performance.likes,
        comments: summary.comments + performance.comments,
        shares: summary.shares + performance.shares,
        saves: summary.saves + performance.saves,
        clicks: summary.clicks + performance.clicks,
        orders: summary.orders + performance.orders,
        revenue: summary.revenue + performance.revenue
      };
    },
    { views: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, orders: 0, revenue: 0 }
  );

  return {
    ...total,
    ...calculatePostedPerformanceSummary(total)
  };
}

export function buildPostedContentCreateData(input: z.infer<typeof postedContentInputSchema>) {
  const parsed = postedContentInputSchema.parse(input);

  return {
    contentPackId: parsed.contentPackId,
    campaignId: parsed.campaignId ?? undefined,
    campaignDayNumber: parsed.campaignDayNumber ?? undefined,
    productId: parsed.productId,
    tiktokAccountId: parsed.tiktokAccountId ?? undefined,
    tiktokVideoUrl: parsed.tiktokVideoUrl,
    postedAt: new Date(parsed.postedAt),
    accountUsed: parsed.accountUsed ?? undefined,
    notes: parsed.notes ?? undefined
  };
}

export function buildPostedPerformanceUpdateData(input: unknown) {
  return postedPerformanceInputSchema.parse(input);
}

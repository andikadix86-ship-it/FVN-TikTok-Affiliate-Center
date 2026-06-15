import { z } from "zod";
import { Prisma } from "@prisma/client";

export const campaignInputSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  durationDays: z.union([z.literal(7), z.literal(14)]),
  goal: z.enum(["awareness", "clicks", "orders", "testing product"]),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]).default("DRAFT"),
  dailyPlan: z.array(z.record(z.unknown()))
});

export const campaignPerformanceInputSchema = z.object({
  dayNumber: z.coerce.number().int().min(1),
  views: z.coerce.number().int().nonnegative().default(0),
  likes: z.coerce.number().int().nonnegative().default(0),
  comments: z.coerce.number().int().nonnegative().default(0),
  shares: z.coerce.number().int().nonnegative().default(0),
  clicks: z.coerce.number().int().nonnegative().default(0),
  orders: z.coerce.number().int().nonnegative().default(0),
  revenue: z.coerce.number().nonnegative().default(0)
});

export function buildCampaignCreateData(input: z.infer<typeof campaignInputSchema>) {
  return {
    productId: input.productId,
    name: input.name,
    durationDays: input.durationDays,
    goal: input.goal,
    status: input.status,
    dailyPlan: input.dailyPlan as Prisma.InputJsonValue
  };
}

export function buildCampaignPerformanceUpsert(campaignId: string, input: z.infer<typeof campaignPerformanceInputSchema>) {
  return {
    where: {
      campaignId_dayNumber: {
        campaignId,
        dayNumber: input.dayNumber
      }
    },
    update: {
      views: input.views,
      likes: input.likes,
      comments: input.comments,
      shares: input.shares,
      clicks: input.clicks,
      orders: input.orders,
      revenue: input.revenue
    },
    create: {
      campaignId,
      dayNumber: input.dayNumber,
      views: input.views,
      likes: input.likes,
      comments: input.comments,
      shares: input.shares,
      clicks: input.clicks,
      orders: input.orders,
      revenue: input.revenue
    }
  };
}

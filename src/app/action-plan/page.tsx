import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { AnalyticsContentItem } from "@/modules/analytics/analytics";
import { ActionPlanPanel } from "@/modules/action-plan/action-plan-panel";
import { ActionPlanCampaign, ActionPlanDraft, ActionPlanProduct, generateActionPlan } from "@/modules/action-plan/action-plan-engine";
import { ProductSource } from "@/modules/affiliate/types";
import { getTikTokAccountView } from "@/modules/tiktok/account-service";
import { TIKTOK_CONNECTED_COOKIE } from "@/modules/tiktok/oauth";

export const dynamic = "force-dynamic";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

async function getActionPlanData() {
  try {
    const [products, drafts, postedContent, campaigns] = await Promise.all([
      prisma.product.findMany({ orderBy: [{ score: "desc" }, { createdAt: "desc" }] }),
      prisma.contentPack.findMany({
        where: { status: { not: "ARCHIVED" } },
        orderBy: { createdAt: "desc" },
        include: { product: true }
      }),
      prisma.postedContent.findMany({
        where: { archived: false },
        orderBy: { postedAt: "desc" },
        include: { product: true, contentPack: true, campaign: true }
      }),
      prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
        include: { product: true, performance: true }
      })
    ]);
    const productItems: ActionPlanProduct[] = products.map((product) => ({
      id: product.id,
      productName: product.productName,
      source: product.source,
      score: product.score,
      recommendation: product.recommendation
    }));
    const draftItems: ActionPlanDraft[] = drafts.map((draft) => {
      const hooks = asStringArray(draft.hooks);

      return {
        id: draft.id,
        productId: draft.productId,
        productName: draft.product.productName,
        status: draft.status,
        hook: draft.selectedHook || hooks[0] || draft.caption
      };
    });
    const postedItems: AnalyticsContentItem[] = postedContent.map((item) => {
      const hooks = asStringArray(item.contentPack.hooks);

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.productName,
        productSource: item.product.source,
        productScore: item.product.score,
        productRecommendation: item.product.recommendation,
        contentHook: item.contentPack.selectedHook || hooks[0] || item.contentPack.caption,
        postedAt: item.postedAt.toISOString(),
        campaignId: item.campaignId ?? undefined,
        campaignName: item.campaign?.name,
        campaignStatus: item.campaign?.status,
        campaignDurationDays: item.campaign?.durationDays,
        campaignDayNumber: item.campaignDayNumber ?? undefined,
        views: item.views,
        likes: item.likes,
        comments: item.comments,
        shares: item.shares,
        saves: item.saves,
        clicks: item.clicks,
        orders: item.orders,
        revenue: Number(item.revenue)
      };
    });
    const campaignItems: ActionPlanCampaign[] = campaigns.map((campaign) => ({
      id: campaign.id,
      productId: campaign.productId,
      productName: campaign.product.productName,
      name: campaign.name,
      status: campaign.status,
      durationDays: campaign.durationDays,
      performance: campaign.performance.map((day) => ({
        dayNumber: day.dayNumber,
        views: day.views,
        clicks: day.clicks,
        orders: day.orders,
        revenue: Number(day.revenue)
      }))
    }));

    return { products: productItems, drafts: draftItems, postedContent: postedItems, campaigns: campaignItems };
  } catch {
    return { products: [], drafts: [], postedContent: [], campaigns: [] };
  }
}

export default async function ActionPlanPage() {
  const cookieStore = cookies();
  const accountView = await getTikTokAccountView();
  const data = await getActionPlanData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const plan = generateActionPlan({
    ...data,
    tiktokConnected: cookieStore.get(TIKTOK_CONNECTED_COOKIE)?.value === "true" || accountView.connected,
    aiProviderConnected: Boolean(env.GEMINI_API_KEY || env.OPENAI_API_KEY),
    postedToday: data.postedContent.filter((item) => new Date(item.postedAt) >= today).length
  });
  const productSources = data.products.reduce((sources, product) => ({ ...sources, [product.id]: product.source }), {} as Record<string, ProductSource>);

  return (
    <AppShell>
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ActionPlanPanel plan={plan} productSources={productSources} />
        </div>
      </section>
    </AppShell>
  );
}

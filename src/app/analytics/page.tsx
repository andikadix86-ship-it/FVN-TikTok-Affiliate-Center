import { AppShell } from "@/components/app-shell";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { AnalyticsDashboard } from "@/modules/analytics/analytics-dashboard";
import { AnalyticsContentItem } from "@/modules/analytics/analytics";

export const dynamic = "force-dynamic";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

async function getAnalyticsItems(): Promise<AnalyticsContentItem[]> {
  try {
    const postedContent = await prisma.postedContent.findMany({
      where: { archived: false },
      orderBy: { postedAt: "desc" },
      include: {
        product: true,
        contentPack: true,
        campaign: true
      }
    });

    return postedContent.map((item) => {
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
  } catch {
    return [];
  }
}

export default async function AnalyticsPage() {
  const items = await getAnalyticsItems();
  const aiProviderConnected = Boolean(env.GEMINI_API_KEY || env.OPENAI_API_KEY);

  return (
    <AppShell>
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 rounded-[2rem] border border-line bg-white p-5 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-wide text-mint">Analisa Manual</p>
            <h1 className="mt-2 text-3xl font-black text-ink">Analisa Affiliate</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Lihat produk, konten, dan campaign yang performanya paling baik berdasarkan input manual.</p>
          </div>
          <AnalyticsDashboard items={items} aiProviderConnected={aiProviderConnected} />
        </div>
      </section>
    </AppShell>
  );
}

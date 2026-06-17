import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { AffiliateWorkflow } from "@/modules/affiliate/affiliate-workflow";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { mapDbProduct, sortProductsBySourcePriority } from "@/modules/database/product-service";
import { contentStatusLabels, mapDbContentDraft } from "@/modules/database/content-service";
import { getPromptEngineMode } from "@/modules/prompt-engine/fallback";
import { TIKTOK_CONNECTED_COOKIE } from "@/modules/tiktok/oauth";
import { calculateAnalyticsSummary } from "@/modules/analytics/analytics";
import { generateActionPlan } from "@/modules/action-plan/action-plan-engine";

async function getDatabaseSnapshot() {
  try {
    const [products, totalProducts, demoProducts, manualProducts, csvProducts] = await Promise.all([
      prisma.product.findMany({
        orderBy: [{ source: "asc" }, { score: "desc" }, { createdAt: "desc" }]
      }),
      prisma.product.count(),
      prisma.product.count({ where: { source: "DEMO" } }),
      prisma.product.count({ where: { source: "MANUAL" } }),
      prisma.product.count({ where: { source: "CSV_IMPORT" } })
    ]);

    return {
      databaseConnected: true,
      products: products.length > 0 ? sortProductsBySourcePriority(products.map(mapDbProduct)) : sampleProducts,
      counts: {
        totalProducts,
        demoProducts,
        manualProducts,
        csvProducts
      }
    };
  } catch {
    return {
      databaseConnected: false,
      products: sampleProducts,
      counts: {
        totalProducts: 0,
        demoProducts: 0,
        manualProducts: 0,
        csvProducts: 0
      }
    };
  }
}

async function getContentStats() {
  try {
    const [totalDrafts, readyDrafts, postedDrafts, latest] = await Promise.all([
      prisma.contentPack.count(),
      prisma.contentPack.count({ where: { status: "READY" } }),
      prisma.contentPack.count({ where: { status: "POSTED" } }),
      prisma.contentPack.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { product: true }
      })
    ]);

    return {
      totalDrafts,
      readyDrafts,
      postedDrafts,
      latestDrafts: latest.map((draft) => {
        const mapped = mapDbContentDraft(draft);

        return {
          id: mapped.id,
          productName: mapped.product.productName,
          status: contentStatusLabels[mapped.status],
          hook: mapped.selectedHook || mapped.hooks[0] || mapped.caption
        };
      })
    };
  } catch {
    return {
      totalDrafts: 0,
      readyDrafts: 0,
      postedDrafts: 0,
      latestDrafts: []
    };
  }
}

async function getPostedStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [postedToday, latestPosted, bestByViews, bestByOrders] = await Promise.all([
      prisma.postedContent.count({ where: { postedAt: { gte: today }, archived: false } }),
      prisma.postedContent.findMany({
        where: { archived: false },
        orderBy: { postedAt: "desc" },
        take: 5,
        include: { product: true }
      }),
      prisma.postedContent.findFirst({
        where: { archived: false },
        orderBy: { views: "desc" },
        include: { product: true }
      }),
      prisma.postedContent.findFirst({
        where: { archived: false },
        orderBy: { orders: "desc" },
        include: { product: true }
      })
    ]);

    return {
      postedToday,
      bestByViews: bestByViews ? `${bestByViews.product.productName} (${bestByViews.views})` : "",
      bestByOrders: bestByOrders ? `${bestByOrders.product.productName} (${bestByOrders.orders})` : "",
      latestPosted: latestPosted.map((item) => ({
        id: item.id,
        productName: item.product.productName,
        url: item.tiktokVideoUrl,
        postedAt: item.postedAt.toISOString()
      }))
    };
  } catch {
    return {
      postedToday: 0,
      bestByViews: "",
      bestByOrders: "",
      latestPosted: []
    };
  }
}

async function getDashboardAnalyticsStats() {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const items = await prisma.postedContent.findMany({
      where: { archived: false, postedAt: { gte: since } },
      include: { product: true, contentPack: true }
    });
    const summary = calculateAnalyticsSummary(items.map((item) => ({
      views: item.views,
      likes: item.likes,
      comments: item.comments,
      shares: item.shares,
      saves: item.saves,
      clicks: item.clicks,
      orders: item.orders,
      revenue: Number(item.revenue)
    })));
    const bestProduct = items.reduce<typeof items[number] | null>((best, item) => (!best || item.orders > best.orders ? item : best), null);
    const bestContent = items.reduce<typeof items[number] | null>((best, item) => (!best || item.views > best.views ? item : best), null);

    return {
      viewsThisWeek: summary.views,
      clicksThisWeek: summary.clicks,
      ordersThisWeek: summary.orders,
      revenueThisWeek: summary.revenue,
      bestProduct: bestProduct?.product.productName ?? "",
      bestContent: bestContent?.contentPack.selectedHook ?? ""
    };
  } catch {
    return {
      viewsThisWeek: 0,
      clicksThisWeek: 0,
      ordersThisWeek: 0,
      revenueThisWeek: 0,
      bestProduct: "",
      bestContent: ""
    };
  }
}

async function getDashboardActionPlanStats(tiktokConnected: boolean, aiProviderConnected: boolean) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [products, drafts, postedContent, campaigns] = await Promise.all([
      prisma.product.findMany({ orderBy: [{ score: "desc" }, { createdAt: "desc" }] }),
      prisma.contentPack.findMany({ where: { status: { not: "ARCHIVED" } }, include: { product: true } }),
      prisma.postedContent.findMany({ where: { archived: false }, include: { product: true, contentPack: true, campaign: true } }),
      prisma.campaign.findMany({ include: { product: true, performance: true } })
    ]);
    const plan = generateActionPlan({
      products: products.map((product) => ({
        id: product.id,
        productName: product.productName,
        source: product.source,
        score: product.score,
        recommendation: product.recommendation
      })),
      drafts: drafts.map((draft) => ({
        id: draft.id,
        productId: draft.productId,
        productName: draft.product.productName,
        status: draft.status,
        hook: draft.selectedHook ?? draft.caption
      })),
      postedContent: postedContent.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.productName,
        productSource: item.product.source,
        productScore: item.product.score,
        productRecommendation: item.product.recommendation,
        contentHook: item.contentPack.selectedHook ?? item.contentPack.caption,
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
      })),
      campaigns: campaigns.map((campaign) => ({
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
      })),
      tiktokConnected,
      aiProviderConnected,
      postedToday: postedContent.filter((item) => item.postedAt >= today).length
    });

    return {
      mainFocus: plan.summary.mainFocus,
      topActions: plan.actions.slice(0, 3).map((action) => action.title)
    };
  } catch {
    return {
      mainFocus: "Hari ini fokus menambah produk dan mengisi data performa manual.",
      topActions: ["Tambah Produk", "Buat Konten", "Input Performa"]
    };
  }
}

export default async function Home() {
  const cookieStore = cookies();
  const tiktokConnected = cookieStore.get(TIKTOK_CONNECTED_COOKIE)?.value === "true";
  const database = await getDatabaseSnapshot();
  const contentStats = await getContentStats();
  const postedStats = await getPostedStats();
  const analyticsStats = await getDashboardAnalyticsStats();
  const promptEngineMode = getPromptEngineMode(Boolean(env.GEMINI_API_KEY), Boolean(env.OPENAI_API_KEY));
  const aiProviderConnected = promptEngineMode === "AI_CONNECTED";
  const actionPlanStats = await getDashboardActionPlanStats(tiktokConnected, aiProviderConnected);

  return (
    <AppShell>
      <section className="pb-5">
        <div className="flex flex-col gap-4">
          <AffiliateWorkflow
            activePage="dashboard"
            tiktokConnected={tiktokConnected}
            promptEngineMode={promptEngineMode}
            initialProducts={database.products}
            databaseConnected={database.databaseConnected}
            contentStats={contentStats}
            postedStats={postedStats}
            analyticsStats={analyticsStats}
            actionPlanStats={actionPlanStats}
          />
        </div>
      </section>
    </AppShell>
  );
}

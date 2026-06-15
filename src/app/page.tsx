import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { AffiliateWorkflow } from "@/modules/affiliate/affiliate-workflow";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { SettingsPanel } from "@/components/settings-panel";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { mapDbProduct, sortProductsBySourcePriority } from "@/modules/database/product-service";
import { contentStatusLabels, mapDbContentDraft } from "@/modules/database/content-service";
import { getPromptEngineMode } from "@/modules/prompt-engine/fallback";
import { getSettingsStatus } from "@/modules/settings/status";
import { getTikTokAccountView } from "@/modules/tiktok/account-service";
import { getTikTokEnvStatus } from "@/modules/tiktok/env-status";
import { TIKTOK_CONNECTED_COOKIE, TIKTOK_OAUTH_ERROR_COOKIE } from "@/modules/tiktok/oauth";
import { TikTokConnectionPanel } from "@/modules/tiktok/tiktok-connection-panel";
import { isTikTokShopApiConfigured } from "@/modules/tiktok-shop/tiktok-shop-api";
import { calculateAnalyticsSummary } from "@/modules/analytics/analytics";

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

export default async function Home() {
  const cookieStore = cookies();
  const tiktokConnected = cookieStore.get(TIKTOK_CONNECTED_COOKIE)?.value === "true";
  const lastOAuthError = cookieStore.get(TIKTOK_OAUTH_ERROR_COOKIE)?.value;
  const database = await getDatabaseSnapshot();
  const contentStats = await getContentStats();
  const postedStats = await getPostedStats();
  const analyticsStats = await getDashboardAnalyticsStats();
  const accountView = await getTikTokAccountView();
  const promptEngineMode = getPromptEngineMode(Boolean(env.GEMINI_API_KEY), Boolean(env.OPENAI_API_KEY));
  const tiktokEnvStatus = getTikTokEnvStatus({
    clientKey: env.TIKTOK_CLIENT_KEY,
    clientSecret: env.TIKTOK_CLIENT_SECRET,
    redirectUri: env.TIKTOK_REDIRECT_URI,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV
  });
  const hasDisplayedDemoProducts = database.products.some((product) => product.source === "DEMO");
  const hasManualProducts = database.products.some((product) => product.source === "MANUAL");
  const hasCsvProducts = database.products.some((product) => product.source === "CSV_IMPORT");
  const hasRealApiProducts = database.products.some((product) => product.source === "REAL_API");
  const settingsStatus = getSettingsStatus({
    appUrl: env.NEXT_PUBLIC_APP_URL,
    databaseUrl: database.databaseConnected ? env.DATABASE_URL : "",
    tiktokOAuthConfigured: tiktokEnvStatus.oauth === "Configured",
    tiktokConnected,
    promptEngineMode,
    productSource: hasManualProducts ? "MANUAL" : hasCsvProducts ? "CSV_IMPORT" : hasRealApiProducts ? "REAL_API" : hasDisplayedDemoProducts ? "DEMO" : "MANUAL"
  });
  const tiktokShopApiStatus = isTikTokShopApiConfigured();

  return (
    <AppShell>
      <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <AffiliateWorkflow
            tiktokConnected={tiktokConnected}
            promptEngineMode={promptEngineMode}
            initialProducts={database.products}
            databaseConnected={database.databaseConnected}
            contentStats={contentStats}
            postedStats={postedStats}
            analyticsStats={analyticsStats}
          />
          <TikTokConnectionPanel
            envStatus={tiktokEnvStatus}
            loginConnected={tiktokConnected || accountView.connected}
            lastOAuthError={lastOAuthError}
            account={accountView}
          />
          <SettingsPanel
            status={settingsStatus}
            databaseConnected={database.databaseConnected}
            counts={database.counts}
            tiktokOAuthConfigured={tiktokEnvStatus.oauth === "Configured"}
            aiProviderConfigured={promptEngineMode === "AI_CONNECTED"}
            productionUrl={env.NEXT_PUBLIC_APP_URL}
            tiktokRedirectUri={env.TIKTOK_REDIRECT_URI}
            tiktokOAuthErrors={tiktokEnvStatus.errors}
            lastOAuthError={lastOAuthError}
            tiktokLoginConnected={tiktokConnected || accountView.connected}
            tiktokShopApiStatus={tiktokShopApiStatus}
          />
        </div>
      </section>
    </AppShell>
  );
}

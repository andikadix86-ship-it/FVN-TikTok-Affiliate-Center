import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { SettingsPanel } from "@/components/settings-panel";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getPromptEngineMode } from "@/modules/prompt-engine/fallback";
import { mapDbProduct, sortProductsBySourcePriority } from "@/modules/database/product-service";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { AffiliateActivePage, AffiliateWorkflow } from "@/modules/affiliate/affiliate-workflow";
import { getSettingsStatus } from "@/modules/settings/status";
import { getTikTokAccountView } from "@/modules/tiktok/account-service";
import { getTikTokEnvStatus } from "@/modules/tiktok/env-status";
import { TIKTOK_CONNECTED_COOKIE, TIKTOK_OAUTH_ERROR_COOKIE } from "@/modules/tiktok/oauth";
import { TikTokConnectionPanel } from "@/modules/tiktok/tiktok-connection-panel";
import { isTikTokShopApiConfigured } from "@/modules/tiktok-shop/tiktok-shop-api";

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

export async function AffiliateWorkspacePage({ activePage }: { activePage: AffiliateActivePage }) {
  const database = await getDatabaseSnapshot();
  const promptEngineMode = getPromptEngineMode(Boolean(env.GEMINI_API_KEY), Boolean(env.OPENAI_API_KEY));
  const tiktokConnected = cookies().get(TIKTOK_CONNECTED_COOKIE)?.value === "true";
  const tiktokEnvStatus = getTikTokEnvStatus({
    clientKey: env.TIKTOK_CLIENT_KEY,
    clientSecret: env.TIKTOK_CLIENT_SECRET,
    redirectUri: env.TIKTOK_REDIRECT_URI,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV
  });

  return (
    <AppShell>
      <AffiliateWorkflow
        activePage={activePage}
        tiktokConnected={tiktokConnected}
        tiktokApiConfigured={tiktokEnvStatus.oauth === "Configured"}
        promptEngineMode={promptEngineMode}
        initialProducts={database.products}
        databaseConnected={database.databaseConnected}
      />
    </AppShell>
  );
}

export async function AffiliateSettingsWorkspacePage() {
  const cookieStore = cookies();
  const tiktokConnected = cookieStore.get(TIKTOK_CONNECTED_COOKIE)?.value === "true";
  const lastOAuthError = cookieStore.get(TIKTOK_OAUTH_ERROR_COOKIE)?.value;
  const database = await getDatabaseSnapshot();
  const promptEngineMode = getPromptEngineMode(Boolean(env.GEMINI_API_KEY), Boolean(env.OPENAI_API_KEY));
  const aiProviderConnected = promptEngineMode === "AI_CONNECTED";
  const accountView = await getTikTokAccountView();
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
    directUrl: database.databaseConnected ? env.DIRECT_URL : "",
    tiktokOAuthConfigured: tiktokEnvStatus.oauth === "Configured",
    tiktokConnected,
    promptEngineMode,
    productSource: hasManualProducts ? "MANUAL" : hasCsvProducts ? "CSV_IMPORT" : hasRealApiProducts ? "REAL_API" : hasDisplayedDemoProducts ? "DEMO" : "MANUAL"
  });
  const tiktokShopApiStatus = isTikTokShopApiConfigured();

  return (
    <AppShell>
      <div className="space-y-5">
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
          aiProviderConfigured={aiProviderConnected}
          productionUrl={env.NEXT_PUBLIC_APP_URL}
          tiktokRedirectUri={env.TIKTOK_REDIRECT_URI}
          tiktokOAuthErrors={tiktokEnvStatus.errors}
          lastOAuthError={lastOAuthError}
          tiktokLoginConnected={tiktokConnected || accountView.connected}
          tiktokShopApiStatus={tiktokShopApiStatus}
        />
      </div>
    </AppShell>
  );
}

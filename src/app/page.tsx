import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { AffiliateWorkflow } from "@/modules/affiliate/affiliate-workflow";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { SettingsPanel } from "@/components/settings-panel";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { mapDbProduct } from "@/modules/database/product-service";
import { getPromptEngineMode } from "@/modules/prompt-engine/fallback";
import { getSettingsStatus } from "@/modules/settings/status";
import { getTikTokEnvStatus } from "@/modules/tiktok/env-status";
import { TIKTOK_CONNECTED_COOKIE, TIKTOK_OAUTH_ERROR_COOKIE } from "@/modules/tiktok/oauth";
import { TikTokConnectionPanel } from "@/modules/tiktok/tiktok-connection-panel";

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
      products: products.length > 0 ? products.map(mapDbProduct) : sampleProducts,
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

export default async function Home() {
  const cookieStore = cookies();
  const tiktokConnected = cookieStore.get(TIKTOK_CONNECTED_COOKIE)?.value === "true";
  const lastOAuthError = cookieStore.get(TIKTOK_OAUTH_ERROR_COOKIE)?.value;
  const database = await getDatabaseSnapshot();
  const promptEngineMode = getPromptEngineMode(Boolean(env.GEMINI_API_KEY), Boolean(env.OPENAI_API_KEY));
  const tiktokEnvStatus = getTikTokEnvStatus({
    clientKey: env.TIKTOK_CLIENT_KEY,
    clientSecret: env.TIKTOK_CLIENT_SECRET,
    redirectUri: env.TIKTOK_REDIRECT_URI,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV
  });
  const hasDisplayedDemoProducts = database.products.some((product) => product.source === "DEMO");
  const hasDisplayedUserProducts = database.products.some((product) => product.source === "MANUAL" || product.source === "CSV_IMPORT" || product.source === "REAL_API");
  const settingsStatus = getSettingsStatus({
    appUrl: env.NEXT_PUBLIC_APP_URL,
    databaseUrl: database.databaseConnected ? env.DATABASE_URL : "",
    tiktokOAuthConfigured: tiktokEnvStatus.oauth === "Configured",
    tiktokConnected,
    promptEngineMode,
    productSource: hasDisplayedDemoProducts && !hasDisplayedUserProducts ? "DEMO" : "MANUAL"
  });

  return (
    <AppShell>
      <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <AffiliateWorkflow
            tiktokConnected={tiktokConnected}
            promptEngineMode={promptEngineMode}
            initialProducts={database.products}
            databaseConnected={database.databaseConnected}
          />
          <TikTokConnectionPanel
            envStatus={tiktokEnvStatus}
            loginConnected={tiktokConnected}
            lastOAuthError={lastOAuthError}
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
          />
        </div>
      </section>
    </AppShell>
  );
}

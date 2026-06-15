import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { getPromptEngineMode } from "@/modules/prompt-engine/fallback";
import { getSettingsStatus } from "@/modules/settings/status";
import { getTikTokEnvStatus } from "@/modules/tiktok/env-status";

export const dynamic = "force-dynamic";

export async function GET() {
  let databaseConnected = false;
  let counts = {
    totalProducts: 0,
    demoProducts: 0,
    manualProducts: 0,
    csvProducts: 0
  };

  try {
    const [totalProducts, demoProducts, manualProducts, csvProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { source: "DEMO" } }),
      prisma.product.count({ where: { source: "MANUAL" } }),
      prisma.product.count({ where: { source: "CSV_IMPORT" } })
    ]);
    databaseConnected = true;
    counts = { totalProducts, demoProducts, manualProducts, csvProducts };
  } catch {
    databaseConnected = false;
  }

  const tiktok = getTikTokEnvStatus({
    clientKey: env.TIKTOK_CLIENT_KEY,
    clientSecret: env.TIKTOK_CLIENT_SECRET,
    redirectUri: env.TIKTOK_REDIRECT_URI,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV
  });
  const promptEngineMode = getPromptEngineMode(Boolean(env.GEMINI_API_KEY), Boolean(env.OPENAI_API_KEY));
  const productSource = counts.manualProducts > 0 ? "MANUAL" : counts.csvProducts > 0 ? "CSV_IMPORT" : counts.demoProducts > 0 ? "DEMO" : "MANUAL";
  const settings = getSettingsStatus({
    appUrl: env.NEXT_PUBLIC_APP_URL,
    databaseUrl: databaseConnected ? env.DATABASE_URL : "",
    tiktokOAuthConfigured: tiktok.oauth === "Configured",
    tiktokConnected: false,
    promptEngineMode,
    productSource
  });

  return NextResponse.json({
    databaseConnected,
    counts,
    tiktok,
    aiProvider: promptEngineMode === "AI_CONNECTED" ? "configured" : "template_mode",
    settings
  });
}

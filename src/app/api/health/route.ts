import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { getPromptEngineMode } from "@/modules/prompt-engine/fallback";
import { getTikTokEnvStatus } from "@/modules/tiktok/env-status";

export const dynamic = "force-dynamic";

async function getDatabaseStatus() {
  if (!env.DATABASE_URL) {
    return "error" as const;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return "connected" as const;
  } catch {
    return "error" as const;
  }
}

async function getProductSource() {
  if (!env.DATABASE_URL) {
    return "demo";
  }

  try {
    const product = await prisma.product.findFirst({
      orderBy: [{ source: "asc" }, { updatedAt: "desc" }]
    });

    return product?.source.toLowerCase() ?? "demo";
  } catch {
    return "demo";
  }
}

export async function GET() {
  const tiktok = getTikTokEnvStatus({
    clientKey: env.TIKTOK_CLIENT_KEY,
    clientSecret: env.TIKTOK_CLIENT_SECRET,
    redirectUri: env.TIKTOK_REDIRECT_URI,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV
  });
  const promptEngineMode = getPromptEngineMode(Boolean(env.GEMINI_API_KEY), Boolean(env.OPENAI_API_KEY));

  return NextResponse.json({
    app: "ok",
    database: await getDatabaseStatus(),
    tiktokOAuth: tiktok.oauth === "Configured" ? "configured" : tiktok.oauth === "Invalid" ? "invalid" : "missing",
    aiProvider: promptEngineMode === "AI_CONNECTED" ? "configured" : "template_mode",
    productSource: await getProductSource()
  });
}

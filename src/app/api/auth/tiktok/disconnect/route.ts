import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  TIKTOK_CODE_VERIFIER_COOKIE,
  TIKTOK_CONNECTED_COOKIE,
  TIKTOK_OAUTH_ERROR_COOKIE,
  TIKTOK_OAUTH_SUCCESS_COOKIE,
  TIKTOK_STATE_COOKIE
} from "@/modules/tiktok/oauth";
import { writeTikTokOAuthLog } from "@/modules/tiktok/account-service";

export async function POST() {
  if (env.DATABASE_URL) {
    try {
      await prisma.tikTokAccount.deleteMany();
      await writeTikTokOAuthLog("SUCCESS", "TikTok account disconnected.", undefined, "disconnect_success");
    } catch (error) {
      await writeTikTokOAuthLog("ERROR", "TikTok disconnect failed.", error, "disconnect_failed");
    }
  }

  const response = NextResponse.json({
    disconnected: true,
    message: "TikTok account disconnected."
  });

  response.cookies.delete(TIKTOK_CONNECTED_COOKIE);
  response.cookies.delete(TIKTOK_STATE_COOKIE);
  response.cookies.delete(TIKTOK_CODE_VERIFIER_COOKIE);
  response.cookies.delete(TIKTOK_OAUTH_ERROR_COOKIE);
  response.cookies.delete(TIKTOK_OAUTH_SUCCESS_COOKIE);

  return response;
}

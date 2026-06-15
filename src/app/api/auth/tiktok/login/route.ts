import { buildTikTokLoginUrl } from "@/modules/tiktok/oauth";

export async function GET() {
  return Response.redirect(buildTikTokLoginUrl());
}

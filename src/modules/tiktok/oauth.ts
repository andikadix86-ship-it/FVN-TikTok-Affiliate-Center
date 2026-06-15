import { env } from "@/lib/env";

export function buildTikTokLoginUrl() {
  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", env.TIKTOK_CLIENT_KEY ?? "");
  url.searchParams.set("scope", "user.info.basic,video.list");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", env.TIKTOK_REDIRECT_URI);
  url.searchParams.set("state", "fvn_tiktok_affiliate_center");

  return url;
}

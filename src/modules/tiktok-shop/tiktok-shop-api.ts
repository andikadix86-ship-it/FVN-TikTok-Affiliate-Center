import { env } from "@/lib/env";
import { AffiliateProduct } from "@/modules/affiliate/types";

export type TikTokShopApiStatus = {
  configured: boolean;
  status: "Connected" | "Not Connected";
  message: string;
  region: string;
};

export type TikTokShopProductPayload = {
  id: string;
  productName: string;
  category: string;
  price: number;
  commissionRate: number;
  salesScore?: number;
  productUrl?: string;
  imageUrl?: string;
};

export function isTikTokShopApiConfigured({
  appKey = env.TIKTOK_SHOP_APP_KEY,
  appSecret = env.TIKTOK_SHOP_APP_SECRET,
  accessToken = env.TIKTOK_SHOP_ACCESS_TOKEN,
  region = env.TIKTOK_SHOP_REGION
}: {
  appKey?: string;
  appSecret?: string;
  accessToken?: string;
  region?: string;
} = {}): TikTokShopApiStatus {
  const configured = Boolean(appKey && appSecret && accessToken);

  return {
    configured,
    status: configured ? "Connected" : "Not Connected",
    message: configured ? "TikTok Shop API configured." : "TikTok Shop API belum terhubung",
    region: region || "ID"
  };
}

export async function fetchTikTokShopProducts(): Promise<AffiliateProduct[]> {
  if (!isTikTokShopApiConfigured().configured) {
    return [];
  }

  // Official TikTok Shop API integration belongs here after app approval.
  // This MVP intentionally does not scrape or fake REAL_API products.
  return [];
}

export async function fetchTikTokShopProductById(_productId: string): Promise<AffiliateProduct | null> {
  if (!isTikTokShopApiConfigured().configured) {
    return null;
  }

  return null;
}

export function mapTikTokShopProductToProductModel(payload: TikTokShopProductPayload): AffiliateProduct {
  const now = new Date().toISOString();

  return {
    id: payload.id,
    source: "REAL_API",
    productName: payload.productName,
    platform: "TikTok",
    category: payload.category,
    price: payload.price,
    commissionRate: payload.commissionRate,
    salesScore: payload.salesScore ?? 50,
    rating: 0,
    reviewCount: 0,
    competitionLevel: "medium",
    productUrl: payload.productUrl ?? "",
    imageUrl: payload.imageUrl ?? "",
    targetAudience: "",
    problemSolved: "",
    mainBenefit: "",
    demoIdea: "",
    notes: "Real API Data from official TikTok Shop API adapter.",
    contentPotential: 70,
    beginnerFriendliness: 70,
    createdAt: now,
    updatedAt: now
  };
}

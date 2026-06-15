export type ProductSource = "DEMO" | "MANUAL" | "CSV_IMPORT" | "REAL_API";

export type AffiliateProduct = {
  id: string;
  source: ProductSource;
  name: string;
  niche: string;
  price: number;
  commissionRate: number;
  salesVelocity: number;
  rating: number;
  contentFit: number;
  competition: "low" | "medium" | "high";
  hook: string;
};

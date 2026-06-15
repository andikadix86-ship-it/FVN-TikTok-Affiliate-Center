export type AffiliateProduct = {
  id: string;
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

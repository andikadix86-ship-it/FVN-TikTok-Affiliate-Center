import { AffiliateProduct } from "@/modules/affiliate/types";

const competitionPenalty = {
  low: 0,
  medium: 7,
  high: 14
};

export function scoreProduct(product: AffiliateProduct) {
  const commission = Math.min(product.commissionRate * 3, 100);
  const rating = product.rating * 20;
  const content = product.contentFit;
  const sales = product.salesVelocity;
  const total = Math.round((commission * 0.2 + rating * 0.2 + content * 0.35 + sales * 0.25) - competitionPenalty[product.competition]);

  return {
    total: Math.max(0, Math.min(100, total)),
    factors: {
      commission: Math.round(commission),
      rating: Math.round(rating),
      content,
      sales,
      competition: product.competition
    }
  };
}

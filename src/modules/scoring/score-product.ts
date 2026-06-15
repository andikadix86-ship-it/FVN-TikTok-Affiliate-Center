import { AffiliateProduct, ProductRecommendation } from "@/modules/affiliate/types";

const competitionScore = {
  low: 92,
  medium: 68,
  high: 38
};

export function getRecommendation(total: number): ProductRecommendation {
  if (total >= 80) {
    return "Promote";
  }

  if (total >= 60) {
    return "Test First";
  }

  return "Avoid";
}

function getPriceAttractiveness(price: number) {
  if (price <= 0) {
    return 40;
  }

  if (price <= 15) {
    return 92;
  }

  if (price <= 35) {
    return 82;
  }

  if (price <= 75) {
    return 62;
  }

  return 42;
}

export function scoreProduct(product: AffiliateProduct) {
  const demoClarity = product.demoIdea ? 88 : product.imageUrl || product.productUrl ? 72 : 50;
  const targetAudienceMatch = product.targetAudience && (product.problemSolved || product.mainBenefit) ? 88 : product.targetAudience ? 72 : 55;
  const contentPotential = Math.max(product.contentPotential, product.mainBenefit || product.problemSolved || product.demoIdea ? 82 : product.contentPotential);
  const beginnerFriendliness = Math.max(product.beginnerFriendliness, product.problemSolved ? 78 : product.beginnerFriendliness);
  const factors = {
    commissionRate: Math.min(product.commissionRate * 4, 100),
    priceAttractiveness: getPriceAttractiveness(product.price),
    salesPotential: product.salesScore,
    competitionLevel: competitionScore[product.competitionLevel],
    contentPotential,
    beginnerFriendliness,
    demoClarity,
    targetAudienceMatch
  };

  const total = Math.round(
    factors.commissionRate * 0.15 +
      factors.priceAttractiveness * 0.12 +
      factors.salesPotential * 0.17 +
      factors.competitionLevel * 0.12 +
      factors.contentPotential * 0.16 +
      factors.beginnerFriendliness * 0.12 +
      factors.demoClarity * 0.08 +
      factors.targetAudienceMatch * 0.08
  );

  return {
    total: Math.max(0, Math.min(100, total)),
    recommendation: getRecommendation(total),
    factors
  };
}

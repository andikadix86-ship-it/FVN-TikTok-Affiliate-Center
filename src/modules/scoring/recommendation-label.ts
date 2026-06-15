import { ProductRecommendation } from "@/modules/affiliate/types";

export function getRecommendationLabel(recommendation: ProductRecommendation) {
  const labels: Record<ProductRecommendation, string> = {
    Promote: "Layak Promosi",
    "Test First": "Test Dulu",
    Avoid: "Hindari"
  };

  return labels[recommendation];
}

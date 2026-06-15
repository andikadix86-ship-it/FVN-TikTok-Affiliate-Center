export type ProductSource = "DEMO" | "MANUAL" | "CSV_IMPORT" | "REAL_API";

export type CompetitionLevel = "low" | "medium" | "high";
export type ProductRecommendation = "Promote" | "Test First" | "Avoid";

export type AffiliateProduct = {
  id: string;
  source: ProductSource;
  name: string;
  category: string;
  price: number;
  commissionRate: number;
  salesScore: number;
  competitionLevel: CompetitionLevel;
  productUrl: string;
  imageUrl: string;
  notes: string;
  contentPotential: number;
  beginnerFriendliness: number;
};

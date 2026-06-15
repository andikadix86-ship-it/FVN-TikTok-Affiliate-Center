export type ProductSource = "DEMO" | "MANUAL" | "CSV_IMPORT" | "REAL_API";

export type CompetitionLevel = "low" | "medium" | "high";
export type ProductRecommendation = "Promote" | "Test First" | "Avoid";

export type AffiliateProduct = {
  id: string;
  source: ProductSource;
  productName: string;
  platform: "TikTok";
  category: string;
  price: number;
  commissionRate: number;
  soldCount?: number;
  salesScore: number;
  rating: number;
  reviewCount: number;
  competitionLevel: CompetitionLevel;
  productUrl: string;
  imageUrl: string;
  targetAudience: string;
  problemSolved: string;
  mainBenefit: string;
  demoIdea: string;
  notes: string;
  contentPotential: number;
  beginnerFriendliness: number;
  createdAt: string;
  updatedAt: string;
};

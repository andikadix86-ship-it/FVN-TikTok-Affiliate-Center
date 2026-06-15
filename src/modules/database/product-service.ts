import { z } from "zod";
import { AffiliateProduct, CompetitionLevel, ProductSource } from "@/modules/affiliate/types";
import { scoreProduct } from "@/modules/scoring/score-product";

export const PRODUCT_SOURCE_PRIORITY: ProductSource[] = ["MANUAL", "CSV_IMPORT", "REAL_API", "DEMO"];
export const productSourceSchema = z.enum(["DEMO", "MANUAL", "CSV_IMPORT", "REAL_API"]);
export const competitionLevelSchema = z.enum(["low", "medium", "high"]);

export const productInputSchema = z.object({
  productName: z.string().min(1, "productName is required"),
  platform: z.string().default("TikTok"),
  category: z.string().min(1, "category is required"),
  price: z.coerce.number().nonnegative("price must be a number"),
  commissionRate: z.coerce.number().nonnegative("commissionRate must be a number"),
  salesScore: z.coerce.number().int().min(0).max(100),
  soldCount: z.coerce.number().int().nonnegative().optional().nullable(),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  reviewCount: z.coerce.number().int().nonnegative().optional().nullable(),
  competitionLevel: competitionLevelSchema,
  productUrl: z.string().url("productUrl must be a valid URL").or(z.literal("")).optional().nullable(),
  imageUrl: z.string().url("imageUrl must be a valid URL").or(z.literal("")).optional().nullable(),
  targetAudience: z.string().optional().nullable(),
  problemSolved: z.string().optional().nullable(),
  mainBenefit: z.string().optional().nullable(),
  demoIdea: z.string().optional().nullable(),
  source: productSourceSchema.default("MANUAL"),
  notes: z.string().optional().nullable(),
  contentPotential: z.coerce.number().int().min(0).max(100).default(70),
  beginnerFriendliness: z.coerce.number().int().min(0).max(100).default(70)
});

export type ProductInput = z.infer<typeof productInputSchema>;

export function normalizeProductInput(input: unknown, source?: ProductSource) {
  const parsed = productInputSchema.parse({
    ...(input as Record<string, unknown>),
    source: source ?? (input as Record<string, unknown>)?.source
  });
  const now = new Date().toISOString();
  const product: AffiliateProduct = {
    id: "score-preview",
    productName: parsed.productName,
    platform: "TikTok",
    category: parsed.category,
    price: parsed.price,
    commissionRate: parsed.commissionRate,
    salesScore: parsed.salesScore,
    soldCount: parsed.soldCount ?? undefined,
    rating: parsed.rating ?? 0,
    reviewCount: parsed.reviewCount ?? 0,
    competitionLevel: parsed.competitionLevel as CompetitionLevel,
    productUrl: parsed.productUrl ?? "",
    imageUrl: parsed.imageUrl ?? "",
    targetAudience: parsed.targetAudience ?? "",
    problemSolved: parsed.problemSolved ?? "",
    mainBenefit: parsed.mainBenefit ?? "",
    demoIdea: parsed.demoIdea ?? "",
    source: parsed.source,
    notes: parsed.notes ?? "",
    contentPotential: parsed.contentPotential,
    beginnerFriendliness: parsed.beginnerFriendliness,
    createdAt: now,
    updatedAt: now
  };
  const score = scoreProduct(product);

  return {
    parsed,
    score
  };
}

export function buildProductCreateData(input: unknown, source?: ProductSource) {
  const { parsed, score } = normalizeProductInput(input, source);

  return {
    productName: parsed.productName,
    platform: "TikTok",
    category: parsed.category,
    price: parsed.price,
    commissionRate: parsed.commissionRate,
    salesScore: parsed.salesScore,
    soldCount: parsed.soldCount ?? undefined,
    rating: parsed.rating ?? undefined,
    reviewCount: parsed.reviewCount ?? undefined,
    competitionLevel: parsed.competitionLevel,
    productUrl: parsed.productUrl ?? undefined,
    imageUrl: parsed.imageUrl ?? undefined,
    targetAudience: parsed.targetAudience ?? undefined,
    problemSolved: parsed.problemSolved ?? undefined,
    mainBenefit: parsed.mainBenefit ?? undefined,
    demoIdea: parsed.demoIdea ?? undefined,
    source: parsed.source,
    notes: parsed.notes ?? undefined,
    score: score.total,
    recommendation: score.recommendation
  };
}

export function mapDbProduct(product: {
  id: string;
  productName: string;
  platform: string;
  category: string;
  price: unknown;
  commissionRate: unknown;
  salesScore: number;
  soldCount: number | null;
  rating: unknown | null;
  reviewCount: number | null;
  competitionLevel: string;
  productUrl: string | null;
  imageUrl: string | null;
  targetAudience?: string | null;
  problemSolved?: string | null;
  mainBenefit?: string | null;
  demoIdea?: string | null;
  source: ProductSource;
  notes: string | null;
  score: number;
  recommendation: string;
  createdAt: Date;
  updatedAt: Date;
}): AffiliateProduct & { score: number; recommendation: string } {
  return {
    id: product.id,
    productName: product.productName,
    platform: "TikTok",
    category: product.category,
    price: Number(product.price),
    commissionRate: Number(product.commissionRate),
    salesScore: product.salesScore,
    soldCount: product.soldCount ?? undefined,
    rating: Number(product.rating ?? 0),
    reviewCount: product.reviewCount ?? 0,
    competitionLevel: product.competitionLevel as CompetitionLevel,
    productUrl: product.productUrl ?? "",
    imageUrl: product.imageUrl ?? "",
    targetAudience: product.targetAudience ?? "",
    problemSolved: product.problemSolved ?? "",
    mainBenefit: product.mainBenefit ?? "",
    demoIdea: product.demoIdea ?? "",
    source: product.source,
    notes: product.notes ?? "",
    contentPotential: 70,
    beginnerFriendliness: 70,
    score: product.score,
    recommendation: product.recommendation,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

export function filterNonDemoProducts<T extends { source: ProductSource }>(products: T[]) {
  return products.filter((product) => product.source !== "DEMO");
}

export function sortProductsBySourcePriority<T extends { source: ProductSource; score?: number; createdAt?: string }>(products: T[]) {
  return [...products].sort((a, b) => {
    const sourceDelta = PRODUCT_SOURCE_PRIORITY.indexOf(a.source) - PRODUCT_SOURCE_PRIORITY.indexOf(b.source);

    if (sourceDelta !== 0) {
      return sourceDelta;
    }

    const scoreDelta = (b.score ?? 0) - (a.score ?? 0);

    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
  });
}

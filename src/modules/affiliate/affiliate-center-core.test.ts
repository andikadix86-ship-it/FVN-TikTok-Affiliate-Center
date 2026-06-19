import { describe, expect, it } from "vitest";
import {
  addProductToTikTokShowcase,
  createContentFactoryOutput,
  createMultiVideoVariants,
  createStoryEngineOutput,
  productDisplayLimit,
  videosToLibraryItems
} from "./affiliate-center-core";
import { AffiliateProduct } from "./types";

const product: AffiliateProduct = {
  id: "product-1",
  source: "MANUAL",
  productName: "Portable Blender",
  platform: "TikTok",
  category: "Kitchen Tools",
  price: 149000,
  commissionRate: 12,
  soldCount: 1000,
  salesScore: 88,
  rating: 4.8,
  reviewCount: 210,
  competitionLevel: "medium",
  productUrl: "https://example.com/product",
  imageUrl: "",
  targetAudience: "Affiliate pemula",
  problemSolved: "Sulit membuat jus saat bepergian",
  mainBenefit: "praktis untuk minuman sehat harian",
  demoIdea: "Demo blender di meja dapur",
  notes: "Manual product",
  contentPotential: 86,
  beginnerFriendliness: 82,
  createdAt: "2026-06-17T00:00:00.000Z",
  updatedAt: "2026-06-17T00:00:00.000Z"
};

describe("affiliate center core workflows", () => {
  it("uses 10 products by default and 25 after show more", () => {
    expect(productDisplayLimit(false)).toBe(10);
    expect(productDisplayLimit(true)).toBe(25);
  });

  it("changes Content Factory script for each content type", () => {
    const review = createContentFactoryOutput(product, "Product Review");
    const problem = createContentFactoryOutput(product, "Problem Solution");
    const comparison = createContentFactoryOutput(product, "Comparison");
    const ugc = createContentFactoryOutput(product, "UGC Script");
    const short = createContentFactoryOutput(product, "Short Video");
    const live = createContentFactoryOutput(product, "Live Selling Script");

    expect(new Set([review.mainScript, problem.mainScript, comparison.mainScript, ugc.mainScript, short.mainScript, live.mainScript]).size).toBe(6);
    for (const output of [review, problem, comparison, ugc, short, live]) {
      expect(output.hook).toBeTruthy();
      expect(output.opening).toBeTruthy();
      expect(output.mainScript).toBeTruthy();
      expect(output.cta).toBeTruthy();
      expect(output.caption).toBeTruthy();
      expect(output.hashtag.length).toBeGreaterThan(0);
    }
  });

  it("changes Story Engine structure for each mode", () => {
    expect(createStoryEngineOutput(product, "Affiliate Story").structure).toContain("Product Discovery");
    expect(createStoryEngineOutput(product, "Education").structure).toContain("Question");
    expect(createStoryEngineOutput(product, "Business Story").structure).toContain("Problem Market");
    expect(createStoryEngineOutput(product, "Islamic Story").structure).toContain("Opening Wisdom");
    expect(createStoryEngineOutput(product, "Kids Animation").structure).toContain("Happy Ending");
    expect(createStoryEngineOutput(product, "Motivational Story").structure).toContain("Turning Point");
  });

  it("generates flexible 1 to 30 Multi Video variants with prompts", () => {
    expect(createMultiVideoVariants(product, 1)).toHaveLength(1);
    expect(createMultiVideoVariants(product, 30)).toHaveLength(30);
    expect(createMultiVideoVariants(product, 99)).toHaveLength(30);
    const [variant] = createMultiVideoVariants(product, 1, undefined, {
      platform: "YouTube Landscape",
      aspectRatio: "16:9",
      resolution: "1920x1080",
      duration: "45 detik",
      generator: "Veo 3"
    });
    expect(variant.imagePrompt).toBeTruthy();
    expect(variant.videoPrompt).toBeTruthy();
    expect(variant.platform).toBe("YouTube Landscape");
    expect(variant.aspectRatio).toBe("16:9");
    expect(variant.resolution).toBe("1920x1080");
    expect(variant.duration).toBe("45 detik");
    expect(variant.generator).toBe("Veo 3");
    expect(variant.videoPrompt).toContain("Veo 3");
    expect(variant.generationStatus).toBe("DEMO");
    expect(variant.generationProgress).toBe(100);
    expect(variant.previewImagePlaceholder).toContain(product.productName);
  });

  it("maps saved videos to Content Library items", () => {
    const variants = createMultiVideoVariants(product, 3);
    const items = videosToLibraryItems(product, variants, "Draft");
    expect(items).toHaveLength(3);
    expect(items.every((item) => item.sourceLabel === "Multi Video Engine")).toBe(true);
    expect(items.every((item) => item.sourceCode === "MULTI_VIDEO_ENGINE")).toBe(true);
    expect(items.every((item) => item.status === "Draft")).toBe(true);
    expect(items.every((item) => item.statusCode === "DRAFT")).toBe(true);
  });

  it("returns NOT_CONNECTED for platform showcase without OAuth/account", () => {
    const result = addProductToTikTokShowcase(product.id, undefined, false);
    expect(result.showcaseStatus).toBe("NOT_CONNECTED");
    expect(result.message).toBe("Platform API belum terhubung. Produk belum bisa ditambahkan ke Showcase.");
  });
});

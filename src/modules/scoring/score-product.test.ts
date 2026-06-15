import { describe, expect, it } from "vitest";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { getRecommendation, scoreProduct } from "./score-product";

describe("product scoring", () => {
  it("uses requested recommendation thresholds", () => {
    expect(getRecommendation(80)).toBe("Promote");
    expect(getRecommendation(60)).toBe("Test First");
    expect(getRecommendation(59)).toBe("Avoid");
  });

  it("scores a product between 0 and 100 with a factor breakdown", () => {
    const score = scoreProduct(sampleProducts[0]);

    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(score.factors).toHaveProperty("commissionRate");
    expect(score.factors).toHaveProperty("priceAttractiveness");
    expect(score.factors).toHaveProperty("salesPotential");
    expect(score.factors).toHaveProperty("competitionLevel");
    expect(score.factors).toHaveProperty("contentPotential");
    expect(score.factors).toHaveProperty("beginnerFriendliness");
    expect(score.factors).toHaveProperty("demoClarity");
    expect(score.factors).toHaveProperty("targetAudienceMatch");
  });

  it("recalculates score when edit fields improve demo clarity and audience match", () => {
    const base = scoreProduct({
      ...sampleProducts[0],
      demoIdea: "",
      targetAudience: "",
      problemSolved: "",
      mainBenefit: "",
      contentPotential: 50,
      beginnerFriendliness: 50
    });
    const edited = scoreProduct({
      ...sampleProducts[0],
      demoIdea: "Before-after pemakaian produk",
      targetAudience: "Affiliate pemula",
      problemSolved: "Sulit membuat konten demo",
      mainBenefit: "Konten lebih mudah direkam",
      contentPotential: 50,
      beginnerFriendliness: 50
    });

    expect(edited.total).toBeGreaterThan(base.total);
  });
});

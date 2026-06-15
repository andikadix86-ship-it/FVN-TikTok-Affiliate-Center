import { describe, expect, it } from "vitest";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { buildProductCreateData, filterNonDemoProducts, productInputSchema } from "./product-service";

describe("product API validation and demo clear logic", () => {
  it("validates product API payloads", () => {
    const parsed = productInputSchema.parse({
      productName: "Manual Product",
      category: "Creator tools",
      price: 10,
      commissionRate: 15,
      salesScore: 70,
      competitionLevel: "low",
      source: "MANUAL"
    });

    expect(parsed.productName).toBe("Manual Product");
    expect(parsed.source).toBe("MANUAL");
  });

  it("rejects invalid product API payloads", () => {
    expect(() =>
      productInputSchema.parse({
        productName: "",
        category: "",
        price: "bad",
        commissionRate: 10,
        salesScore: 70,
        competitionLevel: "extreme"
      })
    ).toThrow();
  });

  it("builds scored product create data", () => {
    const data = buildProductCreateData(sampleProducts[0], "MANUAL");

    expect(data.source).toBe("MANUAL");
    expect(data.score).toBeGreaterThanOrEqual(0);
    expect(data.recommendation).toMatch(/Promote|Test First|Avoid/);
  });

  it("clears only demo products", () => {
    const products = [
      ...sampleProducts,
      { ...sampleProducts[0], id: "manual", source: "MANUAL" as const },
      { ...sampleProducts[0], id: "csv", source: "CSV_IMPORT" as const }
    ];

    const remaining = filterNonDemoProducts(products);

    expect(remaining).toHaveLength(2);
    expect(remaining.every((product) => product.source !== "DEMO")).toBe(true);
  });
});

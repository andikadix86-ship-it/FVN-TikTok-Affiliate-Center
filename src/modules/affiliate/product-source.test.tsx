import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { sampleProducts } from "./sample-products";
import { AffiliateWorkflow } from "./affiliate-workflow";
import { ProductHunter } from "./product-hunter";
import { selectProductsByPriority } from "./product-source";

describe("Product Hunter sources", () => {
  it("marks every sample product as DEMO", () => {
    expect(sampleProducts.length).toBeGreaterThan(0);
    expect(sampleProducts.every((product) => product.source === "DEMO")).toBe(true);
  });

  it("prioritizes manual, CSV, real API, then demo data", () => {
    const selected = selectProductsByPriority({
      REAL_API: [{ ...sampleProducts[0], id: "real", source: "REAL_API" }],
      CSV_IMPORT: [{ ...sampleProducts[0], id: "csv", source: "CSV_IMPORT" }],
      MANUAL: [{ ...sampleProducts[0], id: "manual", source: "MANUAL" }],
      DEMO: sampleProducts
    });

    expect(selected.source).toBe("MANUAL");
    expect(selected.products[0].source).toBe("MANUAL");
  });

  it("shows that demo products are not from TikTok Shop", () => {
    const html = renderToStaticMarkup(<ProductHunter />);

    expect(html).toContain("DEMO DATA - Not from TikTok Shop");
    expect(html).toContain("These products are sample data only. Connect TikTok Shop API, import CSV, or add products manually to use real data.");
  });

  it("shows workflow source modes without presenting demo products as real API", () => {
    const html = renderToStaticMarkup(<AffiliateWorkflow tiktokConnected={false} />);

    expect(html).toContain("DEMO DATA - Not from TikTok Shop");
    expect(html).toContain("MANUAL");
    expect(html).toContain("CSV_IMPORT");
    expect(html).toContain("REAL_API");
    expect(html).toContain("only after API fetch");
  });
});

import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { sampleProducts } from "./sample-products";
import { AffiliateWorkflow } from "./affiliate-workflow";
import { getSourceBadgeText, getSourceTrustText } from "./source-badge";
import { getRecommendationLabel } from "@/modules/scoring/recommendation-label";
import { sortProductsBySourcePriority } from "@/modules/database/product-service";

describe("Product Hunter sources", () => {
  it("marks every sample product as DEMO", () => {
    expect(sampleProducts.length).toBeGreaterThan(0);
    expect(sampleProducts.every((product) => product.source === "DEMO")).toBe(true);
  });

  it("prioritizes manual, CSV, real API, then demo data", () => {
    const selected = sortProductsBySourcePriority([
      { ...sampleProducts[0], id: "real", source: "REAL_API" },
      { ...sampleProducts[0], id: "csv", source: "CSV_IMPORT" },
      { ...sampleProducts[0], id: "manual", source: "MANUAL" },
      ...sampleProducts
    ]);

    expect(selected[0].source).toBe("MANUAL");
    expect(selected[1].source).toBe("CSV_IMPORT");
    expect(selected[2].source).toBe("REAL_API");
  });

  it("shows that demo products are not from TikTok Shop", () => {
    const html = renderToStaticMarkup(
      <AffiliateWorkflow
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );

    expect(html).toContain("DEMO DATA - Bukan dari TikTok Shop");
  });

  it("shows workflow source modes without presenting demo products as real API", () => {
    const html = renderToStaticMarkup(
      <AffiliateWorkflow
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );

    expect(html).toContain("DEMO DATA - Bukan dari TikTok Shop");
    expect(html).toContain("MANUAL");
    expect(html).toContain("CSV_IMPORT");
    expect(html).toContain("REAL_API");
    expect(html).toContain("MANUAL DATA - Input user");
    expect(html).toContain("CSV IMPORT - Dari file user");
    expect(html).toContain("Input user");
    expect(html).toContain("only after API fetch");
  });

  it("returns honest source badge labels", () => {
    expect(getSourceBadgeText("DEMO")).toBe("DEMO DATA - Bukan dari TikTok Shop");
    expect(getSourceBadgeText("MANUAL")).toBe("MANUAL DATA - Input user");
    expect(getSourceBadgeText("CSV_IMPORT")).toBe("CSV IMPORT - Dari file user");
    expect(getSourceBadgeText("REAL_API")).toBe("REAL API DATA - Data API asli");
    expect(getSourceTrustText("DEMO")).toBe("Bukan dari TikTok Shop");
    expect(getSourceTrustText("MANUAL")).toBe("Input user");
    expect(getSourceTrustText("CSV_IMPORT")).toBe("Dari file user");
    expect(getSourceTrustText("REAL_API")).toBe("Data API asli");
  });

  it("returns beginner recommendation labels", () => {
    expect(getRecommendationLabel("Promote")).toBe("Layak Promosi");
    expect(getRecommendationLabel("Test First")).toBe("Test Dulu");
    expect(getRecommendationLabel("Avoid")).toBe("Hindari");
  });

  it("shows beginner workflow fallback and empty-state guidance", () => {
    const html = renderToStaticMarkup(
      <AffiliateWorkflow
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );

    expect(html).toContain("Template Siap Pakai");
    expect(html).toContain("Koneksi AI belum terhubung");
    expect(html).toContain("Belum ada konten. Pilih produk lalu buat script konten.");
    expect(html).toContain("Story Engine");
    expect(html).toContain("Multi Video Engine");
    expect(html).toContain("Analytics / Profit Center");
    expect(html).toContain("AI Agents Optimization");
    expect(html).toContain("Copy Hook");
    expect(html).toContain("Copy Script");
    expect(html).toContain("Copy Caption");
    expect(html).toContain("Copy Hashtag");
    expect(html).toContain("Copy Full Pack");
    expect(html).toContain("Belum ada rencana posting. Buat campaign 7 hari dari produk terbaik kamu.");
  });
});

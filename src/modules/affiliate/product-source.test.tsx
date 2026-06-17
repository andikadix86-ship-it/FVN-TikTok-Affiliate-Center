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

    expect(html).toContain("Data Contoh - Bukan dari TikTok Shop");
  });

  it("shows workflow source modes without presenting demo products as real API", () => {
    const html = renderToStaticMarkup(
      <AffiliateWorkflow
        activePage="product-intelligence"
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );

    expect(html).toContain("Data Contoh - Bukan dari TikTok Shop");
    expect(html).toContain("Data Tersimpan");
    expect(html).toContain("Data Marketplace");
    expect(html).toContain("Data Partner");
    expect(html).toContain("Data Tersimpan - Input user");
    expect(html).toContain("Data Marketplace - Dari file user");
    expect(html).toContain("Input user");
    expect(html).toContain("aktif setelah API partner terhubung");
  });

  it("returns honest source badge labels", () => {
    expect(getSourceBadgeText("DEMO")).toBe("Data Contoh - Bukan dari TikTok Shop");
    expect(getSourceBadgeText("MANUAL")).toBe("Data Tersimpan - Input user");
    expect(getSourceBadgeText("CSV_IMPORT")).toBe("Data Marketplace - Dari file user");
    expect(getSourceBadgeText("REAL_API")).toBe("Data Partner - Data API resmi");
    expect(getSourceTrustText("DEMO")).toBe("Bukan dari TikTok Shop");
    expect(getSourceTrustText("MANUAL")).toBe("Input user");
    expect(getSourceTrustText("CSV_IMPORT")).toBe("Dari file user");
    expect(getSourceTrustText("REAL_API")).toBe("Data API resmi");
  });

  it("returns beginner recommendation labels", () => {
    expect(getRecommendationLabel("Promote")).toBe("Layak Promosi");
    expect(getRecommendationLabel("Test First")).toBe("Test Dulu");
    expect(getRecommendationLabel("Avoid")).toBe("Hindari");
  });

  it("shows beginner workflow fallback and empty-state guidance", () => {
    const contentFactoryHtml = renderToStaticMarkup(
      <AffiliateWorkflow
        activePage="content-factory"
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );
    const storyHtml = renderToStaticMarkup(
      <AffiliateWorkflow
        activePage="story-engine"
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );
    const multiVideoHtml = renderToStaticMarkup(
      <AffiliateWorkflow
        activePage="multi-video-engine"
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );
    const schedulerHtml = renderToStaticMarkup(
      <AffiliateWorkflow
        activePage="scheduler"
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );
    const aiAgentsHtml = renderToStaticMarkup(
      <AffiliateWorkflow
        activePage="ai-agents"
        tiktokConnected={false}
        promptEngineMode="TEMPLATE_MODE"
        initialProducts={sampleProducts}
        databaseConnected={false}
      />
    );

    expect(contentFactoryHtml).toContain("Template Siap Pakai");
    expect(contentFactoryHtml).toContain("Koneksi AI belum terhubung");
    expect(contentFactoryHtml).toContain("Belum ada konten. Pilih produk lalu buat script konten.");
    expect(contentFactoryHtml).toContain("Copy Hook");
    expect(contentFactoryHtml).toContain("Copy Script");
    expect(contentFactoryHtml).toContain("Copy Caption");
    expect(contentFactoryHtml).toContain("Copy Hashtag");
    expect(contentFactoryHtml).toContain("Copy Full Pack");
    expect(storyHtml).toContain("Story Engine");
    expect(multiVideoHtml).toContain("Multi Video Engine");
    expect(schedulerHtml).toContain("Belum ada rencana posting. Buat campaign 7 hari dari produk terbaik kamu.");
    expect(aiAgentsHtml).toContain("AI Agents Optimization");
  });
});

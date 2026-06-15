import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContentDraft } from "@/modules/database/content-service";
import { ContentDraftList } from "./content-draft-list";

describe("ContentDraftList", () => {
  it("renders empty state", () => {
    const html = renderToStaticMarkup(<ContentDraftList initialDrafts={[]} />);

    expect(html).toContain("Belum ada draft konten. Pilih produk di Produk Affiliate");
    expect(html).toContain("Buat Konten Sekarang");
  });

  it("renders draft card actions and copy outputs", () => {
    const html = renderToStaticMarkup(<ContentDraftList initialDrafts={[draft]} />);

    expect(html).toContain("Mini Mic");
    expect(html).toContain("Siap Posting");
    expect(html).toContain("Salin Caption");
    expect(html).toContain("Copy Hashtag");
    expect(html).toContain("Salin Semua");
    expect(html).toContain("Duplikat Draft");
    expect(html).toContain("Buat Campaign");
  });
});

const draft: ContentDraft = {
  id: "draft-1",
  productId: "product-1",
  product: {
    id: "product-1",
    productName: "Mini Mic",
    imageUrl: "",
    source: "MANUAL",
    score: 82,
    recommendation: "Promote",
    category: "Creator",
    price: 10,
    commissionRate: 15
  },
  contentMode: "Product Demo",
  targetAudience: "Affiliate Pemula",
  tone: "Natural",
  productInsight: "Insight",
  mainSellingPoint: "Selling point",
  targetAudienceMatch: "Audience match",
  hooks: ["Hook pertama"],
  selectedHook: "Hook pertama",
  script15s: "Script 15",
  script30s: "Script 30",
  scenePlan: ["Scene"],
  voiceOverDraft: "VO",
  caption: "Caption",
  captionShort: "Caption short",
  captionMedium: "Caption medium",
  captionStorytelling: "Caption story",
  hashtags: ["#affiliate"],
  cta: "CTA",
  ctaSoft: "CTA soft",
  ctaDirect: "CTA direct",
  ctaKeranjangKuning: "CTA keranjang",
  safeClaimChecklist: ["Safe"],
  editingNotes: ["Edit"],
  postingNotes: ["Post"],
  talkingPoints: ["Point"],
  notes: "",
  status: "READY",
  providerMode: "TEMPLATE",
  createdAt: "2026-06-15T00:00:00.000Z",
  updatedAt: "2026-06-15T00:00:00.000Z"
};

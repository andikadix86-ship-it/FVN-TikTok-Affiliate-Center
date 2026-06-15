import { describe, expect, it } from "vitest";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { buildTemplateContentPack } from "@/modules/prompt-engine/fallback";
import {
  buildContentPackCreateData,
  buildContentPackUpdateData,
  buildDuplicateContentPackData,
  contentPackToInput,
  contentStatusLabels,
  filterContentDrafts,
  getContentDraftFullText,
  type ContentDraft
} from "./content-service";

describe("content pack save logic", () => {
  it("maps generated content pack to Prisma create data", () => {
    const pack = buildTemplateContentPack({ product: sampleProducts[0], mode: "TEMPLATE_MODE" });
    const input = contentPackToInput("product-1", pack, "TEMPLATE");
    const data = buildContentPackCreateData(input);

    expect(data.productId).toBe("product-1");
    expect(data.hooks).toHaveLength(10);
    expect(data.script15s).toContain("Opening hook");
    expect(data.providerMode).toBe("TEMPLATE");
    expect(data.status).toBe("DRAFT");
    expect(data.contentMode).toBe("Product Demo");
  });

  it("returns content status labels", () => {
    expect(contentStatusLabels.DRAFT).toBe("Draft");
    expect(contentStatusLabels.READY).toBe("Siap Posting");
    expect(contentStatusLabels.POSTED).toBe("Sudah Posting");
    expect(contentStatusLabels.ARCHIVED).toBe("Arsip");
  });

  it("filters content drafts by search and status", () => {
    const drafts = [buildDraft({ status: "READY", caption: "Caption keranjang kuning", hashtags: ["#rapi"] })];

    expect(filterContentDrafts(drafts, { query: "keranjang", status: "READY" })).toHaveLength(1);
    expect(filterContentDrafts(drafts, { query: "missing", status: "READY" })).toHaveLength(0);
    expect(filterContentDrafts(drafts, { query: "keranjang", status: "DRAFT" })).toHaveLength(0);
  });

  it("creates copy output for full draft reuse", () => {
    const text = getContentDraftFullText(buildDraft());

    expect(text).toContain("Produk:");
    expect(text).toContain("Hook:");
    expect(text).toContain("Hashtags:");
  });

  it("duplicates draft as DRAFT without changing product relation", () => {
    const data = buildDuplicateContentPackData(buildDraft({ status: "POSTED", notes: "Original note" }));

    expect(data.productId).toBe("product-1");
    expect(data.status).toBe("DRAFT");
    expect(data.notes).toContain("Copy of");
  });

  it("builds archive update without deleting product relation", () => {
    const data = buildContentPackUpdateData({ status: "ARCHIVED" });

    expect(data.status).toBe("ARCHIVED");
    expect("productId" in data).toBe(false);
  });
});

function buildDraft(overrides: Partial<ContentDraft> = {}): ContentDraft {
  return {
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
    status: "DRAFT",
    providerMode: "TEMPLATE",
    createdAt: "2026-06-15T00:00:00.000Z",
    updatedAt: "2026-06-15T00:00:00.000Z",
    ...overrides
  };
}

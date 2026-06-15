import { describe, expect, it } from "vitest";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { buildTemplateContentPack, getPromptEngineMode } from "./fallback";

describe("prompt fallback mode", () => {
  it("uses template mode when AI provider keys are missing", () => {
    expect(getPromptEngineMode(false, false)).toBe("TEMPLATE_MODE");
    expect(getPromptEngineMode(true, false)).toBe("AI_CONNECTED");
    expect(getPromptEngineMode(false, true)).toBe("AI_CONNECTED");
  });

  it("generates a full local template content pack", () => {
    const pack = buildTemplateContentPack({ product: sampleProducts[0], mode: "TEMPLATE_MODE" });

    expect(pack.hooks).toHaveLength(10);
    expect(pack.productInsight).toContain(sampleProducts[0].productName);
    expect(pack.mainSellingPoint).toBeTruthy();
    expect(pack.targetAudienceMatch).toContain("Affiliate Pemula");
    expect(pack.script15Variations).toHaveLength(3);
    expect(pack.script30Variations).toHaveLength(3);
    expect(pack.script15).toContain("Opening hook");
    expect(pack.script15).toContain("Problem");
    expect(pack.script15).toContain("Product demo");
    expect(pack.script15).toContain("Benefit");
    expect(pack.script15).toContain("CTA");
    expect(pack.script30).toContain("keranjang kuning");
    expect(pack.scenePlan.length).toBeGreaterThan(0);
    expect(pack.voiceOverDraft).toContain(sampleProducts[0].productName);
    expect(pack.captionShort).toContain(sampleProducts[0].productName);
    expect(pack.captionMedium).toContain("Affiliate Pemula");
    expect(pack.captionStorytelling).toContain(sampleProducts[0].productName);
    expect(pack.hashtags).toContain("#KeranjangKuning");
    expect(pack.ctaSoft).toContain("simpan");
    expect(pack.ctaDirect).toContain("review");
    expect(pack.ctaKeranjangKuning).toContain("keranjang kuning");
    expect(pack.safeClaimChecklist.length).toBeGreaterThan(0);
    expect(pack.compliance?.status).toBe("Safe");
    expect(pack.editingNotes?.length).toBeGreaterThan(0);
    expect(pack.postingNotes?.length).toBeGreaterThan(0);
  });
});

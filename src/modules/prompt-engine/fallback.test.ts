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

    expect(pack.hooks).toHaveLength(5);
    expect(pack.script15).toContain("0-3s");
    expect(pack.script30).toContain("TikTok Shop");
    expect(pack.scenePlan.length).toBeGreaterThan(0);
    expect(pack.caption).toContain(sampleProducts[0].productName);
    expect(pack.hashtags).toContain("#KeranjangKuning");
    expect(pack.cta).toContain("keranjang kuning");
    expect(pack.safeClaimChecklist.length).toBeGreaterThan(0);
  });
});

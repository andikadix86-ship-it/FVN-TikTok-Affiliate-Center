import { describe, expect, it } from "vitest";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { buildCampaignPlan } from "./campaign-generator.prompt";
import { checkCompliance } from "./compliance-check.prompt";
import { buildHooks } from "./hook-generator.prompt";
import { buildImprovementSuggestions } from "./improvement-suggestion.prompt";
import { buildTemplateContentPack } from "./template-mode";
import { generateContentPackWithProvider, resolvePromptProvider } from "./provider";
import { buildScript15 } from "./script-generator.prompt";

const input = {
  product: sampleProducts[0],
  mode: "TEMPLATE_MODE" as const,
  options: {
    contentMode: "Problem Solution" as const,
    targetAudience: "Ibu Rumah Tangga" as const,
    tone: "Santai" as const,
    duration: "15s" as const,
    outputLanguage: "Bahasa Indonesia" as const
  }
};

describe("upgraded affiliate prompt engine", () => {
  it("resolves providers and falls back safely to template mode", async () => {
    expect(resolvePromptProvider({})).toBe("TEMPLATE");
    expect(resolvePromptProvider({ geminiApiKey: "gemini" })).toBe("GEMINI");
    expect(resolvePromptProvider({ openAiApiKey: "openai" })).toBe("OPENAI");

    const pack = await generateContentPackWithProvider(input, "GEMINI");
    expect(pack.providerMode).toBe("TEMPLATE");
    expect(pack.providerWarning).toContain("Fallback ke Template Mode");
    expect(pack.hooks).toHaveLength(10);
  });

  it("generates first-three-second hooks with relatable short video patterns", () => {
    const hooks = buildHooks(input);

    expect(hooks).toHaveLength(10);
    expect(hooks.join(" ")).toContain("coba lihat ini");
    expect(hooks.join(" ")).toContain("Aku kira");
    expect(hooks.join(" ")).toContain("sebelum");
  });

  it("builds scripts with the required beginner recording structure", () => {
    const script = buildScript15(input);

    expect(script).toContain("Opening hook");
    expect(script).toContain("Problem");
    expect(script).toContain("Product demo");
    expect(script).toContain("Benefit");
    expect(script).toContain("Social proof style line");
    expect(script).toContain("CTA");
  });

  it("generates a content production prompt package for image and video AI tools", () => {
    const pack = buildTemplateContentPack(input);

    expect(pack.contentTitle).toContain(sampleProducts[0].productName);
    expect(pack.productBrief?.platform).toBe("Short Video");
    expect(pack.script60).toContain("Opening hook");
    expect(pack.structuredScenePlan?.[0].cameraAngle).toBeTruthy();
    expect(pack.nanoBananaPrompts?.productHeroImagePrompt.prompt).toContain("vertical 9:16");
    expect(pack.nanoBananaPrompts?.imageEditingPrompt.referenceImageInstruction).toContain("keep product identity");
    expect(pack.veo3Prompts?.masterVideoPrompt.prompt).toContain("Aspect ratio: 9:16");
    expect(pack.veo3Prompts?.openingHookShotPrompt.cameraMovement).toContain("push");
    expect(pack.complianceChecklist?.userApprovalRequiredBeforePosting).toBe(true);
  });

  it("generates storyboard scenes and animatic preview metadata", () => {
    const pack = buildTemplateContentPack(input);

    expect(pack.storyboard?.aspectRatio).toBe("9:16");
    expect(pack.storyboard?.scenes.length).toBeGreaterThan(0);
    expect(pack.storyboard?.scenes[0].nanoBananaImagePrompt).toContain("Subject:");
    expect(pack.storyboard?.scenes[0].veo3ScenePrompt).toContain("Camera movement:");
    expect(pack.previewVideoMeta?.label).toContain("Preview");
    expect(pack.previewVideoMeta?.scenes[0].subtitleText).toBeTruthy();
  });

  it("detects risky or revision-needed compliance issues", () => {
    const result = checkCompliance("Produk ini dijamin menyembuhkan penyakit dan stok tinggal hari ini.");

    expect(result.status).toBe("Risky");
    expect(result.findings).toContain("health/medical claims");
    expect(result.findings).toContain("fake urgency or stock scarcity");
    expect(result.saferRewriteSuggestions.length).toBeGreaterThan(0);
  });

  it("generates varied 7-day and 14-day campaign plans", () => {
    const seven = buildCampaignPlan(input, 7, "testing product");
    const fourteen = buildCampaignPlan(input, 14, "orders");

    expect(seven).toHaveLength(7);
    expect(fourteen).toHaveLength(14);
    expect(new Set(seven.map((day) => day.contentMode)).size).toBeGreaterThan(5);
    expect(new Set(fourteen.map((day) => day.angle)).size).toBeGreaterThan(10);
    expect(fourteen[0].hashtagGroup.length).toBeGreaterThan(0);
  });

  it("returns performance-based improvement suggestions", () => {
    const suggestions = buildImprovementSuggestions(
      Array.from({ length: 5 }, () => ({
        views: 100,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 1,
        orders: 0,
        revenue: 0
      }))
    );

    expect(suggestions.join(" ")).toContain("Low views");
    expect(suggestions.join(" ")).toContain("Low clicks");
    expect(suggestions.join(" ")).toContain("Low orders");
    expect(suggestions.join(" ")).toContain("Low engagement");
  });
});

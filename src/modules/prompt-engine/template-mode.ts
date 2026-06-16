import { buildCaption, buildCaptionMedium, buildCaptionShort, buildCaptionStorytelling } from "./caption-generator.prompt";
import { checkCompliance, buildSafeClaimChecklist } from "./compliance-check.prompt";
import { buildCta, buildCtaDirect, buildCtaKeranjangKuning, buildCtaSoft } from "./cta-generator.prompt";
import { buildHashtags } from "./hashtag-generator.prompt";
import { buildHooks } from "./hook-generator.prompt";
import { buildNanoBananaPromptSet } from "./nano-banana.prompt";
import { buildMainSellingPoint, buildProductInsight, buildProductTalkingPoints, buildTargetAudienceMatch } from "./product-analysis.prompt";
import { buildEditingNotes, buildPostingNotes, buildScenePlan } from "./scene-plan.prompt";
import { buildScript15, buildScript15Variations, buildScript30, buildScript30Variations, buildScript60, buildVoiceOverDraft } from "./script-generator.prompt";
import { ContentPack, defaultPromptOptions, PromptInput } from "./types";
import { buildStructuredScenePlan, buildVeo3PromptSet } from "./veo3-video.prompt";

function resolveVideoStyle(contentMode: string) {
  if (contentMode.includes("Comparison")) return "comparison" as const;
  if (contentMode.includes("Unboxing")) return "unboxing" as const;
  if (contentMode.includes("Educational")) return "educational" as const;
  if (contentMode.includes("Story")) return "storytelling" as const;
  if (contentMode.includes("Testimonial")) return "testimonial" as const;
  if (contentMode.includes("Problem")) return "problem-solution" as const;
  if (contentMode.includes("Demo")) return "product demo" as const;
  return "UGC" as const;
}

export function buildTemplateContentPack(input: PromptInput): ContentPack {
  const promptInput: PromptInput = {
    ...input,
    options: input.options ?? defaultPromptOptions
  };
  const script15Variations = buildScript15Variations(promptInput);
  const script30Variations = buildScript30Variations(promptInput);
  const caption = buildCaption(promptInput);
  const compliance = checkCompliance([...script15Variations, ...script30Variations, caption].join(" "));
  const options = promptInput.options ?? defaultPromptOptions;
  const mainSellingPoint = buildMainSellingPoint(promptInput);
  const structuredScenePlan = buildStructuredScenePlan(promptInput);
  const productBrief = {
    productName: promptInput.product.productName,
    productCategory: promptInput.product.category,
    targetAudience: options.targetAudience,
    sellingPoint: mainSellingPoint,
    problemSolved: promptInput.product.problemSolved ?? "Problem harian yang bisa divisualkan dalam konten TikTok.",
    affiliateAngle: `${options.contentMode} untuk ${options.targetAudience}`,
    platform: "TikTok" as const,
    videoStyle: resolveVideoStyle(options.contentMode)
  };
  const complianceChecklist = {
    noFalseGuarantee: true,
    noMedicalHealthOverclaim: true,
    noMisleadingPriceOrDiscountClaim: true,
    noFakeTestimonial: true,
    noUnauthorizedBrandClaim: true,
    noSpammyAutoPostingLanguage: true,
    userApprovalRequiredBeforePosting: true,
    status: compliance.status,
    notes: buildSafeClaimChecklist()
  };

  return {
    contentTitle: `${promptInput.product.productName} - ${options.contentMode}`,
    productBrief,
    productInsight: buildProductInsight(promptInput),
    mainSellingPoint,
    targetAudienceMatch: buildTargetAudienceMatch(promptInput),
    hooks: buildHooks(promptInput),
    script15Variations,
    script30Variations,
    script15: buildScript15(promptInput),
    script30: buildScript30(promptInput),
    script60: buildScript60(promptInput),
    scenePlan: buildScenePlan(promptInput),
    structuredScenePlan,
    voiceOverDraft: buildVoiceOverDraft(promptInput),
    caption,
    captionShort: buildCaptionShort(promptInput),
    captionMedium: buildCaptionMedium(promptInput),
    captionStorytelling: buildCaptionStorytelling(promptInput),
    hashtags: buildHashtags(promptInput),
    cta: buildCta(),
    ctaSoft: buildCtaSoft(),
    ctaDirect: buildCtaDirect(),
    ctaKeranjangKuning: buildCtaKeranjangKuning(),
    safeClaimChecklist: buildSafeClaimChecklist(),
    nanoBananaPrompts: buildNanoBananaPromptSet(promptInput),
    veo3Prompts: buildVeo3PromptSet(promptInput, structuredScenePlan),
    complianceChecklist,
    compliance,
    editingNotes: buildEditingNotes(),
    postingNotes: buildPostingNotes(),
    talkingPoints: buildProductTalkingPoints(promptInput),
    providerMode: "TEMPLATE",
    options: promptInput.options
  };
}

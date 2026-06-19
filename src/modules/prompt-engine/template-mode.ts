import { buildCaption, buildCaptionMedium, buildCaptionShort, buildCaptionStorytelling } from "./caption-generator.prompt";
import { checkCompliance, buildSafeClaimChecklist } from "./compliance-check.prompt";
import { buildCta, buildCtaDirect, buildCtaKeranjangKuning, buildCtaSoft } from "./cta-generator.prompt";
import { buildHashtags } from "./hashtag-generator.prompt";
import { buildHooks } from "./hook-generator.prompt";
import { buildNanoBananaPromptSet } from "./nano-banana.prompt";
import { buildMainSellingPoint, buildProductInsight, buildProductTalkingPoints, buildTargetAudienceMatch } from "./product-analysis.prompt";
import { buildEditingNotes, buildPostingNotes, buildScenePlan } from "./scene-plan.prompt";
import { buildScript15, buildScript15Variations, buildScript30, buildScript30Variations, buildScript60, buildVoiceOverDraft } from "./script-generator.prompt";
import { buildPreviewVideoMeta, buildStoryboard } from "./storyboard.prompt";
import { ContentPack, defaultPromptOptions, PromptInput } from "./types";
import { buildStructuredScenePlan, buildVeo3PromptSet } from "./veo3-video.prompt";

const defaultSubtitleSettings = {
  fontFamily: "Sans" as const,
  fontSize: "medium" as const,
  fontWeight: "semi-bold" as const,
  textColor: "#ffffff",
  backgroundStyle: "translucent" as const,
  position: "bottom" as const,
  alignment: "center" as const
};

const defaultFontSettings = {
  subtitle: defaultSubtitleSettings,
  textOverlay: { ...defaultSubtitleSettings, position: "center" as const },
  hookText: { ...defaultSubtitleSettings, fontFamily: "Bold Headline" as const, fontSize: "large" as const, position: "top" as const },
  ctaText: { ...defaultSubtitleSettings, fontFamily: "Rounded" as const, position: "bottom" as const }
};

const defaultMusicSettings = {
  sourceType: "none" as const,
  volume: 60,
  muted: false,
  trimStart: 0,
  loop: true
};

const defaultVoiceOverSettings = {
  sourceType: "auto_placeholder" as const,
  provider: "placeholder" as const,
  selectedVoice: "Female Casual ID" as const,
  language: "id-ID" as const,
  style: "Casual Indonesia, natural affiliate UGC",
  speed: 1,
  sceneMode: "per_scene" as const
};

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
  const storyboard = buildStoryboard(promptInput, structuredScenePlan);
  const providerMode = input.mode === "AI_CONNECTED" ? "AI" : "TEMPLATE";
  const previewVideoMeta = buildPreviewVideoMeta(storyboard, providerMode);
  const productBrief = {
    productName: promptInput.product.productName,
    productCategory: promptInput.product.category,
    targetAudience: options.targetAudience,
    sellingPoint: mainSellingPoint,
    problemSolved: promptInput.product.problemSolved ?? "Problem harian yang bisa divisualkan dalam konten short video.",
    affiliateAngle: `${options.contentMode} untuk ${options.targetAudience}`,
    platform: "Short Video" as const,
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
    storyboard,
    uploadedMediaAssets: [],
    sceneMediaAssignments: [],
    subtitleSettings: defaultSubtitleSettings,
    fontSettings: defaultFontSettings,
    musicSettings: defaultMusicSettings,
    voiceOverSettings: defaultVoiceOverSettings,
    previewVideoMeta,
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
    providerMode,
    options: promptInput.options
  };
}

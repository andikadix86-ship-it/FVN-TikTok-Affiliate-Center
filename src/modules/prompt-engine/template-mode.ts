import { buildCaption, buildCaptionMedium, buildCaptionShort, buildCaptionStorytelling } from "./caption-generator.prompt";
import { checkCompliance, buildSafeClaimChecklist } from "./compliance-check.prompt";
import { buildCta, buildCtaDirect, buildCtaKeranjangKuning, buildCtaSoft } from "./cta-generator.prompt";
import { buildHashtags } from "./hashtag-generator.prompt";
import { buildHooks } from "./hook-generator.prompt";
import { buildMainSellingPoint, buildProductInsight, buildProductTalkingPoints, buildTargetAudienceMatch } from "./product-analysis.prompt";
import { buildEditingNotes, buildPostingNotes, buildScenePlan } from "./scene-plan.prompt";
import { buildScript15, buildScript15Variations, buildScript30, buildScript30Variations, buildVoiceOverDraft } from "./script-generator.prompt";
import { ContentPack, defaultPromptOptions, PromptInput } from "./types";

export function buildTemplateContentPack(input: PromptInput): ContentPack {
  const promptInput: PromptInput = {
    ...input,
    options: input.options ?? defaultPromptOptions
  };
  const script15Variations = buildScript15Variations(promptInput);
  const script30Variations = buildScript30Variations(promptInput);
  const caption = buildCaption(promptInput);
  const compliance = checkCompliance([...script15Variations, ...script30Variations, caption].join(" "));

  return {
    productInsight: buildProductInsight(promptInput),
    mainSellingPoint: buildMainSellingPoint(promptInput),
    targetAudienceMatch: buildTargetAudienceMatch(promptInput),
    hooks: buildHooks(promptInput),
    script15Variations,
    script30Variations,
    script15: buildScript15(promptInput),
    script30: buildScript30(promptInput),
    scenePlan: buildScenePlan(promptInput),
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
    compliance,
    editingNotes: buildEditingNotes(),
    postingNotes: buildPostingNotes(),
    talkingPoints: buildProductTalkingPoints(promptInput),
    providerMode: "TEMPLATE",
    options: promptInput.options
  };
}

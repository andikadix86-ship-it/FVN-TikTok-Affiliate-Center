import { buildCaption } from "./caption.prompt";
import { buildSafeClaimChecklist } from "./compliance.prompt";
import { buildCta } from "./cta.prompt";
import { buildHashtags } from "./hashtag.prompt";
import { buildHooks } from "./hook.prompt";
import { buildProductTalkingPoints } from "./product-research.prompt";
import { buildScenePlan, buildScript15, buildScript30 } from "./script.prompt";
import { ContentPack, PromptEngineMode, PromptInput } from "./types";

export function getPromptEngineMode(hasGeminiKey: boolean, hasOpenAiKey: boolean): PromptEngineMode {
  return hasGeminiKey || hasOpenAiKey ? "AI_CONNECTED" : "TEMPLATE_MODE";
}

export function buildTemplateContentPack(input: PromptInput): ContentPack {
  return {
    hooks: buildHooks(input),
    script15: buildScript15(input),
    script30: buildScript30(input),
    scenePlan: buildScenePlan(input),
    caption: buildCaption(input),
    hashtags: buildHashtags(input),
    cta: buildCta(),
    safeClaimChecklist: buildSafeClaimChecklist(),
    talkingPoints: buildProductTalkingPoints(input)
  };
}

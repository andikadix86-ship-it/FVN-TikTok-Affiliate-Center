import { buildTemplateContentPack } from "./template-mode";
import { ContentPack, PromptEngineMode, PromptInput } from "./types";

export function getPromptEngineMode(hasGeminiKey: boolean, hasOpenAiKey: boolean): PromptEngineMode {
  return hasGeminiKey || hasOpenAiKey ? "AI_CONNECTED" : "TEMPLATE_MODE";
}

export { buildTemplateContentPack };

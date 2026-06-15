import { ContentPack, PromptInput, PromptProvider } from "./types";
import { buildTemplateContentPack } from "./template-mode";

export function resolvePromptProvider({
  geminiApiKey,
  openAiApiKey
}: {
  geminiApiKey?: string;
  openAiApiKey?: string;
}): PromptProvider {
  if (geminiApiKey) {
    return "GEMINI";
  }

  if (openAiApiKey) {
    return "OPENAI";
  }

  return "TEMPLATE";
}

export async function generateContentPackWithProvider(
  input: PromptInput,
  provider: PromptProvider
): Promise<ContentPack> {
  try {
    if (provider === "TEMPLATE") {
      return buildTemplateContentPack(input);
    }

    // Provider slots are intentionally safe for MVP: when live API integration
    // is not implemented or fails, return the complete local template pack.
    return {
      ...buildTemplateContentPack(input),
      providerMode: "TEMPLATE",
      providerWarning: `${provider} provider slot belum aktif. Fallback ke Template Mode.`
    };
  } catch {
    return {
      ...buildTemplateContentPack(input),
      providerMode: "TEMPLATE",
      providerWarning: "AI provider gagal. Fallback ke Template Mode."
    };
  }
}

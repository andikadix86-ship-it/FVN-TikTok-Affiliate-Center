import { env } from "@/lib/env";

export type AiProvider = "gemini" | "openai";

export function getAvailableAiProviders() {
  return [
    { id: "gemini" satisfies AiProvider, label: "Gemini", configured: Boolean(env.GEMINI_API_KEY) },
    { id: "openai" satisfies AiProvider, label: "OpenAI", configured: Boolean(env.OPENAI_API_KEY) }
  ];
}

export function buildPromptRequest(provider: AiProvider, prompt: string) {
  return {
    provider,
    prompt,
    status: "ready_for_integration"
  };
}

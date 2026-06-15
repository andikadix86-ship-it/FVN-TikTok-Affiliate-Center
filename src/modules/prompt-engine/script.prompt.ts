import { buildHooks } from "./hook.prompt";
import { PromptInput } from "./types";

export function buildScript15(input: PromptInput) {
  const hook = buildHooks(input)[0];

  return `0-3s: ${hook} 3-8s: show the product solving one problem. 8-12s: show the result or comparison. 12-15s: invite viewers to check TikTok Shop / keranjang kuning.`;
}

export function buildScript30(input: PromptInput) {
  const hook = buildHooks(input)[1];

  return `0-3s: ${hook} 3-10s: show the problem. 10-20s: demo ${input.product.productName} with close-up shots. 20-26s: explain who it helps and one limitation. 26-30s: CTA to check details in TikTok Shop / keranjang kuning.`;
}

export function buildScenePlan(input: PromptInput) {
  return [
    "Show the problem in a clear before shot.",
    `Show ${input.product.productName} and one product detail.`,
    "Demo one realistic use case.",
    "Show result, comparison, or practical benefit.",
    "End on product page or keranjang kuning CTA."
  ];
}

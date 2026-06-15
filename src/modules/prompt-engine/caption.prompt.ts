import { PromptInput } from "./types";

export function buildCaption({ product }: PromptInput) {
  return `${product.productName} quick honest test. Check the product details, price, and reviews before buying.`;
}

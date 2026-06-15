import { PromptInput } from "./types";

export function buildProductTalkingPoints({ product }: PromptInput) {
  return [
    product.notes || `Explain what ${product.productName} does in one simple sentence.`,
    `Platform: ${product.platform}`,
    `Category: ${product.category}`,
    `Price to verify before posting: ${product.price}`,
    `Commission rate to verify before posting: ${product.commissionRate}%`,
    `Best beginner angle: one problem, one demo, one honest result.`
  ];
}

import { PromptInput } from "./types";

export function buildHooks({ product }: PromptInput) {
  return [
    `I tested ${product.productName} so you do not have to.`,
    `Before you buy a ${product.category.toLowerCase()} product, watch this.`,
    `This is the simplest way to solve one annoying ${product.category.toLowerCase()} problem.`,
    `Here is what changed after I tried ${product.productName}.`,
    `Is ${product.productName} worth checking in keranjang kuning?`
  ];
}

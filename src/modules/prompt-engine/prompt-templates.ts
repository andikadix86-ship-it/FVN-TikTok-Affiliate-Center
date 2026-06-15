import { AffiliateProduct } from "@/modules/affiliate/types";

export function buildTikTokPrompt(product: AffiliateProduct) {
  return `Create a 30-second TikTok affiliate video for ${product.productName}. Use these notes: "${product.notes}" Show the problem, a simple demo, one proof point, and a soft call to action for TikTok Shop / keranjang kuning. Tone: beginner-friendly, honest, and fast-paced.`;
}

import { AffiliateProduct } from "@/modules/affiliate/types";

export function buildTikTokPrompt(product: AffiliateProduct) {
  return `Create a 30-second TikTok affiliate video for ${product.name}. Open with: "${product.hook}" Show the problem, a simple demo, one proof point, and a soft call to action. Tone: beginner-friendly, honest, and fast-paced.`;
}

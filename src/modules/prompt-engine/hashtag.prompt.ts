import { PromptInput } from "./types";

export function buildHashtags({ product }: PromptInput) {
  return [
    "#TikTokShop",
    "#KeranjangKuning",
    "#AffiliateTikTok",
    `#${product.category.replace(/\s+/g, "")}`,
    "#ReviewProduk"
  ];
}

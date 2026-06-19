import { PromptInput } from "./types";

function tag(value: string) {
  return `#${value.replace(/[^a-zA-Z0-9]/g, "")}`;
}

export function buildHashtags({ product, options }: PromptInput) {
  const mode = options?.contentMode ?? "Product Demo";
  const audience = options?.targetAudience ?? "Affiliate Pemula";

  return [
    "#SocialCommerce",
    "#KeranjangKuning",
    "#AffiliateContent",
    "#ReviewProduk",
    tag(product.category),
    tag(mode),
    tag(audience),
    "#ProdukPilihan"
  ];
}

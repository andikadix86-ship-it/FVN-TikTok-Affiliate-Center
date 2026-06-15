import { PromptInput, defaultPromptOptions } from "./types";

export function buildProductInsight({ product, options = defaultPromptOptions }: PromptInput) {
  return `${product.productName} cocok untuk angle ${options.contentMode.toLowerCase()} karena problemnya mudah divisualkan, harga perlu dicek ulang, dan komisi ${product.commissionRate}% bisa jadi pertimbangan affiliate.`;
}

export function buildMainSellingPoint({ product, options = defaultPromptOptions }: PromptInput) {
  const category = product.category.toLowerCase();

  if (options.tone === "Hemat" || options.contentMode === "Budget Find") {
    return `Value utama: bantu kebutuhan ${category} tanpa terlihat terlalu mahal, dengan demo sederhana sebelum penonton klik keranjang.`;
  }

  if (options.targetAudience === "Ibu Rumah Tangga") {
    return `Value utama: membantu pekerjaan harian terasa lebih praktis dan rapi tanpa klaim berlebihan.`;
  }

  return `Value utama: solusi praktis untuk masalah ${category} yang bisa ditunjukkan lewat demo singkat.`;
}

export function buildTargetAudienceMatch({ product, options = defaultPromptOptions }: PromptInput) {
  return `${options.targetAudience} perlu melihat contoh pemakaian ${product.productName}, manfaat realistis, dan alasan kenapa produk ini relevan untuk rutinitas mereka.`;
}

export function buildProductTalkingPoints(input: PromptInput) {
  const { product, options = defaultPromptOptions } = input;

  return [
    buildProductInsight(input),
    buildMainSellingPoint(input),
    buildTargetAudienceMatch(input),
    `Harga yang ditampilkan: ${product.price}. Selalu cek ulang sebelum posting.`,
    `Komisi: ${product.commissionRate}%. Jangan jadikan ini klaim pendapatan.`,
    `Angle terbaik: ${options.contentMode} dengan tone ${options.tone}.`
  ];
}

import { PromptInput, defaultPromptOptions } from "./types";

export function buildCaptionShort({ product }: PromptInput) {
  return `${product.productName} versi demo singkat. Cek detail dan review dulu sebelum beli.`;
}

export function buildCaptionMedium({ product, options = defaultPromptOptions }: PromptInput) {
  return `Buat ${options.targetAudience}, ${product.productName} ini bisa jadi solusi praktis kalau problemnya mirip. Aku pakai angle ${options.contentMode.toLowerCase()} biar kelihatan fungsi aslinya.`;
}

export function buildCaptionStorytelling({ product, options = defaultPromptOptions }: PromptInput) {
  return `Awalnya aku kira produk seperti ${product.productName} cuma kelihatan menarik di video. Tapi setelah dibikin demo sederhana, fungsi utamanya lebih jelas: bantu kebutuhan ${product.category.toLowerCase()} tanpa harus banyak penjelasan. Tetap cek harga, review, dan detail produk sebelum checkout.`;
}

export function buildCaption(input: PromptInput) {
  const { options = defaultPromptOptions } = input;
  return options.contentMode === "Review Natural" ? buildCaptionStorytelling(input) : buildCaptionMedium(input);
}

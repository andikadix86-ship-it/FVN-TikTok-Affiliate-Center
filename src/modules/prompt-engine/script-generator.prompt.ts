import { buildHooks } from "./hook-generator.prompt";
import { buildMainSellingPoint } from "./product-analysis.prompt";
import { PromptInput, defaultPromptOptions } from "./types";

function scriptTemplate(input: PromptInput, hook: string, duration: "15s" | "30s", variation: number) {
  const { product, options = defaultPromptOptions } = input;
  const proofLine =
    variation === 1
      ? "Aku cek detailnya dulu karena tiap orang kebutuhannya beda."
      : variation === 2
        ? "Yang aku suka, fungsinya langsung kelihatan pas didemoin."
        : "Menurutku ini cocok buat yang punya problem serupa, bukan buat semua orang.";
  const benefit = buildMainSellingPoint(input);

  if (duration === "15s") {
    return [
      `Opening hook: ${hook}`,
      `Problem: Buat kamu yang sering ribet soal ${product.category.toLowerCase()}, ini problem kecil tapi ganggu.`,
      `Product demo: Tunjukkan ${product.productName} dipakai 1 langkah saja.`,
      `Benefit: ${benefit}`,
      `Social proof style line: ${proofLine}`,
      `CTA: Cek detail produk dan review di keranjang kuning sebelum checkout.`
    ].join(" ");
  }

  return [
    `Opening hook: ${hook}`,
    `Problem: Ceritakan situasi harian yang relate untuk ${options.targetAudience}.`,
    `Product demo: Close-up ${product.productName}, tunjukkan cara pakai, lalu tampilkan hasil realistis.`,
    `Benefit: ${benefit}`,
    `Social proof style line: ${proofLine}`,
    `CTA: Kalau problem kamu sama, cek detail, harga, dan review di keranjang kuning.`
  ].join(" ");
}

export function buildScript15Variations(input: PromptInput) {
  const hooks = buildHooks(input);
  return [scriptTemplate(input, hooks[0], "15s", 1), scriptTemplate(input, hooks[1], "15s", 2), scriptTemplate(input, hooks[2], "15s", 3)];
}

export function buildScript30Variations(input: PromptInput) {
  const hooks = buildHooks(input);
  return [scriptTemplate(input, hooks[3], "30s", 1), scriptTemplate(input, hooks[4], "30s", 2), scriptTemplate(input, hooks[5], "30s", 3)];
}

export function buildScript15(input: PromptInput) {
  return buildScript15Variations(input)[0];
}

export function buildScript30(input: PromptInput) {
  return buildScript30Variations(input)[0];
}

export function buildScript60(input: PromptInput) {
  const { product, options = defaultPromptOptions } = input;
  const hook = buildHooks(input)[2];
  const benefit = buildMainSellingPoint(input);

  return [
    `Opening hook: ${hook}`,
    `Problem: Jelaskan situasi harian yang sering dialami ${options.targetAudience} tanpa berlebihan.`,
    `Product demo: Tampilkan ${product.productName} dari dekat, lalu demo satu cara pakai utama yang mudah direkam.`,
    `Benefit: ${benefit}`,
    "Social proof style line: Aku tetap saranin cek detail, ukuran, dan review karena kebutuhan tiap orang beda.",
    "CTA: Kalau cocok dengan kebutuhan kamu, cek detailnya di keranjang kuning."
  ].join(" ");
}

export function buildVoiceOverDraft(input: PromptInput) {
  return `${buildHooks(input)[0]} Aku mau tunjukin ${input.product.productName} secara simpel. Ini problemnya, ini cara pakainya, dan ini hasil yang bisa kamu lihat. Kalau cocok dengan kebutuhan kamu, cek detailnya dulu di keranjang kuning.`;
}

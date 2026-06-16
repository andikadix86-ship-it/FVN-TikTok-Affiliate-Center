import { NanoBananaPrompt, NanoBananaPromptSet, PromptInput, defaultPromptOptions } from "./types";

function buildPrompt(input: PromptInput, variant: string, action: string, composition: string, textOverlayInstruction: string): NanoBananaPrompt {
  const { product, options = defaultPromptOptions } = input;
  const audience = options.targetAudience;
  const context = audience === "Ibu Rumah Tangga" ? "rumah Indonesia modern sederhana" : "konteks pasar Indonesia, ruangan bersih dan realistis";
  const subject = `${product.productName} sebagai produk affiliate TikTok`;
  const productDetail = `${product.category}, harga sekitar ${product.price}, tampilkan bentuk dan detail produk dengan jelas tanpa klaim berlebihan`;
  const prompt = [
    `${variant}: ${subject}.`,
    `Action: ${action}.`,
    `Location/context: ${context}.`,
    `Composition: ${composition}, vertical 9:16, ruang aman untuk teks overlay.`,
    `Style: realistic Indonesian TikTok affiliate visual, clean UGC product content, not overly polished.`,
    `Lighting: soft indoor light with clear product visibility.`,
    `Camera angle: close-up or medium shot focused on real product use.`,
    `Product detail: ${productDetail}.`,
    `Text overlay: ${textOverlayInstruction}.`,
    `If a reference image is uploaded, keep product shape, color, logo placement, packaging, and key details the same; only improve setting, lighting, composition, and clarity.`,
    "Avoid misleading before-after, fake discount, medical claims, or guaranteed result claims."
  ].join(" ");

  return {
    subject,
    action,
    locationContext: context,
    composition,
    style: "Realistic TikTok affiliate UGC for Indonesian market",
    lighting: "Soft indoor light, bright enough to inspect the product",
    cameraAngle: "Close-up / medium shot",
    productDetail,
    aspectRatio: "9:16",
    textOverlayInstruction,
    referenceImageInstruction: "If base image exists, keep product identity and details unchanged; edit only background, lighting, crop, and clarity.",
    prompt
  };
}

export function buildNanoBananaPromptSet(input: PromptInput): NanoBananaPromptSet {
  const productName = input.product.productName;

  return {
    productHeroImagePrompt: buildPrompt(
      input,
      "Product hero image",
      `show ${productName} clearly as the main subject`,
      "centered product hero, clean background, product fills 70% of frame",
      `Short text only: "${productName}" and one realistic benefit`
    ),
    lifestyleProductImagePrompt: buildPrompt(
      input,
      "Lifestyle product image",
      `show a natural daily-use moment with ${productName}`,
      "human hands may appear, faceless friendly composition, product used naturally",
      "Use simple Bahasa Indonesia benefit text, no exaggerated claim"
    ),
    thumbnailPrompt: buildPrompt(
      input,
      "TikTok thumbnail",
      `make ${productName} instantly noticeable in the first glance`,
      "high contrast subject, clear negative space for big text, product close-up",
      "Large readable hook text, max 6 Indonesian words"
    ),
    beforeAfterStyleVisualPrompt: buildPrompt(
      input,
      "Before-after style visual",
      `show the problem context and the improved setup after using ${productName}`,
      "split-screen layout, left side problem, right side improved but realistic result",
      "Label only 'Sebelum' and 'Sesudah', avoid guaranteed results"
    ),
    imageEditingPrompt: buildPrompt(
      input,
      "Image editing prompt",
      `enhance uploaded product image for TikTok affiliate content`,
      "keep product unchanged, improve background, crop, lighting, sharpness, and vertical framing",
      "Add optional small text overlay only if it does not cover product details"
    )
  };
}

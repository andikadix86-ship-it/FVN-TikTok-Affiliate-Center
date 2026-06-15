import { z } from "zod";
import { ContentPack } from "@/modules/prompt-engine/types";

export const contentPackInputSchema = z.object({
  productId: z.string().min(1),
  hooks: z.array(z.string()),
  script15: z.string(),
  script30: z.string(),
  scenePlan: z.array(z.string()),
  caption: z.string(),
  hashtags: z.array(z.string()),
  cta: z.string(),
  safeClaimChecklist: z.array(z.string()),
  providerMode: z.enum(["AI", "TEMPLATE"]).default("TEMPLATE")
});

export function buildContentPackCreateData(input: z.infer<typeof contentPackInputSchema>) {
  return {
    productId: input.productId,
    hooks: input.hooks,
    script15s: input.script15,
    script30s: input.script30,
    scenePlan: input.scenePlan,
    caption: input.caption,
    hashtags: input.hashtags,
    cta: input.cta,
    safeClaimChecklist: input.safeClaimChecklist,
    providerMode: input.providerMode
  };
}

export function contentPackToInput(productId: string, pack: ContentPack, providerMode: "AI" | "TEMPLATE") {
  return contentPackInputSchema.parse({
    productId,
    hooks: pack.hooks,
    script15: pack.script15,
    script30: pack.script30,
    scenePlan: pack.scenePlan,
    caption: pack.caption,
    hashtags: pack.hashtags,
    cta: pack.cta,
    safeClaimChecklist: pack.safeClaimChecklist,
    providerMode
  });
}

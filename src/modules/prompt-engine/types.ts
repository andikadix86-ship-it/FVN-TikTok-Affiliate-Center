import { AffiliateProduct } from "@/modules/affiliate/types";

export type PromptEngineMode = "AI_CONNECTED" | "TEMPLATE_MODE";

export type ContentPack = {
  hooks: string[];
  script15: string;
  script30: string;
  scenePlan: string[];
  caption: string;
  hashtags: string[];
  cta: string;
  safeClaimChecklist: string[];
  talkingPoints: string[];
};

export type PromptInput = {
  product: AffiliateProduct;
  mode: PromptEngineMode;
};

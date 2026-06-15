import { AffiliateProduct } from "@/modules/affiliate/types";

export type PromptEngineMode = "AI_CONNECTED" | "TEMPLATE_MODE";
export type PromptProvider = "GEMINI" | "OPENAI" | "TEMPLATE";

export type ContentMode =
  | "Product Demo"
  | "Problem Solution"
  | "Before After"
  | "Review Natural"
  | "Unboxing"
  | "Comparison"
  | "Tutorial"
  | "Daily Use"
  | "Budget Find"
  | "Viral Hook"
  | "Soft Selling"
  | "Hard Selling";

export type TargetAudience =
  | "Ibu Rumah Tangga"
  | "Affiliate Pemula"
  | "Affiliate Menengah"
  | "Kaum Rebahan"
  | "Mahasiswa"
  | "Pekerja Kantoran"
  | "UMKM"
  | "General TikTok Audience";

export type ToneOption =
  | "Natural"
  | "Santai"
  | "Persuasif"
  | "Edukatif"
  | "Emosional"
  | "Lucu Ringan"
  | "Urgent"
  | "Premium"
  | "Hemat"
  | "Islami Soft";

export type OutputLanguage = "Bahasa Indonesia";

export type PromptGenerationOptions = {
  contentMode: ContentMode;
  targetAudience: TargetAudience;
  tone: ToneOption;
  duration: "15s" | "30s";
  outputLanguage: OutputLanguage;
};

export type ComplianceStatus = "Safe" | "Needs Revision" | "Risky";

export type ComplianceResult = {
  status: ComplianceStatus;
  findings: string[];
  saferRewriteSuggestions: string[];
};

export type CampaignDayPlan = {
  day: number;
  contentMode: ContentMode;
  angle: string;
  hook: string;
  scriptIdea: string;
  caption: string;
  cta: string;
  hashtagGroup: string[];
  postingNote: string;
};

export type ContentPack = {
  productInsight?: string;
  mainSellingPoint?: string;
  targetAudienceMatch?: string;
  hooks: string[];
  script15Variations?: string[];
  script30Variations?: string[];
  script15: string;
  script30: string;
  scenePlan: string[];
  voiceOverDraft?: string;
  caption: string;
  captionShort?: string;
  captionMedium?: string;
  captionStorytelling?: string;
  hashtags: string[];
  cta: string;
  ctaSoft?: string;
  ctaDirect?: string;
  ctaKeranjangKuning?: string;
  safeClaimChecklist: string[];
  compliance?: ComplianceResult;
  editingNotes?: string[];
  postingNotes?: string[];
  talkingPoints: string[];
  providerMode?: "AI" | "TEMPLATE";
  providerWarning?: string;
  options?: PromptGenerationOptions;
};

export type PromptInput = {
  product: AffiliateProduct;
  mode: PromptEngineMode;
  options?: PromptGenerationOptions;
};

export const contentModes: ContentMode[] = [
  "Product Demo",
  "Problem Solution",
  "Before After",
  "Review Natural",
  "Unboxing",
  "Comparison",
  "Tutorial",
  "Daily Use",
  "Budget Find",
  "Viral Hook",
  "Soft Selling",
  "Hard Selling"
];

export const targetAudiences: TargetAudience[] = [
  "Ibu Rumah Tangga",
  "Affiliate Pemula",
  "Affiliate Menengah",
  "Kaum Rebahan",
  "Mahasiswa",
  "Pekerja Kantoran",
  "UMKM",
  "General TikTok Audience"
];

export const toneOptions: ToneOption[] = [
  "Natural",
  "Santai",
  "Persuasif",
  "Edukatif",
  "Emosional",
  "Lucu Ringan",
  "Urgent",
  "Premium",
  "Hemat",
  "Islami Soft"
];

export const defaultPromptOptions: PromptGenerationOptions = {
  contentMode: "Product Demo",
  targetAudience: "Affiliate Pemula",
  tone: "Natural",
  duration: "15s",
  outputLanguage: "Bahasa Indonesia"
};

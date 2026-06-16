import { AffiliateProduct } from "@/modules/affiliate/types";

export type PromptEngineMode = "AI_CONNECTED" | "TEMPLATE_MODE";
export type PromptProvider = "GEMINI" | "OPENAI" | "TEMPLATE";

export type ContentMode =
  | "UGC Natural"
  | "Product Demo"
  | "Problem Solution"
  | "Affiliate Story"
  | "Educational Review"
  | "Before After"
  | "Review Natural"
  | "Unboxing"
  | "Comparison"
  | "Testimonial Style"
  | "Family Safe"
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

export type VideoStyle =
  | "UGC"
  | "product demo"
  | "cinematic"
  | "educational"
  | "storytelling"
  | "comparison"
  | "testimonial"
  | "unboxing"
  | "problem-solution";

export type ProductBrief = {
  productName: string;
  productCategory: string;
  targetAudience: TargetAudience;
  sellingPoint: string;
  problemSolved: string;
  affiliateAngle: string;
  platform: "TikTok";
  videoStyle: VideoStyle;
};

export type ScenePlanItem = {
  sceneNumber: number;
  duration: string;
  visualAction: string;
  voiceOverLine: string;
  onScreenText: string;
  cameraAngle: string;
  cameraMovement: string;
  productPlacement: string;
  transitionSuggestion: string;
};

export type NanoBananaPrompt = {
  subject: string;
  action: string;
  locationContext: string;
  composition: string;
  style: string;
  lighting: string;
  cameraAngle: string;
  productDetail: string;
  aspectRatio: string;
  textOverlayInstruction: string;
  referenceImageInstruction: string;
  prompt: string;
};

export type NanoBananaPromptSet = {
  productHeroImagePrompt: NanoBananaPrompt;
  lifestyleProductImagePrompt: NanoBananaPrompt;
  thumbnailPrompt: NanoBananaPrompt;
  beforeAfterStyleVisualPrompt: NanoBananaPrompt;
  imageEditingPrompt: NanoBananaPrompt;
};

export type Veo3Prompt = {
  mainSubject: string;
  productAction: string;
  environmentLocation: string;
  sceneComposition: string;
  cameraAngle: string;
  cameraMovement: string;
  lensOpticalEffect: string;
  lighting: string;
  mood: string;
  motionDetail: string;
  audioDirection: string;
  subtitleOnScreenTextInstruction: string;
  duration: string;
  aspectRatio: "9:16";
  style: string;
  prompt: string;
};

export type Veo3PromptSet = {
  masterVideoPrompt: Veo3Prompt;
  shortScenePrompts: Veo3Prompt[];
  productDemoPrompt: Veo3Prompt;
  lifestyleUsagePrompt: Veo3Prompt;
  openingHookShotPrompt: Veo3Prompt;
  closingCtaShotPrompt: Veo3Prompt;
};

export type StoryboardItem = {
  sceneNumber: number;
  title: string;
  duration: string;
  objective: string;
  visualDescription: string;
  voiceOver: string;
  onScreenText: string;
  subtitleText: string;
  cameraAngle: string;
  cameraMovement: string;
  composition: string;
  lighting: string;
  mood: string;
  transition: string;
  productPlacement: string;
  nanoBananaImagePrompt: string;
  veo3ScenePrompt: string;
  previewImageUrl?: string;
  previewImagePlaceholder: string;
  notes: string;
};

export type StoryboardSet = {
  totalDuration: string;
  scenes: StoryboardItem[];
  style: ContentMode;
  aspectRatio: "9:16";
  generatedFromScript: string;
  generatedAt: string;
};

export type PreviewVideoMeta = {
  mode: "Animatic Preview" | "AI Video Preview";
  label: string;
  totalDuration: string;
  aspectRatio: "9:16";
  providerMode: "AI" | "TEMPLATE";
  scenes: Array<{
    sceneNumber: number;
    duration: string;
    subtitleText: string;
    previewImagePlaceholder: string;
    transition: string;
  }>;
};

export type PreviewVideoState = {
  mode: "Animatic Preview" | "AI Video Preview";
  currentScene: number;
  isPlaying: boolean;
  totalDuration: string;
  currentTime: number;
  scenes: StoryboardItem[];
};

export type ComplianceChecklist = {
  noFalseGuarantee: boolean;
  noMedicalHealthOverclaim: boolean;
  noMisleadingPriceOrDiscountClaim: boolean;
  noFakeTestimonial: boolean;
  noUnauthorizedBrandClaim: boolean;
  noSpammyAutoPostingLanguage: boolean;
  userApprovalRequiredBeforePosting: boolean;
  status: ComplianceStatus;
  notes: string[];
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
  contentTitle?: string;
  productBrief?: ProductBrief;
  productInsight?: string;
  mainSellingPoint?: string;
  targetAudienceMatch?: string;
  hooks: string[];
  script15Variations?: string[];
  script30Variations?: string[];
  script15: string;
  script30: string;
  script60?: string;
  scenePlan: string[];
  structuredScenePlan?: ScenePlanItem[];
  storyboard?: StoryboardSet;
  previewVideoMeta?: PreviewVideoMeta;
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
  nanoBananaPrompts?: NanoBananaPromptSet;
  veo3Prompts?: Veo3PromptSet;
  complianceChecklist?: ComplianceChecklist;
  compliance?: ComplianceResult;
  editingNotes?: string[];
  postingNotes?: string[];
  talkingPoints: string[];
  providerMode?: "AI" | "TEMPLATE";
  providerWarning?: string;
  options?: PromptGenerationOptions;
};

export type ContentProductionPackage = ContentPack;

export type ContentDraft = {
  productId: string;
  contentTitle: string;
  hook: string;
  script: string;
  scenePlan: ScenePlanItem[];
  storyboard: StoryboardSet;
  previewVideoMeta: PreviewVideoMeta;
  nanoBananaPrompts: NanoBananaPromptSet;
  veo3Prompts: Veo3PromptSet;
  caption: string;
  hashtags: string[];
  cta: string;
  complianceChecklist: ComplianceChecklist;
  status: "draft";
  createdAt: string;
  updatedAt: string;
};

export type PromptInput = {
  product: AffiliateProduct;
  mode: PromptEngineMode;
  options?: PromptGenerationOptions;
};

export const contentModes: ContentMode[] = [
  "UGC Natural",
  "Product Demo",
  "Problem Solution",
  "Affiliate Story",
  "Educational Review",
  "Before After",
  "Review Natural",
  "Unboxing",
  "Comparison",
  "Testimonial Style",
  "Family Safe",
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

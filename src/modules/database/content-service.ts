import { z } from "zod";
import { Prisma } from "@prisma/client";
import { ContentPack, contentModes, targetAudiences, toneOptions } from "@/modules/prompt-engine/types";
import { ProductSource } from "@/modules/affiliate/types";

export const contentStatuses = ["DRAFT", "READY", "POSTED", "ARCHIVED"] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export const contentStatusLabels: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  READY: "Siap Posting",
  POSTED: "Sudah Posting",
  ARCHIVED: "Arsip"
};

export const contentPackInputSchema = z.object({
  productId: z.string().min(1),
  contentMode: z.enum(contentModes as [string, ...string[]]).optional(),
  targetAudience: z.enum(targetAudiences as [string, ...string[]]).optional(),
  tone: z.enum(toneOptions as [string, ...string[]]).optional(),
  productInsight: z.string().optional(),
  mainSellingPoint: z.string().optional(),
  targetAudienceMatch: z.string().optional(),
  hooks: z.array(z.string()),
  selectedHook: z.string().optional(),
  script15: z.string(),
  script30: z.string(),
  scenePlan: z.array(z.string()),
  voiceOverDraft: z.string().optional(),
  caption: z.string(),
  captionShort: z.string().optional(),
  captionMedium: z.string().optional(),
  captionStorytelling: z.string().optional(),
  hashtags: z.array(z.string()),
  cta: z.string(),
  ctaSoft: z.string().optional(),
  ctaDirect: z.string().optional(),
  ctaKeranjangKuning: z.string().optional(),
  safeClaimChecklist: z.array(z.string()),
  editingNotes: z.array(z.string()).optional(),
  postingNotes: z.array(z.string()).optional(),
  talkingPoints: z.array(z.string()).optional(),
  notes: z.string().optional(),
  status: z.enum(contentStatuses).default("DRAFT"),
  providerMode: z.enum(["AI", "TEMPLATE"]).default("TEMPLATE")
});

export const contentPackUpdateSchema = z.object({
  selectedHook: z.string().optional(),
  script15s: z.string().optional(),
  script30s: z.string().optional(),
  caption: z.string().optional(),
  hashtags: z.union([z.array(z.string()), z.string()]).optional(),
  cta: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(contentStatuses).optional()
});

export type ContentPackInput = z.infer<typeof contentPackInputSchema>;
export type ContentPackUpdate = z.infer<typeof contentPackUpdateSchema>;

export type ContentDraftProduct = {
  id: string;
  productName: string;
  imageUrl: string;
  source: ProductSource;
  score: number;
  recommendation: string;
  category: string;
  price: number;
  commissionRate: number;
};

export type ContentDraft = {
  id: string;
  productId: string;
  product: ContentDraftProduct;
  contentMode: string;
  targetAudience: string;
  tone: string;
  productInsight: string;
  mainSellingPoint: string;
  targetAudienceMatch: string;
  hooks: string[];
  selectedHook: string;
  script15s: string;
  script30s: string;
  scenePlan: string[];
  voiceOverDraft: string;
  caption: string;
  captionShort: string;
  captionMedium: string;
  captionStorytelling: string;
  hashtags: string[];
  cta: string;
  ctaSoft: string;
  ctaDirect: string;
  ctaKeranjangKuning: string;
  safeClaimChecklist: string[];
  editingNotes: string[];
  postingNotes: string[];
  talkingPoints: string[];
  notes: string;
  status: ContentStatus;
  providerMode: "AI" | "TEMPLATE";
  createdAt: string;
  updatedAt: string;
};

export type ContentDraftFilters = {
  status?: ContentStatus | "ALL";
  source?: ProductSource | "ALL";
  contentMode?: string;
  targetAudience?: string;
  createdDate?: string;
  query?: string;
};

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  return [];
}

function decimalToNumber(value: unknown) {
  return Number(value ?? 0);
}

export function buildContentPackCreateData(input: ContentPackInput) {
  return {
    productId: input.productId,
    contentMode: input.contentMode,
    targetAudience: input.targetAudience,
    tone: input.tone,
    productInsight: input.productInsight,
    mainSellingPoint: input.mainSellingPoint,
    targetAudienceMatch: input.targetAudienceMatch,
    hooks: input.hooks as Prisma.InputJsonValue,
    selectedHook: input.selectedHook ?? input.hooks[0] ?? "",
    script15s: input.script15,
    script30s: input.script30,
    scenePlan: input.scenePlan as Prisma.InputJsonValue,
    voiceOverDraft: input.voiceOverDraft,
    caption: input.caption,
    captionShort: input.captionShort,
    captionMedium: input.captionMedium,
    captionStorytelling: input.captionStorytelling,
    hashtags: input.hashtags as Prisma.InputJsonValue,
    cta: input.cta,
    ctaSoft: input.ctaSoft,
    ctaDirect: input.ctaDirect,
    ctaKeranjangKuning: input.ctaKeranjangKuning,
    safeClaimChecklist: input.safeClaimChecklist as Prisma.InputJsonValue,
    editingNotes: input.editingNotes as Prisma.InputJsonValue | undefined,
    postingNotes: input.postingNotes as Prisma.InputJsonValue | undefined,
    talkingPoints: input.talkingPoints as Prisma.InputJsonValue | undefined,
    notes: input.notes,
    status: input.status,
    providerMode: input.providerMode
  };
}

export function contentPackToInput(productId: string, pack: ContentPack, providerMode: "AI" | "TEMPLATE") {
  return contentPackInputSchema.parse({
    productId,
    contentMode: pack.options?.contentMode,
    targetAudience: pack.options?.targetAudience,
    tone: pack.options?.tone,
    productInsight: pack.productInsight,
    mainSellingPoint: pack.mainSellingPoint,
    targetAudienceMatch: pack.targetAudienceMatch,
    hooks: pack.hooks,
    selectedHook: pack.hooks[0],
    script15: pack.script15,
    script30: pack.script30,
    scenePlan: pack.scenePlan,
    voiceOverDraft: pack.voiceOverDraft,
    caption: pack.caption,
    captionShort: pack.captionShort,
    captionMedium: pack.captionMedium,
    captionStorytelling: pack.captionStorytelling,
    hashtags: pack.hashtags,
    cta: pack.cta,
    ctaSoft: pack.ctaSoft,
    ctaDirect: pack.ctaDirect,
    ctaKeranjangKuning: pack.ctaKeranjangKuning,
    safeClaimChecklist: pack.safeClaimChecklist,
    editingNotes: pack.editingNotes,
    postingNotes: pack.postingNotes,
    talkingPoints: pack.talkingPoints,
    providerMode
  });
}

export function buildContentPackUpdateData(input: ContentPackUpdate) {
  const parsed = contentPackUpdateSchema.parse(input);
  const hashtags = typeof parsed.hashtags === "string"
    ? parsed.hashtags.split(/[,\s]+/).map((item) => item.trim()).filter(Boolean)
    : parsed.hashtags;

  return {
    selectedHook: parsed.selectedHook,
    script15s: parsed.script15s,
    script30s: parsed.script30s,
    caption: parsed.caption,
    hashtags: hashtags as Prisma.InputJsonValue | undefined,
    cta: parsed.cta,
    notes: parsed.notes,
    status: parsed.status
  };
}

export function buildDuplicateContentPackData(draft: ContentDraft) {
  return {
    productId: draft.productId,
    contentMode: draft.contentMode,
    targetAudience: draft.targetAudience,
    tone: draft.tone,
    productInsight: draft.productInsight,
    mainSellingPoint: draft.mainSellingPoint,
    targetAudienceMatch: draft.targetAudienceMatch,
    hooks: draft.hooks as Prisma.InputJsonValue,
    selectedHook: draft.selectedHook,
    script15s: draft.script15s,
    script30s: draft.script30s,
    scenePlan: draft.scenePlan as Prisma.InputJsonValue,
    voiceOverDraft: draft.voiceOverDraft,
    caption: draft.caption,
    captionShort: draft.captionShort,
    captionMedium: draft.captionMedium,
    captionStorytelling: draft.captionStorytelling,
    hashtags: draft.hashtags as Prisma.InputJsonValue,
    cta: draft.cta,
    ctaSoft: draft.ctaSoft,
    ctaDirect: draft.ctaDirect,
    ctaKeranjangKuning: draft.ctaKeranjangKuning,
    safeClaimChecklist: draft.safeClaimChecklist as Prisma.InputJsonValue,
    editingNotes: draft.editingNotes as Prisma.InputJsonValue,
    postingNotes: draft.postingNotes as Prisma.InputJsonValue,
    talkingPoints: draft.talkingPoints as Prisma.InputJsonValue,
    notes: draft.notes ? `Copy of ${draft.notes}` : "Copy of draft.",
    status: "DRAFT" as const,
    providerMode: draft.providerMode
  };
}

export function mapDbContentDraft(contentPack: {
  id: string;
  productId: string;
  product: {
    id: string;
    productName: string;
    imageUrl: string | null;
    source: ProductSource;
    score: number;
    recommendation: string;
    category: string;
    price: unknown;
    commissionRate: unknown;
  };
  contentMode: string | null;
  targetAudience: string | null;
  tone: string | null;
  productInsight: string | null;
  mainSellingPoint: string | null;
  targetAudienceMatch: string | null;
  hooks: unknown;
  selectedHook: string | null;
  script15s: string;
  script30s: string;
  scenePlan: unknown;
  voiceOverDraft: string | null;
  caption: string;
  captionShort: string | null;
  captionMedium: string | null;
  captionStorytelling: string | null;
  hashtags: unknown;
  cta: string;
  ctaSoft: string | null;
  ctaDirect: string | null;
  ctaKeranjangKuning: string | null;
  safeClaimChecklist: unknown;
  editingNotes: unknown;
  postingNotes: unknown;
  talkingPoints: unknown;
  notes: string | null;
  status: ContentStatus;
  providerMode: "AI" | "TEMPLATE";
  createdAt: Date;
  updatedAt: Date;
}): ContentDraft {
  const hooks = asStringArray(contentPack.hooks);

  return {
    id: contentPack.id,
    productId: contentPack.productId,
    product: {
      id: contentPack.product.id,
      productName: contentPack.product.productName,
      imageUrl: contentPack.product.imageUrl ?? "",
      source: contentPack.product.source,
      score: contentPack.product.score,
      recommendation: contentPack.product.recommendation,
      category: contentPack.product.category,
      price: decimalToNumber(contentPack.product.price),
      commissionRate: decimalToNumber(contentPack.product.commissionRate)
    },
    contentMode: contentPack.contentMode ?? "Product Demo",
    targetAudience: contentPack.targetAudience ?? "Affiliate Pemula",
    tone: contentPack.tone ?? "Natural",
    productInsight: contentPack.productInsight ?? "",
    mainSellingPoint: contentPack.mainSellingPoint ?? "",
    targetAudienceMatch: contentPack.targetAudienceMatch ?? "",
    hooks,
    selectedHook: contentPack.selectedHook ?? hooks[0] ?? "",
    script15s: contentPack.script15s,
    script30s: contentPack.script30s,
    scenePlan: asStringArray(contentPack.scenePlan),
    voiceOverDraft: contentPack.voiceOverDraft ?? "",
    caption: contentPack.caption,
    captionShort: contentPack.captionShort ?? "",
    captionMedium: contentPack.captionMedium ?? "",
    captionStorytelling: contentPack.captionStorytelling ?? "",
    hashtags: asStringArray(contentPack.hashtags),
    cta: contentPack.cta,
    ctaSoft: contentPack.ctaSoft ?? "",
    ctaDirect: contentPack.ctaDirect ?? "",
    ctaKeranjangKuning: contentPack.ctaKeranjangKuning ?? "",
    safeClaimChecklist: asStringArray(contentPack.safeClaimChecklist),
    editingNotes: asStringArray(contentPack.editingNotes),
    postingNotes: asStringArray(contentPack.postingNotes),
    talkingPoints: asStringArray(contentPack.talkingPoints),
    notes: contentPack.notes ?? "",
    status: contentPack.status,
    providerMode: contentPack.providerMode,
    createdAt: contentPack.createdAt.toISOString(),
    updatedAt: contentPack.updatedAt.toISOString()
  };
}

export function getContentDraftFullText(draft: ContentDraft) {
  return [
    `Produk: ${draft.product.productName}`,
    `Mode: ${draft.contentMode}`,
    `Audience: ${draft.targetAudience}`,
    `Tone: ${draft.tone}`,
    `Hook:\n${draft.hooks.join("\n")}`,
    `Script 15s:\n${draft.script15s}`,
    `Script 30s:\n${draft.script30s}`,
    `Scene plan:\n${draft.scenePlan.join("\n")}`,
    `Voice over:\n${draft.voiceOverDraft}`,
    `Caption:\n${draft.caption}`,
    `Hashtags:\n${draft.hashtags.join(" ")}`,
    `CTA:\n${draft.cta}`,
    `Checklist:\n${draft.safeClaimChecklist.join("\n")}`,
    `Notes:\n${draft.notes}`
  ].join("\n\n");
}

export function filterContentDrafts(drafts: ContentDraft[], filters: ContentDraftFilters) {
  const query = filters.query?.trim().toLowerCase();

  return drafts.filter((draft) => {
    if (filters.status && filters.status !== "ALL" && draft.status !== filters.status) return false;
    if (filters.source && filters.source !== "ALL" && draft.product.source !== filters.source) return false;
    if (filters.contentMode && filters.contentMode !== "ALL" && draft.contentMode !== filters.contentMode) return false;
    if (filters.targetAudience && filters.targetAudience !== "ALL" && draft.targetAudience !== filters.targetAudience) return false;
    if (filters.createdDate && !draft.createdAt.startsWith(filters.createdDate)) return false;

    if (!query) return true;

    const haystack = [
      draft.product.productName,
      draft.selectedHook,
      ...draft.hooks,
      draft.caption,
      ...draft.hashtags,
      draft.notes
    ].join(" ").toLowerCase();

    return haystack.includes(query);
  });
}

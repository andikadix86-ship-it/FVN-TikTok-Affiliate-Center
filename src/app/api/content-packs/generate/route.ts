import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbProduct } from "@/modules/database/product-service";
import { buildContentPackCreateData, contentPackInputSchema } from "@/modules/database/content-service";
import { buildTemplateContentPack } from "@/modules/prompt-engine/fallback";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await prisma.product.findUnique({
      where: { id: body.productId }
    });

    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
    }

    const pack =
      body.contentPack ??
      buildTemplateContentPack({
        product: mapDbProduct(product),
        mode: body.providerMode === "AI" ? "AI_CONNECTED" : "TEMPLATE_MODE"
      });
    const input = contentPackInputSchema.parse({
      productId: body.productId,
      contentTitle: pack.contentTitle,
      contentMode: body.contentMode ?? pack.options?.contentMode,
      targetAudience: body.targetAudience ?? pack.options?.targetAudience,
      tone: body.tone ?? pack.options?.tone,
      productBrief: pack.productBrief,
      productInsight: pack.productInsight,
      mainSellingPoint: pack.mainSellingPoint,
      targetAudienceMatch: pack.targetAudienceMatch,
      hooks: pack.hooks,
      selectedHook: pack.hooks[0],
      script15: pack.script15,
      script30: pack.script30,
      script60: pack.script60,
      scenePlan: pack.scenePlan,
      structuredScenePlan: pack.structuredScenePlan,
      storyboard: pack.storyboard,
      uploadedMediaAssets: pack.uploadedMediaAssets,
      sceneMediaAssignments: pack.sceneMediaAssignments,
      subtitleSettings: pack.subtitleSettings,
      fontSettings: pack.fontSettings,
      musicSettings: pack.musicSettings,
      voiceOverSettings: pack.voiceOverSettings,
      previewVideoMeta: pack.previewVideoMeta,
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
      complianceChecklist: pack.complianceChecklist,
      nanoBananaPrompts: pack.nanoBananaPrompts,
      veo3Prompts: pack.veo3Prompts,
      editingNotes: pack.editingNotes,
      postingNotes: pack.postingNotes,
      talkingPoints: pack.talkingPoints,
      notes: body.notes,
      status: "DRAFT",
      providerMode: body.providerMode ?? "TEMPLATE"
    });
    const contentPack = await prisma.contentPack.create({
      data: buildContentPackCreateData(input)
    });

    return NextResponse.json({ contentPack }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        message: "Konten belum bisa dibuat. Cek produk terpilih dan koneksi database."
      },
      { status: 400 }
    );
  }
}

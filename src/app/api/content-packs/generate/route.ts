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
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const pack =
      body.contentPack ??
      buildTemplateContentPack({
        product: mapDbProduct(product),
        mode: body.providerMode === "AI" ? "AI_CONNECTED" : "TEMPLATE_MODE"
      });
    const input = contentPackInputSchema.parse({
      productId: body.productId,
      contentMode: body.contentMode ?? pack.options?.contentMode,
      targetAudience: body.targetAudience ?? pack.options?.targetAudience,
      tone: body.tone ?? pack.options?.tone,
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
      notes: body.notes,
      status: "DRAFT",
      providerMode: body.providerMode ?? "TEMPLATE"
    });
    const contentPack = await prisma.contentPack.create({
      data: buildContentPackCreateData(input)
    });

    return NextResponse.json({ contentPack }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to generate content pack.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}

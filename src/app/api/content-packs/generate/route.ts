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
      hooks: pack.hooks,
      script15: pack.script15,
      script30: pack.script30,
      scenePlan: pack.scenePlan,
      caption: pack.caption,
      hashtags: pack.hashtags,
      cta: pack.cta,
      safeClaimChecklist: pack.safeClaimChecklist,
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

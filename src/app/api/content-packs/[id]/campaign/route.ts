import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbContentDraft } from "@/modules/database/content-service";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const contentPack = await prisma.contentPack.findUnique({
    where: { id: params.id },
    include: { product: true }
  });

  if (!contentPack) {
    return NextResponse.json({ message: "Content draft not found." }, { status: 404 });
  }

  const draft = mapDbContentDraft(contentPack);
  const dailyPlan = Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    contentMode: draft.contentMode,
    angle: index % 2 === 0 ? "Problem solution dari draft" : "Demo ulang dengan angle berbeda",
    hook: draft.selectedHook || draft.hooks[index % Math.max(draft.hooks.length, 1)] || "Mulai dari problem yang paling relate.",
    scriptIdea: index % 2 === 0 ? draft.script15s : draft.script30s,
    caption: draft.captionShort || draft.caption,
    cta: draft.ctaKeranjangKuning || draft.cta,
    hashtagGroup: draft.hashtags,
    postingNote: "Gunakan draft ini sebagai base, ubah opening agar tidak terasa repetitif."
  }));
  const campaign = await prisma.campaign.create({
    data: {
      productId: draft.productId,
      contentPackId: draft.id,
      name: `${draft.product.productName} - Campaign dari Draft Konten`,
      durationDays: 7,
      goal: "testing product",
      status: "DRAFT",
      dailyPlan
    }
  });

  return NextResponse.json({ campaign }, { status: 201 });
}

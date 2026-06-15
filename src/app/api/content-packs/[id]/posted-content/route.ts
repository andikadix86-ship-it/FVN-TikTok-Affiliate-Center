import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPostedContentCreateData, postedContentInputSchema } from "@/modules/posting/posted-content";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const contentPack = await prisma.contentPack.findUnique({
      where: { id: params.id },
      select: { id: true, productId: true }
    });

    if (!contentPack) {
      return NextResponse.json({ message: "Content draft not found." }, { status: 404 });
    }

    const input = postedContentInputSchema.parse({
      ...body,
      contentPackId: contentPack.id,
      productId: contentPack.productId
    });
    const postedContent = await prisma.postedContent.create({
      data: buildPostedContentCreateData(input)
    });
    await prisma.contentPack.update({
      where: { id: contentPack.id },
      data: { status: "POSTED" }
    });

    return NextResponse.json({ postedContent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Konten belum bisa ditandai sudah posting.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}

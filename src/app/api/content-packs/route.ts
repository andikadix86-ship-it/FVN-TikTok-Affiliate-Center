import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbContentDraft } from "@/modules/database/content-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const contentPacks = await prisma.contentPack.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true }
  });

  return NextResponse.json({ contentPacks: contentPacks.map(mapDbContentDraft) });
}

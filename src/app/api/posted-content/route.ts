import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const postedContent = await prisma.postedContent.findMany({
    orderBy: { postedAt: "desc" },
    include: {
      product: true,
      contentPack: true,
      campaign: true,
      tiktokAccount: true
    }
  });

  return NextResponse.json({ postedContent });
}

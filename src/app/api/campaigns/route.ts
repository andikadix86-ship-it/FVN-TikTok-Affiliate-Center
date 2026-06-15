import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildCampaignCreateData, campaignInputSchema } from "@/modules/database/campaign-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, performance: true }
  });

  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = campaignInputSchema.parse(body);
    const campaign = await prisma.campaign.create({
      data: buildCampaignCreateData(input)
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        message: "Campaign belum bisa dibuat. Cek produk, durasi, dan koneksi database."
      },
      { status: 400 }
    );
  }
}

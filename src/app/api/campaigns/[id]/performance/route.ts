import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildCampaignPerformanceUpsert,
  campaignPerformanceInputSchema
} from "@/modules/database/campaign-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const input = campaignPerformanceInputSchema.parse(body);
    const performance = await prisma.campaignPerformance.upsert(
      buildCampaignPerformanceUpsert(params.id, input)
    );

    return NextResponse.json({ performance }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        message: "Performa campaign belum bisa disimpan. Cek angka input dan koneksi database."
      },
      { status: 400 }
    );
  }
}

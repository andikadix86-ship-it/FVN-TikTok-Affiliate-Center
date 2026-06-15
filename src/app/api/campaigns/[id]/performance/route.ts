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
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to save campaign performance.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}

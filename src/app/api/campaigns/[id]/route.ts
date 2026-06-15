import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const campaign = await prisma.campaign.update({
    where: { id: params.id },
    data: {
      name: body.name,
      durationDays: body.durationDays,
      goal: body.goal,
      status: body.status,
      dailyPlan: body.dailyPlan
    }
  });

  return NextResponse.json({ campaign });
}

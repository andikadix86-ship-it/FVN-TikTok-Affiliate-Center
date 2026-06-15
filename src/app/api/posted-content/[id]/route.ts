import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildPostedPerformanceUpdateData } from "@/modules/posting/posted-content";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === "performance") {
      const performance = buildPostedPerformanceUpdateData(body.performance ?? body);
      const postedContent = await prisma.postedContent.update({
        where: { id: params.id },
        data: performance
      });

      return NextResponse.json({ postedContent });
    }

    if (action === "notes") {
      const postedContent = await prisma.postedContent.update({
        where: { id: params.id },
        data: { notes: typeof body.notes === "string" ? body.notes : "" }
      });

      return NextResponse.json({ postedContent });
    }

    if (action === "link_campaign") {
      const postedContent = await prisma.postedContent.update({
        where: { id: params.id },
        data: {
          campaignId: body.campaignId || null,
          campaignDayNumber: body.campaignDayNumber ? Number(body.campaignDayNumber) : null
        }
      });

      return NextResponse.json({ postedContent });
    }

    if (action === "archive") {
      const postedContent = await prisma.postedContent.update({
        where: { id: params.id },
        data: { archived: true }
      });

      return NextResponse.json({ postedContent });
    }

    return NextResponse.json({ message: "Aksi konten terposting tidak didukung." }, { status: 400 });
  } catch {
    return NextResponse.json(
      {
        message: "Konten terposting belum bisa diperbarui. Cek input dan koneksi database."
      },
      { status: 400 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const contentPack = await prisma.contentPack.findUnique({
    where: { id: params.id },
    include: { product: true }
  });

  if (!contentPack) {
    return NextResponse.json({ message: "Content pack not found." }, { status: 404 });
  }

  return NextResponse.json({ contentPack });
}

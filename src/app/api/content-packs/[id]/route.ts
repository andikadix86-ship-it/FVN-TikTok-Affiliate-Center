import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildContentPackUpdateData,
  buildDuplicateContentPackData,
  mapDbContentDraft
} from "@/modules/database/content-service";

export const dynamic = "force-dynamic";

async function findDraft(id: string) {
  const contentPack = await prisma.contentPack.findUnique({
    where: { id },
    include: { product: true }
  });

  return contentPack ? mapDbContentDraft(contentPack) : null;
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const contentPack = await findDraft(params.id);

  if (!contentPack) {
    return NextResponse.json({ message: "Draft konten tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ contentPack });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const contentPack = await prisma.contentPack.update({
      where: { id: params.id },
      data: buildContentPackUpdateData(body),
      include: { product: true }
    });

    return NextResponse.json({ contentPack: mapDbContentDraft(contentPack) });
  } catch {
    return NextResponse.json(
      {
        message: "Draft konten belum bisa diperbarui. Cek input dan koneksi database."
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({}));
  const action = body.action;
  const draft = await findDraft(params.id);

  if (!draft) {
    return NextResponse.json({ message: "Draft konten tidak ditemukan." }, { status: 404 });
  }

  if (action === "duplicate") {
    const duplicate = await prisma.contentPack.create({
      data: buildDuplicateContentPackData(draft),
      include: { product: true }
    });

    return NextResponse.json({ contentPack: mapDbContentDraft(duplicate) }, { status: 201 });
  }

  if (action === "archive") {
    const archived = await prisma.contentPack.update({
      where: { id: params.id },
      data: { status: "ARCHIVED" },
      include: { product: true }
    });

    return NextResponse.json({ contentPack: mapDbContentDraft(archived) });
  }

  return NextResponse.json({ message: "Aksi draft konten tidak didukung." }, { status: 400 });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.contentPack.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ deleted: true });
}

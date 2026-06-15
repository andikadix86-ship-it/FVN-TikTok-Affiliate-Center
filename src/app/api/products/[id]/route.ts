import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildProductCreateData, mapDbProduct } from "@/modules/database/product-service";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product: mapDbProduct(product) });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const existing = await prisma.product.findUnique({
      where: { id: params.id },
      select: { source: true }
    });

    if (!existing) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const data = buildProductCreateData(body, existing.source);
    const product = await prisma.product.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({ product: mapDbProduct(product) });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to update product.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.product.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ deleted: true });
}

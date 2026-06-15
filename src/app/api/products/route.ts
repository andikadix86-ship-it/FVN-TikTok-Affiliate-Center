import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { buildProductCreateData, mapDbProduct, sortProductsBySourcePriority } from "@/modules/database/product-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ source: "asc" }, { score: "desc" }, { createdAt: "desc" }]
    });

    return NextResponse.json({
      source: "database",
      products: sortProductsBySourcePriority(products.map(mapDbProduct))
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      products: sampleProducts,
      warning: "Database is not connected. Showing demo fallback products."
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: buildProductCreateData(body, "MANUAL")
    });

    return NextResponse.json({ product: mapDbProduct(product) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to create product.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");

  if (source !== "DEMO") {
    return NextResponse.json(
      {
        message: "Only source=DEMO can be cleared from this endpoint."
      },
      { status: 400 }
    );
  }

  try {
    const deleted = await prisma.product.deleteMany({
      where: { source: "DEMO" }
    });

    return NextResponse.json({ deleted: deleted.count });
  } catch {
    return NextResponse.json(
      {
        message: "Unable to clear demo data. Check database connection."
      },
      { status: 500 }
    );
  }
}

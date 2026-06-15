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
      warning: "Database belum terhubung. Menampilkan DEMO DATA sebagai fallback."
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
  } catch {
    return NextResponse.json(
      {
        message: "Produk belum bisa disimpan. Cek input produk dan koneksi database."
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
        message: "Endpoint ini hanya boleh menghapus source=DEMO."
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
        message: "DEMO DATA belum bisa dihapus. Cek koneksi database."
      },
      { status: 500 }
    );
  }
}

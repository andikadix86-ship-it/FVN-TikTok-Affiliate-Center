import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAndParseCsv } from "@/modules/affiliate/csv-import";
import { buildProductCreateData, mapDbProduct } from "@/modules/database/product-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const csv = typeof body.csv === "string" ? body.csv : "";
  const result = validateAndParseCsv(csv);

  if (result.errors.length > 0) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  try {
    const products = await prisma.$transaction(
      result.products.map((product) =>
        prisma.product.create({
          data: buildProductCreateData(product, "CSV_IMPORT")
        })
      )
    );

    return NextResponse.json({ products: products.map(mapDbProduct) }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        message: "CSV belum bisa diimpor. Cek format file dan koneksi database."
      },
      { status: 400 }
    );
  }
}

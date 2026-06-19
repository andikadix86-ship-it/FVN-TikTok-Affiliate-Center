import { SAMPLE_PRODUCT_CSV } from "@/modules/affiliate/csv-import";

export async function GET() {
  return new Response(SAMPLE_PRODUCT_CSV, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"affiliate-products-sample.csv\""
    }
  });
}

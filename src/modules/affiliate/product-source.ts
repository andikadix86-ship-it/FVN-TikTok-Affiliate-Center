import { AffiliateProduct, ProductSource } from "./types";
import { sampleProducts } from "./sample-products";

export const PRODUCT_SOURCE_PRIORITY: ProductSource[] = ["MANUAL", "CSV_IMPORT", "REAL_API", "DEMO"];

type ProductGroups = Partial<Record<ProductSource, AffiliateProduct[]>>;

export function selectProductsByPriority(groups: ProductGroups) {
  for (const source of PRODUCT_SOURCE_PRIORITY) {
    const products = groups[source] ?? [];

    if (products.length > 0) {
      return {
        source,
        products
      };
    }
  }

  return {
    source: "DEMO" as const,
    products: sampleProducts
  };
}

export function getProductHunterData() {
  return selectProductsByPriority({
    DEMO: sampleProducts
  });
}

export function getProductSourceLabel(source: ProductSource) {
  const labels: Record<ProductSource, string> = {
    DEMO: "DEMO",
    MANUAL: "MANUAL",
    CSV_IMPORT: "CSV IMPORT",
    REAL_API: "REAL API"
  };

  return labels[source];
}

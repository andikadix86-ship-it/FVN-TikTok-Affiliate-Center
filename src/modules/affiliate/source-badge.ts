import { ProductSource } from "./types";

export function getSourceBadgeText(source: ProductSource) {
  const labels: Record<ProductSource, string> = {
    DEMO: "Data Contoh - Bukan dari TikTok Shop",
    MANUAL: "Data Tersimpan - Input user",
    CSV_IMPORT: "Data Marketplace - Dari file user",
    REAL_API: "Data Partner - Data API resmi"
  };

  return labels[source];
}

export function getSourceTrustText(source: ProductSource) {
  const labels: Record<ProductSource, string> = {
    DEMO: "Bukan dari TikTok Shop",
    MANUAL: "Input user",
    CSV_IMPORT: "Dari file user",
    REAL_API: "Data API resmi"
  };

  return labels[source];
}

export function getSourceClassName(source: ProductSource) {
  const classes: Record<ProductSource, string> = {
    DEMO: "bg-orange-100 text-orange-800",
    MANUAL: "bg-teal-100 text-teal-800",
    CSV_IMPORT: "bg-yellow-100 text-yellow-900",
    REAL_API: "bg-emerald-100 text-emerald-800"
  };

  return classes[source];
}

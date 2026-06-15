import { ProductSource } from "./types";

export function getSourceBadgeText(source: ProductSource) {
  const labels: Record<ProductSource, string> = {
    DEMO: "DEMO DATA - Not from TikTok Shop",
    MANUAL: "MANUAL DATA",
    CSV_IMPORT: "CSV IMPORT",
    REAL_API: "REAL API DATA"
  };

  return labels[source];
}

export function getSourceTrustText(source: ProductSource) {
  const labels: Record<ProductSource, string> = {
    DEMO: "Not from TikTok Shop",
    MANUAL: "User Provided Data",
    CSV_IMPORT: "User Provided Data",
    REAL_API: "Real API Data"
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

import { AffiliateProduct } from "./types";

export const affiliateWorkflowContextKey = "fvn-affiliate-workflow-context";

export type AffiliateWorkflowContext = {
  product?: {
    id: string;
    productName: string;
    category: string;
    price: number;
    commissionRate: number;
    trendScore: number;
    source: string;
    imageUrl: string;
  };
  contentIdea?: {
    hook: string;
    angle: string;
    caption: string;
    cta: string;
  };
  story?: {
    mode: string;
    storyline: string;
    scenePlan: string[];
  };
  videoPlans?: Array<{
    title: string;
    hook: string;
    status: "Draft" | "Ready" | "Scheduled" | "Posted" | "Need Revision";
  }>;
  libraryItems?: Array<{ id: string; title: string; status: string }>;
  schedule?: Array<{ title: string; platform: string; time: string; status: string }>;
  analytics?: {
    views: number;
    clicks: number;
    orders: number;
    profit: number;
  };
  recommendation?: string;
  lastAction?: string;
  updatedAt: string;
};

export function productToWorkflowContext(product: AffiliateProduct, trendScore: number) {
  return {
    id: product.id,
    productName: product.productName,
    category: product.category,
    price: product.price,
    commissionRate: product.commissionRate,
    trendScore,
    source: product.source,
    imageUrl: product.imageUrl
  };
}

export function saveAffiliateWorkflowContext(context: AffiliateWorkflowContext) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(affiliateWorkflowContextKey, JSON.stringify(context));
}

export function saveProductWorkflowContext(product: AffiliateProduct, trendScore: number, lastAction: string) {
  saveAffiliateWorkflowContext({
    product: productToWorkflowContext(product, trendScore),
    lastAction,
    updatedAt: new Date().toISOString()
  });
}

import { describe, expect, it } from "vitest";
import { ActionPlanInput, generateActionPlan } from "./action-plan-engine";

const baseInput: ActionPlanInput = {
  products: [],
  drafts: [],
  postedContent: [],
  campaigns: [],
  tiktokConnected: true,
  aiProviderConnected: false,
  postedToday: 0
};

function highProduct() {
  return {
    id: "product-1",
    productName: "Mini Mic",
    source: "MANUAL" as const,
    score: 86,
    recommendation: "Promote"
  };
}

describe("action plan engine", () => {
  it("recommends creating content for high score product without content", () => {
    const plan = generateActionPlan({ ...baseInput, products: [highProduct()] });

    expect(plan.actions[0].actionType).toBe("CREATE_CONTENT");
    expect(plan.actions[0].priority).toBe("High");
    expect(plan.actions[0].title).toBe("Buat konten untuk produk ini");
  });

  it("recommends posting ready draft", () => {
    const plan = generateActionPlan({
      ...baseInput,
      products: [highProduct()],
      drafts: [{ id: "draft-1", productId: "product-1", productName: "Mini Mic", status: "READY", hook: "Hook" }]
    });

    expect(plan.actions.some((action) => action.actionType === "POST_READY_DRAFT" && action.priority === "High")).toBe(true);
  });

  it("recommends improving CTA for high views low clicks", () => {
    const plan = generateActionPlan({
      ...baseInput,
      products: [highProduct()],
      postedContent: [{
        id: "posted-1",
        productId: "product-1",
        productName: "Mini Mic",
        productSource: "MANUAL",
        productScore: 86,
        productRecommendation: "Promote",
        contentHook: "Hook",
        postedAt: "2026-06-15",
        views: 1200,
        likes: 10,
        comments: 1,
        shares: 1,
        saves: 0,
        clicks: 5,
        orders: 0,
        revenue: 0
      }]
    });

    expect(plan.actions.some((action) => action.title === "Perbaiki CTA dan manfaat produk")).toBe(true);
  });

  it("recommends stronger demo for high clicks low orders", () => {
    const plan = generateActionPlan({
      ...baseInput,
      products: [highProduct()],
      postedContent: [{
        id: "posted-1",
        productId: "product-1",
        productName: "Mini Mic",
        productSource: "MANUAL",
        productScore: 86,
        productRecommendation: "Promote",
        contentHook: "Hook",
        postedAt: "2026-06-15",
        views: 900,
        likes: 10,
        comments: 1,
        shares: 1,
        saves: 0,
        clicks: 25,
        orders: 0,
        revenue: 0
      }]
    });

    expect(plan.actions.some((action) => action.title === "Perkuat demo, trust, dan alasan beli")).toBe(true);
  });

  it("recommends pausing poor 5-day campaign", () => {
    const plan = generateActionPlan({
      ...baseInput,
      products: [highProduct()],
      campaigns: [{
        id: "campaign-1",
        productId: "product-1",
        productName: "Mini Mic",
        name: "Campaign Mic",
        status: "ACTIVE",
        durationDays: 7,
        performance: [1, 2, 3, 4, 5].map((dayNumber) => ({ dayNumber, views: 200, clicks: 1, orders: 0, revenue: 0 }))
      }]
    });

    expect(plan.actions.some((action) => action.actionType === "PAUSE_CAMPAIGN" && action.priority === "High")).toBe(true);
  });

  it("recommends continuing good revenue product", () => {
    const plan = generateActionPlan({
      ...baseInput,
      products: [highProduct()],
      postedContent: [{
        id: "posted-1",
        productId: "product-1",
        productName: "Mini Mic",
        productSource: "MANUAL",
        productScore: 86,
        productRecommendation: "Promote",
        contentHook: "Hook",
        postedAt: "2026-06-15",
        views: 500,
        likes: 10,
        comments: 1,
        shares: 1,
        saves: 0,
        clicks: 30,
        orders: 4,
        revenue: 200000
      }]
    });

    expect(plan.actions.some((action) => action.actionType === "PROMOTE_PRODUCT")).toBe(true);
  });

  it("returns demo-only recommendation and medium priority", () => {
    const plan = generateActionPlan({
      ...baseInput,
      products: [{ ...highProduct(), source: "DEMO" }]
    });

    expect(plan.emptyState).toBe("DEMO_ONLY");
    expect(plan.actions.some((action) => action.title === "Tambahkan produk manual atau import CSV dulu" && action.priority === "Medium")).toBe(true);
  });

  it("returns empty state when no products exist", () => {
    const plan = generateActionPlan(baseInput);

    expect(plan.emptyState).toBe("NO_PRODUCTS");
    expect(plan.actions[0].buttonLabel).toBe("Tambah Produk");
  });

  it("generates CEO summary safely", () => {
    const plan = generateActionPlan({ ...baseInput, products: [highProduct()] });

    expect(plan.summary.providerMode).toBe("TEMPLATE_MODE");
    expect(plan.summary.mainFocus).toContain("Hari ini fokus");
    expect(plan.summary.avoidToday).toContain("Jangan klaim pasti laku");
    expect(plan.summary.recommendedActions.length).toBeGreaterThan(0);
  });
});

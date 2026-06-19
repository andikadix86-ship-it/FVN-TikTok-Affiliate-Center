import { AnalyticsContentItem, aggregateByProduct, calculateAnalyticsSummary } from "@/modules/analytics/analytics";
import { ProductSource } from "@/modules/affiliate/types";

export type ActionPriority = "High" | "Medium" | "Low";

export type ActionType =
  | "PROMOTE_PRODUCT"
  | "CREATE_CONTENT"
  | "POST_READY_DRAFT"
  | "IMPROVE_CONTENT"
  | "CONTINUE_CAMPAIGN"
  | "PAUSE_CAMPAIGN"
  | "TEST_PRODUCT"
  | "STOP_PRODUCT";

export type ActionPlanProduct = {
  id: string;
  productName: string;
  source: ProductSource;
  score: number;
  recommendation: string;
};

export type ActionPlanDraft = {
  id: string;
  productId: string;
  productName: string;
  status: "DRAFT" | "READY" | "POSTED" | "ARCHIVED";
  hook: string;
};

export type ActionPlanCampaign = {
  id: string;
  productId: string;
  productName: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  durationDays: number;
  performance: Array<{
    dayNumber: number;
    views: number;
    clicks: number;
    orders: number;
    revenue: number;
  }>;
};

export type ActionPlanInput = {
  products: ActionPlanProduct[];
  drafts: ActionPlanDraft[];
  postedContent: AnalyticsContentItem[];
  campaigns: ActionPlanCampaign[];
  tiktokConnected: boolean;
  aiProviderConnected: boolean;
  postedToday: number;
};

export type DailyAction = {
  priority: ActionPriority;
  actionType: ActionType;
  title: string;
  reason: string;
  nextStep: string;
  href: string;
  buttonLabel: string;
  relatedProduct?: string;
  relatedContentDraft?: string;
  relatedCampaign?: string;
};

export type CeoSummary = {
  providerMode: "AI_CONNECTED" | "TEMPLATE_MODE";
  mainFocus: string;
  recommendedActions: string[];
  avoidToday: string;
  suggestedPostingTarget: string;
};

export type ActionPlanResult = {
  actions: DailyAction[];
  summary: CeoSummary;
  emptyState: "NO_PRODUCTS" | "DEMO_ONLY" | "READY";
};

function priorityRank(priority: ActionPriority) {
  return priority === "High" ? 0 : priority === "Medium" ? 1 : 2;
}

function hasContent(productId: string, drafts: ActionPlanDraft[]) {
  return drafts.some((draft) => draft.productId === productId && draft.status !== "ARCHIVED");
}

function addUnique(actions: DailyAction[], action: DailyAction) {
  const key = `${action.actionType}:${action.relatedProduct ?? ""}:${action.relatedContentDraft ?? ""}:${action.relatedCampaign ?? ""}`;

  if (!actions.some((item) => `${item.actionType}:${item.relatedProduct ?? ""}:${item.relatedContentDraft ?? ""}:${item.relatedCampaign ?? ""}` === key)) {
    actions.push(action);
  }
}

export function generateActionPlan(input: ActionPlanInput): ActionPlanResult {
  const actions: DailyAction[] = [];
  const products = [...input.products].sort((a, b) => b.score - a.score);
  const emptyState = products.length === 0 ? "NO_PRODUCTS" : products.every((product) => product.source === "DEMO") ? "DEMO_ONLY" : "READY";

  if (emptyState === "NO_PRODUCTS") {
    addUnique(actions, {
      priority: "High",
      actionType: "TEST_PRODUCT",
      title: "Tambahkan produk pertama kamu",
      reason: "Belum ada produk. Aplikasi perlu data produk sebelum bisa membuat rencana harian.",
      nextStep: "Tambah produk manual atau import CSV terlebih dahulu.",
      href: "/#product-hunter",
      buttonLabel: "Tambah Produk"
    });
  }

  if (emptyState === "DEMO_ONLY") {
    addUnique(actions, {
      priority: "Medium",
      actionType: "TEST_PRODUCT",
      title: "Tambahkan produk manual atau import CSV dulu",
      reason: "Saat ini masih memakai produk demo, jadi rekomendasi belum sesuai kondisi toko atau produk kamu.",
      nextStep: "Input minimal 1 produk manual atau import CSV agar analisa lebih relevan.",
      href: "/#product-hunter",
      buttonLabel: "Tambah Produk"
    });
  }

  if (!input.tiktokConnected) {
    addUnique(actions, {
      priority: "Low",
      actionType: "TEST_PRODUCT",
      title: "Koneksi akun platform jika dibutuhkan",
      reason: "Tracking akun akan lebih rapi jika akun terhubung, tetapi mode manual tetap bisa digunakan.",
      nextStep: "Hubungkan akun dari halaman Akun Platform saat sudah siap.",
      href: "/#tiktok-accounts",
      buttonLabel: "Akun Platform"
    });
  }

  products.forEach((product) => {
    const readyDraft = input.drafts.find((draft) => draft.productId === product.id && draft.status === "READY");

    if (product.score >= 80 && readyDraft) {
      addUnique(actions, {
        priority: input.postedToday === 0 ? "High" : "Medium",
        actionType: "POST_READY_DRAFT",
        title: "Posting draft ini hari ini",
        reason: `${product.productName} punya score tinggi dan draft sudah siap upload.`,
        nextStep: "Copy caption, hashtag, dan CTA lalu upload manual ke platform pilihan.",
        href: `/content-library/${readyDraft.id}`,
        buttonLabel: "Lihat Draft",
        relatedProduct: product.id,
        relatedContentDraft: readyDraft.id
      });
    }

    if (product.score >= 80 && !hasContent(product.id, input.drafts)) {
      addUnique(actions, {
        priority: "High",
        actionType: "CREATE_CONTENT",
        title: "Buat konten untuk produk ini",
        reason: `${product.productName} berpotensi karena score produk ${product.score}/100 dan belum punya draft konten.`,
        nextStep: "Buat hook, script 15 detik, caption, dan CTA keranjang kuning.",
        href: "/#content-factory",
        buttonLabel: "Buat Konten",
        relatedProduct: product.id
      });
    } else if (product.score >= 60 && product.score < 80 && !hasContent(product.id, input.drafts)) {
      addUnique(actions, {
        priority: "Medium",
        actionType: "TEST_PRODUCT",
        title: "Test produk ini dengan 1 konten sederhana",
        reason: `${product.productName} masih layak ditest, tetapi data masih terbatas.`,
        nextStep: "Buat satu konten product demo atau problem-solution.",
        href: "/#content-factory",
        buttonLabel: "Buat Konten",
        relatedProduct: product.id
      });
    }
  });

  aggregateByProduct(input.postedContent).forEach((product) => {
    if (product.views >= 1000 && product.ctr < 1) {
      addUnique(actions, {
        priority: "High",
        actionType: "IMPROVE_CONTENT",
        title: "Perbaiki CTA dan manfaat produk",
        reason: `${product.productName} punya views tinggi, tetapi clicks masih rendah.`,
        nextStep: "Buat CTA lebih jelas dan tampilkan manfaat produk sebelum ajakan klik.",
        href: "/analytics",
        buttonLabel: "Lihat Analisa",
        relatedProduct: product.productId
      });
    }

    if (product.clicks >= 20 && product.orders === 0) {
      addUnique(actions, {
        priority: "High",
        actionType: "IMPROVE_CONTENT",
        title: "Perkuat demo, trust, dan alasan beli",
        reason: `${product.productName} sudah menarik klik, tetapi belum menghasilkan order.`,
        nextStep: "Tambahkan demo yang lebih jelas, bukti pemakaian, dan alasan beli yang aman.",
        href: "/posted-content",
        buttonLabel: "Input Performa",
        relatedProduct: product.productId
      });
    }

    if (product.orders >= 3 || product.revenue > 0) {
      addUnique(actions, {
        priority: "Medium",
        actionType: "PROMOTE_PRODUCT",
        title: "Lanjutkan produk ini dengan variasi konten baru",
        reason: `${product.productName} sudah punya order atau revenue dari input manual.`,
        nextStep: "Buat variasi angle baru: review natural, tutorial, atau daily use.",
        href: "/#content-factory",
        buttonLabel: "Buat Konten",
        relatedProduct: product.productId
      });
    }

    if (product.views >= 800 && product.clicks < 4 && product.orders === 0) {
      addUnique(actions, {
        priority: "Medium",
        actionType: "STOP_PRODUCT",
        title: "Pertimbangkan hentikan produk ini sementara",
        reason: `${product.productName} sudah mendapat exposure, tetapi minat klik dan order masih lemah.`,
        nextStep: "Test satu angle terakhir. Jika tetap lemah, pindah ke produk lain.",
        href: "/analytics",
        buttonLabel: "Lihat Analisa",
        relatedProduct: product.productId
      });
    }
  });

  input.campaigns.forEach((campaign) => {
    const firstFiveDays = campaign.performance.filter((day) => day.dayNumber <= 5);
    const summary = calculateAnalyticsSummary(firstFiveDays.map((day) => ({
      views: day.views,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      clicks: day.clicks,
      orders: day.orders,
      revenue: day.revenue
    })));

    if (campaign.status === "ACTIVE" && firstFiveDays.length >= 5 && summary.orders === 0 && summary.ctr < 1) {
      addUnique(actions, {
        priority: "High",
        actionType: "PAUSE_CAMPAIGN",
        title: "Pause campaign atau ganti angle",
        reason: `${campaign.name} sudah punya 5 hari data, tetapi performanya masih rendah.`,
        nextStep: "Ganti hook 3 detik pertama, angle problem-solution, atau test produk lain.",
        href: "/#campaign-planner",
        buttonLabel: "Lihat Campaign",
        relatedProduct: campaign.productId,
        relatedCampaign: campaign.id
      });
    } else if (campaign.status === "ACTIVE") {
      addUnique(actions, {
        priority: "Low",
        actionType: "CONTINUE_CAMPAIGN",
        title: "Lanjutkan campaign yang sedang berjalan",
        reason: `${campaign.name} masih aktif dan perlu diisi performa manual secara rutin.`,
        nextStep: "Lanjutkan posting sesuai plan dan input views, clicks, orders, revenue.",
        href: "/#campaign-planner",
        buttonLabel: "Lihat Campaign",
        relatedProduct: campaign.productId,
        relatedCampaign: campaign.id
      });
    }
  });

  const sortedActions = actions.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority)).slice(0, 12);

  return {
    actions: sortedActions,
    emptyState,
    summary: buildCeoSummary(sortedActions, input)
  };
}

export function buildCeoSummary(actions: DailyAction[], input: ActionPlanInput): CeoSummary {
  const highCount = actions.filter((action) => action.priority === "High").length;
  const readyDrafts = actions.filter((action) => action.actionType === "POST_READY_DRAFT").length;
  const focusProduct = input.products
    .filter((product) => product.source !== "DEMO")
    .sort((a, b) => b.score - a.score)[0] ?? input.products.sort((a, b) => b.score - a.score)[0];

  return {
    providerMode: input.aiProviderConnected ? "AI_CONNECTED" : "TEMPLATE_MODE",
    mainFocus: actions.length === 0
      ? "Hari ini fokus mengumpulkan data produk dan performa manual."
      : `Hari ini fokus pada ${focusProduct ? `produk ${focusProduct.productName}` : "produk utama"}, ${readyDrafts > 0 ? "posting 1 draft siap upload" : "membuat 1 konten baru"}, dan menyelesaikan ${highCount || 1} aksi prioritas.`,
    recommendedActions: actions.slice(0, 3).map((action) => action.title),
    avoidToday: "Jangan klaim pasti laku, pasti viral, atau pasti closing. Pakai bahasa berpotensi dan layak ditest.",
    suggestedPostingTarget: readyDrafts > 0 ? "Upload manual minimal 1 draft siap posting hari ini." : "Buat minimal 1 draft konten baru sebelum posting."
  };
}

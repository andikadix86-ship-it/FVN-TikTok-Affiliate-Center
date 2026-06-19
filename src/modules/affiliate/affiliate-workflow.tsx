"use client";

import { ButtonHTMLAttributes, ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileUp,
  Link,
  Loader2,
  PackageSearch,
  Plus,
  Sparkles
} from "lucide-react";
import { MetricPill } from "@/components/metric-pill";
import { SectionCard } from "@/components/section-card";
import {
  calculatePerformanceSummary,
  CampaignDuration,
  CampaignGoal,
  CampaignPerformanceDay,
  CampaignStatus,
  emptyCampaignPerformanceDay,
  getImprovementSuggestions,
  isPoorCampaignPerformance
} from "@/modules/campaign/performance";
import { buildCampaignPlan } from "@/modules/prompt-engine/campaign.prompt";
import { buildTemplateContentPack } from "@/modules/prompt-engine/fallback";
import {
  ContentMode,
  contentModes,
  ContentPack,
  defaultPromptOptions,
  FontSettings,
  MusicSettings,
  PromptEngineMode,
  SceneMediaAssignment,
  StoryboardSet,
  SubtitleSettings,
  targetAudiences,
  TargetAudience,
  toneOptions,
  ToneOption,
  UploadedMediaAsset,
  VoiceOverSettings
} from "@/modules/prompt-engine/types";
import { getRecommendationLabel } from "@/modules/scoring/recommendation-label";
import { scoreProduct } from "@/modules/scoring/score-product";
import { SAMPLE_PRODUCT_CSV, validateAndParseCsv } from "./csv-import";
import { sampleProducts } from "./sample-products";
import { getSourceBadgeText, getSourceClassName, getSourceTrustText } from "./source-badge";
import { AffiliateProduct, CompetitionLevel, ProductSource } from "./types";
import { AffiliateDashboard } from "./components/affiliate-dashboard";
import { ProductIntelligenceDashboard } from "./components/product-intelligence-dashboard";
import {
  AiAgentsDashboard,
  ContentFactoryFlowPanel,
  MultiVideoEngineDashboard,
  ProfitCenterDashboard,
  SchedulerDashboard,
  StoryEngineDashboard
} from "./components/workflow-dashboards";

const sourcePriority: ProductSource[] = ["MANUAL", "CSV_IMPORT", "REAL_API", "DEMO"];

const initialForm = {
  productName: "",
  category: "",
  price: "19",
  commissionRate: "15",
  salesScore: "60",
  rating: "0",
  reviewCount: "0",
  competitionLevel: "medium" as CompetitionLevel,
  productUrl: "",
  imageUrl: "",
  targetAudience: "",
  problemSolved: "",
  mainBenefit: "",
  demoIdea: "",
  notes: "",
  contentPotential: "70",
  beginnerFriendliness: "75"
};

function sourceBadge(source: ProductSource) {
  return `rounded-full px-3 py-1 text-[10px] font-black ${getSourceClassName(source)}`;
}

function userSourceLabel(source: ProductSource) {
  const labels: Record<ProductSource, string> = {
    DEMO: "DEMO",
    MANUAL: "MANUAL",
    CSV_IMPORT: "CSV_IMPORT",
    REAL_API: "REAL_API"
  };

  return labels[source];
}

type SaveTone = "info" | "success" | "error";
type LoadingAction = "manual" | "csv" | "url" | "edit" | "delete" | "hooks" | "script" | "caption" | "full" | "campaign" | "performance" | null;
type ProductFilter = "all" | "manual" | "csv" | "demo" | "highScore" | "lowCompetition";
export type AffiliateActivePage =
  | "dashboard"
  | "product-intelligence"
  | "content-factory"
  | "story-engine"
  | "multi-video-engine"
  | "scheduler"
  | "profit-center"
  | "ai-agents";

function formatPromptJson(value: unknown) {
  if (!value) return "";
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const acceptedVideoTypes = ["video/mp4", "video/quicktime", "video/webm"];
const acceptedAudioTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/aac", "audio/webm", "audio/ogg"];
const acceptedMediaTypes = [...acceptedImageTypes, ...acceptedVideoTypes, ...acceptedAudioTypes];

const defaultSubtitleSettings: SubtitleSettings = {
  fontFamily: "Sans",
  fontSize: "medium",
  fontWeight: "semi-bold",
  textColor: "#ffffff",
  backgroundStyle: "translucent",
  position: "bottom",
  alignment: "center"
};

const defaultFontSettings: FontSettings = {
  subtitle: defaultSubtitleSettings,
  textOverlay: { ...defaultSubtitleSettings, position: "center" },
  hookText: { ...defaultSubtitleSettings, fontFamily: "Bold Headline", fontSize: "large", position: "top" },
  ctaText: { ...defaultSubtitleSettings, fontFamily: "Rounded", position: "bottom" }
};

const defaultMusicSettings: MusicSettings = {
  sourceType: "none",
  volume: 60,
  muted: false,
  trimStart: 0,
  loop: true
};

const defaultVoiceOverSettings: VoiceOverSettings = {
  sourceType: "auto_placeholder",
  provider: "placeholder",
  selectedVoice: "Female Casual ID",
  language: "id-ID",
  style: "Casual Indonesia natural affiliate UGC",
  speed: 1,
  sceneMode: "per_scene"
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getFileAssetType(file: File): UploadedMediaAsset["fileType"] {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
}

async function createUploadedMediaAsset(file: File, index: number): Promise<UploadedMediaAsset> {
  const dataUrl = await readFileAsDataUrl(file);
  const fileType = getFileAssetType(file);

  return {
    id: `media-${Date.now()}-${index}-${file.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`,
    fileName: file.name,
    fileType,
    mimeType: file.type,
    url: dataUrl,
    thumbnailUrl: fileType === "image" ? dataUrl : "",
    size: file.size,
    createdAt: new Date().toISOString()
  };
}

function parseSceneDurationMs(duration: string) {
  const seconds = Number(duration.match(/[\d.]+/)?.[0] ?? 2);
  return Math.max(800, seconds * 1000);
}

function mergeEditorStateIntoPack(
  pack: ContentPack,
  uploadedMediaAssets: UploadedMediaAsset[],
  sceneMediaAssignments: SceneMediaAssignment[],
  subtitleSettings: SubtitleSettings,
  fontSettings: FontSettings,
  musicSettings: MusicSettings,
  voiceOverSettings: VoiceOverSettings
): ContentPack {
  const storyboard = pack.storyboard
    ? {
        ...pack.storyboard,
        scenes: pack.storyboard.scenes.map((scene) => {
          const assignment = sceneMediaAssignments.find((item) => item.sceneNumber === scene.sceneNumber);
          const assignedMediaAssets = uploadedMediaAssets.filter((asset) => assignment?.assetIds.includes(asset.id));
          const primaryAsset = uploadedMediaAssets.find((asset) => asset.id === assignment?.primaryAssetId) ?? assignedMediaAssets[0];

          return {
            ...scene,
            mediaSourceType: assignedMediaAssets.length > 0 ? "uploaded" as const : scene.mediaSourceType,
            assignedMediaAssets,
            previewImageUrl: primaryAsset?.thumbnailUrl || primaryAsset?.url || scene.previewImageUrl
          };
        })
      }
    : pack.storyboard;

  return {
    ...pack,
    storyboard,
    uploadedMediaAssets,
    sceneMediaAssignments,
    subtitleSettings,
    fontSettings,
    musicSettings,
    voiceOverSettings
  };
}

function productFromForm(source: ProductSource, form: typeof initialForm): AffiliateProduct {
  const now = new Date().toISOString();

  return {
    id: `${source.toLowerCase()}-${Date.now()}`,
    source,
    productName: form.productName || "Untitled Product",
    platform: "TikTok",
    category: form.category || "General",
    price: Number(form.price) || 0,
    commissionRate: Number(form.commissionRate) || 0,
    salesScore: Number(form.salesScore) || 0,
    rating: Number(form.rating) || 0,
    reviewCount: Number(form.reviewCount) || 0,
    competitionLevel: form.competitionLevel,
    productUrl: form.productUrl,
    imageUrl: form.imageUrl,
    targetAudience: form.targetAudience,
    problemSolved: form.problemSolved,
    mainBenefit: form.mainBenefit,
    demoIdea: form.demoIdea,
    notes: form.notes || "No notes yet.",
    contentPotential: Number(form.contentPotential) || 0,
    beginnerFriendliness: Number(form.beginnerFriendliness) || 0,
    createdAt: now,
    updatedAt: now
  };
}

function sortProducts(products: AffiliateProduct[]) {
  return [...products].sort((a, b) => sourcePriority.indexOf(a.source) - sourcePriority.indexOf(b.source));
}

export function AffiliateWorkflow({
  activePage = "dashboard",
  tiktokConnected,
  promptEngineMode,
  initialProducts,
  databaseConnected,
  contentStats = {
    totalDrafts: 0,
    readyDrafts: 0,
    postedDrafts: 0,
    latestDrafts: []
  },
  postedStats = {
    postedToday: 0,
    bestByViews: "",
    bestByOrders: "",
    latestPosted: []
  },
  analyticsStats = {
    viewsThisWeek: 0,
    clicksThisWeek: 0,
    ordersThisWeek: 0,
    revenueThisWeek: 0,
    bestProduct: "",
    bestContent: ""
  },
  actionPlanStats = {
    mainFocus: "Hari ini fokus menambah produk dan membuat konten pertama.",
    topActions: []
  },
  tiktokApiConfigured = false
}: {
  activePage?: AffiliateActivePage;
  tiktokConnected: boolean;
  promptEngineMode: PromptEngineMode;
  initialProducts: AffiliateProduct[];
  databaseConnected: boolean;
  contentStats?: {
    totalDrafts: number;
    readyDrafts: number;
    postedDrafts: number;
    latestDrafts: Array<{ id: string; productName: string; status: string; hook: string }>;
  };
  postedStats?: {
    postedToday: number;
    bestByViews: string;
    bestByOrders: string;
    latestPosted: Array<{ id: string; productName: string; url: string; postedAt: string }>;
  };
  analyticsStats?: {
    viewsThisWeek: number;
    clicksThisWeek: number;
    ordersThisWeek: number;
    revenueThisWeek: number;
    bestProduct: string;
    bestContent: string;
  };
  actionPlanStats?: {
    mainFocus: string;
    topActions: string[];
  };
  tiktokApiConfigured?: boolean;
}) {
  const [products, setProducts] = useState<AffiliateProduct[]>(initialProducts.length > 0 ? initialProducts : sampleProducts);
  const [selectedId, setSelectedId] = useState((initialProducts[0] ?? sampleProducts[0])?.id ?? "");
  const [form, setForm] = useState(initialForm);
  const [urlForm, setUrlForm] = useState(initialForm);
  const [editForm, setEditForm] = useState(initialForm);
  const [csv, setCsv] = useState(SAMPLE_PRODUCT_CSV);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [generatedPack, setGeneratedPack] = useState<ContentPack | null>(null);
  const [draftContentPacks, setDraftContentPacks] = useState(0);
  const [campaignDuration, setCampaignDuration] = useState<CampaignDuration>(7);
  const [campaignGoal, setCampaignGoal] = useState<CampaignGoal>("testing product");
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>("Draft");
  const [performance, setPerformance] = useState<CampaignPerformanceDay[]>(Array.from({ length: 14 }, () => ({ ...emptyCampaignPerformanceDay })));
  const [saveStatus, setSaveStatus] = useState(databaseConnected ? "Database connected" : "Database not connected - using demo fallback");
  const [saveTone, setSaveTone] = useState<SaveTone>(databaseConnected ? "success" : "info");
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");
  const [contentMode, setContentMode] = useState<ContentMode>(defaultPromptOptions.contentMode);
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(defaultPromptOptions.targetAudience);
  const [tone, setTone] = useState<ToneOption>(defaultPromptOptions.tone);
  const [duration, setDuration] = useState<"15s" | "30s">(defaultPromptOptions.duration);
  const [uploadedMediaAssets, setUploadedMediaAssets] = useState<UploadedMediaAsset[]>([]);
  const [sceneMediaAssignments, setSceneMediaAssignments] = useState<SceneMediaAssignment[]>([]);
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettings>(defaultSubtitleSettings);
  const [fontSettings, setFontSettings] = useState<FontSettings>(defaultFontSettings);
  const [musicSettings, setMusicSettings] = useState<MusicSettings>(defaultMusicSettings);
  const [voiceOverSettings, setVoiceOverSettings] = useState<VoiceOverSettings>(defaultVoiceOverSettings);

  const sortedProducts = useMemo(() => sortProducts(products), [products]);
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      const score = scoreProduct(product);

      if (productFilter === "manual") {
        return product.source === "MANUAL";
      }

      if (productFilter === "csv") {
        return product.source === "CSV_IMPORT";
      }

      if (productFilter === "demo") {
        return product.source === "DEMO";
      }

      if (productFilter === "highScore") {
        return score.total >= 80;
      }

      if (productFilter === "lowCompetition") {
        return product.competitionLevel === "low";
      }

      return true;
    });
  }, [productFilter, sortedProducts]);
  const selectedProduct = sortedProducts.find((product) => product.id === selectedId) ?? sortedProducts[0] ?? sampleProducts[0];
  const selectedScore = scoreProduct(selectedProduct);
  const selectedRecommendation = getRecommendationLabel(selectedScore.recommendation);
  const promptOptions = {
    contentMode,
    targetAudience,
    tone,
    duration,
    outputLanguage: "Bahasa Indonesia" as const
  };
  const promptInput = { product: selectedProduct, mode: promptEngineMode, options: promptOptions };
  const promptAssets = generatedPack ?? buildTemplateContentPack(promptInput);
  const editorPack = mergeEditorStateIntoPack(
    promptAssets,
    uploadedMediaAssets,
    sceneMediaAssignments,
    subtitleSettings,
    fontSettings,
    musicSettings,
    voiceOverSettings
  );
  const campaign = buildCampaignPlan(promptInput, campaignDuration, campaignGoal);
  const visiblePerformance = performance.slice(0, campaignDuration);
  const performanceSummary = calculatePerformanceSummary(visiblePerformance);
  const suggestions = isPoorCampaignPerformance(visiblePerformance) ? getImprovementSuggestions(promptEngineMode === "AI_CONNECTED", visiblePerformance) : [];
  const isDemoOnly = products.every((product) => product.source === "DEMO");
  const topProducts = sortedProducts
    .map((product) => ({ product, score: scoreProduct(product) }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 10);
  const sourceCounts = products.reduce(
    (counts, product) => ({ ...counts, [product.source]: counts[product.source] + 1 }),
    { DEMO: 0, MANUAL: 0, CSV_IMPORT: 0, REAL_API: 0 } as Record<ProductSource, number>
  );
  const activeCampaigns = campaignStatus === "Active" ? 1 : 0;

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    setEditForm({
      productName: selectedProduct.productName,
      category: selectedProduct.category,
      price: String(selectedProduct.price),
      commissionRate: String(selectedProduct.commissionRate),
      salesScore: String(selectedProduct.salesScore),
      rating: String(selectedProduct.rating),
      reviewCount: String(selectedProduct.reviewCount),
      competitionLevel: selectedProduct.competitionLevel,
      productUrl: selectedProduct.productUrl,
      imageUrl: selectedProduct.imageUrl,
      targetAudience: selectedProduct.targetAudience,
      problemSolved: selectedProduct.problemSolved,
      mainBenefit: selectedProduct.mainBenefit,
      demoIdea: selectedProduct.demoIdea,
      notes: selectedProduct.notes,
      contentPotential: String(selectedProduct.contentPotential),
      beginnerFriendliness: String(selectedProduct.beginnerFriendliness)
    });
  }, [selectedProduct]);

  function showStatus(message: string, tone: SaveTone = "info") {
    setSaveStatus(message);
    setSaveTone(tone);
  }

  function updateForm(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateUrlForm(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setUrlForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateEditForm(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setEditForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function addManualProduct() {
    if (!form.productName.trim() || !form.category.trim() || !form.productUrl.trim() || !form.price.trim() || !form.commissionRate.trim()) {
      showStatus("Isi nama produk, kategori, harga, komisi, tingkat kompetisi, dan link produk dulu.", "error");
      return;
    }

    setLoadingAction("manual");
    const product = productFromForm("MANUAL", form);
    setProducts((current) => sortProducts([product, ...current]));
    setSelectedId(product.id);
    setForm(initialForm);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
      const payload = await response.json();

      if (response.ok && payload.product) {
        setProducts((current) => sortProducts(current.map((item) => (item.id === product.id ? payload.product : item))));
        setSelectedId(payload.product.id);
        showStatus("Produk manual tersimpan ke database.", "success");
      } else {
        showStatus(payload.message ?? "Produk manual tersimpan lokal saja.", "error");
      }
    } catch {
      showStatus("Produk manual tersimpan lokal saja.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  async function importCsv() {
    setLoadingAction("csv");
    const result = validateAndParseCsv(csv);
    setCsvErrors(result.errors);

    if (result.errors.length > 0 || result.products.length === 0) {
      showStatus("CSV belum bisa diimpor. Periksa pesan error di bawah kolom CSV.", "error");
      setLoadingAction(null);
      return;
    }

    setProducts((current) => sortProducts([...result.products, ...current]));
    setSelectedId(result.products[0].id);

    try {
      const response = await fetch("/api/products/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv })
      });
      const payload = await response.json();

      if (response.ok && payload.products) {
        setProducts((current) => {
          const withoutLocalImports = current.filter((product) => !result.products.some((imported) => imported.id === product.id));
          return sortProducts([...payload.products, ...withoutLocalImports]);
        });
        setSelectedId(payload.products[0].id);
        showStatus(`${payload.products.length} produk CSV tersimpan ke database.`, "success");
      } else {
        showStatus(payload.message ?? "Produk CSV terimpor lokal saja.", "error");
      }
    } catch {
      showStatus("Produk CSV terimpor lokal saja.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  async function addUrlProduct() {
    if (!urlInput.trim() || !urlForm.productName.trim() || !urlForm.category.trim() || !urlForm.price.trim() || !urlForm.commissionRate.trim()) {
      showStatus("Isi link produk, nama produk, kategori, harga, komisi, dan tingkat kompetisi dulu.", "error");
      return;
    }

    setLoadingAction("url");
    const product: AffiliateProduct = {
      ...productFromForm("MANUAL", {
        ...urlForm,
        productUrl: urlInput,
        notes: urlForm.notes || "Link produk disimpan. Data harga/komisi tetap dari input user sampai Platform Commerce API aktif."
      }),
      id: `url-${Date.now()}`
    };

    setProducts((current) => sortProducts([product, ...current]));
    setSelectedId(product.id);
    setUrlInput("");
    setUrlForm(initialForm);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
      const payload = await response.json();

      if (response.ok && payload.product) {
        setProducts((current) => sortProducts(current.map((item) => (item.id === product.id ? payload.product : item))));
        setSelectedId(payload.product.id);
        showStatus("URL produk tersimpan sebagai Data Tersimpan.", "success");
      } else {
        showStatus(payload.message ?? "URL produk tersimpan lokal saja.", "error");
      }
    } catch {
      showStatus("URL produk tersimpan lokal saja.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  async function saveProductEdit() {
    if (!selectedProduct) {
      return;
    }

    setLoadingAction("edit");
    const editedProduct = {
      ...productFromForm(selectedProduct.source, editForm),
      id: selectedProduct.id,
      createdAt: selectedProduct.createdAt,
      updatedAt: new Date().toISOString()
    };

    setProducts((current) => sortProducts(current.map((product) => (product.id === selectedProduct.id ? editedProduct : product))));

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProduct)
      });
      const payload = await response.json();

      if (response.ok && payload.product) {
        setProducts((current) => sortProducts(current.map((product) => (product.id === selectedProduct.id ? payload.product : product))));
        showStatus("Produk diperbarui dan score dihitung ulang.", "success");
      } else {
        showStatus(payload.message ?? "Produk diperbarui lokal saja.", "error");
      }
    } catch {
      showStatus("Produk diperbarui lokal saja.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  async function deleteSelectedProduct() {
    if (!selectedProduct || !window.confirm(`Hapus produk ${selectedProduct.productName}?`)) {
      return;
    }

    setLoadingAction("delete");
    setProducts((current) => {
      const next = current.filter((product) => product.id !== selectedProduct.id);
      setSelectedId(next[0]?.id ?? "");
      return next;
    });

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, { method: "DELETE" });
      showStatus(response.ok ? "Produk dihapus." : "Produk dihapus lokal saja.", response.ok ? "success" : "error");
    } catch {
      showStatus("Produk dihapus lokal saja.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  function updatePerformance(dayIndex: number, field: keyof CampaignPerformanceDay, value: string) {
    setPerformance((current) =>
      current.map((day, index) => (index === dayIndex ? { ...day, [field]: Number(value) || 0 } : day))
    );
  }

  async function copyOutput(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      showStatus(`${label} berhasil disalin.`, "success");
    } catch {
      showStatus(`${label} belum bisa disalin otomatis. Salin manual dari teks di bawah.`, "error");
    }
  }

  async function handleMediaUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const supportedFiles = files.filter((file) => acceptedMediaTypes.includes(file.type));

    if (supportedFiles.length !== files.length) {
      showStatus("Beberapa file dilewati. Gunakan JPG, PNG, WEBP, MP4, MOV, atau WEBM.", "error");
    }

    if (supportedFiles.length === 0) {
      event.target.value = "";
      return;
    }

    try {
      const assets = await Promise.all(
        supportedFiles.map((file, index) => createUploadedMediaAsset(file, index))
      );

      setUploadedMediaAssets((current) => [...current, ...assets]);
      showStatus(`${assets.length} media ditambahkan ke gallery. Assign ke scene yang sesuai.`, "success");
    } catch {
      showStatus("Media belum bisa dibaca dari browser. Coba upload file lain.", "error");
    } finally {
      event.target.value = "";
    }
  }

  async function handleMusicUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!acceptedAudioTypes.includes(file.type)) {
      showStatus("Gunakan file audio MP3, WAV, AAC, WEBM, atau OGG.", "error");
      event.target.value = "";
      return;
    }

    try {
      const asset = await createUploadedMediaAsset(file, 0);
      setUploadedMediaAssets((current) => [...current, asset]);
      setMusicSettings((current) => ({ ...current, sourceType: "uploaded", assetId: asset.id, muted: false }));
      showStatus("Background music ditambahkan ke draft.", "success");
    } catch {
      showStatus("Audio belum bisa dibaca dari browser.", "error");
    } finally {
      event.target.value = "";
    }
  }

  async function handleVoiceOverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!acceptedAudioTypes.includes(file.type)) {
      showStatus("Gunakan file voice over MP3, WAV, AAC, WEBM, atau OGG.", "error");
      event.target.value = "";
      return;
    }

    try {
      const asset = await createUploadedMediaAsset(file, 0);
      setUploadedMediaAssets((current) => [...current, asset]);
      setVoiceOverSettings((current) => ({ ...current, sourceType: "manual_upload", assetId: asset.id, provider: "none" }));
      showStatus("Voice over manual ditambahkan ke draft.", "success");
    } catch {
      showStatus("Voice over belum bisa dibaca dari browser.", "error");
    } finally {
      event.target.value = "";
    }
  }

  function removeMediaAsset(assetId: string) {
    setUploadedMediaAssets((current) => current.filter((asset) => asset.id !== assetId));
    setSceneMediaAssignments((current) =>
      current
        .map((assignment) => {
          const assetIds = assignment.assetIds.filter((id) => id !== assetId);
          return {
            ...assignment,
            assetIds,
            primaryAssetId: assignment.primaryAssetId === assetId ? assetIds[0] : assignment.primaryAssetId
          };
        })
        .filter((assignment) => assignment.assetIds.length > 0)
    );
    showStatus("Media dihapus dari gallery dan assignment scene.", "success");
  }

  function assignMediaToScene(sceneNumber: number, assetId: string) {
    if (!assetId) return;

    setSceneMediaAssignments((current) => {
      const existing = current.find((assignment) => assignment.sceneNumber === sceneNumber);

      if (!existing) {
        return [
          ...current,
          {
            sceneNumber,
            assetIds: [assetId],
            primaryAssetId: assetId,
            usageType: "scene background"
          }
        ];
      }

      const assetIds = Array.from(new Set([...existing.assetIds, assetId]));

      return current.map((assignment) =>
        assignment.sceneNumber === sceneNumber
          ? {
              ...assignment,
              assetIds,
              primaryAssetId: assignment.primaryAssetId ?? assetId
            }
          : assignment
      );
    });
    showStatus(`Media ditambahkan ke scene ${sceneNumber}.`, "success");
  }

  function removeSceneMedia(sceneNumber: number, assetId?: string) {
    setSceneMediaAssignments((current) =>
      current
        .map((assignment) => {
          if (assignment.sceneNumber !== sceneNumber) {
            return assignment;
          }

          const assetIds = assetId ? assignment.assetIds.filter((id) => id !== assetId) : [];

          return {
            ...assignment,
            assetIds,
            primaryAssetId: assignment.primaryAssetId && assetIds.includes(assignment.primaryAssetId) ? assignment.primaryAssetId : assetIds[0]
          };
        })
        .filter((assignment) => assignment.assetIds.length > 0)
    );
    showStatus(`Assignment media scene ${sceneNumber} diperbarui.`, "success");
  }

  function fullPackText() {
    return [
      `Hook:\n${editorPack.hooks.join("\n")}`,
      `Product insight:\n${editorPack.productInsight ?? ""}`,
      `Main selling point:\n${editorPack.mainSellingPoint ?? ""}`,
      `Target audience match:\n${editorPack.targetAudienceMatch ?? ""}`,
      `Script 15 detik:\n${editorPack.script15}`,
      `Script 30 detik:\n${editorPack.script30}`,
      `Script 60 detik:\n${editorPack.script60 ?? ""}`,
      `Scene Plan:\n${editorPack.scenePlan.join("\n")}`,
      `Storyboard:\n${formatPromptJson(editorPack.storyboard)}`,
      `Media Uploaded:\n${formatPromptJson(editorPack.uploadedMediaAssets?.map(({ id, fileName, fileType, mimeType, size }) => ({ id, fileName, fileType, mimeType, size })))}`,
      `Scene Media Assignment:\n${formatPromptJson(editorPack.sceneMediaAssignments)}`,
      `Preview Video:\n${formatPromptJson(editorPack.previewVideoMeta)}`,
      `Product Brief:\n${formatPromptJson(editorPack.productBrief)}`,
      `Prompt Gambar - Nano Banana:\n${formatPromptJson(editorPack.nanoBananaPrompts)}`,
      `Prompt Video - Veo 3:\n${formatPromptJson(editorPack.veo3Prompts)}`,
      `Voice over:\n${editorPack.voiceOverDraft ?? ""}`,
      `Caption pendek:\n${editorPack.captionShort ?? editorPack.caption}`,
      `Caption medium:\n${editorPack.captionMedium ?? editorPack.caption}`,
      `Caption storytelling:\n${editorPack.captionStorytelling ?? editorPack.caption}`,
      `Hashtag:\n${editorPack.hashtags.join(" ")}`,
      `CTA soft:\n${editorPack.ctaSoft ?? editorPack.cta}`,
      `CTA direct:\n${editorPack.ctaDirect ?? editorPack.cta}`,
      `CTA keranjang kuning:\n${editorPack.ctaKeranjangKuning ?? editorPack.cta}`,
      `Checklist Klaim Aman:\n${editorPack.safeClaimChecklist.join("\n")}`,
      `Compliance Checklist:\n${formatPromptJson(editorPack.complianceChecklist)}`,
      `Editing notes:\n${(editorPack.editingNotes ?? []).join("\n")}`,
      `Posting notes:\n${(editorPack.postingNotes ?? []).join("\n")}`
    ].join("\n\n");
  }

  function generatePack(part: "hooks" | "script" | "caption" | "full") {
    setLoadingAction(part);
    const pack = buildTemplateContentPack(promptInput);
    setDraftContentPacks((current) => current + 1);

    if (part === "hooks") {
      setGeneratedPack(mergeEditorStateIntoPack({ ...promptAssets, hooks: pack.hooks }, uploadedMediaAssets, sceneMediaAssignments, subtitleSettings, fontSettings, musicSettings, voiceOverSettings));
      showStatus("Hooks berhasil dibuat dalam Template Mode.", "success");
      setLoadingAction(null);
      return;
    }

    if (part === "script") {
      setGeneratedPack(mergeEditorStateIntoPack({ ...promptAssets, script15: pack.script15, script30: pack.script30, script60: pack.script60, scenePlan: pack.scenePlan, structuredScenePlan: pack.structuredScenePlan, storyboard: pack.storyboard, previewVideoMeta: pack.previewVideoMeta, voiceOverDraft: pack.voiceOverDraft }, uploadedMediaAssets, sceneMediaAssignments, subtitleSettings, fontSettings, musicSettings, voiceOverSettings));
      showStatus("Voice over, script 15/30/60 detik, dan scene plan berhasil dibuat.", "success");
      setLoadingAction(null);
      return;
    }

    if (part === "caption") {
      setGeneratedPack(mergeEditorStateIntoPack({ ...promptAssets, caption: pack.caption, hashtags: pack.hashtags, cta: pack.cta }, uploadedMediaAssets, sceneMediaAssignments, subtitleSettings, fontSettings, musicSettings, voiceOverSettings));
      showStatus("Caption, hashtag, dan CTA berhasil dibuat.", "success");
      setLoadingAction(null);
      return;
    }

    const packWithEditorState = mergeEditorStateIntoPack(pack, uploadedMediaAssets, sceneMediaAssignments, subtitleSettings, fontSettings, musicSettings, voiceOverSettings);
    setGeneratedPack(packWithEditorState);
    fetch("/api/content-packs/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProduct.id,
        contentPack: packWithEditorState,
        contentMode,
        targetAudience,
        tone,
        providerMode: promptEngineMode === "AI_CONNECTED" ? "AI" : "TEMPLATE"
      })
    })
      .then((response) => {
      showStatus(response.ok ? "Content Production Prompt Package tersimpan ke Draft Konten." : "Package dibuat lokal saja.", response.ok ? "success" : "error");
      })
      .catch(() => showStatus("Content pack dibuat lokal saja.", "error"))
      .finally(() => setLoadingAction(null));
  }

  async function saveCampaign() {
    setLoadingAction("campaign");
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          name: `${selectedProduct.productName} ${campaignDuration}-day ${campaignGoal} campaign`,
          durationDays: campaignDuration,
          goal: campaignGoal,
          status: campaignStatus.toUpperCase(),
          dailyPlan: campaign
        })
      });
      const payload = await response.json();

      if (response.ok) {
        setCampaignId(payload.campaign.id);
        showStatus("Campaign tersimpan ke database.", "success");
      } else {
        showStatus(payload.message ?? "Campaign tersimpan lokal saja.", "error");
      }
    } catch {
      showStatus("Campaign tersimpan lokal saja.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  async function savePerformance() {
    if (!campaignId) {
      showStatus("Simpan campaign dulu sebelum menyimpan performa.", "error");
      return;
    }

    setLoadingAction("performance");
    try {
      await Promise.all(
        visiblePerformance.map((day, index) =>
          fetch(`/api/campaigns/${campaignId}/performance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...day, dayNumber: index + 1 })
          })
        )
      );
      showStatus("Performa harian tersimpan ke database.", "success");
    } catch {
      showStatus("Performa tersimpan lokal saja.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <>
      {activePage === "dashboard" ? (
        <AffiliateDashboard
          products={products}
          topProducts={topProducts}
          isDemoOnly={isDemoOnly}
          sourceCounts={sourceCounts}
          activeCampaigns={activeCampaigns}
          contentStats={contentStats}
          draftContentPacks={draftContentPacks}
          postedStats={postedStats}
          analyticsStats={analyticsStats}
          actionPlanStats={actionPlanStats}
          tiktokConnected={tiktokConnected}
          tiktokApiConfigured={tiktokApiConfigured}
          onSelectProduct={setSelectedId}
        />
      ) : null}
      {false ? (
      <>
      <section id="legacy-dashboard" className="hidden">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">Dashboard</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-ink sm:text-5xl">
          Kelola produk, konten, dan rencana posting affiliate dari satu tempat.
        </h1>
        <div className="mt-4 rounded-2xl bg-ink p-5 text-white">
          <p className="text-sm font-bold text-white/70">Produk terbaik hari ini</p>
          <h2 className="mt-2 text-2xl font-black">{topProducts[0]?.product.productName ?? "Belum ada produk"}</h2>
          <p className="mt-2 text-sm text-white/70">
            Score {topProducts[0]?.score.total ?? 0}/100 - {topProducts[0] ? getRecommendationLabel(topProducts[0].score.recommendation) : "Tambahkan produk dulu"}
          </p>
        </div>
        {isDemoOnly ? (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-black text-orange-900">DEMO</p>
            <p className="mt-1 text-sm leading-6 text-orange-900/80">
              Saat ini hanya ada produk demo. Tambahkan produk manual atau import CSV agar aplikasi bisa dipakai untuk produk kamu.
            </p>
          </div>
        ) : null}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <MetricPill label="Produk tersimpan" value={String(products.length)} />
          <MetricPill label="Produk manual" value={String(sourceCounts.MANUAL)} />
          <MetricPill label="Produk CSV" value={String(sourceCounts.CSV_IMPORT)} />
          <MetricPill label="Produk demo" value={String(sourceCounts.DEMO)} tone={sourceCounts.DEMO > 0 ? "warn" : "neutral"} />
          <MetricPill label="Campaign aktif" value={String(activeCampaigns)} />
          <MetricPill label="Draft konten" value={String(contentStats.totalDrafts + draftContentPacks)} />
          <MetricPill label="Siap posting" value={String(contentStats.readyDrafts)} />
          <MetricPill label="Sudah posting" value={String(contentStats.postedDrafts)} />
          <MetricPill label="Terposting hari ini" value={String(postedStats.postedToday)} />
        </div>
        <p className="mt-4 text-sm font-black text-ink">Mulai dari sini</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Tambah Produk", "#product-hunter", "Input produk manual pertama kamu."],
            ["Import CSV", "#product-hunter", "Masukkan banyak produk dari file CSV."],
            ["Rencana Hari Ini", "/action-plan", "Lihat aksi prioritas untuk hari ini."],
            ["Buat Konten", "#content-factory", "Generate hook, script, caption, dan CTA."],
            ["Lihat Draft Konten", "/content-library", "Cari dan pakai ulang draft konten."],
            ["Lihat Konten Terposting", "/posted-content", "Input performa video yang sudah upload."],
            ["Analisa Affiliate", "/analytics", "Lihat performa produk, konten, dan campaign."],
            ["Buat Rencana Posting", "#campaign-planner", "Susun campaign 7 atau 14 hari."]
          ].map(([title, href, detail]) => (
            <a key={title} href={href} className="rounded-2xl border border-line bg-white p-4 transition hover:border-mint hover:bg-teal-50">
              <p className="text-sm font-black text-ink">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
            </a>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-ink">Rencana Hari Ini</p>
            <a href="/action-plan" className="rounded-full border border-line px-3 py-1 text-xs font-bold text-ink">Lihat Full Plan</a>
          </div>
          <p className="mt-2 text-sm font-bold leading-6 text-ink">{actionPlanStats.mainFocus}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(actionPlanStats.topActions.length > 0 ? actionPlanStats.topActions : ["Tambah produk", "Buat konten", "Input performa"]).map((action) => (
              <div key={action} className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-xs font-black uppercase tracking-wide text-muted">Top action</p>
                <p className="mt-1 text-sm font-bold text-ink">{action}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-ink">Ringkasan Analisa Minggu Ini</p>
            <a href="/analytics" className="rounded-full border border-line px-3 py-1 text-xs font-bold text-ink">Analisa Affiliate</a>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            <MetricPill label="Views this week" value={String(analyticsStats.viewsThisWeek)} />
            <MetricPill label="Clicks this week" value={String(analyticsStats.clicksThisWeek)} />
            <MetricPill label="Orders this week" value={String(analyticsStats.ordersThisWeek)} />
            <MetricPill label="Revenue this week" value={`Rp${analyticsStats.revenueThisWeek.toLocaleString("id-ID")}`} />
            <MetricPill label="Best product" value={analyticsStats.bestProduct || "Belum ada"} />
            <MetricPill label="Best content" value={analyticsStats.bestContent || "Belum ada"} />
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-ink">Latest 5 content drafts</p>
            <a href="/content-library" className="rounded-full border border-line px-3 py-1 text-xs font-bold text-ink">Lihat Draft Konten</a>
          </div>
          {contentStats.latestDrafts.length === 0 ? (
            <p className="mt-2 text-sm leading-6 text-muted">Belum ada draft konten. Pilih produk lalu buat konten pertama kamu.</p>
          ) : (
            <div className="mt-3 grid gap-2">
              {contentStats.latestDrafts.map((draft) => (
                <a key={draft.id} href={`/content-library/${draft.id}`} className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-sm font-bold text-ink">{draft.productName}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">{draft.status} - {draft.hook}</p>
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-ink">Konten terposting terbaru</p>
            <a href="/posted-content" className="rounded-full border border-line px-3 py-1 text-xs font-bold text-ink">Lihat Konten Terposting</a>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <MetricPill label="Best views" value={postedStats.bestByViews || "Belum ada"} />
            <MetricPill label="Best orders" value={postedStats.bestByOrders || "Belum ada"} />
          </div>
          {postedStats.latestPosted.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-muted">Belum ada konten terposting.</p>
          ) : (
            <div className="mt-3 grid gap-2">
              {postedStats.latestPosted.map((item) => (
                <a key={item.id} href={item.url} target="_blank" className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-sm font-bold text-ink">{item.productName}</p>
                  <p className="mt-1 text-xs text-muted">{new Date(item.postedAt).toLocaleDateString()}</p>
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {[
            ["Mode AI", promptEngineMode === "AI_CONNECTED" ? "AI Connected" : "Template Mode"],
            ["Status Platform", tiktokConnected ? "Connected" : "Not Connected"],
            ["Sumber data", isDemoOnly ? "DEMO" : "MANUAL / CSV_IMPORT / REAL_API"]
          ].map(([title, value]) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">{title}</p>
              <p className="mt-2 text-sm font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <p className="text-sm font-black text-ink">Top 5 produk rekomendasi</p>
          <div className="mt-3 grid gap-2">
            {topProducts.map(({ product, score }) => (
              <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <div>
                  <p className="text-sm font-bold text-ink">{product.productName}</p>
                  <p className="text-xs text-muted">{getSourceBadgeText(product.source)} - {getSourceTrustText(product.source)}</p>
                </div>
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{score.total}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`mt-4 rounded-2xl border p-4 ${
          saveTone === "success"
            ? "border-teal-200 bg-teal-50"
            : saveTone === "error"
              ? "border-orange-200 bg-orange-50"
              : "border-line bg-white"
        }`}>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Status simpan data</p>
          <p className="mt-2 text-sm font-bold text-ink">{saveStatus}</p>
        </div>
      </section>

      <section id="tutorial-panduan" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">Tutorial & Panduan</p>
            <h2 className="mt-1 text-xl font-black text-ink">Alur cepat affiliate pemula</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Cari produk, buat konten, susun story engine, jadwalkan posting, lalu pantau profit dari input manual kamu.</p>
          </div>
          <a href="/onboarding" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Buka Panduan</a>
        </div>
      </section>
      </>
      ) : null}

      {activePage === "product-intelligence" ? (
      <>
      <ProductIntelligenceDashboard
        products={sortedProducts}
        selectedProductId={selectedProduct.id}
        onSelectProduct={setSelectedId}
        tiktokConnected={tiktokConnected}
      />

      <div className="hidden">
      <SectionCard id="product-hunter-admin" title="Product Intelligence Admin Tools" description="Form input manual dan CSV disimpan untuk mode admin/dev." icon={PackageSearch}>
        {isDemoOnly ? (
          <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
              <div>
                <p className="text-sm font-black text-orange-900">DEMO</p>
                <p className="mt-1 text-sm leading-6 text-orange-900/80">
                  Produk demo hanya contoh. Tambahkan produk manual atau import CSV agar analisa lebih sesuai kebutuhan kamu.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mb-4 grid gap-2 rounded-2xl border border-line bg-slate-50 p-3 sm:grid-cols-4">
          {(["DEMO", "MANUAL", "CSV_IMPORT", "REAL_API"] as ProductSource[]).map((source) => (
            <div key={source} className="rounded-xl bg-white px-3 py-2">
              <span className={sourceBadge(source)}>{userSourceLabel(source)}</span>
              <p className="mt-2 text-xs font-bold text-ink">{getSourceBadgeText(source)}</p>
              <p className="mt-1 text-xs font-semibold text-muted">{getSourceTrustText(source)}</p>
              <p className="mt-1 text-xs font-semibold text-muted">
                {source === "REAL_API" ? "aktif setelah API partner terhubung" : "tersedia"}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {[
            ["all", "Semua"],
            ["manual", "Manual"],
            ["csv", "CSV"],
            ["demo", "Demo"],
            ["highScore", "Score tinggi"],
            ["lowCompetition", "Kompetisi rendah"]
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setProductFilter(value as ProductFilter)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                productFilter === value ? "bg-ink text-white" : "border border-line bg-white text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-line p-4">
            <div className="mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <p className="text-sm font-bold text-ink">Input produk manual</p>
            </div>
            <div className="grid gap-2">
              {[
                ["productName", "Nama produk"],
                ["category", "Kategori"],
                ["price", "Harga"],
                ["commissionRate", "Komisi"],
                ["salesScore", "Score penjualan"],
                ["rating", "Rating"],
                ["reviewCount", "Jumlah review"],
                ["productUrl", "Link produk"],
                ["imageUrl", "Link gambar"],
                ["targetAudience", "Target audience"],
                ["problemSolved", "Problem yang diselesaikan"],
                ["mainBenefit", "Manfaat utama"],
                ["demoIdea", "Ide demo"],
                ["contentPotential", "Potensi konten"],
                ["beginnerFriendliness", "Cocok pemula"]
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  value={form[name as keyof typeof form]}
                  onChange={updateForm}
                  placeholder={placeholder}
                  className="min-h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-mint"
                />
              ))}
              <select name="competitionLevel" value={form.competitionLevel} onChange={updateForm} className="min-h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
                <option value="low">Kompetisi rendah</option>
                <option value="medium">Kompetisi sedang</option>
                <option value="high">Kompetisi tinggi</option>
              </select>
              <textarea name="notes" value={form.notes} onChange={updateForm} placeholder="Catatan produk" className="min-h-20 rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-mint" />
              <ActionButton loading={loadingAction === "manual"} onClick={addManualProduct}>
                Simpan Produk Manual
              </ActionButton>
              <p className="text-xs leading-5 text-muted">Wajib: nama produk, kategori, harga, komisi, tingkat kompetisi, dan link produk. Data ini disimpan sebagai Data Tersimpan, bukan data resmi marketplace.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-line p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              <p className="text-sm font-bold text-ink">Import CSV</p>
            </div>
            <textarea value={csv} onChange={(event) => setCsv(event.target.value)} className="min-h-56 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-mint" />
            <div className="mt-3 flex flex-wrap gap-2">
              <ActionButton loading={loadingAction === "csv"} onClick={importCsv}>
                Import Produk CSV
              </ActionButton>
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE_PRODUCT_CSV)}`}
                download="tiktok-affiliate-products-sample.csv"
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                Download Sample CSV
              </a>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">Baris valid akan disimpan sebagai Data Marketplace dari file kamu. Baris invalid ditolak dengan pesan jelas.</p>
            {csvErrors.length > 0 ? (
              <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-3">
                <p className="text-sm font-black text-orange-900">CSV validation errors</p>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-orange-900/80">
                  {csvErrors.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-line p-4">
            <div className="mb-3 flex items-center gap-2">
              <Link className="h-4 w-4" />
              <p className="text-sm font-bold text-ink">Input link produk</p>
            </div>
            <input value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="Tempel link produk marketplace" className="min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint" />
            <div className="mt-2 grid gap-2">
              {[
                ["productName", "Nama produk"],
                ["category", "Kategori"],
                ["price", "Harga"],
                ["commissionRate", "Komisi"],
                ["salesScore", "Score penjualan"],
                ["notes", "Catatan"]
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  value={urlForm[name as keyof typeof urlForm]}
                  onChange={updateUrlForm}
                  placeholder={placeholder}
                  className="min-h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-mint"
                />
              ))}
              <select name="competitionLevel" value={urlForm.competitionLevel} onChange={updateUrlForm} className="min-h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
                <option value="low">Kompetisi rendah</option>
                <option value="medium">Kompetisi sedang</option>
                <option value="high">Kompetisi tinggi</option>
              </select>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">Link produk disimpan, tetapi data harga/komisi tetap dari input kamu sampai Platform Commerce API aktif.</p>
            <ActionButton loading={loadingAction === "url"} onClick={addUrlProduct} className="mt-3">
              Simpan URL
            </ActionButton>
            <p className="mt-2 text-xs leading-5 text-muted">URL hanya menjadi catatan riset manual sampai Data Partner aktif.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-slate-50 p-6 text-center lg:col-span-2">
              <p className="text-sm font-black text-ink">Belum ada produk. Tambahkan produk pertama kamu untuk mulai.</p>
              <p className="mt-2 text-sm leading-6 text-muted">Ganti filter, tambah produk manual, atau import CSV untuk melihat daftar produk.</p>
            </div>
          ) : null}
          {filteredProducts.map((product) => {
            const productScore = scoreProduct(product);
            return (
              <article
                key={product.id}
                className={`rounded-2xl border p-4 text-left transition ${selectedProduct.id === product.id ? "border-mint bg-teal-50" : "border-line bg-white hover:bg-slate-50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {product.imageUrl ? (
                      <div
                        aria-hidden="true"
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.imageUrl})` }}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={sourceBadge(product.source)}>{userSourceLabel(product.source)}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-ink">{getSourceBadgeText(product.source)}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-ink">{getSourceTrustText(product.source)}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-ink">{getRecommendationLabel(productScore.recommendation)}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-ink">{product.productName}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{product.category}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{product.notes}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <MetricPill label="Harga" value={`$${product.price}`} />
                      <MetricPill label="Komisi" value={`${product.commissionRate}%`} />
                      <MetricPill label="Score" value={`${productScore.total}/100`} />
                    </div>
                    <a
                      href="/buat-konten"
                      onClick={() => setSelectedId(product.id)}
                      className="mt-3 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
                    >
                      Buat Konten
                    </a>
                  </div>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{productScore.total}</span>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
      </div>

      <SectionCard id="product-detail" title="Detail Produk" description="Cek ringkasan produk sebelum membuat konten." icon={PackageSearch}>
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="overflow-hidden rounded-2xl border border-line bg-slate-50">
            {selectedProduct.imageUrl ? (
              <div aria-hidden="true" className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${selectedProduct.imageUrl})` }} />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-sm font-bold text-muted">Belum ada gambar</div>
            )}
            <div className="p-4">
              <span className={sourceBadge(selectedProduct.source)}>{userSourceLabel(selectedProduct.source)}</span>
              <h2 className="mt-3 text-2xl font-black text-ink">{selectedProduct.productName}</h2>
              <p className="mt-1 text-sm text-muted">{selectedProduct.category}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <MetricPill label="Score" value={`${selectedScore.total}/100`} />
                <MetricPill label="Rekomendasi" value={selectedRecommendation} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="/buat-konten" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Buat Konten</a>
                <a href="/rencana-posting" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">Buat Campaign 7 Hari</a>
                <ActionButton loading={loadingAction === "delete"} onClick={deleteSelectedProduct} className="bg-coral">
                  Delete Product
                </ActionButton>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Harga", String(selectedProduct.price)],
              ["Komisi", `${selectedProduct.commissionRate}%`],
              ["Terjual/Sales", selectedProduct.soldCount ? String(selectedProduct.soldCount) : `${selectedProduct.salesScore}/100`],
              ["Rating", `${selectedProduct.rating} (${selectedProduct.reviewCount} reviews)`],
              ["Kompetisi", selectedProduct.competitionLevel],
              ["Target audience", selectedProduct.targetAudience || "Belum diisi"],
              ["Problem solved", selectedProduct.problemSolved || "Belum diisi"],
              ["Main benefit", selectedProduct.mainBenefit || "Belum diisi"],
              ["Demo idea", selectedProduct.demoIdea || "Belum diisi"],
              ["Content packs", draftContentPacks ? `${draftContentPacks} draft dibuat` : "Belum ada konten tersimpan di sesi ini"],
              ["Campaigns", campaignId ? "1 campaign aktif di sesi ini" : "Belum ada campaign di sesi ini"],
              ["Link produk", selectedProduct.productUrl || "Belum diisi"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="mt-2 break-words text-sm font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 rounded-2xl border border-line p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Catatan</p>
          <p className="mt-2 text-sm leading-6 text-muted">{selectedProduct.notes}</p>
        </div>
        <div className="mt-4 rounded-2xl border border-line p-4">
          <p className="text-sm font-black text-ink">Edit Product</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["productName", "Nama produk"],
              ["category", "Kategori"],
              ["price", "Harga"],
              ["commissionRate", "Komisi"],
              ["salesScore", "Score penjualan"],
              ["productUrl", "Link produk"],
              ["imageUrl", "Link gambar"],
              ["targetAudience", "Target audience"],
              ["problemSolved", "Problem solved"],
              ["mainBenefit", "Main benefit"],
              ["demoIdea", "Demo idea"],
              ["notes", "Notes"]
            ].map(([name, placeholder]) => (
              <input
                key={name}
                name={name}
                value={editForm[name as keyof typeof editForm]}
                onChange={updateEditForm}
                placeholder={placeholder}
                className="min-h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-mint"
              />
            ))}
            <select name="competitionLevel" value={editForm.competitionLevel} onChange={updateEditForm} className="min-h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              <option value="low">Kompetisi rendah</option>
              <option value="medium">Kompetisi sedang</option>
              <option value="high">Kompetisi tinggi</option>
            </select>
          </div>
          <ActionButton loading={loadingAction === "edit"} onClick={saveProductEdit} className="mt-3">
            Simpan Edit Product
          </ActionButton>
          <p className="mt-2 text-xs leading-5 text-muted">Score produk otomatis dihitung ulang setelah edit tersimpan.</p>
        </div>
      </SectionCard>
      </>
      ) : null}

      {activePage === "content-factory" ? (
      <SectionCard id="content-factory" title="Content Factory" description="Buat konten affiliate, story engine, dan prompt video siap produksi dari produk terpilih." icon={Sparkles}>
        {promptEngineMode === "TEMPLATE_MODE" ? (
          <div className="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm font-black text-yellow-900">Template Siap Pakai</p>
            <p className="mt-1 text-sm leading-6 text-yellow-900/80">Koneksi AI belum terhubung. Konten tetap bisa dibuat dari template lokal yang aman untuk draft awal.</p>
          </div>
        ) : (
          <div className="mb-4 rounded-2xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm font-black text-teal-900">AI Siap Dipakai</p>
            <p className="mt-1 text-sm leading-6 text-teal-900/80">Konten bisa dibuat lebih cepat. Jika koneksi AI bermasalah, app tetap memakai template cadangan.</p>
          </div>
        )}
        {selectedProduct.source === "DEMO" ? (
          <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-black text-orange-900">DEMO</p>
            <p className="mt-1 text-sm leading-6 text-orange-900/80">Marketplace API belum terhubung. Data ini masih contoh.</p>
          </div>
        ) : null}
        <ContentFactoryFlowPanel
          product={selectedProduct}
          trendScore={selectedScore.total}
          contentPack={editorPack}
          onGenerate={() => generatePack("full")}
        />
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl bg-ink p-5 text-white">
            <span className={sourceBadge(selectedProduct.source)}>{userSourceLabel(selectedProduct.source)}</span>
            <h2 className="mt-3 text-2xl font-bold">{selectedProduct.productName}</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">{selectedProduct.notes}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div><p className="text-xs text-white/60">Score</p><p className="text-2xl font-black">{selectedScore.total}/100</p></div>
              <div><p className="text-xs text-white/60">Rekomendasi</p><p className="text-lg font-bold">{selectedRecommendation}</p></div>
            </div>
          </div>
          <div className="grid gap-3">
            {Object.entries(selectedScore.factors).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
                <span className="text-sm font-semibold text-ink">{label.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-sm font-bold text-muted">{Math.round(value)}/100</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Generator mode</span>
            <select value={contentMode} onChange={(event) => setContentMode(event.target.value as ContentMode)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              {contentModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </label>
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Target audience</span>
            <select value={targetAudience} onChange={(event) => setTargetAudience(event.target.value as TargetAudience)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              {targetAudiences.map((audience) => (
                <option key={audience} value={audience}>{audience}</option>
              ))}
            </select>
          </label>
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Tone</span>
            <select value={tone} onChange={(event) => setTone(event.target.value as ToneOption)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              {toneOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Duration</span>
            <select value={duration} onChange={(event) => setDuration(event.target.value as "15s" | "30s")} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              <option value="15s">15s</option>
              <option value="30s">30s</option>
            </select>
          </label>
          <div className="rounded-2xl border border-line p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Output language</p>
            <p className="mt-3 text-sm font-bold text-ink">Bahasa Indonesia</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 rounded-2xl border border-line bg-slate-50 p-3 text-xs font-black text-ink sm:grid-cols-4 lg:grid-cols-6">
          {["Brief", "Hook", "Script", "Scene Plan", "Storyboard", "Media", "Preview per Scene", "Prompt Gambar - Nano Banana", "Prompt Video - Veo 3", "Caption & Hashtag", "Compliance", "Save to Draft"].map((item) => (
            <span key={item} className="rounded-full bg-white px-3 py-2 text-center">{item}</span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton loading={loadingAction === "hooks"} onClick={() => generatePack("hooks")}>Buat Hook</ActionButton>
          <ActionButton loading={loadingAction === "script"} onClick={() => generatePack("script")}>Buat Voice Over + Scene</ActionButton>
          <ActionButton loading={loadingAction === "caption"} onClick={() => generatePack("caption")}>Buat Caption</ActionButton>
          <ActionButton loading={loadingAction === "full"} onClick={() => generatePack("full")} className="bg-mint">Generate + Save to Draft Konten</ActionButton>
          <button onClick={() => copyOutput("Full Pack", fullPackText())} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
            <Copy className="h-4 w-4" />
            Copy Full Pack
          </button>
          <a href="/content-library" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
            Lihat Draft Konten
          </a>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">Gunakan package ini sebagai draft produksi. Upload ke platform tetap manual; aplikasi belum melakukan auto-post.</p>
        {!generatedPack ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-slate-50 p-4">
            <p className="text-sm font-black text-ink">Belum ada konten. Pilih produk lalu buat script konten.</p>
            <p className="mt-1 text-sm leading-6 text-muted">Package akan berisi brief, hook, voice over, scene plan, prompt Nano Banana, prompt Veo 3, caption, CTA, dan compliance.</p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <PromptBlock title="Brief" text={formatPromptJson(editorPack.productBrief)} copyLabel="Copy Brief" onCopy={() => copyOutput("Brief", formatPromptJson(editorPack.productBrief))} />
          <PromptBlock title="Product insight" text={editorPack.productInsight} />
          <PromptBlock title="Main selling point" text={editorPack.mainSellingPoint} />
          <PromptBlock title="Target audience match" text={editorPack.targetAudienceMatch} />
          <PromptBlock title="Hook 3 detik pertama" items={editorPack.hooks} copyLabel="Copy Hook" onCopy={() => copyOutput("Hook", editorPack.hooks.join("\n"))} />
          <PromptBlock title="3 variasi script 15 detik" items={editorPack.script15Variations ?? [editorPack.script15]} copyLabel="Copy Script" onCopy={() => copyOutput("Script", (editorPack.script15Variations ?? [editorPack.script15]).join("\n\n"))} />
          <PromptBlock title="3 variasi script 30 detik" items={editorPack.script30Variations ?? [editorPack.script30]} copyLabel="Copy Script" onCopy={() => copyOutput("Script", (editorPack.script30Variations ?? [editorPack.script30]).join("\n\n"))} />
          <PromptBlock title="Script / Voice Over 60 detik" text={editorPack.script60} copyLabel="Copy Script" onCopy={() => copyOutput("Script 60s", editorPack.script60 ?? "")} />
          <PromptBlock title="Scene Plan" items={editorPack.scenePlan} />
          <PromptBlock title="Scene Plan Detail" text={formatPromptJson(editorPack.structuredScenePlan)} copyLabel="Copy Scene Plan" onCopy={() => copyOutput("Scene Plan", formatPromptJson(editorPack.structuredScenePlan))} />
          <MediaGalleryPanel assets={uploadedMediaAssets} onUpload={handleMediaUpload} onRemove={removeMediaAsset} />
          <CaptionOverlayTools subtitleSettings={subtitleSettings} onSubtitleChange={setSubtitleSettings} />
          <FontTools fontSettings={fontSettings} onChange={setFontSettings} />
          <MusicTools settings={musicSettings} assets={uploadedMediaAssets} onChange={setMusicSettings} onUpload={handleMusicUpload} />
          <VoiceOverTools settings={voiceOverSettings} assets={uploadedMediaAssets} onChange={setVoiceOverSettings} onUpload={handleVoiceOverUpload} script={duration === "15s" ? editorPack.script15 : editorPack.script30} providerConnected={promptEngineMode === "AI_CONNECTED"} />
          <StoryboardTimeline
            storyboard={editorPack.storyboard}
            mediaAssets={uploadedMediaAssets}
            sceneMediaAssignments={sceneMediaAssignments}
            onAssignMedia={assignMediaToScene}
            onRemoveSceneMedia={removeSceneMedia}
            onCopy={copyOutput}
          />
          <StoryboardPreview
            storyboard={editorPack.storyboard}
            previewMeta={editorPack.previewVideoMeta}
            mediaAssets={uploadedMediaAssets}
            sceneMediaAssignments={sceneMediaAssignments}
            subtitleSettings={subtitleSettings}
            musicSettings={musicSettings}
            voiceOverSettings={voiceOverSettings}
            aiProviderConnected={promptEngineMode === "AI_CONNECTED"}
          />
          <PromptBlock title="Voice Over" text={editorPack.voiceOverDraft} />
          <PromptBlock title="Subtitle" text="Gunakan subtitle Bahasa Indonesia yang pendek, mudah dibaca di layar HP, dan tidak menutup produk." />
          <PromptBlock title="Prompt Gambar - Nano Banana" text={formatPromptJson(editorPack.nanoBananaPrompts)} copyLabel="Copy Nano Banana" onCopy={() => copyOutput("Nano Banana", formatPromptJson(editorPack.nanoBananaPrompts))} />
          <PromptBlock title="Prompt Video - Veo 3" text={formatPromptJson(editorPack.veo3Prompts)} copyLabel="Copy Veo 3" onCopy={() => copyOutput("Veo 3", formatPromptJson(editorPack.veo3Prompts))} />
          <PromptBlock title="Caption short" text={editorPack.captionShort ?? editorPack.caption} copyLabel="Copy Caption" onCopy={() => copyOutput("Caption", editorPack.captionShort ?? editorPack.caption)} />
          <PromptBlock title="Caption medium" text={editorPack.captionMedium ?? editorPack.caption} copyLabel="Copy Caption" onCopy={() => copyOutput("Caption", editorPack.captionMedium ?? editorPack.caption)} />
          <PromptBlock title="Caption storytelling" text={editorPack.captionStorytelling ?? editorPack.caption} copyLabel="Copy Caption" onCopy={() => copyOutput("Caption", editorPack.captionStorytelling ?? editorPack.caption)} />
          <PromptBlock title="Hashtag" items={editorPack.hashtags} copyLabel="Copy Hashtag" onCopy={() => copyOutput("Hashtag", editorPack.hashtags.join(" "))} />
          <PromptBlock title="CTA soft" text={editorPack.ctaSoft ?? editorPack.cta} copyLabel="Copy CTA" onCopy={() => copyOutput("CTA", editorPack.ctaSoft ?? editorPack.cta)} />
          <PromptBlock title="CTA direct" text={editorPack.ctaDirect ?? editorPack.cta} copyLabel="Copy CTA" onCopy={() => copyOutput("CTA", editorPack.ctaDirect ?? editorPack.cta)} />
          <PromptBlock title="CTA keranjang kuning" text={editorPack.ctaKeranjangKuning ?? editorPack.cta} copyLabel="Copy CTA" onCopy={() => copyOutput("CTA", editorPack.ctaKeranjangKuning ?? editorPack.cta)} />
          <PromptBlock title="Checklist Klaim Aman" items={editorPack.safeClaimChecklist} />
          <PromptBlock title="Compliance Checklist" text={formatPromptJson(editorPack.complianceChecklist)} copyLabel="Copy Compliance" onCopy={() => copyOutput("Compliance", formatPromptJson(editorPack.complianceChecklist))} />
          <PromptBlock title={`Compliance: ${editorPack.compliance?.status ?? "Safe"}`} items={[...(editorPack.compliance?.findings ?? []), ...(editorPack.compliance?.saferRewriteSuggestions ?? [])]} />
          <PromptBlock title="Editing notes" items={editorPack.editingNotes} />
          <PromptBlock title="Posting notes" items={editorPack.postingNotes} />
        </div>
      </SectionCard>
      ) : null}

      {activePage === "story-engine" ? (
        <StoryEngineDashboard product={selectedProduct} trendScore={selectedScore.total} contentPack={editorPack} />
      ) : null}

      {activePage === "multi-video-engine" ? (
        <MultiVideoEngineDashboard product={selectedProduct} trendScore={selectedScore.total} contentPack={editorPack} />
      ) : null}

      {activePage === "scheduler" ? (
      <SectionCard id="campaign-planner" title="Scheduler" description="Buat rencana posting 7 atau 14 hari dari produk terpilih dan isi performa manual per hari." icon={CalendarDays}>
        <SchedulerDashboard product={selectedProduct} contentStats={contentStats} />
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Durasi campaign</span>
            <select value={campaignDuration} onChange={(event) => setCampaignDuration(Number(event.target.value) as CampaignDuration)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              <option value={7}>7 hari</option>
              <option value={14}>14 hari</option>
            </select>
          </label>
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Tujuan campaign</span>
            <select value={campaignGoal} onChange={(event) => setCampaignGoal(event.target.value as CampaignGoal)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              <option value="awareness">awareness</option>
              <option value="clicks">clicks</option>
              <option value="orders">orders</option>
              <option value="testing product">testing product</option>
            </select>
          </label>
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Status campaign</span>
            <select value={campaignStatus} onChange={(event) => setCampaignStatus(event.target.value as CampaignStatus)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>
        <div className="mb-4 rounded-2xl border border-line bg-slate-50 p-4">
          <p className="text-sm font-black text-ink">Campaign dari produk terpilih</p>
          <p className="mt-1 text-sm text-muted">{selectedProduct.productName}</p>
          <ActionButton loading={loadingAction === "campaign"} onClick={saveCampaign} className="mt-3">
            Simpan Campaign
          </ActionButton>
          <p className="mt-2 text-xs leading-5 text-muted">Campaign tersimpan sebagai draft sederhana. Ubah status ke Active saat mulai posting.</p>
        </div>
        {!campaignId ? (
          <div className="mb-4 rounded-2xl border border-dashed border-line bg-slate-50 p-4">
            <p className="text-sm font-black text-ink">Belum ada rencana posting. Buat campaign 7 hari dari produk terbaik kamu.</p>
          </div>
        ) : null}
        <div className="grid gap-3 lg:grid-cols-7">
          {campaign.map((day) => (
            <article key={day.day} className="rounded-2xl border border-line p-4">
              <p className="text-xs font-black uppercase tracking-wide text-coral">Hari ke-{day.day}</p>
              <p className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{day.contentMode}</p>
              <h3 className="mt-2 text-sm font-bold text-ink">{day.angle}</h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">Hook</p>
              <p className="mt-1 text-sm leading-6 text-muted">{day.hook}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">Ide video</p>
              <p className="mt-1 text-sm leading-6 text-muted">{day.scriptIdea}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">Caption</p>
              <p className="mt-1 text-sm leading-6 text-muted">{day.caption}</p>
              <p className="mt-2 text-xs font-semibold text-ink">{day.cta}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{day.hashtagGroup.join(" ")}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{day.postingNote}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-line p-4">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <p className="text-sm font-bold text-ink">Input performa manual</p>
          </div>
          <div className="grid gap-3">
            {visiblePerformance.map((day, dayIndex) => (
              <div key={dayIndex} className="rounded-xl bg-slate-50 p-3">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-muted">Hari ke-{dayIndex + 1}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  {(Object.keys(day) as Array<keyof CampaignPerformanceDay>).map((field) => (
                    <input
                      key={field}
                      value={day[field]}
                      onChange={(event) => updatePerformance(dayIndex, field, event.target.value)}
                      placeholder={field}
                      aria-label={`Day ${dayIndex + 1} ${field}`}
                      className="min-h-10 rounded-xl border border-line px-2 text-sm outline-none focus:border-mint"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <MetricPill label="Total views" value={String(performanceSummary.totalViews)} />
            <MetricPill label="Total clicks" value={String(performanceSummary.totalClicks)} />
            <MetricPill label="Total order" value={String(performanceSummary.totalOrders)} />
            <MetricPill label="Revenue" value={`$${performanceSummary.estimatedRevenue.toFixed(2)}`} />
            <MetricPill label="CTR" value={`${performanceSummary.ctr.toFixed(2)}%`} />
            <MetricPill label="Conversion rate" value={`${performanceSummary.conversionRate.toFixed(2)}%`} />
          </div>
          <ActionButton loading={loadingAction === "performance"} onClick={savePerformance} className="mt-4">
            Simpan Performa
          </ActionButton>
          <p className="mt-2 text-xs leading-5 text-muted">Masukkan angka manual dari platform atau marketplace. App hanya menghitung dari data yang Anda isi.</p>
          {suggestions.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-black text-orange-900">Saran perbaikan setelah 5 hari</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-orange-900/80">
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>- {suggestion}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-teal-200 bg-teal-50 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-700" />
              <p className="text-sm leading-6 text-teal-900">Isi performa 5 hari pertama untuk melihat saran perbaikan jika hasil masih lemah.</p>
            </div>
          )}
        </div>
      </SectionCard>
      ) : null}

      {activePage === "profit-center" ? (
        <ProfitCenterDashboard analyticsStats={analyticsStats} performanceSummary={performanceSummary} contentStats={contentStats} />
      ) : null}

      {activePage === "ai-agents" ? (
        <AiAgentsDashboard product={selectedProduct} analyticsStats={analyticsStats} />
      ) : null}
    </>
  );
}

function PromptBlock({
  title,
  text,
  items,
  copyLabel,
  onCopy
}: {
  title: string;
  text?: string;
  items?: string[];
  copyLabel?: string;
  onCopy?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-ink">{title}</p>
        {copyLabel && onCopy ? (
          <button onClick={onCopy} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink">
            <Copy className="h-3.5 w-3.5" />
            {copyLabel}
          </button>
        ) : null}
      </div>
      {text ? <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted">{text}</p> : null}
      {items ? (
        <ul className="mt-2 space-y-2 text-sm leading-6 text-muted">
          {items.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function MediaPreview({ asset, className = "" }: { asset: UploadedMediaAsset; className?: string }) {
  if (asset.fileType === "video") {
    return (
      <video
        src={asset.url}
        className={`h-full w-full object-cover ${className}`}
        muted
        playsInline
        controls={false}
      />
    );
  }

  if (asset.fileType === "audio") {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center bg-slate-900 p-3 text-center text-white ${className}`}>
        <p className="text-xs font-black uppercase tracking-wide">Audio</p>
        <p className="mt-2 break-all text-xs text-white/70">{asset.fileName}</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Local browser preview uses uploaded data URLs before storage exists.
    <img src={asset.url} alt={asset.fileName} className={`h-full w-full object-cover ${className}`} />
  );
}

function CaptionOverlayTools({
  subtitleSettings,
  onSubtitleChange
}: {
  subtitleSettings: SubtitleSettings;
  onSubtitleChange: (settings: SubtitleSettings) => void;
}) {
  const update = <K extends keyof SubtitleSettings>(key: K, value: SubtitleSettings[K]) => {
    onSubtitleChange({ ...subtitleSettings, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-4 lg:col-span-2">
      <p className="text-sm font-bold text-ink">Caption dan Text Overlay Tools</p>
      <p className="mt-1 text-xs leading-5 text-muted">Atur subtitle overlay dengan safe-area agar teks tidak menutup produk dan tetap nyaman dibaca di layar short video.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectControl label="Position" value={subtitleSettings.position} onChange={(value) => update("position", value as SubtitleSettings["position"])} options={["top", "center", "bottom"]} />
        <SelectControl label="Alignment" value={subtitleSettings.alignment} onChange={(value) => update("alignment", value as SubtitleSettings["alignment"])} options={["left", "center", "right"]} />
        <SelectControl label="Size" value={subtitleSettings.fontSize} onChange={(value) => update("fontSize", value as SubtitleSettings["fontSize"])} options={["small", "medium", "large"]} />
        <SelectControl label="Style" value={subtitleSettings.fontWeight} onChange={(value) => update("fontWeight", value as SubtitleSettings["fontWeight"])} options={["normal", "semi-bold", "bold"]} />
        <SelectControl label="Background" value={subtitleSettings.backgroundStyle} onChange={(value) => update("backgroundStyle", value as SubtitleSettings["backgroundStyle"])} options={["none", "solid", "translucent"]} />
        <label className="rounded-2xl border border-line p-3">
          <span className="text-xs font-black uppercase tracking-wide text-muted">Text color</span>
          <input type="color" value={subtitleSettings.textColor} onChange={(event) => update("textColor", event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-line" />
        </label>
        <div className="rounded-2xl border border-line bg-slate-50 p-3 sm:col-span-2">
          <p className="text-xs font-black uppercase tracking-wide text-muted">Safe-area positioning</p>
          <p className="mt-2 text-sm leading-6 text-muted">Subtitle memakai area aman 9:16 dengan jarak dari tepi atas/bawah. User approval required sebelum upload manual ke platform.</p>
        </div>
      </div>
    </div>
  );
}

function FontTools({
  fontSettings,
  onChange
}: {
  fontSettings: FontSettings;
  onChange: (settings: FontSettings) => void;
}) {
  const fontOptions: SubtitleSettings["fontFamily"][] = ["Sans", "Rounded", "Clean Modern", "Bold Headline", "Subtitle style"];
  const updateFont = (key: keyof FontSettings, fontFamily: SubtitleSettings["fontFamily"]) => {
    onChange({ ...fontSettings, [key]: { ...fontSettings[key], fontFamily } });
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-4 lg:col-span-2">
      <p className="text-sm font-bold text-ink">Font Tools</p>
      <p className="mt-1 text-xs leading-5 text-muted">Pilih font aman untuk subtitle, hook, CTA, dan text overlay. Ini hanya preview draft, bukan render final AI video.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectControl label="Subtitle" value={fontSettings.subtitle.fontFamily} onChange={(value) => updateFont("subtitle", value as SubtitleSettings["fontFamily"])} options={fontOptions} />
        <SelectControl label="Hook text" value={fontSettings.hookText.fontFamily} onChange={(value) => updateFont("hookText", value as SubtitleSettings["fontFamily"])} options={fontOptions} />
        <SelectControl label="CTA text" value={fontSettings.ctaText.fontFamily} onChange={(value) => updateFont("ctaText", value as SubtitleSettings["fontFamily"])} options={fontOptions} />
        <SelectControl label="Text overlay" value={fontSettings.textOverlay.fontFamily} onChange={(value) => updateFont("textOverlay", value as SubtitleSettings["fontFamily"])} options={fontOptions} />
      </div>
    </div>
  );
}

function MusicTools({
  settings,
  assets,
  onChange,
  onUpload
}: {
  settings: MusicSettings;
  assets: UploadedMediaAsset[];
  onChange: (settings: MusicSettings) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const audioAssets = assets.filter((asset) => asset.fileType === "audio");

  return (
    <div className="rounded-2xl border border-line bg-white p-4 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">Music / Audio Panel</p>
          <p className="mt-1 text-xs leading-5 text-muted">Upload background music atau pakai placeholder default. Audio diterapkan ke seluruh video draft.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
          Upload Audio
          <input type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/webm,audio/ogg,.mp3,.wav,.aac,.m4a,.webm,.ogg" className="sr-only" onChange={onUpload} />
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectControl label="Music source" value={settings.sourceType} onChange={(value) => onChange({ ...settings, sourceType: value as MusicSettings["sourceType"] })} options={["none", "default", "uploaded"]} />
        <SelectControl label="Uploaded audio" value={settings.assetId ?? ""} onChange={(value) => onChange({ ...settings, sourceType: value ? "uploaded" : settings.sourceType, assetId: value || undefined })} options={["", ...audioAssets.map((asset) => asset.id)]} labels={{ "": "Tidak ada", ...Object.fromEntries(audioAssets.map((asset) => [asset.id, asset.fileName])) }} />
        <label className="rounded-2xl border border-line p-3">
          <span className="text-xs font-black uppercase tracking-wide text-muted">Volume {settings.volume}%</span>
          <input type="range" min={0} max={100} value={settings.volume} onChange={(event) => onChange({ ...settings, volume: Number(event.target.value) })} className="mt-3 w-full" />
        </label>
        <label className="rounded-2xl border border-line p-3">
          <span className="text-xs font-black uppercase tracking-wide text-muted">Trim start</span>
          <input type="number" min={0} value={settings.trimStart} onChange={(event) => onChange({ ...settings, trimStart: Number(event.target.value) || 0 })} className="mt-2 min-h-10 w-full rounded-xl border border-line px-3 text-sm" />
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-line p-3 text-sm font-semibold text-ink">
          <input type="checkbox" checked={settings.muted} onChange={(event) => onChange({ ...settings, muted: event.target.checked })} />
          Mute music
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-line p-3 text-sm font-semibold text-ink">
          <input type="checkbox" checked={settings.loop} onChange={(event) => onChange({ ...settings, loop: event.target.checked })} />
          Loop audio
        </label>
      </div>
    </div>
  );
}

function VoiceOverTools({
  settings,
  assets,
  onChange,
  onUpload,
  script,
  providerConnected
}: {
  settings: VoiceOverSettings;
  assets: UploadedMediaAsset[];
  onChange: (settings: VoiceOverSettings) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  script: string;
  providerConnected: boolean;
}) {
  const audioAssets = assets.filter((asset) => asset.fileType === "audio");

  return (
    <div className="rounded-2xl border border-line bg-white p-4 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">Voice Over Tools</p>
          <p className="mt-1 text-xs leading-5 text-muted">{providerConnected ? "Manual Voice Over Available. AI provider connected untuk prompt voice style." : "Voice Over Provider Not Connected. Manual Voice Over Available."}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
          Upload Voice Over
          <input type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/webm,audio/ogg,.mp3,.wav,.aac,.m4a,.webm,.ogg" className="sr-only" onChange={onUpload} />
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectControl label="Voice option" value={settings.selectedVoice} onChange={(value) => onChange({ ...settings, selectedVoice: value as VoiceOverSettings["selectedVoice"] })} options={["Female Casual ID", "Male Casual ID", "Friendly Seller ID", "UGC Creator ID"]} />
        <SelectControl label="Scene mode" value={settings.sceneMode} onChange={(value) => onChange({ ...settings, sceneMode: value as VoiceOverSettings["sceneMode"] })} options={["full_video", "per_scene"]} />
        <SelectControl label="Manual audio" value={settings.assetId ?? ""} onChange={(value) => onChange({ ...settings, sourceType: value ? "manual_upload" : settings.sourceType, assetId: value || undefined })} options={["", ...audioAssets.map((asset) => asset.id)]} labels={{ "": "Tidak ada", ...Object.fromEntries(audioAssets.map((asset) => [asset.id, asset.fileName])) }} />
        <label className="rounded-2xl border border-line p-3">
          <span className="text-xs font-black uppercase tracking-wide text-muted">Speed {settings.speed.toFixed(1)}x</span>
          <input type="range" min={0.7} max={1.3} step={0.1} value={settings.speed} onChange={(event) => onChange({ ...settings, speed: Number(event.target.value) })} className="mt-3 w-full" />
        </label>
        <label className="rounded-2xl border border-line p-3 sm:col-span-2">
          <span className="text-xs font-black uppercase tracking-wide text-muted">Style</span>
          <input value={settings.style} onChange={(event) => onChange({ ...settings, style: event.target.value })} className="mt-2 min-h-10 w-full rounded-xl border border-line px-3 text-sm" />
        </label>
        <div className="rounded-2xl border border-line bg-slate-50 p-3 sm:col-span-2">
          <p className="text-xs font-black uppercase tracking-wide text-muted">Use selected script</p>
          <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted">{script}</p>
        </div>
      </div>
    </div>
  );
}

function SelectControl({
  label,
  value,
  options,
  labels,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-2xl border border-line p-3">
      <span className="text-xs font-black uppercase tracking-wide text-muted">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-10 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
        {options.map((option) => (
          <option key={option || "empty"} value={option}>
            {labels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function MediaGalleryPanel({
  assets,
  onUpload,
  onRemove
}: {
  assets: UploadedMediaAsset[];
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (assetId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">Media</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Upload gambar, foto, atau video pendek lalu assign ke scene storyboard. Jika storage belum aktif, preview disimpan sebagai metadata/browser preview.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
          <FileUp className="h-4 w-4" />
          Upload Gambar / Foto
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm,.jpg,.jpeg,.png,.webp,.mp4,.mov,.webm"
            className="sr-only"
            onChange={onUpload}
          />
        </label>
      </div>

      {assets.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-slate-50 p-4">
          <p className="text-sm font-black text-ink">Belum ada media.</p>
          <p className="mt-1 text-sm leading-6 text-muted">Upload foto produk, hasil demo, atau video pendek agar tiap scene lebih mudah diproduksi.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {assets.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-2xl border border-line bg-slate-50">
              <div className="aspect-[9/12] bg-slate-200">
                <MediaPreview asset={asset} />
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-bold text-ink" title={asset.fileName}>{asset.fileName}</p>
                <p className="mt-1 text-xs text-muted">{asset.fileType.toUpperCase()} - {(asset.size / 1024).toFixed(0)} KB</p>
                <button onClick={() => onRemove(asset.id)} className="mt-3 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink">
                  Hapus Media
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function StoryboardTimeline({
  storyboard,
  mediaAssets,
  sceneMediaAssignments,
  onAssignMedia,
  onRemoveSceneMedia,
  onCopy
}: {
  storyboard?: StoryboardSet;
  mediaAssets: UploadedMediaAsset[];
  sceneMediaAssignments: SceneMediaAssignment[];
  onAssignMedia: (sceneNumber: number, assetId: string) => void;
  onRemoveSceneMedia: (sceneNumber: number, assetId?: string) => void;
  onCopy: (label: string, value: string) => void;
}) {
  if (!storyboard) {
    return (
      <div className="rounded-2xl border border-line bg-white p-4">
        <p className="text-sm font-bold text-ink">Storyboard</p>
        <p className="mt-2 text-sm leading-6 text-muted">Generate package untuk membuat storyboard dari script dan scene plan.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">Storyboard</p>
          <p className="mt-1 text-xs font-semibold text-muted">{storyboard.style} - {storyboard.aspectRatio} - {storyboard.totalDuration}</p>
        </div>
        <button onClick={() => onCopy("Storyboard", JSON.stringify(storyboard, null, 2))} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink">
          <Copy className="h-3.5 w-3.5" />
          Copy Storyboard
        </button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {storyboard.scenes.map((scene) => {
          const assignment = sceneMediaAssignments.find((item) => item.sceneNumber === scene.sceneNumber);
          const assignedMedia = mediaAssets.filter((asset) => assignment?.assetIds.includes(asset.id));
          const primaryMedia = mediaAssets.find((asset) => asset.id === assignment?.primaryAssetId) ?? assignedMedia[0];

          return (
            <details key={scene.sceneNumber} className="rounded-2xl border border-line bg-slate-50 p-4" open={scene.sceneNumber === 1}>
              <summary className="cursor-pointer text-sm font-black text-ink">
                Scene {scene.sceneNumber}: {scene.title} ({scene.duration})
              </summary>
              <div className="mt-3 grid gap-3 md:grid-cols-[140px_1fr]">
                <div className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="aspect-[9/16] bg-slate-100">
                    {primaryMedia ? (
                      <MediaPreview asset={primaryMedia} />
                    ) : (
                      <div className="flex h-full items-center justify-center p-3 text-center text-xs font-bold text-muted">
                        Placeholder media scene {scene.sceneNumber}
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-[11px] font-semibold text-muted">
                    {primaryMedia ? primaryMedia.fileName : "Belum ada media assigned"}
                  </div>
                </div>
                <div className="space-y-2 text-sm leading-6 text-muted">
              <p><strong className="text-ink">Objective:</strong> {scene.objective}</p>
              <p><strong className="text-ink">Visual:</strong> {scene.visualDescription}</p>
              <p><strong className="text-ink">Voice Over:</strong> {scene.voiceOver}</p>
              <p><strong className="text-ink">Subtitle:</strong> {scene.subtitleText}</p>
              <p><strong className="text-ink">On-screen text:</strong> {scene.onScreenText}</p>
              <p><strong className="text-ink">Camera angle:</strong> {scene.cameraAngle}</p>
              <p><strong className="text-ink">Camera movement:</strong> {scene.cameraMovement}</p>
              <p><strong className="text-ink">Composition:</strong> {scene.composition}</p>
              <p><strong className="text-ink">Lighting:</strong> {scene.lighting}</p>
              <p><strong className="text-ink">Transition:</strong> {scene.transition}</p>
              <label className="block rounded-2xl border border-line bg-white p-3">
                <span className="text-xs font-black uppercase tracking-wide text-muted">Assign media ke scene</span>
                <select
                  value=""
                  onChange={(event) => onAssignMedia(scene.sceneNumber, event.target.value)}
                  className="mt-2 min-h-10 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint"
                >
                  <option value="">Pilih media dari gallery</option>
                  {mediaAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.fileName}
                    </option>
                  ))}
                </select>
                {assignedMedia.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {assignedMedia.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => onRemoveSceneMedia(scene.sceneNumber, asset.id)}
                        className="rounded-full border border-line bg-slate-50 px-3 py-1 text-xs font-semibold text-ink"
                      >
                        Hapus {asset.fileName}
                      </button>
                    ))}
                    <button onClick={() => onRemoveSceneMedia(scene.sceneNumber)} className="rounded-full border border-line bg-slate-50 px-3 py-1 text-xs font-semibold text-ink">
                      Hapus Semua Media Scene
                    </button>
                  </div>
                ) : null}
              </label>
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => onCopy(`Nano Banana Scene ${scene.sceneNumber}`, scene.nanoBananaImagePrompt)} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink">
                  Copy Nano Banana
                </button>
                <button onClick={() => onCopy(`Veo 3 Scene ${scene.sceneNumber}`, scene.veo3ScenePrompt)} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink">
                  Copy Veo 3
                </button>
              </div>
                </div>
            </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

function StoryboardPreview({
  storyboard,
  previewMeta,
  mediaAssets,
  sceneMediaAssignments,
  subtitleSettings,
  musicSettings,
  voiceOverSettings,
  aiProviderConnected
}: {
  storyboard?: StoryboardSet;
  previewMeta?: ContentPack["previewVideoMeta"];
  mediaAssets: UploadedMediaAsset[];
  sceneMediaAssignments: SceneMediaAssignment[];
  subtitleSettings: SubtitleSettings;
  musicSettings: MusicSettings;
  voiceOverSettings: VoiceOverSettings;
  aiProviderConnected: boolean;
}) {
  const scenes = useMemo(() => storyboard?.scenes ?? [], [storyboard]);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeScene = scenes[currentScene];

  useEffect(() => {
    if (!isPlaying || scenes.length === 0) return undefined;

    const timer = window.setTimeout(() => {
      setCurrentScene((current) => {
        if (current >= scenes.length - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, parseSceneDurationMs(scenes[currentScene]?.duration ?? "2s"));

    return () => window.clearTimeout(timer);
  }, [currentScene, isPlaying, scenes]);

  if (!storyboard || !activeScene) {
    return (
      <div className="rounded-2xl border border-line bg-white p-4">
        <p className="text-sm font-bold text-ink">Preview Video</p>
        <p className="mt-2 text-sm leading-6 text-muted">Storyboard Preview / Animatic Preview akan muncul setelah package dibuat.</p>
      </div>
    );
  }

  const progress = `${currentScene + 1}/${scenes.length}`;
  const activeAssignment = sceneMediaAssignments.find((assignment) => assignment.sceneNumber === activeScene.sceneNumber);
  const activeMedia = mediaAssets.find((asset) => asset.id === activeAssignment?.primaryAssetId) ?? mediaAssets.find((asset) => activeAssignment?.assetIds.includes(asset.id));
  const textAlignClass = subtitleSettings.alignment === "left" ? "text-left" : subtitleSettings.alignment === "right" ? "text-right" : "text-center";
  const subtitlePositionClass = subtitleSettings.position === "top" ? "justify-start pt-16" : subtitleSettings.position === "center" ? "justify-center" : "justify-end pb-16";
  const subtitleSizeClass = subtitleSettings.fontSize === "small" ? "text-xs" : subtitleSettings.fontSize === "large" ? "text-base" : "text-sm";
  const subtitleWeightClass = subtitleSettings.fontWeight === "normal" ? "font-normal" : subtitleSettings.fontWeight === "bold" ? "font-black" : "font-bold";
  const subtitleBackgroundClass = subtitleSettings.backgroundStyle === "none" ? "bg-transparent" : subtitleSettings.backgroundStyle === "solid" ? "bg-black" : "bg-black/55";
  const activeMusic = mediaAssets.find((asset) => asset.id === musicSettings.assetId);
  const activeVoiceOver = mediaAssets.find((asset) => asset.id === voiceOverSettings.assetId);
  const replay = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-4 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">Storyboard Preview / Animatic Preview</p>
          <p className="mt-1 text-xs font-semibold text-muted">{previewMeta?.label ?? "Storyboard Preview / Animatic Preview"} - {storyboard.aspectRatio}</p>
        </div>
        <button
          onClick={() => alert(aiProviderConnected ? "AI video preview bisa memakai prompt Veo 3 saat provider tersedia." : "AI provider belum tersambung. Animatic preview tetap bisa dipakai.")}
          className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink"
        >
          Generate AI Video Preview
        </button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="mx-auto aspect-[9/16] w-full max-w-[260px] overflow-hidden rounded-[2rem] border-8 border-ink bg-ink text-white shadow-soft">
          <div className="relative h-full overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950">
            <div className="absolute left-4 right-4 top-4 z-20 rounded-2xl bg-white/10 p-3 text-xs font-bold uppercase tracking-wide">
              Scene {activeScene.sceneNumber} - {progress}
            </div>
            <div className="absolute inset-0">
              {activeMedia ? (
                <MediaPreview asset={activeMedia} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-5 text-center">
                  <p className="text-sm font-black">{activeScene.previewImagePlaceholder}</p>
                  <p className="mt-3 text-xs leading-5 text-white/70">{activeScene.visualDescription}</p>
                </div>
              )}
            </div>
            <div className={`absolute inset-x-4 top-20 z-20 ${textAlignClass}`}>
              <p className="inline-block rounded-2xl bg-white/85 px-3 py-2 text-xs font-black text-ink">{activeScene.onScreenText}</p>
            </div>
            <div className={`absolute inset-0 z-20 flex px-4 ${subtitlePositionClass}`}>
              <div className={`w-full rounded-2xl px-3 py-2 ${subtitleBackgroundClass} ${textAlignClass}`}>
                <p className={`${subtitleSizeClass} ${subtitleWeightClass}`} style={{ color: subtitleSettings.textColor }}>{activeScene.subtitleText}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCurrentScene((current) => Math.max(0, current - 1))} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
              Previous scene
            </button>
            <button onClick={() => setIsPlaying((playing) => !playing)} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={replay} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
              Replay
            </button>
            <button onClick={() => setCurrentScene((current) => Math.min(scenes.length - 1, current + 1))} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
              Next scene
            </button>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-mint" style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }} />
          </div>
          <div className="mt-4 grid gap-2 text-sm leading-6 text-muted">
            <p><strong className="text-ink">Duration:</strong> {activeScene.duration}</p>
            <p><strong className="text-ink">Voice over:</strong> {activeScene.voiceOver}</p>
            <p><strong className="text-ink">On-screen text:</strong> {activeScene.onScreenText}</p>
            <p><strong className="text-ink">Transition:</strong> {activeScene.transition}</p>
            <p><strong className="text-ink">Music:</strong> {musicSettings.muted ? "Muted" : activeMusic?.fileName ?? musicSettings.sourceType}</p>
            <p><strong className="text-ink">Voice option:</strong> {activeVoiceOver?.fileName ?? voiceOverSettings.selectedVoice} ({voiceOverSettings.sceneMode})</p>
            <p><strong className="text-ink">Mode:</strong> {previewMeta?.mode ?? "Animatic Preview"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  loading,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

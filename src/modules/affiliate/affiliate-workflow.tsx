"use client";

import { ButtonHTMLAttributes, ChangeEvent, useMemo, useState } from "react";
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
import { ContentPack, PromptEngineMode } from "@/modules/prompt-engine/types";
import { getRecommendationLabel } from "@/modules/scoring/recommendation-label";
import { scoreProduct } from "@/modules/scoring/score-product";
import { SAMPLE_PRODUCT_CSV, validateAndParseCsv } from "./csv-import";
import { sampleProducts } from "./sample-products";
import { getSourceBadgeText, getSourceClassName, getSourceTrustText } from "./source-badge";
import { AffiliateProduct, CompetitionLevel, ProductSource } from "./types";

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
  notes: "",
  contentPotential: "70",
  beginnerFriendliness: "75"
};

function sourceBadge(source: ProductSource) {
  return `rounded-full px-3 py-1 text-[10px] font-black ${getSourceClassName(source)}`;
}

type SaveTone = "info" | "success" | "error";
type LoadingAction = "manual" | "csv" | "url" | "hooks" | "script" | "caption" | "full" | "campaign" | "performance" | null;
type ProductFilter = "all" | "manual" | "csv" | "demo" | "highScore" | "lowCompetition";

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
  tiktokConnected,
  promptEngineMode,
  initialProducts,
  databaseConnected
}: {
  tiktokConnected: boolean;
  promptEngineMode: PromptEngineMode;
  initialProducts: AffiliateProduct[];
  databaseConnected: boolean;
}) {
  const [products, setProducts] = useState<AffiliateProduct[]>(initialProducts.length > 0 ? initialProducts : sampleProducts);
  const [selectedId, setSelectedId] = useState((initialProducts[0] ?? sampleProducts[0])?.id ?? "");
  const [form, setForm] = useState(initialForm);
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
  const selectedProduct = sortedProducts.find((product) => product.id === selectedId) ?? sortedProducts[0];
  const selectedScore = scoreProduct(selectedProduct);
  const selectedRecommendation = getRecommendationLabel(selectedScore.recommendation);
  const promptInput = { product: selectedProduct, mode: promptEngineMode };
  const promptAssets = generatedPack ?? buildTemplateContentPack(promptInput);
  const campaign = buildCampaignPlan(promptInput, campaignDuration, campaignGoal);
  const visiblePerformance = performance.slice(0, campaignDuration);
  const performanceSummary = calculatePerformanceSummary(visiblePerformance);
  const suggestions = isPoorCampaignPerformance(visiblePerformance) ? getImprovementSuggestions(promptEngineMode === "AI_CONNECTED") : [];
  const isDemoOnly = products.every((product) => product.source === "DEMO");
  const topProducts = sortedProducts
    .map((product) => ({ product, score: scoreProduct(product) }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 5);
  const sourceCounts = products.reduce(
    (counts, product) => ({ ...counts, [product.source]: counts[product.source] + 1 }),
    { DEMO: 0, MANUAL: 0, CSV_IMPORT: 0, REAL_API: 0 } as Record<ProductSource, number>
  );
  const activeCampaigns = campaignStatus === "Active" ? 1 : 0;

  function showStatus(message: string, tone: SaveTone = "info") {
    setSaveStatus(message);
    setSaveTone(tone);
  }

  function updateForm(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function addManualProduct() {
    if (!form.productName.trim() || !form.category.trim()) {
      showStatus("Isi nama produk dan kategori dulu sebelum menyimpan.", "error");
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
    if (!urlInput.trim()) {
      showStatus("Tempel URL produk dulu sebelum menyimpan.", "error");
      return;
    }

    setLoadingAction("url");
    const product: AffiliateProduct = {
      ...productFromForm("MANUAL", {
        ...initialForm,
        productName: "Product URL Research",
        category: "Manual research",
        productUrl: urlInput,
        notes: "URL saved for manual product research. This is not fetched from TikTok Shop API."
      }),
      id: `url-${Date.now()}`
    };

    setProducts((current) => sortProducts([product, ...current]));
    setSelectedId(product.id);
    setUrlInput("");

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
        showStatus("URL produk tersimpan sebagai MANUAL DATA.", "success");
      } else {
        showStatus(payload.message ?? "URL produk tersimpan lokal saja.", "error");
      }
    } catch {
      showStatus("URL produk tersimpan lokal saja.", "error");
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

  function fullPackText() {
    return [
      `Hook:\n${promptAssets.hooks.join("\n")}`,
      `Script 15 detik:\n${promptAssets.script15}`,
      `Script 30 detik:\n${promptAssets.script30}`,
      `Scene Plan:\n${promptAssets.scenePlan.join("\n")}`,
      `Caption:\n${promptAssets.caption}`,
      `Hashtag:\n${promptAssets.hashtags.join(" ")}`,
      `CTA:\n${promptAssets.cta}`,
      `Checklist Klaim Aman:\n${promptAssets.safeClaimChecklist.join("\n")}`
    ].join("\n\n");
  }

  function generatePack(part: "hooks" | "script" | "caption" | "full") {
    setLoadingAction(part);
    const pack = buildTemplateContentPack(promptInput);
    setDraftContentPacks((current) => current + 1);

    if (part === "hooks") {
      setGeneratedPack({ ...promptAssets, hooks: pack.hooks });
      showStatus("Hooks berhasil dibuat dalam Template Mode.", "success");
      setLoadingAction(null);
      return;
    }

    if (part === "script") {
      setGeneratedPack({ ...promptAssets, script15: pack.script15, script30: pack.script30, scenePlan: pack.scenePlan });
      showStatus("Script 15 detik dan 30 detik berhasil dibuat.", "success");
      setLoadingAction(null);
      return;
    }

    if (part === "caption") {
      setGeneratedPack({ ...promptAssets, caption: pack.caption, hashtags: pack.hashtags, cta: pack.cta });
      showStatus("Caption, hashtag, dan CTA berhasil dibuat.", "success");
      setLoadingAction(null);
      return;
    }

    setGeneratedPack(pack);
    fetch("/api/content-packs/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProduct.id,
        contentPack: pack,
        providerMode: promptEngineMode === "AI_CONNECTED" ? "AI" : "TEMPLATE"
      })
    })
      .then((response) => {
        showStatus(response.ok ? "Content pack tersimpan ke database." : "Content pack dibuat lokal saja.", response.ok ? "success" : "error");
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
      <section id="dashboard" className="rounded-[2rem] border border-white bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">Dashboard</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-ink sm:text-5xl">
          Kelola produk, konten, dan rencana posting affiliate TikTok dari satu tempat.
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
            <p className="text-sm font-black text-orange-900">DEMO DATA - Bukan dari TikTok Shop</p>
            <p className="mt-1 text-sm leading-6 text-orange-900/80">
              Produk demo hanya contoh. Tambahkan produk manual atau import CSV agar analisa lebih sesuai kebutuhan kamu.
            </p>
          </div>
        ) : null}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <MetricPill label="Produk tersimpan" value={String(products.length)} />
          <MetricPill label="Produk manual" value={String(sourceCounts.MANUAL)} />
          <MetricPill label="Produk CSV" value={String(sourceCounts.CSV_IMPORT)} />
          <MetricPill label="Produk demo" value={String(sourceCounts.DEMO)} tone={sourceCounts.DEMO > 0 ? "warn" : "neutral"} />
          <MetricPill label="Campaign aktif" value={String(activeCampaigns)} />
          <MetricPill label="Draft konten" value={String(draftContentPacks)} />
        </div>
        <p className="mt-4 text-sm font-black text-ink">Mulai dari sini</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Tambah Produk", "#product-hunter", "Input produk manual pertama kamu."],
            ["Import CSV", "#product-hunter", "Masukkan banyak produk dari file CSV."],
            ["Buat Konten", "#content-factory", "Generate hook, script, caption, dan CTA."],
            ["Buat Rencana Posting", "#campaign-planner", "Susun campaign 7 atau 14 hari."]
          ].map(([title, href, detail]) => (
            <a key={title} href={href} className="rounded-2xl border border-line bg-white p-4 transition hover:border-mint hover:bg-teal-50">
              <p className="text-sm font-black text-ink">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
            </a>
          ))}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {[
            ["Mode AI", promptEngineMode === "AI_CONNECTED" ? "AI Connected" : "Template Mode"],
            ["Status TikTok", tiktokConnected ? "Connected" : "Not Connected"],
            ["Sumber data", isDemoOnly ? "DEMO DATA" : "MANUAL DATA / CSV IMPORT"]
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

      <SectionCard id="product-hunter" title="Produk Affiliate" description="Tambah produk manual, import CSV, atau simpan link produk untuk riset." icon={PackageSearch}>
        {isDemoOnly ? (
          <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
              <div>
                <p className="text-sm font-black text-orange-900">DEMO DATA - Bukan dari TikTok Shop</p>
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
              <span className={sourceBadge(source)}>{source}</span>
              <p className="mt-2 text-xs font-bold text-ink">{getSourceBadgeText(source)}</p>
              <p className="mt-1 text-xs font-semibold text-muted">{getSourceTrustText(source)}</p>
              <p className="mt-1 text-xs font-semibold text-muted">
                {source === "REAL_API" ? "only after API fetch" : "available"}
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
              <p className="text-xs leading-5 text-muted">Data ini disimpan sebagai MANUAL DATA, bukan data resmi TikTok Shop.</p>
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
            <p className="mt-2 text-xs leading-5 text-muted">Baris valid akan disimpan sebagai CSV IMPORT. Baris invalid ditolak dengan pesan jelas.</p>
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
            <input value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="Tempel link produk" className="min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint" />
            <p className="mt-2 text-sm leading-6 text-muted">Link produk disimpan sebagai MANUAL DATA sampai integrasi API asli aktif.</p>
            <ActionButton loading={loadingAction === "url"} onClick={addUrlProduct} className="mt-3">
              Simpan URL
            </ActionButton>
            <p className="mt-2 text-xs leading-5 text-muted">URL hanya menjadi catatan riset manual sampai REAL API DATA aktif.</p>
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
                      <span className={sourceBadge(product.source)}>{product.source}</span>
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
                      href="#content-factory"
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

      <SectionCard id="product-detail" title="Detail Produk" description="Cek ringkasan produk sebelum membuat konten." icon={PackageSearch}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Produk", selectedProduct.productName],
            ["Platform", selectedProduct.platform],
            ["Kategori", selectedProduct.category],
            ["Sumber", `${getSourceBadgeText(selectedProduct.source)} - ${getSourceTrustText(selectedProduct.source)}`],
            ["Harga", String(selectedProduct.price)],
            ["Komisi", `${selectedProduct.commissionRate}%`],
            ["Terjual/Sales", selectedProduct.soldCount ? String(selectedProduct.soldCount) : `${selectedProduct.salesScore}/100`],
            ["Rating", `${selectedProduct.rating} (${selectedProduct.reviewCount} reviews)`],
            ["Kompetisi", selectedProduct.competitionLevel],
            ["Dibuat", new Date(selectedProduct.createdAt).toLocaleDateString()],
            ["Diupdate", new Date(selectedProduct.updatedAt).toLocaleDateString()],
            ["Link produk", selectedProduct.productUrl || "Belum diisi"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-line p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-2 break-words text-sm font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-line p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Catatan</p>
          <p className="mt-2 text-sm leading-6 text-muted">{selectedProduct.notes}</p>
        </div>
      </SectionCard>

      <SectionCard id="content-factory" title="Buat Konten" description="Buat hook, script, caption, hashtag, CTA, dan checklist klaim aman untuk produk terpilih." icon={Sparkles}>
        {promptEngineMode === "TEMPLATE_MODE" ? (
          <div className="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm font-black text-yellow-900">AI Provider Not Connected - Template Mode</p>
            <p className="mt-1 text-sm leading-6 text-yellow-900/80">Tambahkan `GEMINI_API_KEY` atau `OPENAI_API_KEY` untuk mengaktifkan AI Connected nanti.</p>
          </div>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl bg-ink p-5 text-white">
            <span className={sourceBadge(selectedProduct.source)}>{selectedProduct.source}</span>
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

        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton loading={loadingAction === "hooks"} onClick={() => generatePack("hooks")}>Buat Hook</ActionButton>
          <ActionButton loading={loadingAction === "script"} onClick={() => generatePack("script")}>Buat Script</ActionButton>
          <ActionButton loading={loadingAction === "caption"} onClick={() => generatePack("caption")}>Buat Caption</ActionButton>
          <ActionButton loading={loadingAction === "full"} onClick={() => generatePack("full")} className="bg-mint">Buat Full Pack</ActionButton>
          <button onClick={() => copyOutput("Full Pack", fullPackText())} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
            <Copy className="h-4 w-4" />
            Copy Full Pack
          </button>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">Gunakan script ini sebagai draft. Sesuaikan dengan gaya bicara kamu sebelum posting.</p>
        {!generatedPack ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-slate-50 p-4">
            <p className="text-sm font-black text-ink">Belum ada konten. Pilih produk lalu buat script konten.</p>
            <p className="mt-1 text-sm leading-6 text-muted">Mulai dari hook, script 15 detik, caption, atau full pack.</p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <PromptBlock title="Hook 3 detik pertama" items={promptAssets.hooks} copyLabel="Copy Hook" onCopy={() => copyOutput("Hook", promptAssets.hooks.join("\n"))} />
          <PromptBlock title="Script 15 detik" text={promptAssets.script15} copyLabel="Copy Script" onCopy={() => copyOutput("Script", promptAssets.script15)} />
          <PromptBlock title="Script 30 detik" text={promptAssets.script30} copyLabel="Copy Script" onCopy={() => copyOutput("Script", promptAssets.script30)} />
          <PromptBlock title="Scene Plan" items={promptAssets.scenePlan} />
          <PromptBlock title="Caption" text={promptAssets.caption} copyLabel="Copy Caption" onCopy={() => copyOutput("Caption", promptAssets.caption)} />
          <PromptBlock title="Hashtag" items={promptAssets.hashtags} copyLabel="Copy Hashtag" onCopy={() => copyOutput("Hashtag", promptAssets.hashtags.join(" "))} />
          <PromptBlock title="CTA" text={promptAssets.cta} />
          <PromptBlock title="Checklist Klaim Aman" items={promptAssets.safeClaimChecklist} />
        </div>
      </SectionCard>

      <SectionCard id="campaign-planner" title="Rencana Posting" description="Buat rencana posting 7 atau 14 hari dari produk terpilih dan isi performa manual per hari." icon={CalendarDays}>
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
              <h3 className="mt-2 text-sm font-bold text-ink">{day.angle}</h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">Hook</p>
              <p className="mt-1 text-sm leading-6 text-muted">{day.hook}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">Ide video</p>
              <p className="mt-1 text-sm leading-6 text-muted">{day.scriptIdea}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">Caption</p>
              <p className="mt-1 text-sm leading-6 text-muted">{day.caption}</p>
              <p className="mt-2 text-xs font-semibold text-ink">{day.cta}</p>
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
          <p className="mt-2 text-xs leading-5 text-muted">Masukkan angka manual dari TikTok atau TikTok Shop. App hanya menghitung dari data yang Anda isi.</p>
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
      {text ? <p className="mt-2 text-sm leading-6 text-muted">{text}</p> : null}
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

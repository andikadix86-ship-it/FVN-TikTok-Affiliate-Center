"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileUp,
  Link,
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
import { scoreProduct } from "@/modules/scoring/score-product";
import { SAMPLE_PRODUCT_CSV, validateAndParseCsv } from "./csv-import";
import { sampleProducts } from "./sample-products";
import { getSourceBadgeText, getSourceClassName } from "./source-badge";
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
  const [campaignId, setCampaignId] = useState<string | null>(null);

  const sortedProducts = useMemo(() => sortProducts(products), [products]);
  const selectedProduct = sortedProducts.find((product) => product.id === selectedId) ?? sortedProducts[0];
  const selectedScore = scoreProduct(selectedProduct);
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

  function updateForm(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function addManualProduct() {
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
        setSaveStatus("Manual product saved to database");
      } else {
        setSaveStatus(payload.message ?? "Manual product saved locally only");
      }
    } catch {
      setSaveStatus("Manual product saved locally only");
    }
  }

  async function importCsv() {
    const result = validateAndParseCsv(csv);
    setCsvErrors(result.errors);

    if (result.errors.length > 0 || result.products.length === 0) {
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
        setSaveStatus(`${payload.products.length} CSV products saved to database`);
      } else {
        setSaveStatus(payload.message ?? "CSV products imported locally only");
      }
    } catch {
      setSaveStatus("CSV products imported locally only");
    }
  }

  function addUrlProduct() {
    if (!urlInput.trim()) {
      return;
    }

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
  }

  function updatePerformance(dayIndex: number, field: keyof CampaignPerformanceDay, value: string) {
    setPerformance((current) =>
      current.map((day, index) => (index === dayIndex ? { ...day, [field]: Number(value) || 0 } : day))
    );
  }

  function generatePack(part: "hooks" | "script" | "caption" | "full") {
    const pack = buildTemplateContentPack(promptInput);
    setDraftContentPacks((current) => current + 1);

    if (part === "hooks") {
      setGeneratedPack({ ...promptAssets, hooks: pack.hooks });
      return;
    }

    if (part === "script") {
      setGeneratedPack({ ...promptAssets, script15: pack.script15, script30: pack.script30, scenePlan: pack.scenePlan });
      return;
    }

    if (part === "caption") {
      setGeneratedPack({ ...promptAssets, caption: pack.caption, hashtags: pack.hashtags, cta: pack.cta });
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
        setSaveStatus(response.ok ? "Content pack saved to database" : "Content pack generated locally");
      })
      .catch(() => setSaveStatus("Content pack generated locally"));
  }

  async function saveCampaign() {
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
        setSaveStatus("Campaign saved to database");
      } else {
        setSaveStatus(payload.message ?? "Campaign saved locally only");
      }
    } catch {
      setSaveStatus("Campaign saved locally only");
    }
  }

  async function savePerformance() {
    if (!campaignId) {
      setSaveStatus("Save campaign before saving performance");
      return;
    }

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
      setSaveStatus("Performance saved to database");
    } catch {
      setSaveStatus("Performance saved locally only");
    }
  }

  return (
    <>
      <section id="dashboard" className="rounded-[2rem] border border-white bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">Dashboard</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-ink sm:text-5xl">
          TikTok affiliate workflow for product, content, and campaign decisions.
        </h1>
        {isDemoOnly ? (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-black text-orange-900">DEMO DATA - Not from TikTok Shop</p>
            <p className="mt-1 text-sm leading-6 text-orange-900/80">Connect TikTok Shop API later, or use manual/CSV products now.</p>
          </div>
        ) : null}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <MetricPill label="Total products" value={String(products.length)} />
          <MetricPill label="Manual" value={String(sourceCounts.MANUAL)} />
          <MetricPill label="CSV imported" value={String(sourceCounts.CSV_IMPORT)} />
          <MetricPill label="Demo" value={String(sourceCounts.DEMO)} tone={sourceCounts.DEMO > 0 ? "warn" : "neutral"} />
          <MetricPill label="Active campaigns" value={String(activeCampaigns)} />
          <MetricPill label="Draft packs" value={String(draftContentPacks)} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {[
            ["Product Hunter Status", `${products.length} products ready`],
            ["Best Product Today", `${topProducts[0]?.product.productName ?? "No product"} (${topProducts[0]?.score.total ?? 0}/100)`],
            ["Campaign Progress", `${campaignStatus} / ${campaignDuration} days / ${campaignGoal}`],
            ["TikTok Account", tiktokConnected ? "Connected" : "Not Connected"],
            ["AI Prompt Engine", promptEngineMode === "AI_CONNECTED" ? "Connected" : "Template Mode"],
            ["Data Source", isDemoOnly ? "Demo Mode" : "User Provided Data"]
          ].map(([title, value]) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">{title}</p>
              <p className="mt-2 text-sm font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <p className="text-sm font-black text-ink">Top 5 recommended products by score</p>
          <div className="mt-3 grid gap-2">
            {topProducts.map(({ product, score }) => (
              <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <div>
                  <p className="text-sm font-bold text-ink">{product.productName}</p>
                  <p className="text-xs text-muted">{getSourceBadgeText(product.source)}</p>
                </div>
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{score.total}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Database status</p>
          <p className="mt-2 text-sm font-bold text-ink">{saveStatus}</p>
        </div>
      </section>

      <SectionCard id="product-hunter" title="Product Hunter" description="Add products manually, from CSV, or by saving a product URL for research." icon={PackageSearch}>
        {isDemoOnly ? (
          <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
              <div>
                <p className="text-sm font-black text-orange-900">DEMO DATA - Not from TikTok Shop</p>
                <p className="mt-1 text-sm leading-6 text-orange-900/80">
                  These products are sample data only. Connect TikTok Shop API, import CSV, or add products manually to use real data.
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
              <p className="mt-1 text-xs font-semibold text-muted">
                {source === "REAL_API" ? "only after API fetch" : "available"}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-line p-4">
            <div className="mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <p className="text-sm font-bold text-ink">Manual product input</p>
            </div>
            <div className="grid gap-2">
              {[
                ["productName", "Product name"],
                ["category", "Category"],
                ["price", "Price"],
                ["commissionRate", "Commission rate"],
                ["salesScore", "Sales score"],
                ["rating", "Rating"],
                ["reviewCount", "Review count"],
                ["productUrl", "Product URL"],
                ["imageUrl", "Image URL"],
                ["contentPotential", "Content potential"],
                ["beginnerFriendliness", "Beginner friendliness"]
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
                <option value="low">Low competition</option>
                <option value="medium">Medium competition</option>
                <option value="high">High competition</option>
              </select>
              <textarea name="notes" value={form.notes} onChange={updateForm} placeholder="Notes" className="min-h-20 rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-mint" />
              <button onClick={addManualProduct} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Add Manual Product</button>
            </div>
          </div>

          <div className="rounded-2xl border border-line p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              <p className="text-sm font-bold text-ink">CSV import</p>
            </div>
            <textarea value={csv} onChange={(event) => setCsv(event.target.value)} className="min-h-56 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-mint" />
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={importCsv} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Import CSV Products</button>
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE_PRODUCT_CSV)}`}
                download="tiktok-affiliate-products-sample.csv"
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
              >
                Download Sample CSV
              </a>
            </div>
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
              <p className="text-sm font-bold text-ink">Product URL input</p>
            </div>
            <input value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="Paste product URL" className="min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint" />
            <p className="mt-2 text-sm leading-6 text-muted">URL products are saved as MANUAL until real API fetching is connected.</p>
            <button onClick={addUrlProduct} className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Save URL</button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {sortedProducts.map((product) => {
            const productScore = scoreProduct(product);
            return (
              <button
                key={product.id}
                onClick={() => setSelectedId(product.id)}
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
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-ink">{productScore.recommendation}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-ink">{product.productName}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{product.category}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{product.notes}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <MetricPill label="Commission" value={`${product.commissionRate}%`} />
                      <MetricPill label="Sales" value={`${product.salesScore}/100`} />
                      <MetricPill label="Competition" value={product.competitionLevel} />
                    </div>
                  </div>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{productScore.total}</span>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard id="product-detail" title="Product Detail" description="Review the selected product fields before generating content." icon={PackageSearch}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Product", selectedProduct.productName],
            ["Platform", selectedProduct.platform],
            ["Category", selectedProduct.category],
            ["Source", getSourceBadgeText(selectedProduct.source)],
            ["Price", String(selectedProduct.price)],
            ["Commission", `${selectedProduct.commissionRate}%`],
            ["Sold/Sales", selectedProduct.soldCount ? String(selectedProduct.soldCount) : `${selectedProduct.salesScore}/100`],
            ["Rating", `${selectedProduct.rating} (${selectedProduct.reviewCount} reviews)`],
            ["Competition", selectedProduct.competitionLevel],
            ["Created", new Date(selectedProduct.createdAt).toLocaleDateString()],
            ["Updated", new Date(selectedProduct.updatedAt).toLocaleDateString()],
            ["Product URL", selectedProduct.productUrl || "Not set"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-line p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-2 break-words text-sm font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-line p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Notes</p>
          <p className="mt-2 text-sm leading-6 text-muted">{selectedProduct.notes}</p>
        </div>
      </SectionCard>

      <SectionCard id="content-factory" title="Content Factory" description="Generate TikTok hooks, scripts, scenes, captions, hashtags, CTAs, and safe talking points for the selected product." icon={Sparkles}>
        {promptEngineMode === "TEMPLATE_MODE" ? (
          <div className="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm font-black text-yellow-900">AI Provider Not Connected - Template Mode</p>
            <p className="mt-1 text-sm leading-6 text-yellow-900/80">Add `GEMINI_API_KEY` or `OPENAI_API_KEY` to enable provider-backed generation later.</p>
          </div>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl bg-ink p-5 text-white">
            <span className={sourceBadge(selectedProduct.source)}>{selectedProduct.source}</span>
            <h2 className="mt-3 text-2xl font-bold">{selectedProduct.productName}</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">{selectedProduct.notes}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div><p className="text-xs text-white/60">Score</p><p className="text-2xl font-black">{selectedScore.total}/100</p></div>
              <div><p className="text-xs text-white/60">Recommendation</p><p className="text-lg font-bold">{selectedScore.recommendation}</p></div>
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
          <button onClick={() => generatePack("hooks")} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Generate Hooks</button>
          <button onClick={() => generatePack("script")} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Generate Script</button>
          <button onClick={() => generatePack("caption")} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Generate Caption</button>
          <button onClick={() => generatePack("full")} className="rounded-full bg-mint px-4 py-2 text-sm font-semibold text-white">Generate Full Content Pack</button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <PromptBlock title="5 TikTok hooks" items={promptAssets.hooks} />
          <PromptBlock title="15-second script" text={promptAssets.script15} />
          <PromptBlock title="30-second script" text={promptAssets.script30} />
          <PromptBlock title="Scene-by-scene plan" items={promptAssets.scenePlan} />
          <PromptBlock title="Caption" text={promptAssets.caption} />
          <PromptBlock title="Hashtags" items={promptAssets.hashtags} />
          <PromptBlock title="CTA for TikTok Shop / keranjang kuning" text={promptAssets.cta} />
          <PromptBlock title="Safe claim checklist" items={promptAssets.safeClaimChecklist} />
          <PromptBlock title="Product talking points" items={promptAssets.talkingPoints} />
        </div>
      </SectionCard>

      <SectionCard id="campaign-planner" title="Campaign Planner" description="Create a campaign from the selected product and enter simple performance data by day." icon={CalendarDays}>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Campaign duration</span>
            <select value={campaignDuration} onChange={(event) => setCampaignDuration(Number(event.target.value) as CampaignDuration)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
            </select>
          </label>
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Campaign goal</span>
            <select value={campaignGoal} onChange={(event) => setCampaignGoal(event.target.value as CampaignGoal)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              <option value="awareness">awareness</option>
              <option value="clicks">clicks</option>
              <option value="orders">orders</option>
              <option value="testing product">testing product</option>
            </select>
          </label>
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Campaign status</span>
            <select value={campaignStatus} onChange={(event) => setCampaignStatus(event.target.value as CampaignStatus)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>
        <div className="mb-4 rounded-2xl border border-line bg-slate-50 p-4">
          <p className="text-sm font-black text-ink">Campaign from selected product</p>
          <p className="mt-1 text-sm text-muted">{selectedProduct.productName}</p>
          <button onClick={saveCampaign} className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Save Campaign</button>
        </div>
        <div className="grid gap-3 lg:grid-cols-7">
          {campaign.map((day) => (
            <article key={day.day} className="rounded-2xl border border-line p-4">
              <p className="text-xs font-black uppercase tracking-wide text-coral">Day {day.day}</p>
              <h3 className="mt-2 text-sm font-bold text-ink">{day.angle}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{day.hook}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{day.scriptIdea}</p>
              <p className="mt-2 text-xs font-semibold text-ink">{day.cta}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{day.postingNote}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-line p-4">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <p className="text-sm font-bold text-ink">Manual performance input</p>
          </div>
          <div className="grid gap-3">
            {performance.map((day, dayIndex) => (
              <div key={dayIndex} className="rounded-xl bg-slate-50 p-3">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-muted">Day {dayIndex + 1}</p>
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
            <MetricPill label="Total orders" value={String(performanceSummary.totalOrders)} />
            <MetricPill label="Revenue" value={`$${performanceSummary.estimatedRevenue.toFixed(2)}`} />
            <MetricPill label="CTR" value={`${performanceSummary.ctr.toFixed(2)}%`} />
            <MetricPill label="Conversion" value={`${performanceSummary.conversionRate.toFixed(2)}%`} />
          </div>
          <button onClick={savePerformance} className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Save Performance</button>
          {suggestions.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-black text-orange-900">AI improvement suggestions after 5 days</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-orange-900/80">
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>- {suggestion}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-teal-200 bg-teal-50 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-700" />
              <p className="text-sm leading-6 text-teal-900">Enter the first 5 days of performance to unlock improvement suggestions when results are weak.</p>
            </div>
          )}
        </div>
      </SectionCard>
    </>
  );
}

function PromptBlock({ title, text, items }: { title: string; text?: string; items?: string[] }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-sm font-bold text-ink">{title}</p>
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

"use client";

import { Fragment, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  ChevronRight,
  Crown,
  Flame,
  PackageCheck,
  Search,
  Sparkles,
  Store,
  TrendingUp
} from "lucide-react";
import { getRecommendationLabel } from "@/modules/scoring/recommendation-label";
import { scoreProduct } from "@/modules/scoring/score-product";
import { addProductToTikTokShowcase, productDisplayLimit, ShowcaseStatus } from "../affiliate-center-core";
import { saveProductWorkflowContext } from "../workflow-context";
import { AffiliateProduct, ProductSource } from "../types";

type MainTab = "trending-list" | "top-seller" | "top-affiliator" | "trending-product";
type RankingTab = "Top Hari Ini" | "Top Minggu Ini" | "Top Bulan Ini" | "Opportunity Score";
type SellerSubTab = "all" | "own" | "brand" | "fast-growth";
type ProductSubTab = "all" | "new" | "potential" | "fast-growth" | "video";

type SellerRow = {
  id: string;
  rank: number;
  name: string;
  logo: string;
  productName: string;
  revenue: number;
  sales: number;
  growth: number;
  averagePrice: number;
  affiliateRevenue: number;
  videoRevenue: number;
};

type AffiliatorRow = {
  id: string;
  rank: number;
  name: string;
  productName: string;
  platform: string;
  revenue: number;
  sales: number;
  engagement: number;
  topVideo: string;
};

const sourceLabels: Record<ProductSource, string> = {
  DEMO: "DEMO",
  MANUAL: "MANUAL",
  CSV_IMPORT: "CSV_IMPORT",
  REAL_API: "REAL_API"
};

const sourceClasses: Record<ProductSource, string> = {
  DEMO: "bg-amber-100 text-amber-900",
  MANUAL: "bg-violet-100 text-violet-800",
  CSV_IMPORT: "bg-sky-100 text-sky-800",
  REAL_API: "bg-emerald-100 text-emerald-800"
};
const fixedCategories = ["Electronics", "Fashion", "Beauty", "Home & Living", "Kitchen", "Baby", "Health", "Sports", "Automotive", "Books"];

export function ProductIntelligenceDashboard({
  products,
  selectedProductId,
  onSelectProduct,
  tiktokConnected = false
}: {
  products: AffiliateProduct[];
  selectedProductId: string;
  onSelectProduct: (productId: string) => void;
  tiktokConnected?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<MainTab>("trending-list");
  const [sellerSubTab, setSellerSubTab] = useState<SellerSubTab>("all");
  const [productSubTab, setProductSubTab] = useState<ProductSubTab>("all");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("TikTok Shop");
  const [period, setPeriod] = useState("7 hari");
  const [category, setCategory] = useState("Semua kategori");
  const [sortBy, setSortBy] = useState("Trend Score");
  const [rankingTab, setRankingTab] = useState<RankingTab>("Top Hari Ini");
  const [expandedProducts, setExpandedProducts] = useState(false);
  const [notice, setNotice] = useState("");
  const [showcaseStatuses, setShowcaseStatuses] = useState<Record<string, ShowcaseStatus>>({});
  const hasDemoData = products.some((product) => product.source === "DEMO");
  const categoryOptions = ["Semua kategori", ...fixedCategories];
  const rankedProducts = useMemo(
    () => {
      const search = query.trim().toLowerCase();
      const filtered = products.filter((product) => {
        const matchesQuery = !search || [product.productName, product.category, product.notes, product.targetAudience].some((value) => value.toLowerCase().includes(search));
        const matchesCategory = category === "Semua kategori" || product.category === category;
        const matchesPlatform = platform === "Semua" || product.platform === "TikTok";

        return matchesQuery && matchesCategory && matchesPlatform;
      });

      return filtered
        .map((product) => ({ product, score: scoreProduct(product) }))
        .sort((a, b) => {
          if (rankingTab === "Opportunity Score") return b.score.total - a.score.total;
          if (rankingTab === "Top Minggu Ini") return (b.product.soldCount ?? b.product.salesScore) - (a.product.soldCount ?? a.product.salesScore);
          if (rankingTab === "Top Bulan Ini") return estimateRevenue(b.product, b.score.total, 0) - estimateRevenue(a.product, a.score.total, 0);
          if (sortBy === "Komisi") return b.product.commissionRate - a.product.commissionRate;
          if (sortBy === "Penjualan") return b.product.salesScore - a.product.salesScore;
          if (sortBy === "Pendapatan") return estimateRevenue(b.product, b.score.total, 0) - estimateRevenue(a.product, a.score.total, 0);
          return b.score.total - a.score.total;
        });
    },
    [category, platform, products, query, rankingTab, sortBy]
  );
  const displayLimit = productDisplayLimit(expandedProducts);
  const topProducts = rankedProducts.slice(0, displayLimit);
  const topSellers: SellerRow[] = rankedProducts.slice(0, 10).map(({ product, score }, index) => ({
    id: `seller-${product.id}`,
    rank: index + 1,
    name: `${product.category} Official Store`,
    logo: product.imageUrl,
    productName: product.productName,
    revenue: estimateRevenue(product, score.total, index),
    sales: estimateSales(product, score.total, index),
    growth: Math.max(8, score.total - 42 + index),
    averagePrice: product.price || 19,
    affiliateRevenue: estimateRevenue(product, score.total, index) * 0.18,
    videoRevenue: estimateRevenue(product, score.total, index) * 0.12
  }));
  const topAffiliators: AffiliatorRow[] = rankedProducts.slice(0, 10).map(({ product, score }, index) => ({
    id: `creator-${product.id}`,
    rank: index + 1,
    name: creatorNames[index % creatorNames.length],
    productName: product.productName,
    platform: "TikTok Shop",
    revenue: estimateRevenue(product, score.total, index) * 0.32,
    sales: estimateSales(product, score.total, index),
    engagement: Math.max(3.2, Math.min(12.8, score.total / 10)),
    topVideo: `${product.category} review singkat`
  }));
  const summary: Array<[string, string, string, LucideIcon]> = [
    ["Produk Trending Hari Ini", String(topProducts.length), "#trending-products", Flame],
    ["Top Seller", String(topSellers.length), "#top-seller-table", Store],
    ["Top Affiliator", String(topAffiliators.length), "#top-affiliator-table", Crown],
    ["Produk Affiliate Potensial", String(rankedProducts.filter((item) => item.score.total >= 70).length), "#trending-products", PackageCheck]
  ];
  const handleProductAction = (product: AffiliateProduct, trendScore: number, action: string) => {
    if (action === "Add to TikTok Showcase") {
      const result = addProductToTikTokShowcase(product.id, tiktokConnected ? "active-tiktok-account" : undefined, tiktokConnected);
      setShowcaseStatuses((current) => ({ ...current, [product.id]: result.showcaseStatus }));
      setNotice(result.message);
    } else {
      setNotice(`${action} siap untuk ${product.productName}.`);
    }
    saveProductWorkflowContext(product, trendScore, action);
    onSelectProduct(product.id);
  };

  return (
    <section id="product-hunter" className="space-y-5">
      <header className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-soft">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">Product Intelligence</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Temukan peluang produk affiliate</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Temukan produk viral, toko terbaik, affiliator terbaik, dan peluang affiliate paling potensial.
            </p>
          </div>
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari produk, toko, kategori, atau brand..."
              className="min-h-12 w-full rounded-full border border-violet-100 bg-violet-50/50 pl-11 pr-4 text-sm font-semibold outline-none focus:border-violet-400 focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Platform" value={platform} onChange={setPlatform} options={["TikTok Shop", "Shopee", "Tokopedia", "Lazada", "Semua"]} />
          <FilterSelect label="Periode" value={period} onChange={setPeriod} options={["7 hari", "30 hari", "90 hari"]} />
          <FilterSelect label="Kategori" value={category} onChange={setCategory} options={categoryOptions} />
          <FilterSelect label="Urutkan berdasarkan" value={sortBy} onChange={setSortBy} options={["Penjualan", "Pendapatan", "Komisi", "Trend Score"]} />
        </div>
      </header>

      {hasDemoData ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-950">Marketplace API belum terhubung. Data ini masih contoh.</p>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="rounded-[2rem] border border-white bg-white p-4 shadow-soft">
          <p className="text-sm font-black text-ink">Category Browser</p>
          <div className="mt-3 grid gap-2">
            {categoryOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setNotice(`Filter Category aktif: ${item}.`);
                }}
                className={`rounded-2xl px-3 py-2 text-left text-sm font-black ${category === item ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white bg-white p-4 shadow-soft">
          <p className="text-sm font-black text-ink">Ranking</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["Top Hari Ini", "Top Minggu Ini", "Top Bulan Ini", "Opportunity Score"] as RankingTab[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setRankingTab(item);
                  setNotice(`Ranking aktif: ${item}.`);
                }}
                className={`rounded-full px-4 py-2 text-sm font-black ${rankingTab === item ? "bg-ink text-white" : "bg-slate-100 text-ink"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["DEMO", "MANUAL", "CSV_IMPORT", "REAL_API"] as ProductSource[]).map((source) => (
              <span key={source} className={`rounded-full px-3 py-1 text-xs font-black ${sourceClasses[source]}`}>{source}</span>
            ))}
          </div>
        </div>
      </section>

      {rankedProducts.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-violet-200 bg-white p-6 text-center">
          <p className="text-base font-black text-ink">Belum ada data sesuai filter.</p>
          <p className="mt-2 text-sm text-muted">Coba kosongkan pencarian, pilih kategori lain, atau ubah platform ke Semua.</p>
        </div>
      ) : null}

      {notice ? (
        <div className="rounded-[1.5rem] border border-violet-100 bg-white p-4">
          <p className="text-sm font-black text-ink">{notice}</p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(([title, value, href, Icon]) => (
          <a key={String(title)} href={String(href)} className="group rounded-[1.5rem] border border-white bg-white p-4 shadow-soft transition hover:-translate-y-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Icon className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-black text-white">Lihat</span>
            </div>
            <p className="mt-4 text-3xl font-black text-ink">{value}</p>
            <p className="mt-1 text-sm font-bold text-muted">{title}</p>
          </a>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-white p-3 shadow-soft">
        <p className="text-sm font-bold text-ink">Menampilkan {Math.min(topProducts.length, rankedProducts.length)} dari {rankedProducts.length} produk.</p>
        <button
          type="button"
          onClick={() => {
            setExpandedProducts(true);
            setNotice("Lihat Lebih Banyak aktif. Minimal 25 produk ditampilkan jika data tersedia.");
          }}
          disabled={expandedProducts}
          className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
        >
          Lihat Lebih Banyak
        </button>
      </div>

      <AiRecommendationPanel product={topProducts[0]?.product} category={topProducts[0]?.product.category ?? "Home & Living"} onSelectProduct={onSelectProduct} />

      <div className="rounded-[2rem] border border-white bg-white p-3 shadow-soft">
        <div className="flex gap-2 overflow-x-auto">
          {[
            ["trending-list", "🔥 Daftar Trending"],
            ["top-seller", "💼 Top Seller"],
            ["top-affiliator", "👑 Top Affiliator"],
            ["trending-product", "🛍 Produk Trending"]
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setActiveTab(value as MainTab)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${
                activeTab === value ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700 hover:bg-violet-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "trending-list" ? (
        <TrendingOverview
          topProducts={topProducts}
          topAffiliators={topAffiliators}
          topSellers={topSellers}
          selectedProductId={selectedProductId}
          onProductAction={handleProductAction}
          showcaseStatuses={showcaseStatuses}
        />
      ) : null}

      {activeTab === "top-seller" ? (
        <section id="top-seller-table" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
          <SubTabs
            items={[
              ["all", "Semua Toko"],
              ["own", "Peringkat Toko Akun Sendiri"],
              ["brand", "Peringkat Brand"],
              ["fast-growth", "Pertumbuhan Penjualan Cepat"]
            ]}
            active={sellerSubTab}
            onChange={(value) => setSellerSubTab(value as SellerSubTab)}
          />
          <TopSellerTable sellers={sellerSubTab === "fast-growth" ? [...topSellers].sort((a, b) => b.growth - a.growth) : topSellers} />
        </section>
      ) : null}

      {activeTab === "top-affiliator" ? (
        <section id="top-affiliator-table" className="min-w-0 rounded-[2rem] border border-white bg-white p-5 shadow-soft">
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            <FilterSelect label="Kategori" value={category} onChange={setCategory} options={categoryOptions.slice(0, 7)} />
            <FilterSelect label="Platform" value={platform} onChange={setPlatform} options={["TikTok Shop", "Shopee", "Tokopedia", "Semua"]} />
            <FilterSelect label="Periode" value={period} onChange={setPeriod} options={["7 hari", "30 hari", "90 hari"]} />
            <FilterSelect label="Estimasi pendapatan" value="Semua" onChange={() => undefined} options={["Semua", "> Rp1 juta", "> Rp5 juta", "> Rp10 juta"]} />
          </div>
          <TopAffiliatorTable affiliators={topAffiliators} />
        </section>
      ) : null}

      {activeTab === "trending-product" ? (
        <section id="trending-products" className="min-w-0 rounded-[2rem] border border-white bg-white p-5 shadow-soft">
          <SubTabs
            items={[
              ["all", "Semua Produk"],
              ["new", "🆕 Peringkat Produk Baru"],
              ["potential", "👍 Produk Affiliate Potensial"],
              ["fast-growth", "🔥 Pertumbuhan Penjualan Cepat"],
              ["video", "🎬 Produk Video Teratas"]
            ]}
            active={productSubTab}
            onChange={(value) => setProductSubTab(value as ProductSubTab)}
          />
          <ProductActionMarker className="mb-3" />
          <TrendingProductTable
            products={filterProductTab(topProducts, productSubTab)}
            selectedProductId={selectedProductId}
            onProductAction={handleProductAction}
            showcaseStatuses={showcaseStatuses}
          />
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-3">
            <p className="text-sm font-bold text-violet-900">Menampilkan {Math.min(topProducts.length, rankedProducts.length)} dari {rankedProducts.length} produk.</p>
            <button
              type="button"
              onClick={() => {
                setExpandedProducts(true);
                setNotice("Lihat Lebih Banyak aktif. Minimal 25 produk ditampilkan jika data tersedia.");
              }}
              disabled={expandedProducts}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50"
            >
              Lihat Lebih Banyak
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function TrendingOverview({
  topProducts,
  topAffiliators,
  topSellers,
  selectedProductId,
  onProductAction,
  showcaseStatuses
}: {
  topProducts: Array<{ product: AffiliateProduct; score: ReturnType<typeof scoreProduct> }>;
  topAffiliators: AffiliatorRow[];
  topSellers: SellerRow[];
  selectedProductId: string;
  onProductAction: (product: AffiliateProduct, trendScore: number, action: string) => void;
  showcaseStatuses: Record<string, ShowcaseStatus>;
}) {
  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-ink">Produk Terlaris</h3>
            <p className="mt-1 text-sm text-muted">Prioritas produk yang paling mudah dianalisa dan dibuat kontennya.</p>
          </div>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">Trend Score</span>
        </div>
        <div className="mt-4 grid max-h-[760px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
          {topProducts.map(({ product, score }, index) => (
            <article key={product.id} className={`rounded-[1.5rem] border p-4 transition ${selectedProductId === product.id ? "border-violet-300 bg-violet-50" : "border-line bg-white hover:bg-violet-50/60"}`}>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-black text-white">TOP {index + 1}</span>
                <SourceBadge source={product.source} />
              </div>
              <div className="mt-4 h-36 overflow-hidden rounded-2xl bg-slate-100">
                {product.imageUrl ? <div className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} /> : <div className="flex h-full items-center justify-center text-sm font-bold text-muted">No image</div>}
              </div>
              <h4 className="mt-4 line-clamp-2 text-base font-black text-ink">{product.productName}</h4>
              <p className="mt-1 text-sm text-muted">{product.category}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <StatBox label="Range harga" value={formatPriceRange(product.price)} />
                <StatBox label="Pendapatan" value={formatRupiah(estimateRevenue(product, score.total, index))} />
                <StatBox label="Penjualan" value={`${estimateSales(product, score.total, index)} pcs`} />
                <StatBox label="Trend Score" value={`${score.total}/100`} />
              </div>
              <div className="mt-4">
                <ProductActionBar product={product} trendScore={score.total} onProductAction={onProductAction} showcaseStatus={showcaseStatuses[product.id]} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="min-w-0 rounded-[2rem] border border-white bg-white p-5 shadow-soft">
          <h3 className="text-xl font-black text-ink">Top Affiliator</h3>
          <TopAffiliatorTable affiliators={topAffiliators} compact />
        </div>
        <div className="min-w-0 rounded-[2rem] border border-white bg-white p-5 shadow-soft">
          <h3 className="text-xl font-black text-ink">Top Seller</h3>
          <TopSellerTable sellers={topSellers} compact />
        </div>
      </section>
    </div>
  );
}

function TopSellerTable({ sellers, compact = false }: { sellers: SellerRow[]; compact?: boolean }) {
  return (
    <div className="mt-4 w-full max-w-full overflow-x-auto">
      <table className="min-w-[900px] w-full border-separate border-spacing-y-2 text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-3 py-2">Ranking</th>
            <th className="px-3 py-2">Info Toko</th>
            <th className="px-3 py-2">Pendapatan</th>
            <th className="px-3 py-2">Produk Terlaris</th>
            {!compact ? <th className="px-3 py-2">Tren Pendapatan</th> : null}
            {!compact ? <th className="px-3 py-2">Tingkat Pertumbuhan</th> : null}
            <th className="px-3 py-2">Penjualan</th>
            {!compact ? <th className="px-3 py-2">Harga Jual Rata-rata</th> : null}
            {!compact ? <th className="px-3 py-2">Pendapatan Affiliate</th> : null}
            {!compact ? <th className="px-3 py-2">Pendapatan Video</th> : null}
            <th className="px-3 py-2">Aksi Toko</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller.id} className="rounded-2xl bg-slate-50">
              <td className="rounded-l-2xl px-3 py-3 font-black text-violet-700">#{seller.rank}</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <Avatar imageUrl={seller.logo} label={seller.name} icon={<Store className="h-5 w-5" />} />
                  <div>
                    <p className="font-black text-ink">{seller.name}</p>
                    <p className="text-xs text-muted">TikTok Shop</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 font-bold text-ink">{formatRupiah(seller.revenue)}</td>
              <td className="px-3 py-3 text-muted">{seller.productName}</td>
              {!compact ? <td className="px-3 py-3"><MiniTrendChart score={seller.growth + 40} /></td> : null}
              {!compact ? <td className="px-3 py-3 font-bold text-emerald-700">+{seller.growth}%</td> : null}
              <td className="px-3 py-3">{seller.sales} pcs</td>
              {!compact ? <td className="px-3 py-3">{formatRupiah(seller.averagePrice)}</td> : null}
              {!compact ? <td className="px-3 py-3">{formatRupiah(seller.affiliateRevenue)}</td> : null}
              {!compact ? <td className="px-3 py-3">{formatRupiah(seller.videoRevenue)}</td> : null}
              <td className="rounded-r-2xl px-3 py-3">
                <div className="flex flex-wrap gap-2">
                  <SmallAction href="/produk-affiliate#seller-detail" label="Lihat Seller" />
                  {!compact ? <SmallAction href="/produk-affiliate" label="Cari Produk Dari Toko Ini" /> : null}
                  {!compact ? <SmallAction href="/buat-konten" label="Generate Strategi Konten" dark /> : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TopAffiliatorTable({ affiliators, compact = false }: { affiliators: AffiliatorRow[]; compact?: boolean }) {
  return (
    <div className="mt-4 w-full max-w-full overflow-x-auto">
      <table className="min-w-[760px] w-full border-separate border-spacing-y-2 text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-3 py-2">Ranking</th>
            <th className="px-3 py-2">Info Kreator</th>
            <th className="px-3 py-2">Platform</th>
            <th className="px-3 py-2">Produk Terlaris</th>
            <th className="px-3 py-2">Estimasi Pendapatan</th>
            {!compact ? <th className="px-3 py-2">Estimasi Penjualan</th> : null}
            {!compact ? <th className="px-3 py-2">Engagement</th> : null}
            {!compact ? <th className="px-3 py-2">Video Teratas</th> : null}
            <th className="px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {affiliators.map((creator) => (
            <tr key={creator.id} className="bg-slate-50">
              <td className="rounded-l-2xl px-3 py-3 font-black text-violet-700">#{creator.rank}</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <Avatar label={creator.name} icon={<Bot className="h-5 w-5" />} />
                  <p className="font-black text-ink">{creator.name}</p>
                </div>
              </td>
              <td className="px-3 py-3">{creator.platform}</td>
              <td className="px-3 py-3 text-muted">{creator.productName}</td>
              <td className="px-3 py-3 font-bold text-ink">{formatRupiah(creator.revenue)}</td>
              {!compact ? <td className="px-3 py-3">{creator.sales} pcs</td> : null}
              {!compact ? <td className="px-3 py-3">{creator.engagement.toFixed(1)}%</td> : null}
              {!compact ? <td className="px-3 py-3">{creator.topVideo}</td> : null}
              <td className="rounded-r-2xl px-3 py-3"><SmallAction href="/buat-konten" label="Analisa Kreator" dark /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendingProductTable({
  products,
  selectedProductId,
  onProductAction,
  showcaseStatuses
}: {
  products: Array<{ product: AffiliateProduct; score: ReturnType<typeof scoreProduct> }>;
  selectedProductId: string;
  onProductAction: (product: AffiliateProduct, trendScore: number, action: string) => void;
  showcaseStatuses: Record<string, ShowcaseStatus>;
}) {
  return (
    <div className="mt-4 w-full max-w-full overflow-x-auto">
      <table className="min-w-[1100px] w-full border-separate border-spacing-y-2 text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-3 py-2">Ranking</th>
            <th className="px-3 py-2">Gambar Produk</th>
            <th className="px-3 py-2">Nama Produk</th>
            <th className="px-3 py-2">Harga</th>
            <th className="px-3 py-2">Pendapatan</th>
            <th className="px-3 py-2">Tren Pendapatan</th>
            <th className="px-3 py-2">Tingkat Pertumbuhan</th>
            <th className="px-3 py-2">Penjualan</th>
            <th className="px-3 py-2">Harga Jual Rata-rata</th>
            <th className="px-3 py-2">Biaya Pengiriman</th>
            <th className="px-3 py-2">Tingkat Komisi</th>
            <th className="px-3 py-2">Jumlah Kreator</th>
            <th className="px-3 py-2">Rasio Konversi</th>
          </tr>
        </thead>
        <tbody>
          {products.map(({ product, score }, index) => {
            const active = selectedProductId === product.id;
            const sales = estimateSales(product, score.total, index);

            return (
              <Fragment key={product.id}>
                <tr className={active ? "bg-violet-50" : "bg-slate-50"}>
                  <td className="rounded-l-2xl px-3 py-3 font-black text-violet-700">#{index + 1}</td>
                  <td className="px-3 py-3">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-white">
                      {product.imageUrl ? <div className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} /> : null}
                    </div>
                  </td>
                  <td className="max-w-[240px] px-3 py-3">
                    <p className="line-clamp-2 font-black text-ink">{product.productName}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <SourceBadge source={product.source} />
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-muted">{getRecommendationLabel(score.recommendation)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">{formatRupiah(product.price)}</td>
                  <td className="px-3 py-3 font-bold">{formatRupiah(estimateRevenue(product, score.total, index))}</td>
                  <td className="px-3 py-3"><MiniTrendChart score={score.total} /></td>
                  <td className="px-3 py-3 font-bold text-emerald-700">+{Math.max(6, score.total - 48)}%</td>
                  <td className="px-3 py-3">{sales} pcs</td>
                  <td className="px-3 py-3">{formatRupiah(product.price || 19)}</td>
                  <td className="px-3 py-3">{formatRupiah(product.price > 35 ? 0 : 2)}</td>
                  <td className="px-3 py-3">{product.commissionRate}%</td>
                  <td className="px-3 py-3">{Math.max(3, Math.round(score.total / 8))}</td>
                  <td className="rounded-r-2xl px-3 py-3">{Math.max(1.2, score.total / 18).toFixed(1)}%</td>
                </tr>
                <tr className={active ? "bg-violet-50" : "bg-slate-50"}>
                  <td colSpan={13} className="rounded-b-2xl px-3 pb-3 pt-0">
                    <div className="border-t border-violet-100/70 pt-3 sm:ml-[168px]">
                      <ProductActionBar product={product} trendScore={score.total} onProductAction={onProductAction} showcaseStatus={showcaseStatuses[product.id]} />
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AiRecommendationPanel({
  product,
  category,
  onSelectProduct
}: {
  product?: AffiliateProduct;
  category: string;
  onSelectProduct: (productId: string) => void;
}) {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-violet-700 to-fuchsia-600 p-5 text-white shadow-soft">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-xl font-black">Rekomendasi AI Untuk Kamu</h3>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <RecommendationItem title="Produk peluang terbaik" value={product?.productName ?? "Tambahkan produk dulu"} />
            <RecommendationItem title="Kategori naik" value={category} />
            <RecommendationItem title="Kompetisi rendah" value="Cari produk score 70+" />
            <RecommendationItem title="Cocok pemula" value="Pilih produk mudah didemokan" />
          </div>
        </div>
        <a
          href="/buat-konten"
          onClick={() => product ? onSelectProduct(product.id) : undefined}
          className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-violet-700"
        >
          Buat Konten Dari Rekomendasi Ini
        </a>
      </div>
    </section>
  );
}

function ProductActionBar({
  product,
  trendScore,
  onProductAction,
  showcaseStatus
}: {
  product: AffiliateProduct;
  trendScore: number;
  onProductAction: (product: AffiliateProduct, trendScore: number, action: string) => void;
  showcaseStatus?: ShowcaseStatus;
}) {
  const click = (action: string) => onProductAction(product, trendScore, action);

  return (
    <div className="w-full min-w-0">
      <div className="flex w-full min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
        <SmallAction href="/produk-affiliate#product-detail" label="Lihat Detail" onClick={() => click("Lihat Detail Produk")} />
        <SmallAction href="/produk-affiliate#product-detail" label="Save Opportunity" onClick={() => click("Save Opportunity")} />
        <SmallAction href="/buat-konten" label="Create Content" onClick={() => click("Create Content")} dark />
        <SmallAction href="/campaigns" label="Create Campaign" onClick={() => click("Create Campaign")} />
        <SmallAction href="/produk-affiliate#product-detail" label="Add to TikTok" onClick={() => click("Add to TikTok Showcase")} />
        <SmallAction href="/story-engine" label="Buat Story" onClick={() => click("Buat Story")} />
        <SmallAction href="/multi-video-engine" label="Buat Video" onClick={() => click("Buat Video")} dark />
        <SmallAction href="/rencana-posting" label="Jadwalkan" onClick={() => click("Jadwalkan")} dark />
        {showcaseStatus ? <ShowcaseBadge status={showcaseStatus} /> : null}
      </div>
      <ProductActionMarker className="mt-2" />
    </div>
  );
}

function ProductActionMarker({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-md border border-yellow-400 bg-yellow-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-yellow-900 ${className}`}>
      PRODUCT ACTION BAR V3 ACTIVE
    </div>
  );
}

function ShowcaseBadge({ status }: { status: ShowcaseStatus }) {
  const classes: Record<ShowcaseStatus, string> = {
    NOT_CONNECTED: "bg-amber-100 text-amber-950",
    PENDING: "bg-sky-100 text-sky-950",
    ADDED_TO_SHOWCASE: "bg-emerald-100 text-emerald-950",
    FAILED: "bg-rose-100 text-rose-950"
  };

  return <span className={`inline-flex h-8 shrink-0 items-center rounded-full px-3 text-[11px] font-black whitespace-nowrap ${classes[status]}`}>Showcase: {status}</span>;
}

function SmallAction({ href, label, onClick, dark = false }: { href: string; label: string; onClick?: () => void; dark?: boolean }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-full border px-3 text-[11px] font-black leading-none whitespace-nowrap transition hover:-translate-y-0.5 ${
        dark ? "border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-200" : "border-violet-100 bg-white text-violet-700 hover:border-violet-300"
      }`}
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5" />
    </a>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="rounded-2xl border border-violet-100 bg-white p-3">
      <span className="text-xs font-black uppercase tracking-wide text-muted">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-10 w-full rounded-xl border border-violet-100 bg-violet-50/50 px-3 text-sm font-semibold outline-none focus:border-violet-400">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function SubTabs({ items, active, onChange }: { items: Array<[string, string]>; active: string; onChange: (value: string) => void }) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto">
      {items.map(([value, label]) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${active === value ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: ProductSource }) {
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${sourceClasses[source]}`}>{sourceLabels[source]}</span>;
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-black text-ink">{value}</p>
    </div>
  );
}

function Avatar({ imageUrl, label, icon }: { imageUrl?: string; label: string; icon: ReactNode }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-violet-100 text-violet-700">
      {imageUrl ? <div aria-label={label} className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} /> : icon}
    </div>
  );
}

function MiniTrendChart({ score }: { score: number }) {
  const bars = [36, 48, 42, Math.max(40, score - 20), Math.max(48, score - 8), score];
  return (
    <span className="inline-flex h-8 items-end gap-1 rounded-full bg-white px-2 py-1">
      {bars.map((bar, index) => <span key={`${bar}-${index}`} className="w-1.5 rounded-full bg-violet-500" style={{ height: `${Math.max(20, bar)}%` }} />)}
    </span>
  );
}

function RecommendationItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3">
      <p className="text-xs font-bold text-white/70">{title}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function filterProductTab(products: Array<{ product: AffiliateProduct; score: ReturnType<typeof scoreProduct> }>, tab: ProductSubTab) {
  if (tab === "potential") return products.filter((item) => item.score.total >= 70);
  if (tab === "fast-growth") return [...products].sort((a, b) => b.score.factors.salesPotential - a.score.factors.salesPotential);
  if (tab === "video") return [...products].sort((a, b) => b.score.factors.contentPotential - a.score.factors.contentPotential);
  if (tab === "new") return [...products].sort((a, b) => Date.parse(b.product.createdAt) - Date.parse(a.product.createdAt));
  return products;
}

function estimateRevenue(product: AffiliateProduct, score: number, index: number) {
  const price = product.price || 19;
  const base = Math.max(product.salesScore, score) * price * (12 - Math.min(index, 8));
  return Math.round(base * 1600);
}

function estimateSales(product: AffiliateProduct, score: number, index: number) {
  return product.soldCount ?? Math.round(Math.max(product.salesScore, score) * (9 - Math.min(index, 6)));
}

function formatRupiah(value: number) {
  return `Rp${Math.round(value).toLocaleString("id-ID")}`;
}

function formatPriceRange(price: number) {
  const low = Math.max(1, price * 0.9);
  const high = Math.max(low, price * 1.15);
  return `${formatRupiah(low)} - ${formatRupiah(high)}`;
}

const creatorNames = ["Ayu Review", "Raka Finds", "Mila UGC", "Dapur Nia", "Fajar Deals", "Tasya Daily", "Bima Review", "Sari Hemat"];

"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  CalendarClock,
  ChevronRight,
  DollarSign,
  Flame,
  GraduationCap,
  Layers3,
  Megaphone,
  PackageSearch,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Video,
  WandSparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MetricPill } from "@/components/metric-pill";
import { getRecommendationLabel } from "@/modules/scoring/recommendation-label";
import { getSourceBadgeText, getSourceClassName } from "../source-badge";
import { AffiliateProduct, ProductSource } from "../types";

type TopProduct = {
  product: AffiliateProduct;
  score: {
    total: number;
    recommendation: "Promote" | "Test First" | "Avoid";
  };
};

type ContentStats = {
  totalDrafts: number;
  readyDrafts: number;
  postedDrafts: number;
  latestDrafts: Array<{ id: string; productName: string; status: string; hook: string }>;
};

type PostedStats = {
  postedToday: number;
  bestByViews: string;
  bestByOrders: string;
  latestPosted: Array<{ id: string; productName: string; url: string; postedAt: string }>;
};

type AnalyticsStats = {
  viewsThisWeek: number;
  clicksThisWeek: number;
  ordersThisWeek: number;
  revenueThisWeek: number;
  bestProduct: string;
  bestContent: string;
};

type ActionPlanStats = {
  mainFocus: string;
  topActions: string[];
};

export function AffiliateDashboard({
  products,
  topProducts,
  isDemoOnly,
  sourceCounts,
  activeCampaigns,
  contentStats,
  draftContentPacks,
  postedStats,
  analyticsStats,
  actionPlanStats,
  onSelectProduct
}: {
  products: AffiliateProduct[];
  topProducts: TopProduct[];
  isDemoOnly: boolean;
  sourceCounts: Record<ProductSource, number>;
  activeCampaigns: number;
  contentStats: ContentStats;
  draftContentPacks: number;
  postedStats: PostedStats;
  analyticsStats: AnalyticsStats;
  actionPlanStats: ActionPlanStats;
  onSelectProduct: (productId: string) => void;
}) {
  const [agentMessage, setAgentMessage] = useState("");
  const hasDemoProducts = sourceCounts.DEMO > 0;
  const latestDrafts = contentStats.latestDrafts.slice(0, 3);
  const quickActions = [
    {
      title: "Cari Produk Viral",
      description: "Temukan produk terbaik hari ini",
      href: "#product-hunter",
      icon: Flame,
      gradient: "from-violet-500 to-fuchsia-500"
    },
    {
      title: "Buat Konten Affiliate",
      description: "Buat konten menarik dalam 1 klik",
      href: "#content-factory",
      icon: WandSparkles,
      gradient: "from-indigo-500 to-violet-500"
    },
    {
      title: "Story Engine",
      description: "Buat story selling yang menjual & viral",
      href: "#content-factory",
      icon: PlayCircle,
      gradient: "from-purple-500 to-rose-500"
    },
    {
      title: "Jadwalkan Posting",
      description: "Atur jadwal posting semua akunmu",
      href: "#campaign-planner",
      icon: CalendarClock,
      gradient: "from-sky-500 to-violet-500"
    },
    {
      title: "Lihat Profit",
      description: "Pantau performa & profit harianmu",
      href: "/analytics",
      icon: DollarSign,
      gradient: "from-emerald-500 to-violet-500"
    }
  ];
  const templates = [
    ["Video Review", "Review natural produk pilihan", "Review Natural"],
    ["Story Selling", "Bangun cerita sebelum jualan", "Affiliate Story"],
    ["Edukasi", "Konten tips yang mudah dipahami", "Educational Review"],
    ["Testimoni", "Format pengalaman user", "Testimonial Style"],
    ["Perbandingan", "Bandingkan opsi produk", "Comparison"],
    ["Lainnya", "Eksplor mode konten lain", "UGC Natural"]
  ];
  const agents: Array<[string, string, LucideIcon]> = [
    ["Product Hunter Agent", "Bantu pilih produk yang layak ditest", PackageSearch],
    ["Content Creator Agent", "Bantu susun hook, script, dan CTA", Sparkles],
    ["Profit Optimizer Agent", "Bantu baca peluang profit sederhana", TrendingUp],
    ["Trend Analyzer Agent", "Bantu lihat sinyal tren konten", BarChart3],
    ["CEO Assistant Agent", "Bantu susun fokus kerja harian", Bot]
  ];
  const scheduleItems = latestDrafts.length > 0
    ? latestDrafts.map((draft, index) => ({
        platform: "TikTok",
        title: draft.productName,
        time: `${9 + index * 3}:00`,
        status: draft.status
      }))
    : [];

  return (
    <section id="dashboard" className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-600 p-6 text-white shadow-soft sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/70">Dashboard</p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">Halo Andika! 👋</h1>
            <p className="mt-3 text-lg font-bold text-white/90">Selamat datang di FVN Affiliate Center</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">Kelola produk, buat konten, dan tingkatkan profit affiliate kamu.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#product-hunter" className="rounded-full bg-white px-5 py-3 text-sm font-black text-violet-700 shadow-soft">Mulai Cari Produk</a>
              <a href="#content-factory" className="rounded-full border border-white/30 px-5 py-3 text-sm font-black text-white">Buat Konten</a>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/20 bg-white/15 p-4 backdrop-blur">
            <p className="text-sm font-bold text-white/70">Fokus hari ini</p>
            <p className="mt-2 text-xl font-black leading-tight">{actionPlanStats.mainFocus}</p>
            <a href="/action-plan" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-violet-700">
              Lihat Rencana
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {hasDemoProducts ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-950">DEMO ONLY - Bukan dari TikTok Shop</p>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            Produk demo hanya contoh. Tambahkan produk manual atau import CSV agar analisa lebih sesuai kebutuhan kamu.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <a key={action.title} href={action.href} className="group rounded-[1.6rem] border border-white bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-soft`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-black text-ink">{action.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted">{action.description}</p>
                    </div>
                    <span className="rounded-full bg-violet-50 p-2 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          <section className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">🔥 TOP 10 PRODUK HARI INI</p>
                <h2 className="mt-1 text-2xl font-black text-ink">Produk yang paling layak ditest</h2>
              </div>
              <a href="#product-hunter" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Lihat Semua</a>
            </div>

            {topProducts.length === 0 ? (
              <EmptyState title="Belum ada produk." description="Tambahkan produk manual atau import CSV untuk mulai melihat ranking produk." href="#product-hunter" action="Tambah Produk" />
            ) : (
              <div className="mt-5 grid gap-3">
                {topProducts.map(({ product, score }, index) => (
                  <article key={product.id} className="grid gap-3 rounded-[1.5rem] border border-line bg-slate-50 p-3 transition hover:border-violet-200 hover:bg-violet-50/50 sm:grid-cols-[44px_72px_1fr_auto] sm:items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-sm font-black text-white">#{index + 1}</div>
                    <div className="h-20 overflow-hidden rounded-2xl bg-white sm:h-16">
                      {product.imageUrl ? <div className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} /> : <div className="flex h-full items-center justify-center text-xs font-bold text-muted">No image</div>}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-black text-ink">{product.productName}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${getSourceClassName(product.source)}`}>{getSourceBadgeText(product.source)}</span>
                        {product.source === "DEMO" ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-900">DEMO ONLY</span> : null}
                      </div>
                      <p className="mt-1 text-sm text-muted">{product.category}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-muted">
                        <span>Trend Score {score.total}/100</span>
                        <span>Komisi {product.commissionRate}%</span>
                        <span>{getRecommendationLabel(score.recommendation)}</span>
                        <MiniTrendChart score={score.total} />
                      </div>
                    </div>
                    <a
                      href="#content-factory"
                      onClick={() => onSelectProduct(product.id)}
                      className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-black text-white"
                    >
                      Generate Konten
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-ink">Buat Konten Lebih Cepat</h2>
                <p className="mt-1 text-sm text-muted">Pilih template, lalu lanjutkan di Content Factory.</p>
              </div>
              <a href="#content-factory" className="text-sm font-black text-violet-700">Buka Content Factory</a>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map(([title, description, preset]) => (
                <a key={title} href={`#content-factory?preset=${encodeURIComponent(preset)}`} className="rounded-[1.4rem] border border-line bg-gradient-to-br from-white to-violet-50 p-4 transition hover:border-violet-300">
                  <Video className="h-6 w-6 text-violet-700" />
                  <p className="mt-3 text-sm font-black text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-ink">Proyek Terbaru Kamu</h2>
                <a href="/content-library" className="text-sm font-black text-violet-700">Lihat Draft</a>
              </div>
              {latestDrafts.length === 0 ? (
                <EmptyState title="Belum ada konten." description="Mulai dari produk viral atau buat konten baru." href="#content-factory" action="Buat Konten Baru" />
              ) : (
                <div className="mt-4 space-y-3">
                  {latestDrafts.map((draft) => (
                    <article key={draft.id} className="grid grid-cols-[56px_1fr] gap-3 rounded-2xl bg-slate-50 p-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Layers3 className="h-6 w-6" /></div>
                      <div>
                        <p className="line-clamp-1 text-sm font-black text-ink">{draft.productName}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-muted">{draft.hook}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-ink">{draft.status}</span>
                          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-muted">30s</span>
                          <a href={`/content-library/${draft.id}`} className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-black text-white">Edit</a>
                          <a href="#campaign-planner" className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-ink">Jadwalkan</a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div id="ai-agents" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
              <h2 className="text-xl font-black text-ink">AI Agents</h2>
              <p className="mt-1 text-sm text-muted">Gunakan rekomendasi sederhana dulu sampai agent penuh siap.</p>
              <div className="mt-4 grid gap-3">
                {agents.map(([name, description, Icon]) => (
                  <article key={String(name)} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-ink">{name}</p>
                        <p className="text-xs text-muted">{description}</p>
                      </div>
                    </div>
                    <button onClick={() => setAgentMessage("Agent sedang disiapkan. Untuk saat ini gunakan mode rekomendasi manual.")} className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-violet-700">Jalankan</button>
                  </article>
                ))}
              </div>
              {agentMessage ? (
                <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-3 text-sm font-bold text-violet-950">{agentMessage}</div>
              ) : null}
            </div>
          </section>
        </div>

        <AffiliateRightPanel
          isDemoOnly={isDemoOnly}
          products={products}
          activeCampaigns={activeCampaigns}
          contentStats={contentStats}
          draftContentPacks={draftContentPacks}
          postedStats={postedStats}
          analyticsStats={analyticsStats}
          scheduleItems={scheduleItems}
        />
      </div>
    </section>
  );
}

function AffiliateRightPanel({
  isDemoOnly,
  products,
  activeCampaigns,
  contentStats,
  draftContentPacks,
  postedStats,
  analyticsStats,
  scheduleItems
}: {
  isDemoOnly: boolean;
  products: AffiliateProduct[];
  activeCampaigns: number;
  contentStats: ContentStats;
  draftContentPacks: number;
  postedStats: PostedStats;
  analyticsStats: AnalyticsStats;
  scheduleItems: Array<{ platform: string; title: string; time: string; status: string }>;
}) {
  const bestContent = postedStats.latestPosted[0];
  const totalDrafts = contentStats.totalDrafts + draftContentPacks;

  return (
    <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
      <section id="profit-center" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-ink">Ringkasan Profit</h2>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">7 Hari Terakhir</span>
        </div>
        {isDemoOnly ? <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs font-bold text-amber-900">DEMO - data profit belum real.</p> : null}
        <div className="mt-4 grid gap-2">
          <MetricPill label="Total Profit" value={`Rp${analyticsStats.revenueThisWeek.toLocaleString("id-ID")}`} />
          <MetricPill label="Klik" value={String(analyticsStats.clicksThisWeek)} />
          <MetricPill label="Order" value={String(analyticsStats.ordersThisWeek)} />
          <MetricPill label="Komisi" value={`Rp${analyticsStats.revenueThisWeek.toLocaleString("id-ID")}`} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-ink">Jadwal Posting</h2>
          <a href="#campaign-planner" className="text-xs font-black text-violet-700">Lihat Semua</a>
        </div>
        {scheduleItems.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted">Belum ada jadwal. Buat campaign 7 hari dari produk terbaik kamu.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {scheduleItems.map((item) => (
              <article key={`${item.title}-${item.time}`} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-violet-600">{item.platform} - {item.time}</p>
                <p className="mt-1 line-clamp-1 text-sm font-black text-ink">{item.title}</p>
                <p className="mt-1 text-xs text-muted">{item.status}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
        <h2 className="text-lg font-black text-ink">Performa Konten Terbaik</h2>
        {bestContent ? (
          <article className="mt-4 rounded-2xl bg-slate-50 p-3">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">#1</div>
              <div>
                <p className="text-sm font-black text-ink">{bestContent.productName}</p>
                <p className="mt-1 text-xs text-muted">Views dari input manual</p>
                <p className="mt-1 text-xs font-black text-violet-700">{postedStats.bestByViews || "Belum ada views"}</p>
              </div>
            </div>
          </article>
        ) : (
          <p className="mt-3 text-sm leading-6 text-muted">Belum ada performa konten. Input views, klik, order, dan revenue secara manual setelah posting.</p>
        )}
      </section>

      <section className="rounded-[2rem] bg-gradient-to-br from-violet-700 to-fuchsia-600 p-5 text-white shadow-soft">
        <Megaphone className="h-8 w-8" />
        <h2 className="mt-4 text-xl font-black">Tingkatkan Profit Kamu!</h2>
        <p className="mt-2 text-sm leading-6 text-white/80">Gunakan AI Agents untuk optimasi konten dan tingkatkan konversi hingga 2x lipat.</p>
        <a href="#ai-agents" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-violet-700">Pelajari Cara Optimasi</a>
      </section>

      <section className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
        <h2 className="text-lg font-black text-ink">Status Singkat</h2>
        <div className="mt-3 grid gap-2">
          <MetricPill label="Produk" value={String(products.length)} />
          <MetricPill label="Draft" value={String(totalDrafts)} />
          <MetricPill label="Campaign aktif" value={String(activeCampaigns)} />
          <MetricPill label="Terposting hari ini" value={String(postedStats.postedToday)} />
        </div>
      </section>
    </aside>
  );
}

function MiniTrendChart({ score }: { score: number }) {
  const bars = [42, 58, 46, Math.max(35, score - 15), Math.max(45, score - 5), score];

  return (
    <span className="inline-flex h-7 items-end gap-1 rounded-full bg-white px-2 py-1">
      {bars.map((bar, index) => (
        <span key={`${bar}-${index}`} className="w-1.5 rounded-full bg-violet-500" style={{ height: `${Math.max(20, bar)}%` }} />
      ))}
    </span>
  );
}

function EmptyState({ title, description, href, action }: { title: string; description: string; href: string; action: string }) {
  return (
    <div className="mt-4 rounded-[1.5rem] border border-dashed border-violet-200 bg-violet-50/60 p-5 text-center">
      <GraduationCap className="mx-auto h-8 w-8 text-violet-700" />
      <p className="mt-3 text-base font-black text-ink">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
      <a href={href} className="mt-4 inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">{action}</a>
    </div>
  );
}

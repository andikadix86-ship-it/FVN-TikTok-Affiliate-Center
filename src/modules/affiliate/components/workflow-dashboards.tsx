"use client";

import { useState } from "react";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  DollarSign,
  Layers3,
  PlaySquare,
  RefreshCcw,
  Sparkles,
  Video
} from "lucide-react";
import { MetricPill } from "@/components/metric-pill";
import { ContentPack } from "@/modules/prompt-engine/types";
import { AffiliateProduct } from "../types";
import { productToWorkflowContext, saveAffiliateWorkflowContext } from "../workflow-context";

type PerformanceSummary = {
  totalViews: number;
  totalClicks: number;
  totalOrders: number;
  estimatedRevenue: number;
  ctr: number;
  conversionRate: number;
};

type CampaignDay = {
  day: number;
  contentMode: string;
  angle: string;
  hook: string;
  scriptIdea: string;
  caption: string;
  cta: string;
  postingNote: string;
};

type AnalyticsStats = {
  viewsThisWeek: number;
  clicksThisWeek: number;
  ordersThisWeek: number;
  revenueThisWeek: number;
  bestProduct: string;
  bestContent: string;
};

type ContentStats = {
  totalDrafts: number;
  readyDrafts: number;
  postedDrafts: number;
  latestDrafts: Array<{ id: string; productName: string; status: string; hook: string }>;
};

export function ProductContextCard({ product, trendScore }: { product: AffiliateProduct; trendScore: number }) {
  return (
    <div className="rounded-[1.5rem] border border-violet-100 bg-violet-50/70 p-4">
      <div className="grid gap-4 sm:grid-cols-[96px_1fr] sm:items-center">
        <div className="h-24 overflow-hidden rounded-2xl bg-white">
          {product.imageUrl ? <div className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} /> : <div className="flex h-full items-center justify-center text-xs font-bold text-muted">No image</div>}
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Product Context</p>
          <h3 className="mt-1 text-xl font-black text-ink">{product.productName}</h3>
          <p className="mt-1 text-sm text-muted">{product.category}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <MetricPill label="Harga" value={`Rp${product.price.toLocaleString("id-ID")}`} />
            <MetricPill label="Komisi" value={`${product.commissionRate}%`} />
            <MetricPill label="Trend Score" value={`${trendScore}/100`} />
            <MetricPill label="Status" value="Siap Dipakai" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentFactoryFlowPanel({
  product,
  trendScore,
  contentPack,
  onGenerate
}: {
  product: AffiliateProduct;
  trendScore: number;
  contentPack: ContentPack;
  onGenerate: () => void;
}) {
  const templates = ["Video Review", "Story Selling", "Edukasi", "Testimoni", "Perbandingan", "Soft Selling", "Problem Solution", "Before After"];

  return (
    <div className="mb-5 space-y-4">
      <ProductContextCard product={product} trendScore={trendScore} />
      <div className="rounded-[1.5rem] border border-line bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-ink">Template konten</p>
            <p className="mt-1 text-sm text-muted">Pilih format awal, lalu generate script dan lanjut ke menu berikutnya.</p>
          </div>
          <button onClick={onGenerate} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Generate Script</button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {templates.map((template) => (
            <button key={template} className="shrink-0 rounded-full bg-violet-50 px-4 py-2 text-sm font-black text-violet-700 hover:bg-violet-100">{template}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <OutputCard title="Hook" value={contentPack.hooks[0] ?? "Generate untuk membuat hook."} />
        <OutputCard title="Angle konten" value={contentPack.productInsight ?? "Angle akan muncul setelah konten dibuat."} />
        <OutputCard title="Platform recommendation" value="TikTok Shop video pendek, format 9:16, posting manual." />
        <OutputCard title="Posting difficulty" value={trendScore >= 75 ? "Mudah ditest pemula" : "Perlu testing hook dan CTA"} />
        <OutputCard title="Testing plan" value="Buat 3 variasi hook, posting 3 hari, lalu cek views, klik, dan order." />
        <OutputCard title="CTA" value={contentPack.ctaKeranjangKuning ?? contentPack.cta} />
      </div>
      <WorkflowActionButtons product={product} trendScore={trendScore} contentPack={contentPack} />
    </div>
  );
}

export function StoryEngineDashboard({ product, trendScore, contentPack }: { product: AffiliateProduct; trendScore: number; contentPack: ContentPack }) {
  const [mode, setMode] = useState("Affiliate Story");
  const [message, setMessage] = useState("");
  const structure = [
    ["Problem", product.problemSolved || "Masalah harian yang relate dengan target audience."],
    ["Emotion", "Tunjukkan rasa ribet, penasaran, atau ingin solusi cepat."],
    ["Solution", product.mainBenefit || `Kenalkan ${product.productName} sebagai solusi praktis.`],
    ["Proof", "Gunakan demo produk, before-after aman, atau pengalaman natural."],
    ["CTA", contentPack.ctaKeranjangKuning ?? contentPack.cta]
  ];

  function saveStory(action: string) {
    saveAffiliateWorkflowContext({
      product: productToWorkflowContext(product, trendScore),
      contentIdea: {
        hook: contentPack.hooks[0] ?? "",
        angle: contentPack.productInsight ?? mode,
        caption: contentPack.caption,
        cta: contentPack.cta
      },
      story: {
        mode,
        storyline: structure.map(([label, value]) => `${label}: ${value}`).join("\n"),
        scenePlan: contentPack.scenePlan
      },
      lastAction: action,
      updatedAt: new Date().toISOString()
    });
    setMessage(`${action} siap. Konteks story disimpan untuk menu berikutnya.`);
  }

  return (
    <section id="story-engine" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
      <Header icon={Layers3} title="Story Engine" subtitle="Ubah produk dan konsep konten menjadi cerita yang menjual, sederhana, dan mudah diproduksi." />
      <div className="mt-4"><ProductContextCard product={product} trendScore={trendScore} /></div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.5rem] border border-line p-4">
          <p className="text-sm font-black text-ink">Mode story</p>
          <div className="mt-3 grid gap-2">
            {["Affiliate Story", "Education Story", "Business Story", "Islamic Story", "Motivational Story", "Kids Story"].map((item) => (
              <button key={item} onClick={() => setMode(item)} className={`rounded-2xl px-4 py-3 text-left text-sm font-black ${mode === item ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"}`}>{item}</button>
            ))}
          </div>
          <button onClick={() => saveStory("Generate Story")} className="mt-4 w-full rounded-full bg-ink px-4 py-2 text-sm font-black text-white">Generate Story</button>
        </div>
        <div className="rounded-[1.5rem] border border-line p-4">
          <p className="text-sm font-black text-ink">Story Structure</p>
          <div className="mt-3 grid gap-3">
            {structure.map(([label, value]) => <OutputCard key={label} title={label} value={value} />)}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <OutputCard title="Storyline" value={structure.map(([label, value]) => `${label}: ${value}`).join("\n")} />
        <OutputCard title="Scene plan" value={contentPack.scenePlan.join("\n")} />
        <OutputCard title="Voice over" value={contentPack.voiceOverDraft ?? contentPack.script15} />
        <OutputCard title="Subtitle draft" value={contentPack.storyboard?.scenes.map((scene) => scene.subtitleText).join("\n") ?? contentPack.script15} />
        <OutputCard title="Caption" value={contentPack.caption} />
        <OutputCard title="CTA & Hashtag" value={`${contentPack.cta}\n${contentPack.hashtags.join(" ")}`} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionLink href="#multi-video-engine" label="Kirim ke Multi Video Engine" onClick={() => saveStory("Kirim ke Multi Video Engine")} />
        <ActionLink href="/content-library" label="Simpan ke Content Library" onClick={() => saveStory("Simpan ke Content Library")} />
        <ActionLink href="#campaign-planner" label="Jadwalkan" onClick={() => saveStory("Jadwalkan")} />
      </div>
      {message ? <Notice message={message} /> : null}
    </section>
  );
}

export function MultiVideoEngineDashboard({ product, trendScore, contentPack }: { product: AffiliateProduct; trendScore: number; contentPack: ContentPack }) {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState("Problem Solution");
  const [message, setMessage] = useState("");
  const formats = ["Review", "Problem Solution", "Before After", "Testimoni", "Edukasi", "Komedi Ringan", "Perbandingan", "Fakta Menarik", "Soft Selling", "CTA Hard Selling"];
  const videoPlans = Array.from({ length: count }, (_, index) => ({
    title: `${format} #${index + 1} - ${product.productName}`,
    hook: contentPack.hooks[index % contentPack.hooks.length] ?? contentPack.hooks[0] ?? "Hook produk",
    script: index % 2 === 0 ? contentPack.script15 : contentPack.script30,
    scene: contentPack.scenePlan[index % contentPack.scenePlan.length] ?? product.demoIdea,
    voiceOver: contentPack.voiceOverDraft ?? contentPack.script15,
    caption: contentPack.caption,
    hashtag: contentPack.hashtags.join(" "),
    cta: contentPack.cta,
    status: "Draft"
  }));

  function saveVideos(action: string) {
    saveAffiliateWorkflowContext({
      product: productToWorkflowContext(product, trendScore),
      videoPlans: videoPlans.map((plan) => ({ title: plan.title, hook: plan.hook, status: "Draft" })),
      lastAction: action,
      updatedAt: new Date().toISOString()
    });
    setMessage(`${action} siap. ${videoPlans.length} rencana video tersimpan di workflow context.`);
  }

  return (
    <section id="multi-video-engine" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
      <Header icon={Video} title="Multi Video Engine" subtitle="Buat banyak variasi video dari satu produk, story, atau script yang sudah dibuat." />
      <div className="mt-4"><ProductContextCard product={product} trendScore={trendScore} /></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <SelectCard label="Jumlah video" value={String(count)} options={["3", "5", "10", "30"]} onChange={(value) => setCount(value === "30" ? 30 : Number(value))} />
        <SelectCard label="Format video" value={format} options={formats} onChange={setFormat} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => saveVideos("Generate Semua")} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Generate Semua</button>
        <button onClick={() => saveVideos("Simpan Semua ke Content Library")} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Simpan Semua ke Content Library</button>
        <a href="#campaign-planner" onClick={() => saveVideos("Jadwalkan Batch")} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Jadwalkan Batch</a>
        <button onClick={() => saveVideos("Edit Satu-satu")} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Edit Satu-satu</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {videoPlans.slice(0, Math.min(count, 10)).map((plan) => (
          <article key={plan.title} className="rounded-[1.5rem] border border-line bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-black text-ink">{plan.title}</h3>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-violet-700">{plan.status}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted"><strong>Hook:</strong> {plan.hook}</p>
            <p className="mt-1 text-sm leading-6 text-muted"><strong>Script:</strong> {plan.script}</p>
            <p className="mt-1 text-sm leading-6 text-muted"><strong>Scene:</strong> {plan.scene}</p>
            <p className="mt-1 text-sm leading-6 text-muted"><strong>CTA:</strong> {plan.cta}</p>
          </article>
        ))}
      </div>
      {message ? <Notice message={message} /> : null}
    </section>
  );
}

export function SchedulerDashboard({ product, contentStats }: { product: AffiliateProduct; contentStats: ContentStats }) {
  const schedule = [
    { title: `${product.productName} - Video Review`, platform: "TikTok", time: "09:00", status: "Scheduled" },
    { title: `${product.productName} - Story Selling`, platform: "Instagram Reels", time: "13:00", status: "Pending Approval" },
    { title: `${product.productName} - Problem Solution`, platform: "YouTube Shorts", time: "19:30", status: "Need Revision" }
  ];

  return (
    <div className="mb-5 rounded-[1.5rem] border border-violet-100 bg-violet-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-ink">Scheduler Workflow</p>
          <p className="mt-1 text-sm text-muted">Pilih konten dari Content Library, platform, akun, tanggal, jam, frekuensi, dan timezone Asia/Jakarta.</p>
        </div>
        <a href="/content-library" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Pilih Konten</a>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-muted">Calendar View</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted">
            {Array.from({ length: 14 }, (_, index) => <span key={index} className="rounded-xl bg-violet-50 px-2 py-3">{index + 1}</span>)}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-muted">List View</p>
          <div className="mt-3 space-y-2">
            {schedule.map((item) => (
              <div key={item.title} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <p className="font-black text-ink">{item.title}</p>
                <p className="text-muted">{item.platform} - {item.time} WIB - {item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs font-bold text-muted">Draft tersedia: {contentStats.totalDrafts}. Status posting tetap manual sampai API posting resmi disetujui.</p>
    </div>
  );
}

export function ProfitCenterDashboard({
  analyticsStats,
  performanceSummary,
  contentStats
}: {
  analyticsStats: AnalyticsStats;
  performanceSummary: PerformanceSummary;
  contentStats: ContentStats;
}) {
  const weakContent = performanceSummary.totalViews > 0 && performanceSummary.ctr < 1.5;

  return (
    <section id="profit-center" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
      <Header icon={DollarSign} title="Analytics / Profit Center" subtitle="Pantau performa dan profit dari data manual yang kamu input setelah posting." />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <MetricPill label="Views" value={String(analyticsStats.viewsThisWeek || performanceSummary.totalViews)} />
        <MetricPill label="Klik" value={String(analyticsStats.clicksThisWeek || performanceSummary.totalClicks)} />
        <MetricPill label="Order" value={String(analyticsStats.ordersThisWeek || performanceSummary.totalOrders)} />
        <MetricPill label="Komisi" value={`Rp${analyticsStats.revenueThisWeek.toLocaleString("id-ID")}`} />
        <MetricPill label="Profit" value={`Rp${performanceSummary.estimatedRevenue.toLocaleString("id-ID")}`} />
        <MetricPill label="Conversion Rate" value={`${performanceSummary.conversionRate.toFixed(2)}%`} />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <OutputCard title="Konten terbaik" value={analyticsStats.bestContent || "Belum ada data performa konten."} />
        <OutputCard title="Produk terbaik" value={analyticsStats.bestProduct || "Belum ada produk terbaik dari data performa."} />
        <OutputCard title="Campaign terbaik" value={contentStats.readyDrafts > 0 ? `${contentStats.readyDrafts} draft siap posting untuk ditest.` : "Belum ada campaign dengan performa cukup."} />
        <OutputCard title="Rekomendasi" value={weakContent ? "Konten views ada tapi klik rendah. Kirim ke AI Agents untuk ubah CTA dan buat versi testimoni." : "Kumpulkan data views, klik, order, dan komisi untuk rekomendasi lebih akurat."} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionLink href="#ai-agents" label="Kirim ke AI Agents untuk optimasi" />
        <ActionLink href="#multi-video-engine" label="Buat versi baru" />
        <ActionLink href="#content-factory" label="Ganti hook" />
        <ActionLink href="#campaign-planner" label="Jadwalkan ulang" />
      </div>
    </section>
  );
}

export function AiAgentsDashboard({ product, analyticsStats }: { product: AffiliateProduct; analyticsStats: AnalyticsStats }) {
  const [message, setMessage] = useState("");
  const agents = [
    ["Product Hunter Agent", "Cari produk baru yang lebih potensial", "Kirim ke Content Factory"],
    ["Content Creator Agent", "Buat variasi konten baru", "Kirim ke Story Engine"],
    ["Profit Optimizer Agent", "Optimasi profit dan konversi", "Jadwalkan Ulang"],
    ["Trend Analyzer Agent", "Analisa tren kategori/produk", "Simpan Rekomendasi"],
    ["CEO Assistant Agent", "Beri strategi harian/mingguan", "Buat Versi Baru"]
  ];
  const insight = `${product.productName} punya peluang ditest. Jika views tinggi tapi klik rendah, ubah CTA dan buat versi testimoni.`;

  return (
    <section id="ai-agents" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
      <Header icon={Bot} title="AI Agents Optimization" subtitle="Agent menerima konteks produk, konten, campaign, analytics, dan profit untuk memberi rekomendasi praktis." />
      <div className="mt-4 rounded-[1.5rem] border border-violet-100 bg-violet-50 p-4">
        <p className="text-sm font-black text-ink">Rekomendasi contoh</p>
        <p className="mt-1 text-sm leading-6 text-muted">{analyticsStats.bestContent ? `Konten ${analyticsStats.bestContent} perlu dibuat variasi baru.` : insight}</p>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        {agents.map(([name, description, action]) => (
          <article key={name} className="rounded-[1.5rem] border border-line bg-slate-50 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Bot className="h-5 w-5" /></div>
            <h3 className="mt-3 text-sm font-black text-ink">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            <button onClick={() => setMessage(`${name}: ${action} siap diproses dengan konteks ${product.productName}.`)} className="mt-3 rounded-full bg-violet-600 px-3 py-2 text-xs font-black text-white">{action}</button>
          </article>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionLink href="#multi-video-engine" label="Buat Versi Baru" />
        <ActionLink href="#content-factory" label="Kirim ke Content Factory" />
        <ActionLink href="#story-engine" label="Kirim ke Story Engine" />
        <ActionLink href="#campaign-planner" label="Jadwalkan Ulang" />
      </div>
      {message ? <Notice message={message} /> : null}
    </section>
  );
}

function Header({ icon: Icon, title, subtitle }: { icon: typeof Sparkles; title: string; subtitle: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Icon className="h-5 w-5" /></span>
          <h2 className="text-2xl font-black text-ink">{title}</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
      </div>
      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">Terintegrasi</span>
    </div>
  );
}

function WorkflowActionButtons({ product, trendScore, contentPack }: { product: AffiliateProduct; trendScore: number; contentPack: ContentPack }) {
  const save = (action: string) => {
    saveAffiliateWorkflowContext({
      product: productToWorkflowContext(product, trendScore),
      contentIdea: {
        hook: contentPack.hooks[0] ?? "",
        angle: contentPack.productInsight ?? "",
        caption: contentPack.caption,
        cta: contentPack.cta
      },
      lastAction: action,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <ActionLink href="#story-engine" label="Kirim ke Story Engine" onClick={() => save("Kirim ke Story Engine")} />
      <ActionLink href="#multi-video-engine" label="Buat Multi Video" onClick={() => save("Buat Multi Video")} />
      <ActionLink href="/content-library" label="Simpan ke Content Library" onClick={() => save("Simpan ke Content Library")} />
      <ActionLink href="#campaign-planner" label="Jadwalkan" onClick={() => save("Jadwalkan")} />
    </div>
  );
}

function OutputCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-line bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-muted">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{value || "Belum ada output."}</p>
    </div>
  );
}

function SelectCard({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="rounded-[1.5rem] border border-line bg-white p-4">
      <span className="text-xs font-black uppercase tracking-wide text-muted">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm font-bold outline-none focus:border-violet-400">
        {options.map((option) => <option key={option} value={option}>{option === "30" ? "30 hari konten" : option}</option>)}
      </select>
    </label>
  );
}

function ActionLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <a href={href} onClick={onClick} className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">
      {label}
      <ChevronRight className="h-4 w-4" />
    </a>
  );
}

function Notice({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-950">
      <CheckCircle2 className="mt-0.5 h-4 w-4" />
      {message}
    </div>
  );
}

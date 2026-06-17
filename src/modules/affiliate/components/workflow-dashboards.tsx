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
import {
  ContentFactoryType,
  createContentFactoryOutput,
  createMultiVideoVariants,
  createStoryEngineOutput,
  MultiVideoVariant,
  saveGeneratedLibraryItems,
  StoryMode,
  VideoAspectRatio,
  VideoDuration,
  VideoGenerator,
  VideoResolution,
  videosToLibraryItems
} from "../affiliate-center-core";
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

type CaptionDetail = {
  title: string;
  caption: string;
  hashtags?: string[];
  productName: string;
  sourceLabel: "Content Factory" | "Story Engine" | "Multi Video Engine" | "Content Library";
};

type ScheduleDraft = {
  platform: string;
  account: string;
  date: string;
  time: string;
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
  const templates: ContentFactoryType[] = ["Product Review", "Problem Solution", "Comparison", "UGC Script", "Short Video", "Live Selling Script"];
  const [contentType, setContentType] = useState<ContentFactoryType>("Product Review");
  const [scriptOutput, setScriptOutput] = useState(() => createContentFactoryOutput(product, "Product Review"));
  const [message, setMessage] = useState("");
  const [captionDetail, setCaptionDetail] = useState<CaptionDetail | null>(null);

  function changeContentType(nextType: ContentFactoryType) {
    setContentType(nextType);
    setScriptOutput(createContentFactoryOutput(product, nextType));
  }

  function generateScript() {
    setScriptOutput(createContentFactoryOutput(product, contentType));
    onGenerate();
    setMessage(`${contentType} regenerated.`);
  }

  async function copyScript() {
    const text = `${scriptOutput.hook}\n\n${scriptOutput.opening}\n\n${scriptOutput.mainScript}\n\n${scriptOutput.cta}\n${scriptOutput.caption}\n${scriptOutput.hashtag.join(" ")}`;
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Script copied.");
    } catch {
      setMessage("Copy belum berhasil otomatis. Pilih teks dan salin manual.");
    }
  }

  function saveScriptToLibrary() {
    saveGeneratedLibraryItems([{
      id: `content-factory-${product.id}-${Date.now()}`,
      title: `${product.productName} - ${contentType}`,
      sourceLabel: "Content Factory",
      status: "Saved",
      type: "TEXT",
      productName: product.productName,
      platform: "TikTok",
      preview: `${scriptOutput.hook}\n${scriptOutput.opening}\n${scriptOutput.mainScript}\n${scriptOutput.caption}`,
      tags: [contentType, "content-factory", ...scriptOutput.hashtag],
      createdAt: new Date().toISOString()
    }]);
    setMessage("Content Factory output saved to Content Library.");
  }

  return (
    <div className="mb-5 space-y-4">
      <ProductContextCard product={product} trendScore={trendScore} />
      <div className="rounded-[1.5rem] border border-line bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-ink">Template konten</p>
            <p className="mt-1 text-sm text-muted">Pilih format awal, lalu generate script dan lanjut ke menu berikutnya.</p>
          </div>
          <button onClick={generateScript} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Generate Script</button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {templates.map((template) => (
            <button
              key={template}
              onClick={() => changeContentType(template)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${contentType === template ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700 hover:bg-violet-100"}`}
            >
              {template}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <OutputCard title="Hook" value={scriptOutput.hook} />
        <OutputCard title="Opening" value={scriptOutput.opening} />
        <OutputCard title="Main Script" value={scriptOutput.mainScript} />
        <OutputCard title="CTA" value={scriptOutput.cta} />
        <OutputCard title="Caption" value={scriptOutput.caption} onClick={() => setCaptionDetail({
          title: `${product.productName} - ${contentType}`,
          caption: scriptOutput.caption,
          hashtags: scriptOutput.hashtag,
          productName: product.productName,
          sourceLabel: "Content Factory"
        })} />
        <OutputCard title="Hashtag" value={scriptOutput.hashtag.join(" ")} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={generateScript} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Generate</button>
        <button onClick={copyScript} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Copy</button>
        <button onClick={saveScriptToLibrary} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Save to Library</button>
        <a href="/campaigns" onClick={() => setMessage("Create Campaign siap memakai produk terpilih.")} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Create Campaign</a>
      </div>
      {message ? <Notice message={message} /> : null}
      {captionDetail ? <CaptionDetailModal detail={captionDetail} onClose={() => setCaptionDetail(null)} onMessage={setMessage} /> : null}
      <WorkflowActionButtons product={product} trendScore={trendScore} contentPack={contentPack} />
    </div>
  );
}

export function StoryEngineDashboard({ product, trendScore, contentPack }: { product: AffiliateProduct; trendScore: number; contentPack: ContentPack }) {
  const storyModes: StoryMode[] = ["Kids Animation", "Education", "Business Story", "Affiliate Story", "Islamic Story", "Motivational Story"];
  const [mode, setMode] = useState<StoryMode>("Affiliate Story");
  const [message, setMessage] = useState("");
  const [captionDetail, setCaptionDetail] = useState<CaptionDetail | null>(null);
  const storyOutput = createStoryEngineOutput(product, mode);

  function saveStory(action: string) {
    if (action === "Simpan ke Content Library") {
      saveGeneratedLibraryItems([{
        id: `story-engine-${product.id}-${Date.now()}`,
        title: `${product.productName} - ${mode}`,
        sourceLabel: "Story Engine",
        status: "Saved",
        type: "TEXT",
        productName: product.productName,
        platform: "TikTok",
        preview: `${storyOutput.shortScript}\n${storyOutput.scenePlan.join("\n")}\n${storyOutput.caption}`,
        imagePrompt: storyOutput.imagePrompt,
        videoPrompt: storyOutput.videoPrompt,
        tags: [mode, "story-engine", ...storyOutput.hashtag],
        createdAt: new Date().toISOString()
      }]);
    }
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
        storyline: storyOutput.shortScript,
        scenePlan: storyOutput.scenePlan
      },
      lastAction: action,
      updatedAt: new Date().toISOString()
    });
    setMessage(`${action} siap. Konteks story disimpan untuk menu berikutnya.`);
  }

  async function copyStory() {
    const text = `${storyOutput.hook}\n${storyOutput.shortScript}\n${storyOutput.scenePlan.join("\n")}\n${storyOutput.imagePrompt}\n${storyOutput.videoPrompt}\n${storyOutput.caption}\n${storyOutput.hashtag.join(" ")}\n${storyOutput.cta}`;
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Story copied.");
    } catch {
      setMessage("Copy belum berhasil otomatis. Pilih teks dan salin manual.");
    }
  }

  return (
    <section id="story-engine" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
      <Header icon={Layers3} title="Story Engine" subtitle="Ubah produk dan konsep konten menjadi cerita yang menjual, sederhana, dan mudah diproduksi." />
      <div className="mt-4"><ProductContextCard product={product} trendScore={trendScore} /></div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.5rem] border border-line p-4">
          <p className="text-sm font-black text-ink">Mode story</p>
          <div className="mt-3 grid gap-2">
            {storyModes.map((item) => (
              <button key={item} onClick={() => setMode(item)} className={`rounded-2xl px-4 py-3 text-left text-sm font-black ${mode === item ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"}`}>{item}</button>
            ))}
          </div>
          <button onClick={() => saveStory("Generate Story")} className="mt-4 w-full rounded-full bg-ink px-4 py-2 text-sm font-black text-white">Generate Story</button>
        </div>
        <div className="rounded-[1.5rem] border border-line p-4">
          <p className="text-sm font-black text-ink">Story Structure</p>
          <div className="mt-3 grid gap-3">
            {storyOutput.structure.split(" -> ").map((label, index) => <OutputCard key={label} title={label} value={storyOutput.scenePlan[index] ?? storyOutput.shortScript} />)}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <OutputCard title="Storyline" value={storyOutput.shortScript} />
        <OutputCard title="Scene plan" value={storyOutput.scenePlan.join("\n")} />
        <OutputCard title="Image prompt" value={storyOutput.imagePrompt} />
        <OutputCard title="Video prompt" value={storyOutput.videoPrompt} />
        <OutputCard title="Voice over" value={storyOutput.voiceOver} />
        <OutputCard title="Subtitle draft" value={storyOutput.subtitle} />
        <OutputCard title="Caption" value={storyOutput.caption} onClick={() => setCaptionDetail({
          title: `${product.productName} - ${mode}`,
          caption: storyOutput.caption,
          hashtags: storyOutput.hashtag,
          productName: product.productName,
          sourceLabel: "Story Engine"
        })} />
        <OutputCard title="CTA & Hashtag" value={`${storyOutput.cta}\n${storyOutput.hashtag.join(" ")}`} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => saveStory("Generate Story")} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Generate Story</button>
        <button onClick={copyStory} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Copy</button>
        <button onClick={() => saveStory("Simpan ke Content Library")} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Save to Library</button>
        <ActionLink href="/multi-video-engine" label="Kirim ke Multi Video Engine" onClick={() => saveStory("Kirim ke Multi Video Engine")} />
        <ActionLink href="/multi-video-engine" label="Create Video" onClick={() => saveStory("Create Video")} />
        <ActionLink href="/rencana-posting" label="Jadwalkan" onClick={() => saveStory("Jadwalkan")} />
      </div>
      {message ? <Notice message={message} /> : null}
      {captionDetail ? <CaptionDetailModal detail={captionDetail} onClose={() => setCaptionDetail(null)} onMessage={setMessage} /> : null}
    </section>
  );
}

export function MultiVideoEngineDashboard({ product, trendScore, contentPack }: { product: AffiliateProduct; trendScore: number; contentPack: ContentPack }) {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState("Problem Solution");
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>("9:16");
  const [resolution, setResolution] = useState<VideoResolution>("1080x1920");
  const [duration, setDuration] = useState<VideoDuration>("30 detik");
  const [generator, setGenerator] = useState<VideoGenerator>("Mock Preview");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [captionDetail, setCaptionDetail] = useState<CaptionDetail | null>(null);
  const [editingPlan, setEditingPlan] = useState<MultiVideoVariant | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState<ScheduleDraft>({ platform: "TikTok", account: "NOT_CONNECTED", date: "", time: "" });
  const formats = ["Review", "Problem Solution", "Before After", "Testimoni", "Edukasi", "Komedi Ringan", "Perbandingan", "Fakta Menarik", "Soft Selling", "CTA Hard Selling"];
  const aspectOptions: VideoAspectRatio[] = ["9:16", "1:1", "16:9", "4:5"];
  const resolutionOptions: VideoResolution[] = ["720x1280", "1080x1920", "1080x1080", "1920x1080", "1080x1350"];
  const durationOptions: VideoDuration[] = ["15 detik", "30 detik", "45 detik", "60 detik", "90 detik"];
  const generatorOptions: VideoGenerator[] = ["Veo 3", "Banana Pro", "Gemini Video", "Kling", "Runway", "Mock Preview"];
  const [videoPlans, setVideoPlans] = useState(() => createMultiVideoVariants(product, count, undefined, { aspectRatio, resolution, duration, generator }));

  const activeSettings = { aspectRatio, resolution, duration, generator };

  function generateVideos() {
    const variants = createMultiVideoVariants(product, count, undefined, activeSettings).map((variant, index) => ({
      ...variant,
      title: `${format} #${index + 1} - ${product.productName} (${variant.platform} ${variant.duration})`,
      hook: `${variant.platform} ${variant.duration}: ${product.productName} untuk angle ${format}.`,
      script: `${format} untuk ${product.productName}. Gunakan format ${variant.aspectRatio}, resolusi ${variant.resolution}, generator ${variant.generator}, lalu tutup dengan CTA jelas.`,
      status: "Draft" as const,
      generationStatus: "GENERATING" as const,
      generationProgress: 38
    }));
    setVideoPlans(variants);
    setIsGenerating(true);
    setMessage(`Generating ${variants.length} preview card. Media provider belum terkoneksi, output akan memakai visual DEMO.`);

    window.setTimeout(() => {
      const completed = variants.map((variant) => ({
        ...variant,
        status: "Generated" as const,
        generationStatus: "DEMO" as const,
        generationProgress: 100
      }));
      setVideoPlans(completed);
      setIsGenerating(false);
      saveAffiliateWorkflowContext({
        product: productToWorkflowContext(product, trendScore),
        videoPlans: completed.map((plan) => ({ title: plan.title, hook: plan.hook, status: "Draft" })),
        lastAction: "Generate Multi Video",
        updatedAt: new Date().toISOString()
      });
      setMessage(`Generate Batch siap. ${completed.length} draft video dibuat sebagai Mock Preview. Preview generated from prompt only - real media provider not connected.`);
    }, 700);
  }

  function saveVideos(action: string) {
    if (isGenerating) {
      setMessage("Tunggu generation selesai sebelum menyimpan atau menjadwalkan.");
      return;
    }
    const status = "Draft";
    const saved = videoPlans.map((plan) => ({ ...plan, status: "Draft" as const }));
    setVideoPlans(saved);
    saveGeneratedLibraryItems(videosToLibraryItems(product, saved, status));
    saveAffiliateWorkflowContext({
      product: productToWorkflowContext(product, trendScore),
      videoPlans: saved.map((plan) => ({ title: plan.title, hook: plan.hook, status: "Draft" })),
      lastAction: action,
      updatedAt: new Date().toISOString()
    });
    setMessage(`${action} selesai. ${saved.length} video masuk Content Library dengan source MULTI_VIDEO_ENGINE dan status DRAFT.`);
  }

  function saveEditedPlan(nextPlan: MultiVideoVariant) {
    setVideoPlans((current) => current.map((plan) => plan.id === nextPlan.id ? nextPlan : plan));
    setEditingPlan(null);
    setMessage(`Edit tersimpan untuk ${nextPlan.title}.`);
  }

  function saveScheduleDraft(next: ScheduleDraft) {
    setScheduleDraft(next);
    setScheduleOpen(false);
    saveAffiliateWorkflowContext({
      product: productToWorkflowContext(product, trendScore),
      videoPlans: videoPlans.map((plan) => ({ title: plan.title, hook: plan.hook, status: "Scheduled" })),
      lastAction: "Schedule Draft",
      updatedAt: new Date().toISOString()
    });
    setMessage("Schedule draft tersimpan. Scheduler belum connected, upload/posting tetap manual sampai API scheduler aktif.");
  }

  return (
    <section id="multi-video-engine" className="rounded-[2rem] border border-white bg-white p-5 shadow-soft">
      <Header icon={Video} title="Multi Video Engine" subtitle="Buat banyak variasi video dari satu produk, story, atau script yang sudah dibuat." />
      <div className="mt-4"><ProductContextCard product={product} trendScore={trendScore} /></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <SelectCard label="Jumlah video" value={String(count)} options={Array.from({ length: 30 }, (_, index) => String(index + 1))} onChange={(value) => setCount(Math.min(30, Math.max(1, Number(value) || 1)))} />
        <SelectCard label="Format video" value={format} options={formats} onChange={setFormat} />
        <SelectCard label="Aspect Ratio" value={aspectRatio} options={aspectOptions} onChange={(value) => setAspectRatio(value as VideoAspectRatio)} />
        <SelectCard label="Resolution" value={resolution} options={resolutionOptions} onChange={(value) => setResolution(value as VideoResolution)} />
        <SelectCard label="Duration" value={duration} options={durationOptions} onChange={(value) => setDuration(value as VideoDuration)} />
        <SelectCard label="Video Generator" value={generator} options={generatorOptions} onChange={(value) => setGenerator(value as VideoGenerator)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button disabled={isGenerating} onClick={generateVideos} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60">
          {isGenerating ? "Generating..." : "Generate Batch"}
        </button>
        <button disabled={isGenerating || videoPlans.length === 0} onClick={() => saveVideos("Save All to Library")} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink disabled:cursor-not-allowed disabled:opacity-60">Save All to Library</button>
        <button disabled={isGenerating || videoPlans.length === 0} onClick={() => setScheduleOpen(true)} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink disabled:cursor-not-allowed disabled:opacity-60">Schedule</button>
        <button disabled={videoPlans.length === 0} onClick={() => setEditingPlan(videoPlans[0])} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink disabled:cursor-not-allowed disabled:opacity-60">Edit</button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-3">
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">Media Provider: DEMO</span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-950">Provider belum terkoneksi</span>
        <span className="text-sm font-bold text-muted">Preview generated from prompt only - real media provider not connected.</span>
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {videoPlans.map((plan) => (
          <MultiVideoPreviewCard
            key={plan.id}
            plan={plan}
            product={product}
            onEdit={() => setEditingPlan(plan)}
            onCaptionClick={() => setCaptionDetail({
              title: plan.title,
              caption: plan.caption,
              hashtags: plan.hashtag,
              productName: product.productName,
              sourceLabel: "Multi Video Engine"
            })}
          />
        ))}
      </div>
      {message ? <Notice message={message} /> : null}
      {captionDetail ? <CaptionDetailModal detail={captionDetail} onClose={() => setCaptionDetail(null)} onMessage={setMessage} /> : null}
      {editingPlan ? <EditVideoModal plan={editingPlan} onClose={() => setEditingPlan(null)} onSave={saveEditedPlan} /> : null}
      {scheduleOpen ? <ScheduleModal draft={scheduleDraft} onClose={() => setScheduleOpen(false)} onSave={saveScheduleDraft} /> : null}
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
        <ActionLink href="/ai-agents" label="Kirim ke AI Agents untuk optimasi" />
        <ActionLink href="/multi-video-engine" label="Buat versi baru" />
        <ActionLink href="/buat-konten" label="Ganti hook" />
        <ActionLink href="/rencana-posting" label="Jadwalkan ulang" />
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
        <ActionLink href="/multi-video-engine" label="Buat Versi Baru" />
        <ActionLink href="/buat-konten" label="Kirim ke Content Factory" />
        <ActionLink href="/story-engine" label="Kirim ke Story Engine" />
        <ActionLink href="/rencana-posting" label="Jadwalkan Ulang" />
      </div>
      {message ? <Notice message={message} /> : null}
    </section>
  );
}

function MultiVideoPreviewCard({ plan, product, onEdit, onCaptionClick }: { plan: MultiVideoVariant; product: AffiliateProduct; onEdit: () => void; onCaptionClick: () => void }) {
  const thumbnailUrl = plan.videoThumbnailUrl ?? plan.imageThumbnailUrl;
  const thumbnailLabel = plan.videoThumbnailUrl ? "Video frame" : plan.imageThumbnailUrl ? "Image thumbnail" : "Demo thumbnail";
  const isGenerating = plan.generationStatus === "GENERATING";
  const previewStatus = isGenerating ? "Generating" : plan.status === "Generated" ? "Ready" : plan.status;

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-sm">
      <div className="bg-slate-950 p-3">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <div className="relative aspect-video min-h-[260px] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-slate-950 via-cyan-950 to-rose-900 text-white">
            {thumbnailUrl ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${thumbnailUrl})` }} aria-label={thumbnailLabel} />
            ) : (
              <div className="absolute inset-0">
                <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black backdrop-blur">{plan.platform}</span>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black ${previewStatusClass(previewStatus)}`}>{previewStatus}</span>
                </div>
                <div className="absolute inset-x-5 top-16 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                      <PlaySquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase">Content Preview</p>
                      <p className="text-[10px] font-bold text-white/75">Mock Preview</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-5 bottom-24">
                  <p className="line-clamp-2 text-2xl font-black leading-7">{product.productName}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur">{plan.duration}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur">{plan.aspectRatio}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur">{plan.resolution}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white backdrop-blur">{plan.generator}</span>
                  </div>
                </div>
                <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white p-3 text-slate-950">
                  <p className="line-clamp-2 text-sm font-black">{plan.hook}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-black text-slate-500">
                    <span>{plan.status}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{plan.platform}</span>
                  </div>
                  {isGenerating ? <PreviewProgress progress={plan.generationProgress} /> : null}
                </div>
              </div>
            )}
            {thumbnailUrl ? (
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/70 p-3 text-white backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="line-clamp-2 text-sm font-black">{product.productName}</p>
                    <p className="mt-1 text-xs font-bold text-white/75">{plan.duration}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black ${previewStatusClass(previewStatus)}`}>{previewStatus}</span>
                </div>
                {isGenerating ? <PreviewProgress progress={plan.generationProgress} dark /> : null}
              </div>
            ) : null}
          </div>
          <div className="relative min-h-[220px] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-slate-100 to-violet-200 p-4 text-slate-950">
            {plan.imageThumbnailUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${plan.imageThumbnailUrl})` }} aria-label="Image thumbnail" /> : null}
            <div className="relative z-10 flex h-full min-h-[188px] flex-col justify-between rounded-2xl border border-white/70 bg-white/75 p-3 backdrop-blur">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black text-white">Thumbnail</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-950">Mock Preview</span>
              </div>
              <div>
                <p className="line-clamp-3 text-base font-black">{product.productName}</p>
                <p className="mt-2 text-xs font-bold text-slate-600">{plan.platform} - {plan.duration}</p>
              </div>
              <PlaySquare className="h-8 w-8 text-violet-700" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-ink">{plan.title}</h3>
            <p className="mt-1 text-sm font-bold text-muted">{thumbnailLabel}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-[10px] font-black ${previewStatusClass(previewStatus)}`}>{previewStatus}</span>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-black text-violet-800">{plan.platform}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{plan.duration}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{plan.aspectRatio}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{plan.resolution}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-950">{plan.generator}</span>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <PreviewLine label="Hook" value={plan.hook} />
          <PreviewLine label="Script" value={plan.script} />
          <PreviewLine label="Scene list" value={plan.sceneList.join(" | ")} />
          <PreviewLine label="Image prompt" value={plan.imagePrompt} />
          <PreviewLine label="Video prompt" value={plan.videoPrompt} />
          <button type="button" onClick={onCaptionClick} className="rounded-xl border border-violet-100 bg-violet-50 p-3 text-left text-sm leading-6 text-violet-950 transition hover:border-violet-300 hover:bg-violet-100">
            <strong>Caption:</strong> {plan.caption}
          </button>
          <PreviewLine label="Hashtag" value={plan.hashtag.join(" ")} />
          <PreviewLine label="CTA" value={plan.cta} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={onEdit} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Edit item</button>
        </div>
      </div>
    </article>
  );
}

function PreviewProgress({ progress, dark = false }: { progress: number; dark?: boolean }) {
  return (
    <div className="mt-3">
      <div className={`h-2 overflow-hidden rounded-full ${dark ? "bg-white/20" : "bg-slate-200"}`}>
        <div className={`h-full rounded-full transition-all ${dark ? "bg-white" : "bg-slate-950"}`} style={{ width: `${progress}%` }} />
      </div>
      <p className={`mt-2 text-[10px] font-black ${dark ? "text-white" : "text-slate-600"}`}>Generating preview {progress}%</p>
    </div>
  );
}

function CaptionDetailModal({ detail, onClose, onMessage }: { detail: CaptionDetail; onClose: () => void; onMessage: (message: string) => void }) {
  const [caption, setCaption] = useState(detail.caption);
  const [editing, setEditing] = useState(false);
  const hashtagText = detail.hashtags?.join(" ") ?? "";

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(`${caption}${hashtagText ? `\n${hashtagText}` : ""}`);
      onMessage("Copied.");
    } catch {
      onMessage("Caption belum bisa disalin otomatis. Salin manual dari modal.");
    }
  }

  function saveCaption() {
    saveGeneratedLibraryItems([{
      id: `caption-${detail.sourceLabel.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      title: `${detail.title} Caption`,
      sourceLabel: detail.sourceLabel === "Content Library" ? "Content Factory" : detail.sourceLabel,
      sourceCode: detail.sourceLabel === "Multi Video Engine" ? "MULTI_VIDEO_ENGINE" : detail.sourceLabel === "Story Engine" ? "STORY_ENGINE" : "CONTENT_FACTORY",
      status: "Saved",
      statusCode: "SAVED",
      type: "TEXT",
      productName: detail.productName,
      platform: "TikTok",
      preview: `${caption}${hashtagText ? `\n${hashtagText}` : ""}`,
      tags: ["caption", detail.sourceLabel, ...(detail.hashtags ?? [])],
      createdAt: new Date().toISOString()
    }]);
    onMessage("Caption saved to Content Library.");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-xl rounded-[1.5rem] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">{detail.sourceLabel}</p>
            <h3 className="mt-1 text-xl font-black text-ink">{detail.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-line px-3 py-1 text-sm font-black text-ink">Close</button>
        </div>
        {editing ? (
          <textarea value={caption} onChange={(event) => setCaption(event.target.value)} className="mt-4 min-h-36 w-full rounded-2xl border border-line p-3 text-sm leading-6" />
        ) : (
          <button type="button" onClick={() => setEditing(true)} className="mt-4 w-full cursor-pointer rounded-2xl border border-violet-100 bg-violet-50 p-4 text-left text-sm leading-6 text-ink transition hover:border-violet-300 hover:bg-violet-100">
            {caption}
          </button>
        )}
        {hashtagText ? <p className="mt-3 text-sm font-bold text-violet-700">{hashtagText}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={copyCaption} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Copy Caption</button>
          <button onClick={() => setEditing(true)} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Edit Caption</button>
          <button onClick={saveCaption} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">Save to Library</button>
        </div>
      </div>
    </div>
  );
}

function EditVideoModal({ plan, onClose, onSave }: { plan: MultiVideoVariant; onClose: () => void; onSave: (plan: MultiVideoVariant) => void }) {
  const [draft, setDraft] = useState({
    title: plan.title,
    hook: plan.hook,
    script: plan.script,
    caption: plan.caption,
    hashtag: plan.hashtag.join(" "),
    imagePrompt: plan.imagePrompt,
    videoPrompt: plan.videoPrompt,
    duration: plan.duration,
    aspectRatio: plan.aspectRatio,
    resolution: plan.resolution,
    generator: plan.generator
  });
  const aspectOptions: VideoAspectRatio[] = ["9:16", "1:1", "16:9", "4:5"];
  const resolutionOptions: VideoResolution[] = ["720x1280", "1080x1920", "1080x1080", "1920x1080", "1080x1350"];
  const durationOptions: VideoDuration[] = ["15 detik", "30 detik", "45 detik", "60 detik", "90 detik"];
  const generatorOptions: VideoGenerator[] = ["Veo 3", "Banana Pro", "Gemini Video", "Kling", "Runway", "Mock Preview"];

  function save() {
    onSave({
      ...plan,
      ...draft,
      hashtag: draft.hashtag.split(/\s+/).filter(Boolean),
      previewImagePlaceholder: `Mock visual placeholder for ${draft.title}, ${draft.aspectRatio}, ${draft.resolution}.`,
      previewVideoPlaceholder: `Mock Preview for ${draft.title}, ${draft.generator}.`,
      generationStatus: "DEMO",
      generationProgress: 100
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-black text-ink">Edit Video Item</h3>
          <button onClick={onClose} className="rounded-full border border-line px-3 py-1 text-sm font-black text-ink">Close</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <EditInput label="Title" value={draft.title} onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
          <SelectCard label="Duration" value={draft.duration} options={durationOptions} onChange={(value) => setDraft((current) => ({ ...current, duration: value as VideoDuration }))} />
          <SelectCard label="Aspect Ratio" value={draft.aspectRatio} options={aspectOptions} onChange={(value) => setDraft((current) => ({ ...current, aspectRatio: value as VideoAspectRatio }))} />
          <SelectCard label="Resolution" value={draft.resolution} options={resolutionOptions} onChange={(value) => setDraft((current) => ({ ...current, resolution: value as VideoResolution }))} />
          <SelectCard label="Generator" value={draft.generator} options={generatorOptions} onChange={(value) => setDraft((current) => ({ ...current, generator: value as VideoGenerator }))} />
          <EditInput label="Hashtag" value={draft.hashtag} onChange={(value) => setDraft((current) => ({ ...current, hashtag: value }))} />
        </div>
        <div className="mt-3 grid gap-3">
          <EditArea label="Hook" value={draft.hook} onChange={(value) => setDraft((current) => ({ ...current, hook: value }))} />
          <EditArea label="Script" value={draft.script} onChange={(value) => setDraft((current) => ({ ...current, script: value }))} />
          <EditArea label="Caption" value={draft.caption} onChange={(value) => setDraft((current) => ({ ...current, caption: value }))} />
          <EditArea label="Image Prompt" value={draft.imagePrompt} onChange={(value) => setDraft((current) => ({ ...current, imagePrompt: value }))} />
          <EditArea label="Video Prompt" value={draft.videoPrompt} onChange={(value) => setDraft((current) => ({ ...current, videoPrompt: value }))} />
        </div>
        <button onClick={save} className="mt-4 rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Save Edit</button>
      </div>
    </div>
  );
}

function ScheduleModal({ draft, onClose, onSave }: { draft: ScheduleDraft; onClose: () => void; onSave: (draft: ScheduleDraft) => void }) {
  const [form, setForm] = useState(draft);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-[1.5rem] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-ink">Schedule Batch</h3>
            <p className="mt-1 text-sm font-bold text-amber-700">Scheduler belum connected. Draft jadwal disimpan lokal untuk workflow manual.</p>
          </div>
          <button onClick={onClose} className="rounded-full border border-line px-3 py-1 text-sm font-black text-ink">Close</button>
        </div>
        <div className="mt-4 grid gap-3">
          <SelectCard label="Platform" value={form.platform} options={["TikTok", "Reels", "Shorts", "Instagram", "YouTube"]} onChange={(value) => setForm((current) => ({ ...current, platform: value }))} />
          <SelectCard label="Akun" value={form.account} options={["NOT_CONNECTED", "TikTok Account 1", "Instagram Account 1", "YouTube Account 1"]} onChange={(value) => setForm((current) => ({ ...current, account: value }))} />
          <label className="rounded-[1.5rem] border border-line bg-white p-4">
            <span className="text-xs font-black uppercase tracking-wide text-muted">Tanggal</span>
            <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm font-bold" />
          </label>
          <label className="rounded-[1.5rem] border border-line bg-white p-4">
            <span className="text-xs font-black uppercase tracking-wide text-muted">Jam</span>
            <input type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm font-bold" />
          </label>
        </div>
        <button onClick={() => onSave(form)} className="mt-4 rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">Save Schedule Draft</button>
      </div>
    </div>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm leading-6 text-muted">
      <strong className="text-ink">{label}:</strong> {value}
    </p>
  );
}

function previewStatusClass(status: string) {
  if (status === "Ready" || status === "Generated") return "bg-emerald-100 text-emerald-950";
  if (status === "Generating") return "bg-sky-100 text-sky-950";
  if (status === "Failed") return "bg-rose-100 text-rose-950";
  return "bg-slate-100 text-slate-950";
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
      <ActionLink href="/story-engine" label="Kirim ke Story Engine" onClick={() => save("Kirim ke Story Engine")} />
      <ActionLink href="/multi-video-engine" label="Buat Multi Video" onClick={() => save("Buat Multi Video")} />
      <ActionLink href="/content-library" label="Simpan ke Content Library" onClick={() => save("Simpan ke Content Library")} />
      <ActionLink href="/rencana-posting" label="Jadwalkan" onClick={() => save("Jadwalkan")} />
    </div>
  );
}

function OutputCard({ title, value, onClick }: { title: string; value: string; onClick?: () => void }) {
  const clickable = Boolean(onClick);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (clickable && (event.key === "Enter" || event.key === " ")) onClick?.();
      }}
      className={`rounded-[1.25rem] border border-line bg-white p-4 ${clickable ? "cursor-pointer transition hover:border-violet-300 hover:bg-violet-50" : ""}`}
    >
      <p className="text-xs font-black uppercase tracking-wide text-muted">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{value || "Belum ada output."}</p>
    </div>
  );
}

function EditInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="rounded-[1.5rem] border border-line bg-white p-4">
      <span className="text-xs font-black uppercase tracking-wide text-muted">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm font-bold outline-none focus:border-violet-400" />
    </label>
  );
}

function EditArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="rounded-[1.5rem] border border-line bg-white p-4">
      <span className="text-xs font-black uppercase tracking-wide text-muted">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-line p-3 text-sm font-bold leading-6 outline-none focus:border-violet-400" />
    </label>
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, Copy, FilePlus2, Search, Trash2 } from "lucide-react";
import {
  ContentDraft,
  contentStatusLabels,
  ContentStatus,
  filterContentDrafts,
  getContentDraftFullText
} from "@/modules/database/content-service";
import { ProductSource } from "@/modules/affiliate/types";
import { getSourceClassName } from "@/modules/affiliate/source-badge";
import { GeneratedLibraryItem, saveGeneratedLibraryItems, readGeneratedLibraryItems } from "@/modules/affiliate/affiliate-center-core";

const statusOptions: Array<ContentStatus | "ALL"> = ["ALL", "DRAFT", "READY", "POSTED", "ARCHIVED"];
const sourceOptions: Array<ProductSource | "ALL"> = ["ALL", "DEMO", "MANUAL", "CSV_IMPORT", "REAL_API"];
const generatedSourceOptions = ["ALL", "Content Factory", "Story Engine", "Multi Video Engine", "Creative Studio"];
const typeOptions = ["ALL", "TEXT", "IMAGE", "VIDEO"];
const platformOptions = ["ALL", "TikTok", "Reels", "Shorts"];

type CaptionDetail = {
  title: string;
  caption: string;
  productName: string;
  hashtags?: string[];
};

function statusLabel(status: ContentStatus | "ALL") {
  return status === "ALL" ? "Semua" : contentStatusLabels[status];
}

function sourceLabel(source: ProductSource | "ALL") {
  const labels: Record<ProductSource | "ALL", string> = {
    ALL: "Semua data",
    DEMO: "DEMO",
    MANUAL: "MANUAL",
    CSV_IMPORT: "CSV_IMPORT",
    REAL_API: "REAL_API"
  };

  return labels[source];
}

function sourceDescription(source: ProductSource) {
  const labels: Record<ProductSource, string> = {
    DEMO: "Data ini masih contoh. Hubungkan marketplace API untuk data real.",
    MANUAL: "Data input user.",
    CSV_IMPORT: "Data dari file user.",
    REAL_API: "Data partner dari koneksi API."
  };

  return labels[source];
}

async function copyText(label: string, value: string, setMessage: (message: string) => void) {
  try {
    await navigator.clipboard.writeText(value);
    setMessage(`${label} berhasil disalin.`);
  } catch {
    setMessage(`${label} belum bisa disalin otomatis. Salin manual dari detail draft.`);
  }
}

export function ContentDraftList({ initialDrafts }: { initialDrafts: ContentDraft[] }) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ContentStatus | "ALL">("ALL");
  const [source, setSource] = useState<ProductSource | "ALL">("ALL");
  const [generatedSource, setGeneratedSource] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [platform, setPlatform] = useState("ALL");
  const [contentMode, setContentMode] = useState("ALL");
  const [targetAudience, setTargetAudience] = useState("ALL");
  const [createdDate, setCreatedDate] = useState("");
  const [message, setMessage] = useState("");
  const [generatedItems, setGeneratedItems] = useState<GeneratedLibraryItem[]>([]);
  const [captionDetail, setCaptionDetail] = useState<CaptionDetail | null>(null);
  const contentModes = useMemo(() => Array.from(new Set(drafts.map((draft) => draft.contentMode).filter(Boolean))), [drafts]);
  const targetAudiences = useMemo(() => Array.from(new Set(drafts.map((draft) => draft.targetAudience).filter(Boolean))), [drafts]);
  const filteredDrafts = useMemo(
    () => filterContentDrafts(drafts, { query, status, source, contentMode, targetAudience, createdDate }),
    [contentMode, createdDate, drafts, query, source, status, targetAudience]
  );
  const filteredGeneratedItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    return generatedItems.filter((item) => {
      const matchesQuery = !term || `${item.title} ${item.productName} ${item.preview} ${item.tags.join(" ")}`.toLowerCase().includes(term);
      const matchesStatus = status === "ALL" || (status === "READY" && ["Generated", "Saved"].includes(item.status)) || (status === "DRAFT" && item.status === "Draft") || (status === "POSTED" && item.status === "Scheduled");
      const matchesSource = generatedSource === "ALL" || item.sourceLabel === generatedSource;
      const matchesType = type === "ALL" || item.type === type;
      const matchesPlatform = platform === "ALL" || item.platform === platform || item.tags.includes(platform);
      return matchesQuery && matchesStatus && matchesSource && matchesType && matchesPlatform;
    });
  }, [generatedItems, generatedSource, platform, query, status, type]);

  useEffect(() => {
    const loadGeneratedItems = () => setGeneratedItems(readGeneratedLibraryItems());
    loadGeneratedItems();
    window.addEventListener("fvn-content-library-updated", loadGeneratedItems);
    return () => window.removeEventListener("fvn-content-library-updated", loadGeneratedItems);
  }, []);

  async function runDraftAction(id: string, action: "archive" | "duplicate" | "delete") {
    if (action === "delete" && !window.confirm("Hapus draft konten ini? Produk dan campaign tidak akan dihapus.")) {
      return;
    }

    const method = action === "delete" ? "DELETE" : "POST";
    const response = await fetch(`/api/content-packs/${id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: action === "delete" ? undefined : JSON.stringify({ action })
    });

    if (!response.ok) {
      setMessage("Aksi draft belum berhasil. Cek koneksi database.");
      return;
    }

    if (action === "delete") {
      setDrafts((current) => current.filter((draft) => draft.id !== id));
      setMessage("Draft dihapus. Produk dan campaign tetap aman.");
      return;
    }

    const payload = await response.json();

    if (action === "archive") {
      setDrafts((current) => current.map((draft) => (draft.id === id ? payload.contentPack : draft)));
      setMessage("Draft masuk Arsip.");
      return;
    }

    setDrafts((current) => [payload.contentPack, ...current]);
    setMessage("Duplikat draft dibuat sebagai Draft.");
  }

  function runGeneratedAction(item: GeneratedLibraryItem, action: "edit" | "duplicate" | "schedule" | "delete") {
    if (action === "delete") {
      const next = generatedItems.filter((current) => current.id !== item.id);
      localStorage.setItem("fvn-generated-content-library", JSON.stringify(next));
      setGeneratedItems(next);
      setMessage("Generated item deleted.");
      return;
    }

    if (action === "duplicate") {
      const copy = { ...item, id: `${item.id}-copy-${Date.now()}`, title: `${item.title} Copy`, status: "Draft" as const, createdAt: new Date().toISOString() };
      const next = [copy, ...generatedItems];
      localStorage.setItem("fvn-generated-content-library", JSON.stringify(next));
      setGeneratedItems(next);
      setMessage("Generated item duplicated.");
      return;
    }

    if (action === "schedule") {
      const next = generatedItems.map((current) => current.id === item.id ? { ...current, status: "Scheduled" as const } : current);
      localStorage.setItem("fvn-generated-content-library", JSON.stringify(next));
      setGeneratedItems(next);
      setMessage("Generated item marked Scheduled.");
      return;
    }

    setMessage("Edit ready. Open the generated prompt details, adjust text, then duplicate or schedule.");
  }

  async function createCampaign(id: string) {
    const response = await fetch(`/api/content-packs/${id}/campaign`, { method: "POST" });
    setMessage(response.ok ? "Campaign dari draft berhasil dibuat." : "Campaign belum bisa dibuat dari draft.");
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-line bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(8,0.8fr)]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari produk, hook, caption, hashtag, notes" className="min-h-11 w-full rounded-xl border border-line pl-9 pr-3 text-sm outline-none focus:border-mint" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value as ContentStatus | "ALL")} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            {statusOptions.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}
          </select>
          <select value={source} onChange={(event) => setSource(event.target.value as ProductSource | "ALL")} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            {sourceOptions.map((item) => <option key={item} value={item}>{sourceLabel(item)}</option>)}
          </select>
          <select value={generatedSource} onChange={(event) => setGeneratedSource(event.target.value)} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            {generatedSourceOptions.map((item) => <option key={item} value={item}>{item === "ALL" ? "Semua source" : item}</option>)}
          </select>
          <select value={type} onChange={(event) => setType(event.target.value)} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            {typeOptions.map((item) => <option key={item} value={item}>{item === "ALL" ? "Semua type" : item}</option>)}
          </select>
          <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            {platformOptions.map((item) => <option key={item} value={item}>{item === "ALL" ? "Semua platform" : item}</option>)}
          </select>
          <select value={contentMode} onChange={(event) => setContentMode(event.target.value)} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            <option value="ALL">Semua mode</option>
            {contentModes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={targetAudience} onChange={(event) => setTargetAudience(event.target.value)} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            <option value="ALL">Semua audience</option>
            {targetAudiences.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input type="date" value={createdDate} onChange={(event) => setCreatedDate(event.target.value)} className="min-h-11 rounded-xl border border-line px-3 text-sm" />
        </div>
      </div>

      {message ? <div className="rounded-2xl border border-line bg-slate-50 p-4 text-sm font-bold text-ink">{message}</div> : null}

      {filteredDrafts.length === 0 && filteredGeneratedItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-line bg-white p-8 text-center">
          <p className="text-lg font-black text-ink">Belum ada draft konten. Pilih produk di Produk Affiliate, lalu buat konten pertama kamu.</p>
          <a href="/#content-factory" className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Buat Konten Sekarang</a>
        </div>
      ) : null}

      {filteredGeneratedItems.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {filteredGeneratedItems.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] border border-violet-100 bg-white p-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-[10px] font-black text-violet-700">{item.sourceLabel}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{item.status}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{item.type}</span>
              </div>
              <h2 className="mt-3 text-base font-black text-ink">{item.title}</h2>
              <p className="mt-1 text-xs font-semibold text-muted">{item.productName}</p>
              <button
                type="button"
                onClick={() => setCaptionDetail({ title: item.title, caption: item.preview, productName: item.productName, hashtags: item.tags.filter((tag) => tag.startsWith("#")) })}
                className="mt-3 w-full cursor-pointer whitespace-pre-wrap rounded-2xl border border-violet-100 bg-violet-50 p-3 text-left text-sm leading-6 text-muted transition hover:border-violet-300 hover:bg-violet-100"
              >
                {item.preview}
              </button>
              {item.imagePrompt ? <p className="mt-3 text-xs leading-5 text-violet-700"><strong>Image prompt:</strong> {item.imagePrompt}</p> : null}
              {item.videoPrompt ? <p className="mt-2 text-xs leading-5 text-violet-700"><strong>Video prompt:</strong> {item.videoPrompt}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => <span key={tag} className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-bold text-muted">{tag}</span>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => runGeneratedAction(item, "edit")} className="icon-btn">Edit</button>
                <button onClick={() => runGeneratedAction(item, "duplicate")} className="icon-btn">Duplicate</button>
                <button onClick={() => runGeneratedAction(item, "schedule")} className="icon-btn">Schedule</button>
                <button onClick={() => runGeneratedAction(item, "delete")} className="icon-btn"><Trash2 className="h-4 w-4" />Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        {filteredDrafts.map((draft) => (
          <article key={draft.id} className="rounded-[1.5rem] border border-line bg-white p-4">
            <div className="flex gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {draft.product.imageUrl ? <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${draft.product.imageUrl})` }} /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black ${getSourceClassName(draft.product.source)}`}>{sourceLabel(draft.product.source)}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{contentStatusLabels[draft.status]}</span>
                </div>
                <h2 className="mt-2 text-base font-black text-ink">{draft.product.productName}</h2>
                <p className="mt-1 text-xs font-semibold text-muted">{sourceDescription(draft.product.source)}</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Badge label="Mode" value={draft.contentMode} />
              <Badge label="Audience" value={draft.targetAudience} />
              <Badge label="Tone" value={draft.tone} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{draft.selectedHook || draft.hooks[0]}</p>
            <button
              type="button"
              onClick={() => setCaptionDetail({ title: `${draft.product.productName} Caption`, caption: draft.captionShort || draft.caption, productName: draft.product.productName, hashtags: draft.hashtags })}
              className="mt-2 w-full cursor-pointer rounded-xl border border-violet-100 bg-violet-50 p-3 text-left text-sm leading-6 text-muted transition hover:border-violet-300 hover:bg-violet-100"
            >
              {draft.captionShort || draft.caption}
            </button>
            <p className="mt-2 text-xs font-semibold text-muted">{new Date(draft.createdAt).toLocaleDateString()}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`/content-library/${draft.id}`} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">View Detail</a>
              <a href={`/content-library/${draft.id}#edit`} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">Edit</a>
              <button onClick={() => copyText("Caption", draft.captionShort || draft.caption, setMessage)} className="icon-btn"><Copy className="h-4 w-4" />Salin Caption</button>
              <button onClick={() => copyText("Hashtag", draft.hashtags.join(" "), setMessage)} className="icon-btn"><Copy className="h-4 w-4" />Copy Hashtag</button>
              <button onClick={() => copyText("Semua", getContentDraftFullText(draft), setMessage)} className="icon-btn"><Copy className="h-4 w-4" />Salin Semua</button>
              <button onClick={() => createCampaign(draft.id)} className="icon-btn"><FilePlus2 className="h-4 w-4" />Buat Campaign</button>
              <button onClick={() => runDraftAction(draft.id, "duplicate")} className="icon-btn">Duplikat Draft</button>
              <button onClick={() => runDraftAction(draft.id, "archive")} className="icon-btn"><Archive className="h-4 w-4" />Arsipkan</button>
              <button onClick={() => runDraftAction(draft.id, "delete")} className="icon-btn"><Trash2 className="h-4 w-4" />Hapus Draft</button>
            </div>
          </article>
        ))}
      </div>
      {captionDetail ? <CaptionDetailModal detail={captionDetail} onClose={() => setCaptionDetail(null)} onMessage={setMessage} /> : null}
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
      id: `content-library-caption-${Date.now()}`,
      title: detail.title,
      sourceLabel: "Content Factory",
      sourceCode: "CONTENT_FACTORY",
      status: "Saved",
      statusCode: "SAVED",
      type: "TEXT",
      productName: detail.productName,
      platform: "TikTok",
      preview: `${caption}${hashtagText ? `\n${hashtagText}` : ""}`,
      tags: ["caption", "content-library", ...(detail.hashtags ?? [])],
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
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">Content Library</p>
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

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-xs font-bold text-ink">{value}</p>
    </div>
  );
}

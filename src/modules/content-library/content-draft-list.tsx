"use client";

import { useMemo, useState } from "react";
import { Archive, Copy, FilePlus2, Search, Trash2 } from "lucide-react";
import {
  ContentDraft,
  contentStatusLabels,
  ContentStatus,
  filterContentDrafts,
  getContentDraftFullText
} from "@/modules/database/content-service";
import { ProductSource } from "@/modules/affiliate/types";
import { getSourceBadgeText, getSourceClassName } from "@/modules/affiliate/source-badge";

const statusOptions: Array<ContentStatus | "ALL"> = ["ALL", "DRAFT", "READY", "POSTED", "ARCHIVED"];
const sourceOptions: Array<ProductSource | "ALL"> = ["ALL", "DEMO", "MANUAL", "CSV_IMPORT", "REAL_API"];

function statusLabel(status: ContentStatus | "ALL") {
  return status === "ALL" ? "Semua" : contentStatusLabels[status];
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
  const [contentMode, setContentMode] = useState("ALL");
  const [targetAudience, setTargetAudience] = useState("ALL");
  const [createdDate, setCreatedDate] = useState("");
  const [message, setMessage] = useState("");
  const contentModes = useMemo(() => Array.from(new Set(drafts.map((draft) => draft.contentMode).filter(Boolean))), [drafts]);
  const targetAudiences = useMemo(() => Array.from(new Set(drafts.map((draft) => draft.targetAudience).filter(Boolean))), [drafts]);
  const filteredDrafts = useMemo(
    () => filterContentDrafts(drafts, { query, status, source, contentMode, targetAudience, createdDate }),
    [contentMode, createdDate, drafts, query, source, status, targetAudience]
  );

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

  async function createCampaign(id: string) {
    const response = await fetch(`/api/content-packs/${id}/campaign`, { method: "POST" });
    setMessage(response.ok ? "Campaign dari draft berhasil dibuat." : "Campaign belum bisa dibuat dari draft.");
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-line bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(5,0.8fr)]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari produk, hook, caption, hashtag, notes" className="min-h-11 w-full rounded-xl border border-line pl-9 pr-3 text-sm outline-none focus:border-mint" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value as ContentStatus | "ALL")} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            {statusOptions.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}
          </select>
          <select value={source} onChange={(event) => setSource(event.target.value as ProductSource | "ALL")} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            {sourceOptions.map((item) => <option key={item} value={item}>{item === "ALL" ? "Semua source" : item}</option>)}
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

      {filteredDrafts.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-line bg-white p-8 text-center">
          <p className="text-lg font-black text-ink">Belum ada draft konten. Pilih produk di Produk Affiliate, lalu buat konten pertama kamu.</p>
          <a href="/#content-factory" className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Buat Konten Sekarang</a>
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
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black ${getSourceClassName(draft.product.source)}`}>{draft.product.source}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{contentStatusLabels[draft.status]}</span>
                </div>
                <h2 className="mt-2 text-base font-black text-ink">{draft.product.productName}</h2>
                <p className="mt-1 text-xs font-semibold text-muted">{getSourceBadgeText(draft.product.source)}</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Badge label="Mode" value={draft.contentMode} />
              <Badge label="Audience" value={draft.targetAudience} />
              <Badge label="Tone" value={draft.tone} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{draft.selectedHook || draft.hooks[0]}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{draft.captionShort || draft.caption}</p>
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

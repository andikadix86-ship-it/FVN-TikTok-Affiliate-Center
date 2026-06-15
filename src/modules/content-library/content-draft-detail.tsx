"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Copy, FilePlus2, Trash2 } from "lucide-react";
import {
  ContentDraft,
  contentStatusLabels,
  contentStatuses,
  ContentStatus,
  getContentDraftFullText
} from "@/modules/database/content-service";
import { getRecommendationLabel } from "@/modules/scoring/recommendation-label";
import { getSourceBadgeText, getSourceClassName } from "@/modules/affiliate/source-badge";

export function ContentDraftDetail({ draft }: { draft: ContentDraft }) {
  const router = useRouter();
  const [current, setCurrent] = useState(draft);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    selectedHook: draft.selectedHook,
    script15s: draft.script15s,
    script30s: draft.script30s,
    caption: draft.caption,
    hashtags: draft.hashtags.join(" "),
    cta: draft.cta,
    notes: draft.notes,
    status: draft.status
  });

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} berhasil disalin.`);
    } catch {
      setMessage(`${label} belum bisa disalin otomatis.`);
    }
  }

  async function save() {
    const response = await fetch(`/api/content-packs/${current.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json();

    if (response.ok && payload.contentPack) {
      setCurrent(payload.contentPack);
      setMessage("Draft berhasil disimpan.");
      return;
    }

    setMessage(payload.message ?? "Draft belum bisa disimpan.");
  }

  async function action(actionName: "archive" | "duplicate") {
    const response = await fetch(`/api/content-packs/${current.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: actionName })
    });
    const payload = await response.json();

    if (!response.ok) {
      setMessage(payload.message ?? "Aksi belum berhasil.");
      return;
    }

    if (actionName === "archive") {
      setCurrent(payload.contentPack);
      setForm((active) => ({ ...active, status: "ARCHIVED" }));
      setMessage("Draft masuk Arsip.");
      return;
    }

    router.push(`/content-library/${payload.contentPack.id}`);
  }

  async function deleteDraft() {
    if (!window.confirm("Hapus draft konten ini? Produk dan campaign tidak akan dihapus.")) {
      return;
    }

    const response = await fetch(`/api/content-packs/${current.id}`, { method: "DELETE" });

    if (response.ok) {
      router.push("/content-library");
      return;
    }

    setMessage("Draft belum bisa dihapus.");
  }

  async function createCampaign() {
    const response = await fetch(`/api/content-packs/${current.id}/campaign`, { method: "POST" });
    setMessage(response.ok ? "Campaign dari draft berhasil dibuat." : "Campaign belum bisa dibuat.");
  }

  return (
    <div className="grid gap-4">
      {message ? <div className="rounded-2xl border border-line bg-slate-50 p-4 text-sm font-bold text-ink">{message}</div> : null}
      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-soft">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="overflow-hidden rounded-2xl bg-slate-50">
            {current.product.imageUrl ? <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${current.product.imageUrl})` }} /> : <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted">Belum ada gambar</div>}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-black ${getSourceClassName(current.product.source)}`}>{getSourceBadgeText(current.product.source)}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-ink">{contentStatusLabels[current.status]}</span>
            </div>
            <h1 className="mt-3 text-3xl font-black text-ink">{current.product.productName}</h1>
            <p className="mt-2 text-sm text-muted">Score {current.product.score}/100 - {getRecommendationLabel(current.product.recommendation as "Promote" | "Test First" | "Avoid")}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Meta label="Content mode" value={current.contentMode} />
              <Meta label="Target audience" value={current.targetAudience} />
              <Meta label="Tone" value={current.tone} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => copy("Semua", getContentDraftFullText(current))} className="icon-btn"><Copy className="h-4 w-4" />Salin Semua</button>
              <button onClick={createCampaign} className="icon-btn"><FilePlus2 className="h-4 w-4" />Buat Campaign dari Draft Ini</button>
              <button onClick={() => action("duplicate")} className="icon-btn">Duplikat Draft</button>
              <button onClick={() => action("archive")} className="icon-btn"><Archive className="h-4 w-4" />Arsipkan</button>
              <button onClick={deleteDraft} className="icon-btn"><Trash2 className="h-4 w-4" />Hapus Draft</button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <CopyBlock title="Product insight" value={current.productInsight} onCopy={copy} />
        <CopyBlock title="Main selling point" value={current.mainSellingPoint} onCopy={copy} />
        <CopyBlock title="Target audience match" value={current.targetAudienceMatch} onCopy={copy} />
        <CopyBlock title="Hooks" value={current.hooks.join("\n")} onCopy={copy} />
        <CopyBlock title="Script 15s" value={current.script15s} onCopy={copy} />
        <CopyBlock title="Script 30s" value={current.script30s} onCopy={copy} />
        <CopyBlock title="Scene plan" value={current.scenePlan.join("\n")} onCopy={copy} />
        <CopyBlock title="Voice over draft" value={current.voiceOverDraft} onCopy={copy} />
        <CopyBlock title="Caption short" value={current.captionShort} onCopy={copy} />
        <CopyBlock title="Caption medium" value={current.captionMedium} onCopy={copy} />
        <CopyBlock title="Caption storytelling" value={current.captionStorytelling} onCopy={copy} />
        <CopyBlock title="Hashtags" value={current.hashtags.join(" ")} onCopy={copy} />
        <CopyBlock title="CTA soft" value={current.ctaSoft} onCopy={copy} />
        <CopyBlock title="CTA direct" value={current.ctaDirect} onCopy={copy} />
        <CopyBlock title="CTA keranjang kuning" value={current.ctaKeranjangKuning} onCopy={copy} />
        <CopyBlock title="Safe claim checklist" value={current.safeClaimChecklist.join("\n")} onCopy={copy} />
        <CopyBlock title="Editing notes" value={current.editingNotes.join("\n")} onCopy={copy} />
        <CopyBlock title="Posting notes" value={current.postingNotes.join("\n")} onCopy={copy} />
      </section>

      <section id="edit" className="rounded-[2rem] border border-line bg-white p-5">
        <p className="text-lg font-black text-ink">Edit Draft</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <EditField label="Selected hook" value={form.selectedHook} onChange={(value) => setForm((active) => ({ ...active, selectedHook: value }))} />
          <EditField label="Caption" value={form.caption} onChange={(value) => setForm((active) => ({ ...active, caption: value }))} />
          <EditField label="Script 15s" value={form.script15s} onChange={(value) => setForm((active) => ({ ...active, script15s: value }))} tall />
          <EditField label="Script 30s" value={form.script30s} onChange={(value) => setForm((active) => ({ ...active, script30s: value }))} tall />
          <EditField label="Hashtags" value={form.hashtags} onChange={(value) => setForm((active) => ({ ...active, hashtags: value }))} />
          <EditField label="CTA" value={form.cta} onChange={(value) => setForm((active) => ({ ...active, cta: value }))} />
          <EditField label="Notes" value={form.notes} onChange={(value) => setForm((active) => ({ ...active, notes: value }))} tall />
          <label className="rounded-2xl border border-line p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-muted">Status</span>
            <select value={form.status} onChange={(event) => setForm((active) => ({ ...active, status: event.target.value as ContentStatus }))} className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-sm">
              {contentStatuses.map((item) => <option key={item} value={item}>{contentStatusLabels[item]}</option>)}
            </select>
          </label>
        </div>
        <button onClick={save} className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Simpan Draft</button>
      </section>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function CopyBlock({ title, value, onCopy }: { title: string; value: string; onCopy: (label: string, value: string) => void }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-black text-ink">{title}</p>
        <button onClick={() => onCopy(title, value)} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink">
          <Copy className="h-3.5 w-3.5" />
          Salin
        </button>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{value || "Belum diisi."}</p>
    </article>
  );
}

function EditField({ label, value, onChange, tall }: { label: string; value: string; onChange: (value: string) => void; tall?: boolean }) {
  return (
    <label className="rounded-2xl border border-line p-4">
      <span className="text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className={`mt-2 w-full rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-mint ${tall ? "min-h-28" : "min-h-16"}`} />
    </label>
  );
}

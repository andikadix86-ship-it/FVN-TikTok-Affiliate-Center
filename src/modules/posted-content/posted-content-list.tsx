"use client";

import { useState } from "react";
import { Archive, ExternalLink, Save } from "lucide-react";
import { calculatePostedPerformanceSummary } from "@/modules/posting/posted-content";

export type PostedContentItem = {
  id: string;
  productName: string;
  hook: string;
  tiktokVideoUrl: string;
  postedAt: string;
  accountUsed: string;
  campaignId: string;
  campaignName: string;
  notes: string;
  archived: boolean;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  orders: number;
  revenue: number;
};

export type CampaignOption = {
  id: string;
  name: string;
};

const performanceFields = ["views", "likes", "comments", "shares", "saves", "clicks", "orders", "revenue"] as const;

export function PostedContentList({
  initialItems,
  campaigns
}: {
  initialItems: PostedContentItem[];
  campaigns: CampaignOption[];
}) {
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState("");

  async function updateItem(id: string, patch: Partial<PostedContentItem>, action: string) {
    const response = await fetch(`/api/posted-content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...patch, performance: patch })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage(payload.message ?? "Konten terposting belum bisa diperbarui.");
      return;
    }

    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setMessage(action === "archive" ? "Konten masuk arsip." : "Konten terposting diperbarui.");
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-line bg-white p-8 text-center">
        <p className="text-lg font-black text-ink">Belum ada konten terposting. Setelah upload video ke platform, tandai draft sebagai sudah posting dan simpan link videonya di sini.</p>
        <a href="/content-library" className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Lihat Draft Siap Posting</a>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {message ? <div className="rounded-2xl border border-line bg-slate-50 p-4 text-sm font-bold text-ink">{message}</div> : null}
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm font-black text-yellow-900">Untuk MVP ini, aplikasi belum melakukan auto-post ke platform. Upload video tetap dilakukan manual oleh user.</p>
        <p className="mt-1 text-sm leading-6 text-yellow-900/80">Data performa di halaman ini adalah input manual, bukan data otomatis dari Platform API.</p>
      </div>
      {items.filter((item) => !item.archived).map((item) => {
        const summary = calculatePostedPerformanceSummary(item);

        return (
          <article key={item.id} className="rounded-[1.5rem] border border-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-mint">Konten Terposting</p>
                <h2 className="mt-1 text-xl font-black text-ink">{item.productName}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{item.hook}</p>
              </div>
              <a href={item.tiktokVideoUrl} target="_blank" className="icon-btn">
                <ExternalLink className="h-4 w-4" />
                Buka Video Platform
              </a>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              <Meta label="Tanggal posting" value={new Date(item.postedAt).toLocaleDateString()} />
              <Meta label="Akun dipakai" value={item.accountUsed || "Input manual"} />
              <Meta label="Campaign" value={item.campaignName || "Belum terhubung"} />
              <Meta label="Revenue" value={String(item.revenue)} />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              <Meta label="Engagement rate" value={`${summary.engagementRate.toFixed(2)}%`} />
              <Meta label="CTR" value={`${summary.ctr.toFixed(2)}%`} />
              <Meta label="Conversion rate" value={`${summary.conversionRate.toFixed(2)}%`} />
              <Meta label="Orders" value={String(item.orders)} />
            </div>
            <div className="mt-4 rounded-2xl border border-line bg-slate-50 p-4">
              <p className="text-sm font-black text-ink">Input Performa</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {performanceFields.map((field) => (
                  <input
                    key={field}
                    aria-label={field}
                    value={item[field]}
                    onChange={(event) => setItems((current) => current.map((active) => (active.id === item.id ? { ...active, [field]: Number(event.target.value) || 0 } : active)))}
                    placeholder={field}
                    className="min-h-10 rounded-xl border border-line px-3 text-sm"
                  />
                ))}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
                <input
                  value={item.notes}
                  onChange={(event) => setItems((current) => current.map((active) => (active.id === item.id ? { ...active, notes: event.target.value } : active)))}
                  placeholder="Edit Notes"
                  className="min-h-10 rounded-xl border border-line px-3 text-sm"
                />
                <select
                  value={item.campaignId}
                  onChange={(event) => setItems((current) => current.map((active) => (active.id === item.id ? { ...active, campaignId: event.target.value, campaignName: campaigns.find((campaign) => campaign.id === event.target.value)?.name ?? "" } : active)))}
                  className="min-h-10 rounded-xl border border-line px-3 text-sm"
                >
                  <option value="">Link ke Campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                  ))}
                </select>
                <button onClick={() => updateItem(item.id, item, "performance")} className="icon-btn"><Save className="h-4 w-4" />Simpan</button>
                <button onClick={() => updateItem(item.id, { archived: true }, "archive")} className="icon-btn"><Archive className="h-4 w-4" />Arsipkan</button>
              </div>
              <button onClick={() => updateItem(item.id, { campaignId: item.campaignId, campaignName: item.campaignName }, "link_campaign")} className="mt-3 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
                Link ke Campaign
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { MetricPill } from "@/components/metric-pill";
import { getSourceBadgeText, getSourceClassName } from "@/modules/affiliate/source-badge";
import {
  aggregateByCampaign,
  aggregateByProduct,
  AnalyticsContentItem,
  calculateAnalyticsSummary,
  exportAnalyticsCsv,
  filterByDays,
  getBestCampaign,
  getBestContent,
  getBestProduct
} from "./analytics";
import { AffiliateInsight, generateAffiliateInsight } from "./insight-engine";

type RangeFilter = "7" | "14" | "30" | "all";

export function AnalyticsDashboard({
  items,
  aiProviderConnected
}: {
  items: AnalyticsContentItem[];
  aiProviderConnected: boolean;
}) {
  const [range, setRange] = useState<RangeFilter>("30");
  const filteredItems = useMemo(() => filterByDays(items, range === "all" ? "all" : Number(range)), [items, range]);
  const summary = calculateAnalyticsSummary(filteredItems);
  const productRows = aggregateByProduct(filteredItems);
  const campaignRows = aggregateByCampaign(filteredItems);
  const bestProductByOrders = getBestProduct(filteredItems, "orders");
  const bestProductByRevenue = getBestProduct(filteredItems, "revenue");
  const bestContentByViews = getBestContent(filteredItems, "views");
  const bestContentByCtr = getBestContent(filteredItems, "ctr");
  const bestCampaign = getBestCampaign(filteredItems);
  const insight = generateAffiliateInsight(filteredItems, aiProviderConnected);

  function downloadCsv() {
    const blob = new Blob([exportAnalyticsCsv(filteredItems)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analisa-affiliate.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-line bg-white p-8 text-center">
        <p className="text-lg font-black text-ink">Belum ada data performa. Setelah kamu posting video platform, input views, clicks, orders, dan revenue secara manual.</p>
        <a href="/posted-content" className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Lihat Konten Terposting</a>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm font-black text-yellow-900">Data analisa berasal dari input manual user. Aplikasi belum mengambil analytics langsung dari Platform API.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
        <label className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">Filter waktu</span>
          <select value={range} onChange={(event) => setRange(event.target.value as RangeFilter)} className="min-h-11 rounded-xl border border-line px-3 text-sm">
            <option value="7">7 hari terakhir</option>
            <option value="14">14 hari terakhir</option>
            <option value="30">30 hari terakhir</option>
            <option value="all">Semua waktu</option>
          </select>
        </label>
        <button onClick={downloadCsv} className="icon-btn">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricPill label="Total views" value={String(summary.views)} />
        <MetricPill label="Total clicks" value={String(summary.clicks)} />
        <MetricPill label="Total orders" value={String(summary.orders)} />
        <MetricPill label="Total revenue" value={formatMoney(summary.revenue)} />
        <MetricPill label="CTR" value={`${summary.ctr.toFixed(2)}%`} />
        <MetricPill label="Conversion rate" value={`${summary.conversionRate.toFixed(2)}%`} />
        <MetricPill label="Engagement rate" value={`${summary.engagementRate.toFixed(2)}%`} />
        <MetricPill label="Revenue / order" value={formatMoney(summary.revenuePerOrder)} />
        <MetricPill label="Revenue / 1.000 views" value={formatMoney(summary.revenuePerThousandViews)} />
        <MetricPill label="Best product" value={bestProductByOrders?.productName ?? "Belum ada"} />
        <MetricPill label="Best content" value={bestContentByViews?.contentHook ?? "Belum ada"} />
        <MetricPill label="Best campaign" value={bestCampaign?.campaignName ?? "Belum ada"} />
      </div>

      <BestPerformerCards
        bestProductByOrders={bestProductByOrders?.productName}
        bestProductByRevenue={bestProductByRevenue?.productName}
        bestContentByViews={bestContentByViews?.contentHook}
        bestContentByCtr={bestContentByCtr?.contentHook}
        bestCampaign={bestCampaign?.campaignName}
      />

      <InsightCard insight={insight} />

      <section className="rounded-[1.5rem] border border-line bg-white p-4">
        <h2 className="text-lg font-black text-ink">Analisa Produk</h2>
        <TableWrap>
          <thead><tr>{["Produk", "Source", "Score", "Views", "Clicks", "Orders", "Revenue", "CTR", "Conv.", "Rekomendasi"].map((head) => <Th key={head}>{head}</Th>)}</tr></thead>
          <tbody>
            {productRows.map((row) => (
              <tr key={row.productId}>
                <Td>{row.productName}</Td>
                <Td><span className={`rounded-full px-2 py-1 text-[10px] font-black ${getSourceClassName(row.source)}`}>{getSourceBadgeText(row.source)}</span></Td>
                <Td>{row.score}</Td>
                <Td>{row.views}</Td>
                <Td>{row.clicks}</Td>
                <Td>{row.orders}</Td>
                <Td>{formatMoney(row.revenue)}</Td>
                <Td>{row.ctr.toFixed(2)}%</Td>
                <Td>{row.conversionRate.toFixed(2)}%</Td>
                <Td>{row.recommendation}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </section>

      <section className="rounded-[1.5rem] border border-line bg-white p-4">
        <h2 className="text-lg font-black text-ink">Analisa Konten</h2>
        <TableWrap>
          <thead><tr>{["Hook", "Produk", "Tanggal", "Views", "Likes", "Comments", "Shares", "Saves", "Clicks", "Orders", "Revenue", "Eng.", "CTR", "Conv."].map((head) => <Th key={head}>{head}</Th>)}</tr></thead>
          <tbody>
            {filteredItems.map((item) => {
              const row = calculateAnalyticsSummary([item]);
              return (
                <tr key={item.id}>
                  <Td>{item.contentHook}</Td>
                  <Td>{item.productName}</Td>
                  <Td>{new Date(item.postedAt).toLocaleDateString()}</Td>
                  <Td>{item.views}</Td>
                  <Td>{item.likes}</Td>
                  <Td>{item.comments}</Td>
                  <Td>{item.shares}</Td>
                  <Td>{item.saves}</Td>
                  <Td>{item.clicks}</Td>
                  <Td>{item.orders}</Td>
                  <Td>{formatMoney(item.revenue)}</Td>
                  <Td>{row.engagementRate.toFixed(2)}%</Td>
                  <Td>{row.ctr.toFixed(2)}%</Td>
                  <Td>{row.conversionRate.toFixed(2)}%</Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </section>

      <section className="rounded-[1.5rem] border border-line bg-white p-4">
        <h2 className="text-lg font-black text-ink">Analisa Campaign</h2>
        <TableWrap>
          <thead><tr>{["Campaign", "Produk", "Status", "Durasi", "Views", "Clicks", "Orders", "Revenue", "CTR", "Conv.", "Hari terbaik", "Hari terlemah", "Insight"].map((head) => <Th key={head}>{head}</Th>)}</tr></thead>
          <tbody>
            {campaignRows.map((row) => (
              <tr key={row.campaignId}>
                <Td>{row.campaignName}</Td>
                <Td>{row.productName}</Td>
                <Td>{row.status}</Td>
                <Td>{row.durationDays} hari</Td>
                <Td>{row.views}</Td>
                <Td>{row.clicks}</Td>
                <Td>{row.orders}</Td>
                <Td>{formatMoney(row.revenue)}</Td>
                <Td>{row.ctr.toFixed(2)}%</Td>
                <Td>{row.conversionRate.toFixed(2)}%</Td>
                <Td>{row.bestDay ? `Hari ${row.bestDay}` : "-"}</Td>
                <Td>{row.worstDay ? `Hari ${row.worstDay}` : "-"}</Td>
                <Td>{row.insight}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        {campaignRows.length === 0 ? <p className="mt-3 text-sm text-muted">Belum ada posted content yang terhubung ke campaign.</p> : null}
      </section>
    </div>
  );
}

function BestPerformerCards({
  bestProductByOrders,
  bestProductByRevenue,
  bestContentByViews,
  bestContentByCtr,
  bestCampaign
}: {
  bestProductByOrders?: string;
  bestProductByRevenue?: string;
  bestContentByViews?: string;
  bestContentByCtr?: string;
  bestCampaign?: string;
}) {
  const cards = [
    ["Produk terbaik berdasarkan orders", bestProductByOrders],
    ["Produk terbaik berdasarkan revenue", bestProductByRevenue],
    ["Konten terbaik berdasarkan views", bestContentByViews],
    ["Konten terbaik berdasarkan CTR", bestContentByCtr],
    ["Campaign terbaik berdasarkan revenue", bestCampaign]
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-2 line-clamp-3 text-sm font-bold text-ink">{value || "Belum ada"}</p>
        </div>
      ))}
    </div>
  );
}

function InsightCard({ insight }: { insight: AffiliateInsight }) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-black text-ink">Insight Affiliate</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-ink">{insight.providerMode === "AI" ? "AI Connected" : "Template Mode"}</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MetricPill label="Masalah utama" value={insight.masalahUtama} />
        <MetricPill label="Peluang perbaikan" value={insight.peluangPerbaikan} />
        <MetricPill label="Rekomendasi produk" value={insight.rekomendasiProduk} />
        <MetricPill label="Rekomendasi konten" value={insight.rekomendasiKonten} />
      </div>
      <div className="mt-3 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-black text-ink">Langkah 3 hari ke depan</p>
        <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
          {insight.langkahTigaHari.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </div>
    </section>
  );
}

function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="min-w-[980px] w-full text-left text-sm">{children}</table>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="border-b border-line px-3 py-2 text-xs font-black uppercase tracking-wide text-muted">{children}</th>;
}

function Td({ children }: { children: ReactNode }) {
  return <td className="border-b border-line px-3 py-3 align-top text-sm text-ink">{children}</td>;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

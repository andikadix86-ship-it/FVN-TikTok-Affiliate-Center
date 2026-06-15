"use client";

import { Download, ExternalLink, Settings, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { SAMPLE_PRODUCT_CSV } from "@/modules/affiliate/csv-import";
import { SettingsStatus } from "@/modules/settings/status";

export function SettingsPanel({
  status,
  databaseConnected,
  counts,
  tiktokOAuthConfigured,
  aiProviderConfigured,
  productionUrl,
  tiktokRedirectUri,
  tiktokOAuthErrors
}: {
  status: SettingsStatus;
  databaseConnected: boolean;
  counts: {
    totalProducts: number;
    demoProducts: number;
    manualProducts: number;
    csvProducts: number;
  };
  tiktokOAuthConfigured: boolean;
  aiProviderConfigured: boolean;
  productionUrl: string;
  tiktokRedirectUri: string;
  tiktokOAuthErrors: string[];
}) {
  const settings = [
    { label: "Production URL", value: productionUrl || "Missing" },
    { label: "TikTok Redirect URI", value: tiktokRedirectUri || "Missing" },
    { label: "App URL status", value: status.appUrl },
    { label: "Database status", value: databaseConnected ? "Connected" : "Not Connected" },
    { label: "TikTok OAuth status", value: tiktokOAuthConfigured ? "Configured" : "Missing" },
    { label: "AI Provider status", value: aiProviderConfigured ? "Configured" : "Missing" },
    { label: "Product data source status", value: status.productDataSource },
    { label: "Product count from database", value: String(counts.totalProducts) },
    { label: "Demo product count", value: String(counts.demoProducts) },
    { label: "Manual product count", value: String(counts.manualProducts) },
    { label: "CSV product count", value: String(counts.csvProducts) }
  ];

  async function clearDemoData() {
    if (!window.confirm("Clear only DEMO products? Manual, CSV_IMPORT, and REAL_API products will not be deleted.")) {
      return;
    }

    await fetch("/api/products?source=DEMO", {
      method: "DELETE"
    });
    window.location.reload();
  }

  return (
    <SectionCard
      id="settings"
      title="Settings"
      description="Configure environment variables before enabling live integrations."
      icon={Settings}
    >
      {status.productDataSource === "Demo Mode" ? (
        <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-black text-orange-900">DEMO DATA - Not from TikTok Shop</p>
          <p className="mt-1 text-sm leading-6 text-orange-900/80">Use manual input or CSV import before treating products as real affiliate candidates.</p>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {settings.map((item) => (
          <div key={item.label} className="rounded-2xl border border-line p-4">
            <p className="text-sm font-bold text-ink">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.value}</p>
          </div>
        ))}
      </div>
      {tiktokOAuthErrors.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-black text-orange-900">TikTok OAuth configuration needs attention</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-orange-900/80">
            {tiktokOAuthErrors.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={clearDemoData} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
          <Trash2 className="h-4 w-4" />
          Clear demo data
        </button>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE_PRODUCT_CSV)}`}
          download="tiktok-affiliate-products-sample.csv"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          <Download className="h-4 w-4" />
          Export sample CSV
        </a>
        <a
          href="/api/health"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
        >
          <ExternalLink className="h-4 w-4" />
          Health check
        </a>
      </div>
    </SectionCard>
  );
}

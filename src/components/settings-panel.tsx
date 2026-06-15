"use client";

import { useEffect, useState } from "react";
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
  tiktokOAuthErrors,
  lastOAuthError
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
  lastOAuthError?: string;
}) {
  const [healthStatus, setHealthStatus] = useState("Checking...");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/health")
      .then((response) => response.json())
      .then((payload) => {
        if (!active) {
          return;
        }

        setHealthStatus(
          `app ${payload.app}; database ${payload.database}; TikTok OAuth ${payload.tiktokOAuth}; AI ${payload.aiProvider}; source ${payload.productSource}`
        );
      })
      .catch(() => {
        if (active) {
          setHealthStatus("Health check error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const settings = [
    { label: "Production URL", value: productionUrl || "Missing" },
    { label: "TikTok Redirect URI", value: tiktokRedirectUri || "Missing" },
    { label: "Status App URL", value: status.appUrl },
    { label: "Database", value: databaseConnected ? "Connected" : "Error / Not Connected" },
    { label: "TikTok OAuth", value: tiktokOAuthConfigured ? "Configured" : "Missing" },
    { label: "Last OAuth error", value: lastOAuthError || "none" },
    { label: "AI Provider", value: aiProviderConfigured ? "Configured" : "Template Mode" },
    { label: "Product Source", value: status.productDataSource },
    { label: "Product count from database", value: String(counts.totalProducts) },
    { label: "Demo Data Count", value: String(counts.demoProducts) },
    { label: "Manual product count", value: String(counts.manualProducts) },
    { label: "CSV product count", value: String(counts.csvProducts) },
    { label: "Health check status", value: healthStatus }
  ];

  async function clearDemoData() {
    if (!window.confirm("Hapus hanya DEMO DATA? MANUAL DATA, CSV IMPORT, dan REAL API DATA tidak akan dihapus.")) {
      return;
    }

    setActionMessage("Clearing demo data...");

    try {
      const response = await fetch("/api/products?source=DEMO", {
        method: "DELETE"
      });

      if (!response.ok) {
        const payload = await response.json();
        setActionMessage(payload.message ?? "Unable to clear demo data.");
        return;
      }

      setActionMessage("DEMO DATA cleared. Manual and CSV products were kept.");
      window.location.reload();
    } catch {
      setActionMessage("Unable to clear demo data. Check database connection.");
    }
  }

  return (
    <SectionCard
      id="settings"
      title="Pengaturan"
      description="Cek koneksi database, OAuth TikTok, AI Provider, dan sumber data produk."
      icon={Settings}
    >
      {status.productDataSource === "Demo Mode" ? (
        <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-black text-orange-900">DEMO DATA - Bukan dari TikTok Shop</p>
          <p className="mt-1 text-sm leading-6 text-orange-900/80">Gunakan input manual atau CSV import sebelum membaca produk sebagai kandidat affiliate kamu.</p>
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
          Clear Demo Data
        </button>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE_PRODUCT_CSV)}`}
          download="tiktok-affiliate-products-sample.csv"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          <Download className="h-4 w-4" />
          Download Sample CSV
        </a>
        <a
          href="/tiktok/oauth-test"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
        >
          <ExternalLink className="h-4 w-4" />
          Open TikTok OAuth Test Page
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(tiktokRedirectUri);
            setActionMessage("Redirect URI copied.");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
        >
          Copy Redirect URI
        </button>
        <a
          href="/api/health"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
        >
          <ExternalLink className="h-4 w-4" />
          Health Check
        </a>
      </div>
      <div className="mt-4 rounded-2xl border border-line bg-slate-50 p-4">
        <p className="text-sm font-black text-ink">Production checklist</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-muted">
          <li>Deployed to Vercel</li>
          <li>Env added in Vercel</li>
          <li>Redirect URI added in TikTok Developer Portal</li>
          <li>App has Login Kit product</li>
          <li>Test Connect TikTok</li>
        </ol>
      </div>
      {actionMessage ? (
        <div className="mt-4 rounded-2xl border border-line bg-slate-50 p-4">
          <p className="text-sm font-bold text-ink">{actionMessage}</p>
        </div>
      ) : null}
    </SectionCard>
  );
}

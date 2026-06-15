import { Download, Settings, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { SAMPLE_PRODUCT_CSV } from "@/modules/affiliate/csv-import";
import { SettingsStatus } from "@/modules/settings/status";

export function SettingsPanel({ status }: { status: SettingsStatus }) {
  const settings = [
    { label: "App URL status", value: status.appUrl },
    { label: "Database status", value: status.database },
    { label: "TikTok OAuth status", value: status.tiktokOAuth },
    { label: "AI Provider status", value: status.aiProvider },
    { label: "Product data source status", value: status.productDataSource }
  ];

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
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {settings.map((item) => (
          <div key={item.label} className="rounded-2xl border border-line p-4">
            <p className="text-sm font-bold text-ink">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
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
      </div>
    </SectionCard>
  );
}

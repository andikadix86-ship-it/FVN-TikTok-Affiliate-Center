import { AlertTriangle } from "lucide-react";
import { getProductSourceLabel } from "@/modules/affiliate/product-source";
import { ApiStatus } from "./api-status";

export function ApiStatusPanel({ status }: { status: ApiStatus }) {
  const rows = [
    ["TikTok Login", status.tiktokLogin],
    ["TikTok Display API", status.tiktokDisplayApi],
    ["TikTok Shop API", status.tiktokShopApi],
    ["Product Source", status.productSource]
  ];

  return (
    <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
        <div>
          <p className="text-sm font-black text-orange-900">DEMO DATA - Not from TikTok Shop</p>
          <p className="mt-1 text-sm leading-6 text-orange-900/80">
            These products are sample data only. Connect TikTok Shop API, import CSV, or add products manually to use real data.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {label === "Product Source" ? getProductSourceLabel(value as ApiStatus["productSource"]) : value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

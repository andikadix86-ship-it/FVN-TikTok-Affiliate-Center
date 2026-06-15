import { PackageSearch } from "lucide-react";
import { MetricPill } from "@/components/metric-pill";
import { SectionCard } from "@/components/section-card";
import { scoreProduct } from "@/modules/scoring/score-product";
import { sampleProducts } from "./sample-products";

export function ProductHunter() {
  return (
    <SectionCard
      id="product-hunter"
      title="Product Hunter"
      description="Shortlist beginner-friendly products with clear hooks and simple demos."
      icon={PackageSearch}
    >
      <div className="grid gap-3 lg:grid-cols-3">
        {sampleProducts.map((product) => {
          const score = scoreProduct(product);
          return (
            <article key={product.id} className="rounded-2xl border border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink">{product.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{product.niche}</p>
                </div>
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{score.total}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{product.hook}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <MetricPill label="Price" value={`$${product.price}`} />
                <MetricPill label="Commission" value={`${product.commissionRate}%`} tone="good" />
                <MetricPill label="Sales" value={`${product.salesVelocity}/100`} />
                <MetricPill label="Competition" value={product.competition} tone={product.competition === "low" ? "good" : "warn"} />
              </div>
            </article>
          );
        })}
      </div>
    </SectionCard>
  );
}

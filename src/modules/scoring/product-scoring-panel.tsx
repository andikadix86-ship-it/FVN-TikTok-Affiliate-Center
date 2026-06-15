import { BarChart3 } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { scoreProduct } from "./score-product";

export function ProductScoringPanel() {
  const bestProduct = sampleProducts
    .map((product) => ({ product, score: scoreProduct(product) }))
    .sort((a, b) => b.score.total - a.score.total)[0];

  return (
    <SectionCard
      id="scoring"
      title="Product Scoring"
      description="Score products by commission, demand, content fit, rating, and competition."
      icon={BarChart3}
    >
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl bg-ink p-5 text-white">
          <p className="text-sm font-semibold text-white/70">Best candidate</p>
          <p className="mt-2 text-2xl font-bold">{bestProduct.product.productName}</p>
          <p className="mt-2 text-sm leading-6 text-white/75">{bestProduct.product.notes}</p>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-5xl font-black">{bestProduct.score.total}</span>
            <span className="pb-2 text-sm font-semibold text-white/60">affiliate score</span>
          </div>
        </div>
        <div className="grid gap-3">
          {Object.entries(bestProduct.score.factors).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-line px-4 py-3">
              <span className="text-sm font-semibold capitalize text-ink">{label}</span>
              <span className="text-sm font-bold text-muted">{String(Math.round(value))}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

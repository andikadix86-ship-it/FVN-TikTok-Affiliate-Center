import { Copy, Sparkles } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { sampleProducts } from "@/modules/affiliate/sample-products";
import { buildTikTokPrompt } from "./prompt-templates";

export function ContentFactory() {
  const product = sampleProducts[0];
  const prompt = buildTikTokPrompt(product);

  return (
    <SectionCard
      id="content-factory"
      title="Buat Konten"
      description="Ubah produk terpilih menjadi draft script short video yang aman untuk pemula."
      icon={Sparkles}
    >
      <div className="rounded-2xl border border-line bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-ink">Prompt Engineer Draft</p>
          <button className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
        <p className="mt-3 text-sm leading-7 text-muted">{prompt}</p>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {["Hook", "Demo", "CTA"].map((step) => (
          <div key={step} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm font-bold text-ink">{step}</p>
            <p className="mt-1 text-sm leading-6 text-muted">Ready for AI provider integration.</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

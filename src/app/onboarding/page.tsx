"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { buildCampaignPlan } from "@/modules/prompt-engine/campaign.prompt";
import { buildTemplateContentPack } from "@/modules/prompt-engine/fallback";
import { scoreProduct } from "@/modules/scoring/score-product";
import { getRecommendationLabel } from "@/modules/scoring/recommendation-label";
import { onboardingSteps, getNextOnboardingStep, getPreviousOnboardingStep } from "@/modules/onboarding/onboarding-steps";
import { AffiliateProduct, CompetitionLevel } from "@/modules/affiliate/types";

const initialProduct = {
  productName: "",
  category: "",
  price: "19",
  commissionRate: "15",
  competitionLevel: "medium" as CompetitionLevel,
  productUrl: ""
};

function buildFirstProduct(form: typeof initialProduct): AffiliateProduct {
  const now = new Date().toISOString();

  return {
    id: "onboarding-product",
    productName: form.productName || "Produk pertama kamu",
    platform: "TikTok",
    category: form.category || "Kategori produk",
    price: Number(form.price) || 0,
    commissionRate: Number(form.commissionRate) || 0,
    salesScore: 65,
    rating: 0,
    reviewCount: 0,
    competitionLevel: form.competitionLevel,
    productUrl: form.productUrl,
    imageUrl: "",
    targetAudience: "Affiliate pemula",
    problemSolved: "Belum tahu angle konten produk",
    mainBenefit: "Membantu mulai dari produk pertama",
    demoIdea: "Tunjukkan produk dipakai secara sederhana",
    source: "MANUAL",
    notes: "Produk pertama dari onboarding.",
    contentPotential: 75,
    beginnerFriendliness: 80,
    createdAt: now,
    updatedAt: now
  };
}

export default function OnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(initialProduct);
  const product = useMemo(() => buildFirstProduct(form), [form]);
  const score = scoreProduct(product);
  const contentPack = buildTemplateContentPack({ product, mode: "TEMPLATE_MODE" });
  const campaign = buildCampaignPlan({ product, mode: "TEMPLATE_MODE" }, 7, "testing product");

  function updateForm(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <AppShell>
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-line bg-white p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-mint">Onboarding</p>
              <h1 className="mt-2 text-3xl font-bold leading-tight text-ink">Mulai Affiliate TikTok dengan Lebih Terarah</h1>
              <p className="mt-2 text-sm leading-6 text-muted">Ikuti langkah singkat ini untuk memahami alur produk, konten, campaign, dan evaluasi performa.</p>
            </div>
            <a href="/#dashboard" className="rounded-full border border-line px-4 py-2 text-center text-sm font-semibold text-ink">
              Buka Dashboard
            </a>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {onboardingSteps.map((step, index) => (
              <button
                key={step}
                onClick={() => setStepIndex(index)}
                className={`min-h-12 rounded-2xl px-2 text-xs font-bold ${index === stepIndex ? "bg-ink text-white" : "bg-slate-100 text-muted"}`}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {stepIndex === 0 ? <WelcomeStep /> : null}
            {stepIndex === 1 ? <DataSourceStep /> : null}
            {stepIndex === 2 ? <FirstProductStep form={form} updateForm={updateForm} score={score.total} recommendation={getRecommendationLabel(score.recommendation)} /> : null}
            {stepIndex === 3 ? <FirstContentStep productName={product.productName} hooks={contentPack.hooks} script={contentPack.script15} caption={contentPack.caption} cta={contentPack.cta} /> : null}
            {stepIndex === 4 ? <FirstCampaignStep productName={product.productName} campaign={campaign.slice(0, 7)} /> : null}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <button
              onClick={() => setStepIndex(getPreviousOnboardingStep(stepIndex))}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
            <button
              onClick={() => setStepIndex(getNextOnboardingStep(stepIndex))}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
            >
              Lanjut
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function WelcomeStep() {
  return (
    <div className="grid gap-3 sm:grid-cols-5">
      {["Cari produk", "Nilai peluang produk", "Buat script konten", "Buat rencana posting", "Evaluasi performa"].map((item) => (
        <div key={item} className="rounded-2xl border border-line p-4">
          <CheckCircle2 className="h-5 w-5 text-teal-700" />
          <p className="mt-3 text-sm font-bold text-ink">{item}</p>
        </div>
      ))}
    </div>
  );
}

function DataSourceStep() {
  const rows = [
    ["DEMO DATA", "contoh saja, bukan data TikTok Shop asli"],
    ["MANUAL DATA", "produk yang kamu input sendiri"],
    ["CSV IMPORT", "produk dari file CSV kamu"],
    ["REAL API DATA", "data asli jika TikTok Shop API sudah connected"]
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map(([label, detail]) => (
        <div key={label} className="rounded-2xl border border-line bg-slate-50 p-4">
          <p className="text-sm font-black text-ink">{label}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function FirstProductStep({
  form,
  updateForm,
  score,
  recommendation
}: {
  form: typeof initialProduct;
  updateForm: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  score: number;
  recommendation: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
      <div className="grid gap-2">
        {[
          ["productName", "Nama produk"],
          ["category", "Kategori"],
          ["price", "Harga"],
          ["commissionRate", "Komisi"],
          ["productUrl", "Link produk"]
        ].map(([name, label]) => (
          <input key={name} name={name} value={form[name as keyof typeof form]} onChange={updateForm} placeholder={label} className="min-h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-mint" />
        ))}
        <select name="competitionLevel" value={form.competitionLevel} onChange={updateForm} className="min-h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-mint">
          <option value="low">Kompetisi rendah</option>
          <option value="medium">Kompetisi sedang</option>
          <option value="high">Kompetisi tinggi</option>
        </select>
      </div>
      <div className="rounded-2xl bg-ink p-5 text-white">
        <p className="text-sm font-bold text-white/70">Preview score</p>
        <p className="mt-3 text-5xl font-black">{score}</p>
        <p className="mt-2 text-lg font-bold">{recommendation}</p>
        <p className="mt-3 text-sm leading-6 text-white/70">Score ini estimasi awal. Pakai sebagai filter, bukan jaminan penjualan.</p>
      </div>
    </div>
  );
}

function FirstContentStep({ productName, hooks, script, caption, cta }: { productName: string; hooks: string[]; script: string; caption: string; cta: string }) {
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border border-line p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-mint" />
          <p className="text-sm font-bold text-ink">Draft konten untuk {productName}</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted">Gunakan script ini sebagai draft. Sesuaikan dengan gaya bicara kamu sebelum posting.</p>
      </div>
      <Output title="Hook 3 detik pertama" value={hooks[0]} />
      <Output title="Script 15 detik" value={script} />
      <Output title="Caption" value={caption} />
      <Output title="CTA keranjang kuning" value={cta} />
    </div>
  );
}

function FirstCampaignStep({ productName, campaign }: { productName: string; campaign: Array<{ day: number; angle: string; hook: string; scriptIdea: string; cta: string }> }) {
  return (
    <div>
      <p className="text-sm font-bold text-ink">Rencana posting 7 hari untuk {productName}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {campaign.map((day) => (
          <div key={day.day} className="rounded-2xl border border-line p-4">
            <p className="text-xs font-black uppercase tracking-wide text-coral">Hari ke-{day.day}</p>
            <p className="mt-2 text-sm font-bold text-ink">{day.angle}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{day.hook}</p>
            <p className="mt-2 text-xs font-semibold text-ink">{day.cta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Output({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink">{value}</p>
    </div>
  );
}

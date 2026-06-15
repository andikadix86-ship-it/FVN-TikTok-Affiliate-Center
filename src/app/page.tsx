import { AppShell } from "@/components/app-shell";
import { CampaignPlanner } from "@/modules/campaign/campaign-planner";
import { ContentFactory } from "@/modules/prompt-engine/content-factory";
import { ProductHunter } from "@/modules/affiliate/product-hunter";
import { ProductScoringPanel } from "@/modules/scoring/product-scoring-panel";
import { SettingsPanel } from "@/components/settings-panel";
import { TikTokConnectionPanel } from "@/modules/tiktok/tiktok-connection-panel";

export default function Home() {
  return (
    <AppShell>
      <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <div className="rounded-[2rem] border border-white bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint">FVN TikTok Affiliate Center</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-ink sm:text-5xl">
              Find products, score them, and plan TikTok affiliate content.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              A beginner-friendly MVP that keeps the workflow simple: pick a product, validate the angle, generate a content prompt, connect TikTok, and schedule the next campaign.
            </p>
          </div>
          <ProductHunter />
          <ProductScoringPanel />
          <ContentFactory />
          <TikTokConnectionPanel />
          <CampaignPlanner />
          <SettingsPanel />
        </div>
      </section>
    </AppShell>
  );
}

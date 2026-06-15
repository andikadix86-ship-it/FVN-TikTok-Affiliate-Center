import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { getSourceBadgeText, getSourceClassName } from "@/modules/affiliate/source-badge";
import { ProductSource } from "@/modules/affiliate/types";
import { ActionPlanResult, DailyAction } from "./action-plan-engine";

const priorityClass: Record<string, string> = {
  High: "bg-coral text-white",
  Medium: "bg-yellow-100 text-yellow-900",
  Low: "bg-slate-100 text-ink"
};

const actionTypeLabels: Record<string, string> = {
  PROMOTE_PRODUCT: "Lanjutkan Produk",
  CREATE_CONTENT: "Buat Konten",
  POST_READY_DRAFT: "Posting Draft",
  IMPROVE_CONTENT: "Perbaiki Konten",
  CONTINUE_CAMPAIGN: "Lanjutkan Campaign",
  PAUSE_CAMPAIGN: "Pause Campaign",
  TEST_PRODUCT: "Test Produk",
  STOP_PRODUCT: "Stop Produk"
};

export function ActionPlanPanel({
  plan,
  productSources
}: {
  plan: ActionPlanResult;
  productSources: Record<string, ProductSource>;
}) {
  return (
    <div className="grid gap-4">
      <section className="rounded-[2rem] border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-mint">Fokus Hari Ini</p>
            <h1 className="mt-2 text-3xl font-black text-ink">Rencana Hari Ini</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-ink">
            {plan.summary.providerMode === "AI_CONNECTED" ? "AI Connected" : "Template Mode"}
          </span>
        </div>
        <p className="mt-4 text-lg font-bold leading-7 text-ink">{plan.summary.mainFocus}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {plan.summary.recommendedActions.map((action) => (
            <div key={action} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-muted">Aksi disarankan</p>
              <p className="mt-2 text-sm font-bold text-ink">{action}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-black text-orange-900">Hindari hari ini</p>
            <p className="mt-1 text-sm leading-6 text-orange-900/80">{plan.summary.avoidToday}</p>
          </div>
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-sm font-black text-teal-900">Target posting</p>
            <p className="mt-1 text-sm leading-6 text-teal-900/80">{plan.summary.suggestedPostingTarget}</p>
          </div>
        </div>
      </section>

      {plan.emptyState === "NO_PRODUCTS" ? (
        <EmptyState
          title="Belum ada produk. Tambahkan produk pertama kamu agar aplikasi bisa membuat rencana harian."
          buttonLabel="Tambah Produk"
          href="/#product-hunter"
        />
      ) : null}

      {plan.emptyState === "DEMO_ONLY" ? (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-black text-yellow-900">Saat ini masih memakai produk demo. Tambahkan produk manual atau import CSV agar rekomendasi lebih sesuai kebutuhan kamu.</p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <ActionGroup title="Produk yang harus difokuskan hari ini" actions={plan.actions.filter((action) => action.actionType === "PROMOTE_PRODUCT")} productSources={productSources} />
        <ActionGroup title="Konten yang harus dibuat" actions={plan.actions.filter((action) => action.actionType === "CREATE_CONTENT" || action.actionType === "TEST_PRODUCT")} productSources={productSources} />
        <ActionGroup title="Draft yang siap diposting" actions={plan.actions.filter((action) => action.actionType === "POST_READY_DRAFT")} productSources={productSources} />
        <ActionGroup title="Campaign yang perlu dilanjutkan" actions={plan.actions.filter((action) => action.actionType === "CONTINUE_CAMPAIGN")} productSources={productSources} />
        <ActionGroup title="Produk yang perlu ditest ulang" actions={plan.actions.filter((action) => action.actionType === "TEST_PRODUCT")} productSources={productSources} />
        <ActionGroup title="Produk yang sebaiknya dihentikan" actions={plan.actions.filter((action) => action.actionType === "STOP_PRODUCT")} productSources={productSources} />
        <ActionGroup title="Konten yang perlu diperbaiki" actions={plan.actions.filter((action) => action.actionType === "IMPROVE_CONTENT" || action.actionType === "PAUSE_CAMPAIGN")} productSources={productSources} />
      </div>
    </div>
  );
}

function ActionGroup({
  title,
  actions,
  productSources
}: {
  title: string;
  actions: DailyAction[];
  productSources: Record<string, ProductSource>;
}) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-4">
      <h2 className="text-lg font-black text-ink">{title}</h2>
      {actions.length === 0 ? (
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-slate-50 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-700" />
          <p className="text-sm leading-6 text-muted">Belum ada aksi khusus untuk bagian ini.</p>
        </div>
      ) : (
        <div className="mt-3 grid gap-3">
          {actions.map((action) => <ActionCard key={`${action.actionType}-${action.title}-${action.relatedProduct ?? ""}`} action={action} source={action.relatedProduct ? productSources[action.relatedProduct] : undefined} />)}
        </div>
      )}
    </section>
  );
}

function ActionCard({ action, source }: { action: DailyAction; source?: ProductSource }) {
  return (
    <article className="rounded-2xl border border-line bg-slate-50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-black ${priorityClass[action.priority]}`}>{action.priority}</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-ink">{actionTypeLabels[action.actionType]}</span>
        {source ? <span className={`rounded-full px-3 py-1 text-[10px] font-black ${getSourceClassName(source)}`}>{getSourceBadgeText(source)}</span> : null}
      </div>
      <h3 className="mt-3 text-lg font-black text-ink">{action.title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-muted">Kenapa penting</p>
          <p className="mt-1 text-sm leading-6 text-muted">{action.reason}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-muted">Langkah berikutnya</p>
          <p className="mt-1 text-sm leading-6 text-muted">{action.nextStep}</p>
        </div>
      </div>
      <a href={action.href} className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
        <Sparkles className="h-4 w-4" />
        {action.buttonLabel}
      </a>
    </article>
  );
}

function EmptyState({ title, buttonLabel, href }: { title: string; buttonLabel: string; href: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-line bg-white p-8 text-center">
      <AlertTriangle className="mx-auto h-8 w-8 text-coral" />
      <p className="mt-3 text-lg font-black text-ink">{title}</p>
      <a href={href} className="mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">{buttonLabel}</a>
    </div>
  );
}

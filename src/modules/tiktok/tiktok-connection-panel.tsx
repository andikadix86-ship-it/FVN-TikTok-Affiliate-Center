import { AlertTriangle, CheckCircle2, Link2 } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { TikTokEnvStatus } from "./env-status";
import { TikTokAccountView } from "./account-service";

export function TikTokConnectionPanel({
  envStatus,
  loginConnected,
  lastOAuthError,
  account
}: {
  envStatus: TikTokEnvStatus;
  loginConnected: boolean;
  lastOAuthError?: string;
  account: TikTokAccountView;
}) {
  const rows = [
    ["TIKTOK_CLIENT_KEY", envStatus.clientKey],
    ["TIKTOK_CLIENT_SECRET", envStatus.clientSecret],
    ["TIKTOK_REDIRECT_URI", envStatus.redirectUri],
    ["Status koneksi", loginConnected ? "Connected" : "Not Connected"],
    ["Error OAuth terakhir", lastOAuthError || "none"]
  ];

  return (
    <SectionCard
      id="tiktok-accounts"
      title="Akun TikTok"
      description="Hubungkan TikTok Login Kit saat credential aplikasi sudah siap. Mode manual tetap bisa dipakai dulu."
      icon={Link2}
    >
      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([label, value]) => {
          const isProblem = value === "Missing" || value === "Not Connected" || (label === "Error OAuth terakhir" && value !== "none");
          return (
            <div key={label} className="rounded-2xl border border-line p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                {isProblem ? <AlertTriangle className="h-4 w-4 text-orange-700" /> : <CheckCircle2 className="h-4 w-4 text-teal-700" />}
              </div>
              <p className="mt-2 break-words text-sm font-bold text-ink">{value}</p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-ink">Status koneksi</p>
          <p className="mt-1 text-sm text-muted">
            {loginConnected ? "Connected. TikTok Login Kit authorization completed." : "Akun TikTok belum terhubung. Kamu tetap bisa memakai mode manual/CSV dulu."}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {[
              ["display name", account.displayName],
              ["avatar", account.avatarUrl ? "available" : "Not connected"],
              ["open_id", account.openIdMasked],
              ["connected_at", account.connectedAt],
              ["token status", account.tokenStatus],
              ["scope status", account.scopeStatus],
              ["last sync", account.lastSyncStatus],
              ["last OAuth error", lastOAuthError || "none"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="mt-1 break-words text-xs font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <a href="/api/auth/tiktok/login" className="rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-white">
          Hubungkan TikTok
        </a>
        <a href="/tiktok/oauth-test" className="rounded-full border border-line px-4 py-2 text-center text-sm font-semibold text-ink">
          Open OAuth Test Page
        </a>
        <button
          className="rounded-full border border-line px-4 py-2 text-center text-sm font-semibold text-muted disabled:cursor-not-allowed disabled:opacity-70"
          disabled
          title="Token belum disimpan karena enkripsi token belum dikonfigurasi."
          type="button"
        >
          Refresh Profile
        </button>
        <form action="/api/auth/tiktok/disconnect" method="post">
          <button className="w-full rounded-full border border-line px-4 py-2 text-center text-sm font-semibold text-ink" type="submit">
            Disconnect TikTok
          </button>
        </form>
      </div>
    </SectionCard>
  );
}

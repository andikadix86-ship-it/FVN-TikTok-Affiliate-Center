import { AlertTriangle, CheckCircle2, Link2 } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { TikTokEnvStatus } from "./env-status";

export function TikTokConnectionPanel({
  envStatus,
  loginConnected,
  lastOAuthError
}: {
  envStatus: TikTokEnvStatus;
  loginConnected: boolean;
  lastOAuthError?: string;
}) {
  const rows = [
    ["TIKTOK_CLIENT_KEY", envStatus.clientKey],
    ["TIKTOK_CLIENT_SECRET", envStatus.clientSecret],
    ["TIKTOK_REDIRECT_URI", envStatus.redirectUri],
    ["Connection Status", loginConnected ? "Connected" : "Not Connected"],
    ["Last OAuth Error", lastOAuthError || "none"]
  ];

  return (
    <SectionCard
      id="tiktok-accounts"
      title="TikTok Accounts"
      description="OAuth/Login Kit is wired as a placeholder route for real TikTok app credentials."
      icon={Link2}
    >
      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([label, value]) => {
          const isProblem = value === "Missing" || value === "Not Connected" || (label === "Last OAuth Error" && value !== "none");
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
          <p className="text-sm font-bold text-ink">Connection status</p>
          <p className="mt-1 text-sm text-muted">
            {loginConnected ? "Connected. TikTok Login Kit authorization completed." : "TikTok account is not connected yet."}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {[
              ["display name", loginConnected ? "Connected Account" : "Not connected"],
              ["avatar", loginConnected ? "placeholder" : "Not connected"],
              ["open_id", loginConnected ? "pending_token_exchange" : "Not connected"],
              ["connected_at", loginConnected ? new Date().toLocaleDateString() : "Not connected"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="mt-1 break-words text-xs font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <a href="/api/auth/tiktok/login" className="rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-white">
          Start TikTok Login
        </a>
      </div>
    </SectionCard>
  );
}

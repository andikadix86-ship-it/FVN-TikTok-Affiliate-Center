import { AlertTriangle, CheckCircle2, Link2 } from "lucide-react";
import { SectionCard } from "@/components/section-card";

export function TikTokConnectionPanel({
  clientKeyConfigured,
  redirectUriConfigured,
  loginConnected,
  lastOAuthError
}: {
  clientKeyConfigured: boolean;
  redirectUriConfigured: boolean;
  loginConnected: boolean;
  lastOAuthError?: string;
}) {
  const rows = [
    ["TikTok Client Key", clientKeyConfigured ? "configured" : "missing"],
    ["TikTok Redirect URI", redirectUriConfigured ? "configured" : "missing"],
    ["TikTok Login Status", loginConnected ? "connected" : "not connected"],
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
          const isProblem = value === "missing" || value === "not connected" || (label === "Last OAuth Error" && value !== "none");
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
            {loginConnected ? "Connected. TikTok Login Kit authorization completed." : "Not connected. Add TikTok keys in `.env` and use the login route."}
          </p>
        </div>
        <a href="/api/auth/tiktok/login" className="rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-white">
          Start TikTok Login
        </a>
      </div>
    </SectionCard>
  );
}

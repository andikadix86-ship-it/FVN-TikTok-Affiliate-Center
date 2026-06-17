"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, PlayCircle, ShieldCheck, UserCircle } from "lucide-react";
import type { TikTokAccountView } from "./account-service";

type ConnectionStep = "Dashboard" | "Connect TikTok" | "Authorize" | "Return" | "Connected";

export function TikTokConnectionCenter({
  account,
  apiConfigured,
  loginConnected,
  startFlow = false,
  compact = false
}: {
  account: TikTokAccountView;
  apiConfigured: boolean;
  loginConnected: boolean;
  startFlow?: boolean;
  compact?: boolean;
}) {
  const demoAccount: TikTokAccountView = {
    connected: true,
    demoMode: true,
    connectionStatus: "Connected",
    username: "@fvn_demo_creator",
    displayName: "Demo TikTok Account",
    avatarUrl: "",
    followerCount: "12,480",
    videoCount: "86",
    openIdMasked: "demo_open_id",
    connectedAt: "Demo mode",
    tokenStatus: "demo_not_stored",
    scopeStatus: "demo_profile",
    lastSyncStatus: "demo_connected"
  };
  const [status, setStatus] = useState<TikTokAccountView["connectionStatus"]>(loginConnected ? account.connectionStatus : apiConfigured ? "Not Connected" : "Connected");
  const [activeAccount, setActiveAccount] = useState<TikTokAccountView>(loginConnected ? account : demoAccount);
  const [step, setStep] = useState<ConnectionStep>(startFlow ? "Connect TikTok" : loginConnected || !apiConfigured ? "Connected" : "Dashboard");
  const [message, setMessage] = useState("");
  const apiBadge = loginConnected && apiConfigured ? "TikTok API Connected" : "TikTok API Not Connected";
  const showConnected = loginConnected || (!apiConfigured && activeAccount.demoMode);

  useEffect(() => {
    if (startFlow) {
      setStep("Connect TikTok");
      setMessage("Flow siap direkam: Dashboard -> Connect TikTok -> Authorize -> Return -> Connected.");
    }
  }, [startFlow]);

  function authorizeDemo() {
    setStatus("Connecting");
    setStep("Authorize");
    setMessage("Connecting to TikTok demo authorization...");
    window.setTimeout(() => {
      setStep("Return");
      setMessage("Returning from TikTok authorization...");
    }, 450);
    window.setTimeout(() => {
      setActiveAccount(demoAccount);
      setStatus("Connected");
      setStep("Connected");
      setMessage("Connected (Demo). Real TikTok API is not connected yet.");
    }, 900);
  }

  return (
    <section className={`rounded-[2rem] border border-white bg-white p-5 shadow-soft ${compact ? "" : "space-y-5"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">TikTok Connection Center</p>
          <h2 className="mt-1 text-2xl font-black text-ink">Accounts / Social Accounts</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Connect TikTok untuk showcase, profile sync, scheduling context, dan review flow.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${loginConnected && apiConfigured ? "bg-emerald-100 text-emerald-950" : "bg-amber-100 text-amber-950"}`}>
          {apiBadge}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {(["Not Connected", "Connecting", "Connected", "Expired"] as const).map((item) => (
          <div key={item} className={`rounded-2xl border p-3 ${status === item ? "border-violet-300 bg-violet-50" : "border-line bg-white"}`}>
            <p className="text-[11px] font-black uppercase tracking-wide text-muted">Status</p>
            <p className="mt-1 text-sm font-black text-ink">{item}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-line bg-slate-50 p-4">
          <div className="flex flex-wrap gap-2">
            {(["Dashboard", "Connect TikTok", "Authorize", "Return", "Connected"] as ConnectionStep[]).map((item) => (
              <span key={item} className={`rounded-full px-3 py-1 text-xs font-black ${step === item ? "bg-violet-600 text-white" : "bg-white text-muted"}`}>{item}</span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="/accounts?connect=tiktok" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-black text-white">
              <PlayCircle className="h-4 w-4" />
              Connect TikTok
            </a>
            {apiConfigured ? (
              <a href="/api/auth/tiktok/login" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">
                <ExternalLink className="h-4 w-4" />
                Authorize Real OAuth
              </a>
            ) : (
              <button onClick={authorizeDemo} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">
                {status === "Connecting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Authorize Demo
              </button>
            )}
            <a href="/" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-ink">
              Return to Dashboard
            </a>
          </div>
          {message ? <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold text-ink">{message}</p> : null}
        </div>

        <div className="rounded-[1.5rem] border border-line bg-white p-4">
          <div className="flex items-center gap-3">
            {activeAccount.avatarUrl ? (
              <div className="h-16 w-16 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${activeAccount.avatarUrl})` }} />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <UserCircle className="h-8 w-8" />
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-black text-ink">{showConnected ? activeAccount.displayName : "No TikTok account connected"}</p>
                {activeAccount.demoMode ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-950">Connected (Demo)</span> : null}
                {loginConnected && !activeAccount.demoMode ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : null}
              </div>
              <p className="mt-1 text-sm font-bold text-muted">{showConnected ? activeAccount.username : "Connect TikTok to show username"}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <Metric label="Followers" value={showConnected ? activeAccount.followerCount : "0"} />
            <Metric label="Videos" value={showConnected ? activeAccount.videoCount : "0"} />
            <Metric label="Connection" value={activeAccount.demoMode ? "Demo" : loginConnected ? "Real OAuth" : "None"} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-black text-ink">{value}</p>
    </div>
  );
}

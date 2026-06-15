"use client";

import { useState } from "react";

export function OAuthTestPanel({
  redirectUri,
  loginUrl
}: {
  redirectUri: string;
  loginUrl: string;
}) {
  const [message, setMessage] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  async function copyRedirectUri() {
    await navigator.clipboard.writeText(redirectUri);
    setMessage("Redirect URI berhasil disalin.");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => setMessage("Environment status ditampilkan di kartu di atas.")} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
        Test Environment
      </button>
      <button onClick={() => setGeneratedUrl(loginUrl)} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
        Generate Login URL
      </button>
      <button onClick={copyRedirectUri} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
        Copy Redirect URI
      </button>
      <a href="/api/auth/tiktok/login" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
        Connect TikTok
      </a>
      {message ? <p className="basis-full text-sm font-semibold text-teal-800">{message}</p> : null}
      {generatedUrl ? (
        <div className="basis-full rounded-2xl border border-line bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Generated Login URL</p>
          <p className="mt-2 break-all text-sm text-ink">{generatedUrl}</p>
        </div>
      ) : null}
    </div>
  );
}

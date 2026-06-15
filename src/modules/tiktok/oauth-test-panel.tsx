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
  const [loadingAction, setLoadingAction] = useState<"env" | "url" | "copy" | null>(null);

  async function copyRedirectUri() {
    setLoadingAction("copy");

    try {
      await navigator.clipboard.writeText(redirectUri);
      setMessage("Redirect URI berhasil disalin.");
    } catch {
      setMessage("Redirect URI belum bisa disalin otomatis. Salin manual dari kartu di atas.");
    } finally {
      setLoadingAction(null);
    }
  }

  function showEnvironmentStatus() {
    setLoadingAction("env");
    setMessage("Mengecek status environment...");
    window.setTimeout(() => {
      setMessage("Environment status ditampilkan di kartu di atas.");
      setLoadingAction(null);
    }, 200);
  }

  function showLoginUrl() {
    setLoadingAction("url");
    setMessage("Membuat Login URL...");
    window.setTimeout(() => {
      setGeneratedUrl(loginUrl);
      setMessage("Login URL berhasil dibuat. Tidak ada code_challenge saat PKCE nonaktif.");
      setLoadingAction(null);
    }, 200);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={showEnvironmentStatus} disabled={loadingAction !== null} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
        {loadingAction === "env" ? "Testing..." : "Test Environment"}
      </button>
      <button onClick={showLoginUrl} disabled={loadingAction !== null} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
        {loadingAction === "url" ? "Generating..." : "Generate Login URL"}
      </button>
      <button onClick={copyRedirectUri} disabled={loadingAction !== null} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
        {loadingAction === "copy" ? "Copying..." : "Copy Redirect URI"}
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

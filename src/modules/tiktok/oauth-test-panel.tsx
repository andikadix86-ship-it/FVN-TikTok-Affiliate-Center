"use client";

import { useState } from "react";

export function OAuthTestPanel({
  redirectUri,
  clientKey,
  pkceEnabled
}: {
  redirectUri: string;
  clientKey: string;
  pkceEnabled: boolean;
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
      const state = window.crypto?.randomUUID?.() ?? String(Date.now());
      const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
      url.searchParams.set("client_key", clientKey);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "user.info.basic");
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("state", state);

      setGeneratedUrl(url.toString());
      setMessage(
        pkceEnabled
          ? "Login URL dasar berhasil dibuat. PKCE lengkap dibuat oleh route login server."
          : "Login URL berhasil dibuat. Tidak ada code_challenge saat PKCE nonaktif."
      );
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
        Connect Platform
      </a>
      {message ? <p className="basis-full text-sm font-semibold text-teal-800">{message}</p> : null}
      {generatedUrl ? (
        <div className="basis-full rounded-2xl border border-line bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Generated Login URL</p>
          <p className="mt-2 text-sm text-ink">Login URL berhasil dibuat untuk authorized platform integration. Endpoint disembunyikan dari UI publik.</p>
        </div>
      ) : null}
    </div>
  );
}

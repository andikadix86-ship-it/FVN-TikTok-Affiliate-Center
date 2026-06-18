"use client";

import { Loader2, MailCheck } from "lucide-react";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Request reset password gagal.");
      setMessage(data.message ?? "Instruksi reset password akan dikirim jika email terdaftar.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request reset password gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div> : null}

      <label className="block">
        <span className="text-sm font-black text-ink">Email</span>
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm font-semibold text-ink outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder="you@fvn.com" />
      </label>

      <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 text-sm font-black text-white shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
        {loading ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}

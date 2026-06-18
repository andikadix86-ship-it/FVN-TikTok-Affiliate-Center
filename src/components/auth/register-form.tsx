"use client";

import { Chrome, Eye, EyeOff, Loader2, Music2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OAuthButton } from "@/components/auth/oauth-button";

export function RegisterForm({ googleEnabled, tiktokEnabled }: { googleEnabled: boolean; tiktokEnabled: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password harus sama.");
      return;
    }

    if (!agreeTerms) {
      setError("Setujui Terms dan Privacy Policy untuk membuat akun.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password, agreeTerms, remember: true })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Register gagal.");
      router.push(data.redirectTo ?? "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <OAuthButton href="/api/auth/login/google" label="Continue with Google" icon={Chrome} disabled={!googleEnabled} badge={googleEnabled ? undefined : "Setup"} />
        <OAuthButton href="/api/auth/login/tiktok" label="Continue with TikTok" icon={Music2} disabled={!tiktokEnabled} badge="Soon" />
      </div>

      <div className="flex items-center gap-3 text-xs font-black uppercase text-slate-400">
        <span className="h-px flex-1 bg-violet-100" />
        or register with email
        <span className="h-px flex-1 bg-violet-100" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}

        <label className="block">
          <span className="text-sm font-black text-ink">Name</span>
          <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm font-semibold text-ink outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder="FVN Creator" />
        </label>

        <label className="block">
          <span className="text-sm font-black text-ink">Email</span>
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm font-semibold text-ink outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder="you@fvn.com" />
        </label>

        <label className="block">
          <span className="text-sm font-black text-ink">Password</span>
          <div className="relative mt-2">
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 pr-12 text-sm font-semibold text-ink outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder="Minimum 8 characters" />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-violet-50 hover:text-violet-700">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-black text-ink">Confirm password</span>
          <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-violet-100 bg-white px-4 text-sm font-semibold text-ink outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder="Repeat your password" />
        </label>

        <label className="flex items-start gap-3 text-sm font-semibold leading-6 text-muted">
          <input type="checkbox" checked={agreeTerms} onChange={(event) => setAgreeTerms(event.target.checked)} className="mt-1 h-4 w-4 rounded border-violet-200 accent-violet-700" />
          <span>
            I agree to the <Link href="/terms" className="font-black text-violet-700 transition hover:text-fuchsia-700">Terms</Link> and <Link href="/privacy" className="font-black text-violet-700 transition hover:text-fuchsia-700">Privacy Policy</Link>.
          </span>
        </label>

        <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 text-sm font-black text-white shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

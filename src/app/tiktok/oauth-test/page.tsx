import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { env } from "@/lib/env";
import {
  TIKTOK_OAUTH_ERROR_COOKIE,
  TIKTOK_OAUTH_SUCCESS_COOKIE,
  validateTikTokEnv
} from "@/modules/tiktok/oauth";
import { OAuthTestPanel } from "@/modules/tiktok/oauth-test-panel";

function statusText(value: boolean, valid = "valid", invalid = "invalid") {
  return value ? valid : invalid;
}

export default function TikTokOAuthTestPage() {
  const cookieStore = cookies();
  const validation = validateTikTokEnv();
  const rows = [
    ["Platform Client Key", validation.clientKey],
    ["Platform Client Secret", validation.clientSecret],
    ["Platform Redirect URI", validation.redirectUri],
    ["Redirect URI HTTPS", statusText(validation.redirect.https)],
    ["Redirect URI Static", statusText(validation.redirect.static)],
    ["Redirect URI Has Query", validation.redirect.hasQuery ? "yes" : "no"],
    ["Redirect URI Has Hash", validation.redirect.hasHash ? "yes" : "no"],
    ["NEXT_PUBLIC_APP_URL", validation.appUrl],
    ["OAuth Endpoint", "v2 authorize"],
    ["Token Endpoint", "v2 token"],
    ["Last OAuth Error", cookieStore.get(TIKTOK_OAUTH_ERROR_COOKIE)?.value ?? "none"],
    ["Last OAuth Success", cookieStore.get(TIKTOK_OAUTH_SUCCESS_COOKIE)?.value ?? "none"]
  ];

  return (
    <AppShell>
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-line bg-white p-5 shadow-soft sm:p-7">
          <p className="text-sm font-bold uppercase tracking-wide text-mint">OAuth Diagnostics</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Test Koneksi Platform</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Cek env, redirect URI, endpoint Login Kit, dan error terakhir tanpa menampilkan client secret atau token.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                <p className="mt-2 break-words text-sm font-black text-ink">{value}</p>
              </div>
            ))}
          </div>

          {validation.errors.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-black text-orange-900">Friendly error</p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-orange-900/80">
                {validation.errors.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-5">
            <OAuthTestPanel
              redirectUri={env.TIKTOK_REDIRECT_URI}
              clientKey={env.TIKTOK_CLIENT_KEY ?? ""}
              pkceEnabled={validation.pkceEnabled}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Authorize URL</p>
              <p className="mt-2 break-all text-sm text-muted">Official platform authorize endpoint configured.</p>
            </div>
            <div className="rounded-2xl border border-line p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Token URL</p>
              <p className="mt-2 break-all text-sm text-muted">Official platform token endpoint configured.</p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

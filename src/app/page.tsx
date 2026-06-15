import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { AffiliateWorkflow } from "@/modules/affiliate/affiliate-workflow";
import { SettingsPanel } from "@/components/settings-panel";
import { env } from "@/lib/env";
import { getPromptEngineMode } from "@/modules/prompt-engine/fallback";
import { TIKTOK_CONNECTED_COOKIE, TIKTOK_OAUTH_ERROR_COOKIE } from "@/modules/tiktok/oauth";
import { TikTokConnectionPanel } from "@/modules/tiktok/tiktok-connection-panel";

export default function Home() {
  const cookieStore = cookies();
  const tiktokConnected = cookieStore.get(TIKTOK_CONNECTED_COOKIE)?.value === "true";
  const lastOAuthError = cookieStore.get(TIKTOK_OAUTH_ERROR_COOKIE)?.value;
  const promptEngineMode = getPromptEngineMode(Boolean(env.GEMINI_API_KEY), Boolean(env.OPENAI_API_KEY));

  return (
    <AppShell>
      <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <AffiliateWorkflow tiktokConnected={tiktokConnected} promptEngineMode={promptEngineMode} />
          <TikTokConnectionPanel
            clientKeyConfigured={Boolean(env.TIKTOK_CLIENT_KEY)}
            redirectUriConfigured={Boolean(env.TIKTOK_REDIRECT_URI)}
            loginConnected={tiktokConnected}
            lastOAuthError={lastOAuthError}
          />
          <SettingsPanel />
        </div>
      </section>
    </AppShell>
  );
}

import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { AffiliateWorkflow } from "@/modules/affiliate/affiliate-workflow";
import { SettingsPanel } from "@/components/settings-panel";
import { TIKTOK_CONNECTED_COOKIE } from "@/modules/tiktok/oauth";
import { TikTokConnectionPanel } from "@/modules/tiktok/tiktok-connection-panel";

export default function Home() {
  const tiktokConnected = cookies().get(TIKTOK_CONNECTED_COOKIE)?.value === "true";

  return (
    <AppShell>
      <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <AffiliateWorkflow tiktokConnected={tiktokConnected} />
          <TikTokConnectionPanel />
          <SettingsPanel />
        </div>
      </section>
    </AppShell>
  );
}

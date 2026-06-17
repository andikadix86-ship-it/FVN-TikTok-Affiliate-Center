import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { env } from "@/lib/env";
import { getTikTokAccountView } from "@/modules/tiktok/account-service";
import { getTikTokEnvStatus } from "@/modules/tiktok/env-status";
import { TIKTOK_CONNECTED_COOKIE } from "@/modules/tiktok/oauth";
import { TikTokConnectionCenter } from "@/modules/tiktok/tiktok-connection-center";

export const dynamic = "force-dynamic";

export default async function AccountsPage({ searchParams }: { searchParams?: { connect?: string } }) {
  const cookieStore = cookies();
  const account = await getTikTokAccountView();
  const envStatus = getTikTokEnvStatus({
    clientKey: env.TIKTOK_CLIENT_KEY,
    clientSecret: env.TIKTOK_CLIENT_SECRET,
    redirectUri: env.TIKTOK_REDIRECT_URI,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: process.env.NODE_ENV
  });
  const loginConnected = cookieStore.get(TIKTOK_CONNECTED_COOKIE)?.value === "true" || account.connected;

  return (
    <AppShell>
      <div className="space-y-5">
        <TikTokConnectionCenter
          account={account}
          apiConfigured={envStatus.oauth === "Configured"}
          loginConnected={loginConnected}
          startFlow={searchParams?.connect === "tiktok"}
        />
      </div>
    </AppShell>
  );
}

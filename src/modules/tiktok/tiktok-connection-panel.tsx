import { Link2 } from "lucide-react";
import { SectionCard } from "@/components/section-card";

export function TikTokConnectionPanel() {
  return (
    <SectionCard
      id="tiktok-accounts"
      title="TikTok Accounts"
      description="OAuth/Login Kit is wired as a placeholder route for real TikTok app credentials."
      icon={Link2}
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-ink">Connection status</p>
          <p className="mt-1 text-sm text-muted">Not connected. Add TikTok keys in `.env` and use the login route.</p>
        </div>
        <a href="/api/auth/tiktok/login" className="rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-white">
          Start TikTok Login
        </a>
      </div>
    </SectionCard>
  );
}

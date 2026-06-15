import { Settings } from "lucide-react";
import { SectionCard } from "@/components/section-card";

const settings = [
  { label: "Database", value: "Supabase/PostgreSQL via Prisma" },
  { label: "AI Providers", value: "Gemini and OpenAI slots" },
  { label: "TikTok", value: "Login Kit OAuth placeholders" }
];

export function SettingsPanel() {
  return (
    <SectionCard
      id="settings"
      title="Settings"
      description="Configure environment variables before enabling live integrations."
      icon={Settings}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {settings.map((item) => (
          <div key={item.label} className="rounded-2xl border border-line p-4">
            <p className="text-sm font-bold text-ink">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.value}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

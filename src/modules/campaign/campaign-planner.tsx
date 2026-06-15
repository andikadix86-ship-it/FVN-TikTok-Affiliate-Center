import { CalendarDays } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { starterCampaigns } from "./campaign-data";

export function CampaignPlanner() {
  return (
    <SectionCard
      id="campaigns"
      title="Campaign Planner"
      description="Plan the next three TikTok posts around one product and one simple promise."
      icon={CalendarDays}
    >
      <div className="grid gap-3 md:grid-cols-3">
        {starterCampaigns.map((campaign) => (
          <article key={campaign.id} className="rounded-2xl border border-line p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-coral">{campaign.day}</p>
            <h3 className="mt-2 text-base font-bold text-ink">{campaign.product}</h3>
            <p className="mt-1 text-sm font-semibold text-muted">{campaign.contentType}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{campaign.task}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

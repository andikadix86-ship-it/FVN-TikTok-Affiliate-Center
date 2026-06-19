import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { PostedContentList } from "@/modules/posted-content/posted-content-list";
import type { CampaignOption, PostedContentItem } from "@/modules/posted-content/posted-content-list";

export const dynamic = "force-dynamic";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

async function getPostedContent(): Promise<{ items: PostedContentItem[]; campaigns: CampaignOption[] }> {
  try {
    const [postedContent, campaigns] = await Promise.all([
      prisma.postedContent.findMany({
        orderBy: { postedAt: "desc" },
        include: {
          product: true,
          contentPack: true,
          campaign: true
        }
      }),
      prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true }
      })
    ]);

    return {
      campaigns,
      items: postedContent.map((item) => ({
        id: item.id,
        productName: item.product.productName,
        hook: item.contentPack.selectedHook || asStringArray(item.contentPack.hooks)[0] || item.contentPack.caption,
        tiktokVideoUrl: item.tiktokVideoUrl,
        postedAt: item.postedAt.toISOString(),
        accountUsed: item.accountUsed ?? "",
        campaignId: item.campaignId ?? "",
        campaignName: item.campaign?.name ?? "",
        notes: item.notes ?? "",
        archived: item.archived,
        views: item.views,
        likes: item.likes,
        comments: item.comments,
        shares: item.shares,
        saves: item.saves,
        clicks: item.clicks,
        orders: item.orders,
        revenue: Number(item.revenue)
      }))
    };
  } catch {
    return { items: [], campaigns: [] };
  }
}

export default async function PostedContentPage() {
  const { items, campaigns } = await getPostedContent();

  return (
    <AppShell>
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 rounded-[2rem] border border-line bg-white p-5 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-wide text-mint">Manual Publishing</p>
            <h1 className="mt-2 text-3xl font-black text-ink">Konten Terposting</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Track video yang sudah kamu upload manual ke platform. Tidak ada auto-posting di MVP ini.</p>
          </div>
          <PostedContentList initialItems={items} campaigns={campaigns} />
        </div>
      </section>
    </AppShell>
  );
}

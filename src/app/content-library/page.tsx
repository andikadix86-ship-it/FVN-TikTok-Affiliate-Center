import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { ContentDraftList } from "@/modules/content-library/content-draft-list";
import { mapDbContentDraft } from "@/modules/database/content-service";

export const dynamic = "force-dynamic";

async function getDrafts() {
  try {
    const drafts = await prisma.contentPack.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true }
    });

    return drafts.map(mapDbContentDraft);
  } catch {
    return [];
  }
}

export default async function ContentLibraryPage() {
  const drafts = await getDrafts();

  return (
    <AppShell>
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 rounded-[2rem] border border-line bg-white p-5 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-wide text-mint">Content Library</p>
            <h1 className="mt-2 text-3xl font-black text-ink">Draft Konten</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Simpan, cari, edit, dan pakai ulang semua draft konten TikTok affiliate dari Content Factory.</p>
          </div>
          <ContentDraftList initialDrafts={drafts} />
        </div>
      </section>
    </AppShell>
  );
}

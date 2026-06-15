import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";
import { ContentDraftDetail } from "@/modules/content-library/content-draft-detail";
import { mapDbContentDraft } from "@/modules/database/content-service";

export const dynamic = "force-dynamic";

async function getDraft(id: string) {
  try {
    const draft = await prisma.contentPack.findUnique({
      where: { id },
      include: { product: true }
    });

    return draft ? mapDbContentDraft(draft) : null;
  } catch {
    return null;
  }
}

export default async function ContentDraftDetailPage({ params }: { params: { id: string } }) {
  const draft = await getDraft(params.id);

  if (!draft) {
    notFound();
  }

  return (
    <AppShell>
      <section className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <a href="/content-library" className="mb-4 inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
            Kembali ke Draft Konten
          </a>
          <ContentDraftDetail draft={draft} />
        </div>
      </section>
    </AppShell>
  );
}

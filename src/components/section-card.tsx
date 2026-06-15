import { LucideIcon } from "lucide-react";

export function SectionCard({
  id,
  title,
  description,
  icon: Icon,
  children
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-ink">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

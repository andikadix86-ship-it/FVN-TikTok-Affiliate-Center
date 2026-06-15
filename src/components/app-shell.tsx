import { BarChart3, CalendarDays, ClipboardList, Gauge, Link2, ListChecks, PackageCheck, PackageSearch, Settings, Sparkles } from "lucide-react";

const navItems = [
  { href: "/#dashboard", label: "Dashboard", icon: Gauge },
  { href: "/action-plan", label: "Rencana Hari Ini", icon: ListChecks },
  { href: "/#product-hunter", label: "Produk Affiliate", icon: PackageSearch },
  { href: "/#content-factory", label: "Buat Konten", icon: Sparkles },
  { href: "/content-library", label: "Draft Konten", icon: ClipboardList },
  { href: "/#campaign-planner", label: "Rencana Posting", icon: CalendarDays },
  { href: "/posted-content", label: "Konten Terposting", icon: PackageCheck },
  { href: "/analytics", label: "Analisa Affiliate", icon: BarChart3 },
  { href: "/#tiktok-accounts", label: "Akun TikTok", icon: Link2 },
  { href: "/#settings", label: "Pengaturan", icon: Settings }
];

const mobileNavItems = [
  { href: "/#dashboard", label: "Dashboard", icon: Gauge },
  { href: "/action-plan", label: "Action", icon: ListChecks },
  { href: "/#product-hunter", label: "Produk", icon: PackageSearch },
  { href: "/posted-content", label: "Posting", icon: PackageCheck },
  { href: "/analytics", label: "Analisa", icon: BarChart3 }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold text-ink">FVN Affiliate</p>
            <p className="text-xs text-muted">Pusat kerja affiliate TikTok</p>
          </div>
          <nav className="hidden flex-1 justify-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-xs font-bold text-muted hover:bg-slate-100 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="/api/auth/tiktok/login"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Hubungkan TikTok
          </a>
        </div>
      </header>
      {children}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-white/95 px-2 py-2 backdrop-blur sm:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold text-muted hover:bg-slate-100 hover:text-ink"
                title={item.label}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
      <div className="h-20 sm:hidden" />
    </main>
  );
}

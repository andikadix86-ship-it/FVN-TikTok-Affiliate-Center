import { BarChart3, CalendarDays, Link2, PackageSearch, Settings, Sparkles } from "lucide-react";

const navItems = [
  { href: "#product-hunter", label: "Products", icon: PackageSearch },
  { href: "#scoring", label: "Score", icon: BarChart3 },
  { href: "#content-factory", label: "Prompts", icon: Sparkles },
  { href: "#tiktok", label: "TikTok", icon: Link2 },
  { href: "#campaigns", label: "Plan", icon: CalendarDays },
  { href: "#settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold text-ink">FVN Affiliate</p>
            <p className="text-xs text-muted">TikTok MVP</p>
          </div>
          <a
            href="/api/auth/tiktok/login"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Connect TikTok
          </a>
        </div>
      </header>
      {children}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-white/95 px-2 py-2 backdrop-blur sm:hidden">
        <div className="grid grid-cols-6 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold text-muted hover:bg-slate-100 hover:text-ink"
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

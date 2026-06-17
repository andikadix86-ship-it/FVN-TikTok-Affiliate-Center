import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Crown,
  DollarSign,
  GraduationCap,
  Gauge,
  Layers3,
  Library,
  PackageSearch,
  Search,
  Settings,
  Sparkles,
  UserCircle,
  Video
} from "lucide-react";

const navItems = [
  { href: "/#dashboard", label: "Dashboard", icon: Gauge },
  { href: "/#product-hunter", label: "Product Intelligence", icon: PackageSearch },
  { href: "/#content-factory", label: "Content Factory", icon: Sparkles },
  { href: "/#content-factory", label: "Story Engine", icon: Layers3 },
  { href: "/#content-factory", label: "Multi Video Engine", icon: Video },
  { href: "/#campaign-planner", label: "Scheduler", icon: CalendarDays },
  { href: "/content-library", label: "Content Library", icon: Library },
  { href: "/#ai-agents", label: "AI Agents", icon: Bot },
  { href: "/#profit-center", label: "Profit Center", icon: DollarSign },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/#tutorial-panduan", label: "Tutorial & Panduan", icon: GraduationCap },
  { href: "/#settings", label: "Pengaturan", icon: Settings }
];

const mobileNavItems = [
  { href: "/#dashboard", label: "Dashboard", icon: Gauge },
  { href: "/#product-hunter", label: "Produk", icon: PackageSearch },
  { href: "/#content-factory", label: "Konten", icon: Sparkles },
  { href: "/#campaign-planner", label: "Jadwal", icon: CalendarDays },
  { href: "/analytics", label: "Profit", icon: BarChart3 }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f4ff]">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 border-r border-violet-100 bg-white/95 px-4 py-5 shadow-soft backdrop-blur lg:block">
        <a href="/#dashboard" className="flex items-center gap-3 rounded-[1.5rem] bg-gradient-to-br from-violet-700 to-fuchsia-600 p-4 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-xl font-black">F</div>
          <div>
            <p className="text-sm font-black">FVN Affiliate</p>
            <p className="text-xs text-white/75">TikTok Center</p>
          </div>
        </a>

        <nav className="mt-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-violet-600 group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-violet-100 bg-[#f7f4ff]/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1500px] items-center gap-3">
            <a href="/#dashboard" className="flex items-center gap-2 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-700 text-sm font-black text-white">F</span>
              <span className="text-sm font-black text-ink">FVN</span>
            </a>
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Cari produk, konten, template..."
                className="min-h-12 w-full rounded-full border border-violet-100 bg-white pl-11 pr-4 text-sm font-semibold text-ink outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <a href="/onboarding" className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 py-2.5 text-sm font-black text-white shadow-soft sm:inline-flex">
              <Crown className="h-4 w-4" />
              Upgrade
            </a>
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-100 bg-white text-slate-600">
              <Bell className="h-5 w-5" />
            </button>
            <button className="hidden items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-2 text-sm font-black text-ink sm:flex">
              <UserCircle className="h-6 w-6 text-violet-700" />
              Andika
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          {children}
        </div>

        <footer className="border-t border-violet-100 bg-white px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>FVN TikTok Affiliate Center</p>
            <div className="flex gap-4">
              <a href="/terms" className="font-semibold hover:text-ink">Terms of Service</a>
              <a href="/privacy" className="font-semibold hover:text-ink">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-violet-100 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                title={item.label}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
      <div className="h-20 lg:hidden" />
    </main>
  );
}

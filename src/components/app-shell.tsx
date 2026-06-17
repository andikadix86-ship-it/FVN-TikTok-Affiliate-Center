"use client";

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
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/produk-affiliate", label: "Product Intelligence", icon: PackageSearch },
  { href: "/buat-konten", label: "Content Factory", icon: Sparkles },
  { href: "/story-engine", label: "Story Engine", icon: Layers3 },
  { href: "/multi-video-engine", label: "Multi Video Engine", icon: Video },
  { href: "/content-library", label: "Content Library", icon: Library },
  { href: "/rencana-posting", label: "Scheduler", icon: CalendarDays },
  { href: "/ai-agents", label: "AI Agents", icon: Bot },
  { href: "/profit-center", label: "Profit Center", icon: DollarSign },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/tutorial-panduan", label: "Tutorial & Panduan", icon: GraduationCap },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings }
];

const mobileNavItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/produk-affiliate", label: "Produk", icon: PackageSearch },
  { href: "/content-library", label: "Library", icon: Library },
  { href: "/rencana-posting", label: "Jadwal", icon: CalendarDays },
  { href: "/analytics", label: "Analisa", icon: BarChart3 }
];

const workflowSteps = [
  { href: "/produk-affiliate", label: "Product Intelligence" },
  { href: "/buat-konten", label: "Content Factory" },
  { href: "/story-engine", label: "Story Engine" },
  { href: "/multi-video-engine", label: "Multi Video Engine" },
  { href: "/content-library", label: "Content Library" },
  { href: "/rencana-posting", label: "Scheduler" },
  { href: "/profit-center", label: "Profit Center" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  return (
    <main className="min-h-screen bg-[#f7f4ff]">
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 border-r border-violet-100 bg-white/95 px-4 py-5 shadow-soft backdrop-blur lg:block">
        <a href="/" className="flex items-center gap-3 rounded-[1.5rem] bg-gradient-to-br from-violet-700 to-fuchsia-600 p-4 text-white">
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
                className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition ${
                  isActivePath(pathname, item.href)
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  isActivePath(pathname, item.href)
                    ? "bg-violet-600 text-white"
                    : "bg-slate-50 text-slate-500 group-hover:bg-violet-600 group-hover:text-white"
                }`}>
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
            <a href="/" className="flex items-center gap-2 lg:hidden">
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
            <a href="/ai-agents" className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-100 bg-white text-slate-600" title="Lihat rekomendasi AI">
              <Bell className="h-5 w-5" />
            </a>
            <a href="/pengaturan" className="hidden items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-2 text-sm font-black text-ink sm:flex" title="Buka profil dan pengaturan">
              <UserCircle className="h-6 w-6 text-violet-700" />
              Andika
            </a>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <WorkflowBreadcrumb pathname={pathname} />
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
                className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold ${
                  isActivePath(pathname, item.href)
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                }`}
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

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function WorkflowBreadcrumb({ pathname }: { pathname: string }) {
  const activeIndex = workflowSteps.findIndex((step) => isActivePath(pathname, step.href));

  return (
    <nav className="mb-5 overflow-x-auto rounded-[1.5rem] border border-violet-100 bg-white p-3 shadow-soft" aria-label="Workflow affiliate">
      <div className="flex min-w-max items-center gap-2">
        {workflowSteps.map((step, index) => {
          const status = activeIndex === index ? "active" : activeIndex > index ? "done" : "disabled";

          return (
            <div key={step.href} className="flex items-center gap-2">
              <a
                href={step.href}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${
                  status === "active"
                    ? "bg-violet-600 text-white"
                    : status === "done"
                      ? "bg-teal-50 text-teal-800"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                <span>{step.label}</span>
                {status === "done" ? <span>✓</span> : null}
                {status === "active" ? <span>●</span> : null}
              </a>
              {index < workflowSteps.length - 1 ? <span className="text-xs font-black text-slate-300">→</span> : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

import { BarChart3, Globe2, PackageSearch, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
};

const benefits = [
  { icon: PackageSearch, title: "Product intelligence", text: "Riset produk, skor peluang, dan rekomendasi konten dalam satu workspace." },
  { icon: BarChart3, title: "Affiliate workflow", text: "Kelola draft, campaign, posting manual, dan performa creator commerce." },
  { icon: Globe2, title: "Global growth ready", text: "Dibuat untuk creator yang ingin scale dengan proses yang rapi." }
];

export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ff] px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-8 flex items-center gap-3">
              <FvnLogo size="md" />
              <div>
                <p className="text-sm font-black text-ink">FVN Affiliate Center</p>
                <p className="mt-1 text-xs font-bold text-violet-700">Smart Commerce, Global Growth</p>
              </div>
            </div>
            <h1 className="text-5xl font-black leading-tight text-ink">FVN Affiliate Center</h1>
            <p className="mt-5 max-w-lg text-base font-semibold leading-7 text-muted">
              Command center untuk product hunting, content workflow, creator platform connection, dan affiliate growth planning.
            </p>
            <div className="mt-9 space-y-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.title} className="flex gap-4 rounded-[1.5rem] border border-violet-100 bg-white/85 p-4 shadow-soft">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-700 to-fuchsia-600 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-ink">{benefit.title}</p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-muted">{benefit.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/privacy" className="mt-7 inline-flex items-center text-sm font-black text-violet-700 transition hover:text-fuchsia-700">
              Privacy and compliance
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center lg:hidden">
            <FvnLogo size="lg" />
            <p className="mt-4 text-sm font-black text-violet-700">Smart Commerce, Global Growth</p>
          </div>

          <div className="rounded-[2rem] border border-violet-100 bg-white/95 p-5 shadow-soft sm:p-7">
            <div className="mb-6 text-center sm:text-left">
              <div className="mx-auto mb-4 hidden w-fit lg:block">
                <FvnLogo size="sm" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure access
              </div>
              <h2 className="mt-4 text-2xl font-black text-ink">{title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">{subtitle}</p>
            </div>
            {children}
            {footer ? <div className="mt-6 text-center text-sm font-semibold text-muted">{footer}</div> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function FvnLogo({ size }: { size: "sm" | "md" | "lg" }) {
  const dimensions = size === "lg" ? "h-20 w-20 rounded-[1.75rem] text-2xl" : size === "md" ? "h-12 w-12 rounded-2xl text-lg" : "h-10 w-10 rounded-2xl text-base";

  return (
    <div className={`grid shrink-0 place-items-center bg-gradient-to-br from-violet-700 to-fuchsia-600 font-black text-white shadow-soft ${dimensions}`}>
      F
    </div>
  );
}

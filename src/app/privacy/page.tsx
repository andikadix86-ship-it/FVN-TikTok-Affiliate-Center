import { AppShell } from "@/components/app-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - FVN Affiliate Center",
  description: "Privacy Policy for FVN Affiliate Center."
};

export default function PrivacyPage() {
  return (
    <AppShell>
      <section className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-mint">Legal</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted">Last updated: June 15, 2026</p>

          <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
            <section>
              <h2 className="text-lg font-black text-ink">1. App Name</h2>
              <p>This Privacy Policy applies to FVN Affiliate Center.</p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">2. What The App Does</h2>
              <p>
                FVN Affiliate Center helps users manage affiliate products, content drafts, manual posting workflow, campaign planning, and manual analytics.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">3. Information Users Provide</h2>
              <p>
                Users may enter product data, CSV product data, content drafts, campaign plans, TikTok video URLs, notes, and manual performance numbers such as views, clicks, orders, and revenue.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">4. TikTok Login</h2>
              <p>
                TikTok Login is used only to connect a TikTok account when the user authorizes it. The app may receive basic account information from TikTok according to the approved Login Kit scope.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">5. No Auto-Posting</h2>
              <p>
                This MVP does not auto-post to TikTok. Users upload videos manually. The app only stores posted video links and manual performance data when users enter them.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">6. Product Data Source</h2>
              <p>
                Product data is manual, CSV import, or demo data unless an official TikTok Shop API integration is connected later. The app does not claim demo, manual, or CSV data is official TikTok Shop data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">7. Data Use</h2>
              <p>
                Data is used to show product lists, product scores, content drafts, posting checklists, campaign plans, manual analytics, and daily action recommendations inside the app.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">8. Contact</h2>
              <p>For privacy questions, contact: andikadix86@gmail.com</p>
            </section>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

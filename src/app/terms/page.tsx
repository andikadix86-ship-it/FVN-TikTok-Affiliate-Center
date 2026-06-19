import { AppShell } from "@/components/app-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - FVN Affiliate Center",
  description: "Terms of Service for FVN Affiliate Center."
};

export default function TermsPage() {
  return (
    <AppShell>
      <section className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-mint">Legal</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted">Last updated: June 15, 2026</p>

          <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
            <section>
              <h2 className="text-lg font-black text-ink">1. App Name</h2>
              <p>These Terms of Service apply to FVN Affiliate Center.</p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">2. Purpose</h2>
              <p>
                FVN Affiliate Center helps users manage affiliate products, content drafts, manual posting workflow, campaign planning, and manual analytics.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">3. Platform Login</h2>
              <p>
                Platform login is used only to connect a creator account when the user authorizes it. The app uses an authorized platform integration for account connection and OAuth diagnostics.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">4. Manual Publishing</h2>
              <p>
                This MVP does not auto-post to a creator platform. Users upload videos manually and may save the posted video URL in the app for tracking.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">5. Product Data</h2>
              <p>
                Product data is manual, CSV import, or demo data unless an official commerce API integration is connected later. Demo, manual, and CSV data should not be treated as official marketplace data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">6. User Responsibility</h2>
              <p>
                Users are responsible for checking product information, complying with platform policies, using safe claims, and manually entering accurate performance data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">7. No Guaranteed Results</h2>
              <p>
                The app provides planning, scoring, content drafts, and analytics helpers. It does not guarantee sales, views, clicks, orders, income, or viral results.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">8. Contact</h2>
              <p>For questions about these terms, contact: andikadix86@gmail.com</p>
            </section>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

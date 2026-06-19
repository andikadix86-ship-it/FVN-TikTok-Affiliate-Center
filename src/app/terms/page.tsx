import { AppShell } from "@/components/app-shell";
import type { Metadata } from "next";

const verificationSignature = "tiktok-developers-site-verification=ixyOV4GEWntG4Bd1rkRKkJqjQYqa5j0a";

export const metadata: Metadata = {
  title: "Terms of Service - FVN Affiliate Center",
  description: "Terms of Service for FVN Affiliate Center.",
  other: {
    "tiktok-developers-site-verification": "ixyOV4GEWntG4Bd1rkRKkJqjQYqa5j0a"
  }
};

export default function TermsPage() {
  return (
    <AppShell>
      <section className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-mint">Legal</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Terms of Service</h1>
          <p className="mt-2 text-sm text-muted">Last updated: June 19, 2026</p>

          <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
            <section>
              <h2 className="text-lg font-black text-ink">1. App Name</h2>
              <p>
                These Terms of Service apply to FVN Affiliate Center, an independent creator commerce dashboard for affiliate workflow management.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">2. Purpose of the Service</h2>
              <p>
                FVN Affiliate Center helps users manage affiliate product research, content planning, campaign workflow, creative drafts, scheduling preparation, and performance tracking.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">3. Account Connection</h2>
              <p>
                Users may connect their authorized creator platform account using secure OAuth/Login when available. Account connection is used only to help users identify and manage their own connected account inside the dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">4. User Permission</h2>
              <p>
                FVN Affiliate Center uses requested permissions only for account connection, content workflow management, account status display, and publishing-related features when the user gives permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">5. Content and Publishing Workflow</h2>
              <p>
                The app may help users prepare captions, hooks, scripts, hashtags, video concepts, campaign notes, and publishing schedules. Users remain responsible for reviewing, editing, approving, and publishing their own content.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">6. Product and Campaign Data</h2>
              <p>
                Product, campaign, and performance data may come from manual input, CSV import, demo data, or authorized integrations. Demo, manual, and imported data should not be treated as official marketplace or platform data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">7. User Responsibility</h2>
              <p>
                Users are responsible for checking product information, following applicable platform policies, avoiding misleading claims, protecting account credentials, and ensuring that all published content complies with relevant rules and laws.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">8. No Guaranteed Results</h2>
              <p>
                FVN Affiliate Center provides workflow tools, planning support, scoring helpers, and content preparation features. The app does not guarantee sales, views, clicks, orders, income, ranking, approval, or viral results.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">9. Independent Service</h2>
              <p>
                FVN Affiliate Center is not an official product of any social media, marketplace, or creator platform. It is an independent dashboard that helps users manage their own affiliate workflow using authorized integrations and user-approved permissions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-ink">10. Contact</h2>
              <p>For questions about these terms, contact: andikadix86@gmail.com</p>
            </section>
          </div>

          <p className="sr-only">{verificationSignature}</p>
        </div>
      </section>
    </AppShell>
  );
}
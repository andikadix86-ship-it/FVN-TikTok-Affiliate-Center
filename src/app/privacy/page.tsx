import { AppShell } from "@/components/app-shell";
import type { Metadata } from "next";

const verificationSignature = "tiktok-developers-site-verification=RhJvpdcZLBzSaubkAs4H5daLTNdtZQRu";

export const metadata: Metadata = {
title: "Privacy Policy - FVN Affiliate Center",
description: "Privacy Policy for FVN Affiliate Center.",
other: {
"tiktok-developers-site-verification": "RhJvpdcZLBzSaubkAs4H5daLTNdtZQRu"
}
};

export default function PrivacyPage() {
return ( <AppShell> <section className="px-4 pb-10 pt-6 sm:px-6 lg:px-8"> <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-8"> <p className="text-sm font-bold uppercase tracking-wide text-mint">Legal</p> <h1 className="mt-2 text-3xl font-black text-ink">Privacy Policy</h1> <p className="mt-2 text-sm text-muted">Last updated: June 19, 2026</p>

```
      <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-lg font-black text-ink">1. App Name</h2>
          <p>
            This Privacy Policy applies to FVN Affiliate Center, an independent creator commerce dashboard for affiliate workflow management.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">2. What The App Does</h2>
          <p>
            FVN Affiliate Center helps users manage affiliate product research, content planning, campaign workflow, creative drafts, scheduling preparation, and performance tracking.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">3. Information Users Provide</h2>
          <p>
            Users may enter product data, CSV product data, content drafts, campaign plans, posted content URLs, notes, and manual performance numbers such as views, clicks, orders, and revenue.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">4. Account Connection</h2>
          <p>
            Users may connect their authorized creator platform account using secure OAuth/Login when available. The app may receive basic account information according to the approved login scope and user permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">5. Data From Connected Accounts</h2>
          <p>
            Connected account data is used only to support account identification, account status display, content workflow management, and publishing-related features when the user gives permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">6. Publishing Workflow</h2>
          <p>
            The app may help users prepare content drafts, captions, campaign notes, and publishing schedules. Users remain responsible for reviewing, approving, and publishing their own content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">7. Product Data Source</h2>
          <p>
            Product data may come from manual input, CSV import, demo data, or authorized commerce integrations. The app does not claim demo, manual, or imported data is official marketplace or platform data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">8. Data Use</h2>
          <p>
            Data is used to show product lists, product scores, content drafts, posting checklists, campaign plans, manual analytics, daily action recommendations, and connected account status inside the app.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">9. Data Sharing</h2>
          <p>
            FVN Affiliate Center does not sell user data to advertisers. Data is used only to provide the service, support authorized integrations, maintain security, and comply with applicable legal requirements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">10. User Control</h2>
          <p>
            Users may disconnect their connected account, stop using the app, or contact us to request assistance related to their account data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">11. Independent Service</h2>
          <p>
            FVN Affiliate Center is not an official product of any social media, marketplace, or creator platform. It is an independent dashboard that helps users manage their own affiliate workflow using authorized integrations and user-approved permissions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-ink">12. Contact</h2>
          <p>For privacy questions, contact: andikadix86@gmail.com</p>
        </section>
      </div>

      <p className="sr-only">{verificationSignature}</p>
    </div>
  </section>
</AppShell>
```

);
}

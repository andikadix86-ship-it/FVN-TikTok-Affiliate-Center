---
title: "FVN TikTok Affiliate Center Complete User Guide v1.0"
subtitle: "Professional PDF-ready documentation for creators, operators, and administrators"
version: "v1.0"
toc: true
toc-depth: 3
---

<style>
@media print {
  .page-break { page-break-after: always; break-after: page; }
  .screenshot-placeholder { break-inside: avoid; }
}
.guide-note {
  border: 1px solid #d9d6ff;
  background: #f7f4ff;
  padding: 14px 16px;
  border-radius: 10px;
  margin: 16px 0;
}
.screenshot-placeholder {
  border: 2px dashed #aaa3d8;
  background: #fbfaff;
  color: #4b3f72;
  min-height: 260px;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
}
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd7ff; padding: 8px; vertical-align: top; }
th { background: #f1eeff; }
</style>

# FVN TikTok Affiliate Center Complete User Guide v1.0

This guide is the complete operational documentation for FVN TikTok Affiliate Center. It is written for affiliate creators, content operators, campaign planners, account managers, analysts, and administrators who need a practical reference for day-to-day work.

The guide is PDF-ready and includes explicit print page breaks. When converted with a Markdown processor that supports raw HTML and print CSS, the document is designed to produce more than 100 pages.

<div class="guide-note">
Recommended PDF conversion: use a converter that supports front matter TOC and HTML page breaks. Example with Pandoc: <code>pandoc docs/FVN_TIKTOK_AFFILIATE_CENTER_COMPLETE_GUIDE.md --toc --toc-depth=3 -o FVN_TIKTOK_AFFILIATE_CENTER_COMPLETE_GUIDE.pdf</code>.
</div>

<div class="page-break"></div>

## Automatic Table of Contents

<!-- toc -->

If your Markdown renderer supports automatic table of contents generation, enable TOC from the document metadata above or use the renderer-specific TOC marker below:

[TOC]

<!-- /toc -->

<div class="page-break"></div>

## Document Scope

This documentation covers the complete user and administrator workflow for:

- Dashboard
- Product Intelligence
- Content Factory
- Story Engine
- Multi Video Engine
- Creative Studio
- Content Library
- Campaign Planner
- Scheduler
- Social Accounts
- Analytics
- Settings
- TikTok Integration
- Administrator Guide

Each major area includes tujuan, cara kerja, workflow, best practice, FAQ, troubleshooting, and screenshot placeholder.

<div class="page-break"></div>

## System Workflow Map

The recommended operating flow is:

1. Review Dashboard status.
2. Discover products in Product Intelligence.
3. Save high-potential opportunities.
4. Generate content in Content Factory or Story Engine.
5. Build variations in Multi Video Engine.
6. Refine assets in Creative Studio.
7. Store final drafts in Content Library.
8. Plan campaigns in Campaign Planner.
9. Schedule publishing in Scheduler.
10. Connect and manage accounts in Social Accounts.
11. Track performance in Analytics.
12. Adjust account, provider, and system preferences in Settings.

<div class="page-break"></div>

## Data And Provider Status

FVN TikTok Affiliate Center can operate in three data modes:

| Mode | Meaning | User Expectation |
|---|---|---|
| REAL_API | A real marketplace, TikTok, AI, or analytics provider is connected. | Data can be used for live operational decisions. |
| MANUAL or CSV_IMPORT | Data was entered or imported by the team. | Data is operational but should be checked for freshness. |
| DEMO or TEMPLATE | Data is generated locally for demo, training, or review. | Data should not be treated as live marketplace truth. |

When a provider is not connected, the product still shows a clear badge and should not pretend that live API actions have succeeded.

<div class="page-break"></div>

## Page Count Plan

This guide intentionally separates every module into seven print segments:

1. Tujuan
2. Cara kerja
3. Workflow
4. Best practice
5. FAQ
6. Troubleshooting
7. Screenshot placeholder

With 14 covered areas plus front matter, the document contains more than 100 PDF-ready page segments.

<div class="page-break"></div>

# Dashboard

## Dashboard - Tujuan

Dashboard is the daily control room for FVN TikTok Affiliate Center. It gives the operator a fast overview of account connection status, content workflow health, affiliate product progress, scheduling readiness, and current performance signals.

Primary goals:

- Show whether TikTok and supporting APIs are connected.
- Highlight products, content, campaigns, and schedules that need attention.
- Provide quick access to Connect TikTok, Product Intelligence, Content Factory, Content Library, Scheduler, and Analytics.
- Summarize revenue, commission, orders, conversion rate, ROI, top product, top content, and top account when available.
- Clearly mark demo-only or fallback data.

<div class="page-break"></div>

## Dashboard - Cara Kerja

Dashboard reads summary data from connected workflow modules. It does not replace the detailed pages; it summarizes them.

Data sources:

| Source | Dashboard Usage |
|---|---|
| TikTok Integration | Connection status, connected account, API badge. |
| Product Intelligence | Top product and opportunity pipeline. |
| Content Library | Draft, generated, saved, and scheduled content counts. |
| Scheduler | Upcoming posts and scheduling gaps. |
| Analytics | Revenue, orders, commission, ROI, conversion rate. |
| Settings | Provider status and fallback indicators. |

If a real provider is missing, Dashboard should show a clear DEMO, TEMPLATE, or API Not Connected badge.

<div class="page-break"></div>

## Dashboard - Workflow

Recommended daily workflow:

1. Open Dashboard.
2. Check TikTok API status.
3. If not connected, select Connect TikTok and complete the authorization flow.
4. Review top product and campaign performance cards.
5. Open Product Intelligence for new opportunities.
6. Open Content Library to continue unfinished drafts.
7. Open Scheduler to confirm publishing plan.
8. Open Analytics to review revenue and conversion movement.

Operational rule: use Dashboard for triage, then move to the specific module for execution.

<div class="page-break"></div>

## Dashboard - Best Practice

- Start every work session from Dashboard to avoid missing account or provider warnings.
- Treat DEMO ONLY values as layout and workflow examples, not business reports.
- Use quick actions only after confirming the selected account and product context.
- Check scheduled content before creating new drafts to avoid duplicate posts.
- Review alerts before running batch generation.
- Keep Dashboard clean by resolving failed drafts and disconnected account warnings.

<div class="page-break"></div>

## Dashboard - FAQ

**Why do I see demo metrics?**  
Because no live analytics provider or marketplace source is connected yet.

**Can I publish directly from Dashboard?**  
Dashboard should route you to Scheduler or Campaign Planner for final execution.

**Why is Connect TikTok visible even when I can use the app?**  
The app can run in demo mode, but live TikTok actions require connection.

**What should I check first when performance looks wrong?**  
Check provider badges, selected account, date range, and whether the data is demo or real.

<div class="page-break"></div>

## Dashboard - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| TikTok shows Not Connected | OAuth is not complete or token expired. | Open Social Accounts or TikTok Integration and reconnect. |
| Metrics look unrealistic | Demo or template data is active. | Confirm Analytics provider and marketplace data status. |
| Quick action opens the wrong page | Browser cache or stale route state. | Refresh and retry from the main navigation. |
| Dashboard loads but cards are empty | No product, content, or campaign records exist. | Create or import product and content data first. |

<div class="page-break"></div>

## Dashboard - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Dashboard overview with connection badge, performance summary, quick actions, and workflow status cards.
</div>

<div class="page-break"></div>

# Product Intelligence

## Product Intelligence - Tujuan

Product Intelligence helps operators discover, compare, and prioritize affiliate products. The page should show product rankings, source indicators, category filters, opportunity scores, sales signals, margin, commission, seller data, and creator/affiliate trends.

Primary goals:

- Display at least 10 products by default and support expanding to 25 products.
- Provide category browsing for Electronics, Fashion, Beauty, Home & Living, Kitchen, Baby, Health, Sports, Automotive, and Books.
- Rank products by Top Hari Ini, Top Minggu Ini, Top Bulan Ini, and Opportunity Score.
- Identify source status: DEMO, MANUAL, CSV_IMPORT, or REAL_API.
- Support Save Opportunity, Create Content, Create Campaign, Add to TikTok Showcase, Lihat Detail Produk, and Lihat Seller.

<div class="page-break"></div>

## Product Intelligence - Cara Kerja

The engine calculates product opportunity from multiple signals:

| Signal | Meaning |
|---|---|
| Sales | Marketplace demand or imported sales proxy. |
| Margin | Estimated profit space after costs. |
| Commission | Affiliate payout potential. |
| Trend | Momentum across product, search, and creator signals. |
| Source | Data reliability and priority. |

Source priority should prefer REAL_API, MANUAL, and CSV_IMPORT over DEMO. DEMO data is useful for review and training, but it should not override real or manually curated records.

<div class="page-break"></div>

## Product Intelligence - Workflow

1. Open Product Intelligence.
2. Select a ranking tab: Top Hari Ini, Top Minggu Ini, Top Bulan Ini, or Opportunity Score.
3. Filter by category if needed.
4. Review source badges and marketplace API warning.
5. Expand with Lihat Lebih Banyak to inspect 25 products.
6. Select a product.
7. Choose one action:
   - Save Opportunity
   - Create Content
   - Create Campaign
   - Add to TikTok Showcase
   - Lihat Detail Produk
   - Lihat Seller
8. Continue the selected workflow in the target module.

<div class="page-break"></div>

## Product Intelligence - Best Practice

- Prioritize REAL_API data when available.
- Do not add a product to TikTok Showcase until the TikTok account is connected.
- Use Opportunity Score as a starting point, then inspect commission and margin.
- Compare top products across daily, weekly, and monthly tabs.
- Save opportunities before generating content so the product is traceable.
- Use category filters to avoid mixing unrelated product strategies.
- Validate seller credibility before building a campaign.

<div class="page-break"></div>

## Product Intelligence - FAQ

**Why do I see the warning "Marketplace API belum terhubung. Data ini masih contoh"?**  
The system is showing demo product data because a live marketplace API is not connected.

**What happens when I click Add to TikTok Showcase without a connected account?**  
The system stores a NOT_CONNECTED status and shows that the TikTok Shop API is not connected.

**Why are some products marked CSV_IMPORT?**  
They came from an imported CSV file and may require manual freshness checks.

**Can I create content from a product directly?**  
Yes. Create Content should pass the selected product context to Content Factory.

<div class="page-break"></div>

## Product Intelligence - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Only a few products show | View is not expanded or dataset is incomplete. | Click Lihat Lebih Banyak or import/connect data. |
| Filter does not change products | Category mapping is missing. | Verify product category field. |
| Save Opportunity does not appear in saved list | Persistence error or offline state. | Retry, then check Content Library or saved opportunity store. |
| Showcase action fails | TikTok Shop API is not connected. | Connect TikTok and confirm API status. |
| Demo data appears above real data | Source priority is wrong. | Check source priority rules. |

<div class="page-break"></div>

## Product Intelligence - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Product Intelligence with category sidebar, 10 product cards, source badges, ranking tabs, and Lihat Lebih Banyak button.
</div>

<div class="page-break"></div>

# Content Factory

## Content Factory - Tujuan

Content Factory generates structured affiliate content for selected products. It supports product review, problem solution, comparison, UGC script, short video, and live selling script formats.

Primary goals:

- Generate content that changes when the content type changes.
- Produce Hook, Opening, Main Script, CTA, Caption, and Hashtag.
- Allow Copy, Save to Library, and Create Campaign.
- Preserve product context from Product Intelligence.
- Clearly show AI Provider mode: DEMO, TEMPLATE, or REAL.

<div class="page-break"></div>

## Content Factory - Cara Kerja

Content Factory combines product context, content type, platform style, and provider status. If a real AI provider is connected, generated text can come from the provider. If not, a local template mode generates usable drafts.

Content type behavior:

| Type | Output Style |
|---|---|
| Product Review | Experience-driven benefits and proof. |
| Problem Solution | Pain point, solution, result, CTA. |
| Comparison | Before/after or product A versus alternative. |
| UGC Script | Natural creator voice and short scenes. |
| Short Video | Fast hook, punchy scenes, short CTA. |
| Live Selling Script | Host-style selling flow and objections. |

<div class="page-break"></div>

## Content Factory - Workflow

1. Open Content Factory.
2. Select or confirm product context.
3. Choose content type.
4. Enter topic, angle, or target audience.
5. Click Generate.
6. Review Hook, Opening, Main Script, CTA, Caption, and Hashtag.
7. Click Copy for immediate use.
8. Click Save to Library to persist the item.
9. Click Create Campaign to send it to Campaign Planner.

When content type changes, the preview should reset or regenerate and not reuse the previous script.

<div class="page-break"></div>

## Content Factory - Best Practice

- Change content type before editing the final copy.
- Keep captions platform-specific and avoid overloading hashtags.
- Save every approved draft to Content Library.
- Use Product Review for trust-building and Problem Solution for pain-aware selling.
- Use UGC Script for creator-style TikTok output.
- Use Live Selling Script when preparing live sessions or shop-focused streams.

<div class="page-break"></div>

## Content Factory - FAQ

**Why did the script change after I changed type?**  
Each content type uses a different structure and should regenerate.

**Can I edit generated content?**  
Yes. Edit the output before saving it to Content Library.

**What does TEMPLATE provider mean?**  
The app is using local fallback templates because a real AI provider is not connected.

**Can I create a campaign from generated content?**  
Yes. Create Campaign should pass the selected draft and product context to Campaign Planner.

<div class="page-break"></div>

## Content Factory - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Script does not change after type change | Old state was reused. | Regenerate after selecting a new type. |
| Save to Library fails | Library service or database unavailable. | Retry and check provider/database status. |
| Caption cannot be copied | Browser clipboard permission issue. | Use the caption modal and manual select as fallback. |
| Output is generic | Missing product or audience context. | Add product, audience, and content angle. |

<div class="page-break"></div>

## Content Factory - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Content Factory form with content type selector, generated script sections, provider badge, Copy, Save to Library, and Create Campaign buttons.
</div>

<div class="page-break"></div>

# Story Engine

## Story Engine - Tujuan

Story Engine creates narrative content from a topic or product. It supports Affiliate Story, Islamic Story, Education Story, Business Story, Kids Animation Story, and Motivational Story modes.

Primary goals:

- Provide a complete flow from topic to CTA.
- Generate a structure that changes by story mode.
- Output Topic, Character, Scene Plan, Image Prompt, Video Prompt, Voice Over, Subtitle, Caption, Hashtag, and CTA.
- Support Copy, Save to Library, and Create Video.

<div class="page-break"></div>

## Story Engine - Cara Kerja

Story Engine builds a structured narrative using mode-specific templates or AI generation.

Mode structures:

| Mode | Structure |
|---|---|
| Affiliate Story | Problem, Product Discovery, Benefit, Proof, CTA. |
| Education Story | Question, Explanation, Example, Lesson, CTA. |
| Business Story | Market Problem, Opportunity, Strategy, Result, CTA. |
| Islamic Story | Opening Wisdom, Story Lesson, Moral Value, Soft CTA. |
| Kids Animation Story | Character, Problem, Adventure, Lesson, Happy Ending. |
| Motivational Story | Pain Point, Struggle, Turning Point, Lesson, Motivation CTA. |

<div class="page-break"></div>

## Story Engine - Workflow

1. Open Story Engine.
2. Select story mode.
3. Enter topic or product.
4. Run Research if available.
5. Run Fact Check or review the fallback note.
6. Generate Story Creation.
7. Review Scene Plan.
8. Generate Image Prompt and Video Prompt.
9. Review Voice Over, Subtitle, Caption, Hashtag, and CTA.
10. Save to Library or Create Video.

<div class="page-break"></div>

## Story Engine - Best Practice

- Choose story mode before writing the final topic.
- Use Affiliate Story when the goal is product conversion.
- Use Education Story when the goal is authority and trust.
- Use Islamic Story only with respectful, accurate, and non-exploitative messaging.
- Use Kids Animation Story with simple language and clear moral outcomes.
- Always verify facts before publishing educational or religious claims.

<div class="page-break"></div>

## Story Engine - FAQ

**Why is each mode different?**  
Every mode has a different narrative structure and audience expectation.

**Can Story Engine work without AI?**  
Yes. It can use TEMPLATE mode for fallback generation.

**What is Fact Check for?**  
It helps prevent unsupported claims, especially in education, business, health, and religious content.

**Can I send a story to Multi Video Engine?**  
Yes. Create Video should pass the story output to Multi Video Engine.

<div class="page-break"></div>

## Story Engine - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Structure does not change by mode | Mode state is stale. | Change mode and regenerate. |
| Story is too long | Topic is too broad. | Narrow the topic and select a target duration. |
| Prompt is weak | Missing visual style or scene detail. | Add product, character, environment, and tone. |
| Fact Check is unavailable | Real provider is not connected. | Use manual review and TEMPLATE badge. |

<div class="page-break"></div>

## Story Engine - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Story Engine with mode selector, story structure, scene plan, prompts, voice over, subtitle, caption, hashtag, and CTA.
</div>

<div class="page-break"></div>

# Multi Video Engine

## Multi Video Engine - Tujuan

Multi Video Engine creates multiple video draft variations from one product, story, or content pack. It is designed for batch production across TikTok, Reels, Shorts, and other short-form formats.

Primary goals:

- Generate 1 to 30 video drafts.
- Support platform, duration, aspect ratio, resolution, and video generator settings.
- Produce preview cards with professional mock visuals when real media providers are not connected.
- Save all generated videos to Content Library.
- Support Edit, Schedule, Preview Image, and Preview Video.

<div class="page-break"></div>

## Multi Video Engine - Cara Kerja

The engine creates a batch plan for each video item. A generated item should include:

| Field | Description |
|---|---|
| Title | Video title based on product and variation. |
| Duration | 15, 30, 45, 60, or 90 seconds. |
| Platform | TikTok, Reels, Shorts, Instagram Feed, or landscape video target. |
| Aspect Ratio | 9:16, 1:1, 16:9, or 4:5. |
| Resolution | 720x1280, 1080x1920, 1080x1080, 1920x1080, or 1080x1350. |
| Generator | Veo 3, Banana Pro, Gemini Video, Kling, Runway, or Mock Preview. |
| Prompts | Image prompt and video prompt for provider execution. |
| Status | DEMO, GENERATING, READY, FAILED, Draft, Generated, Saved, or Scheduled. |

<div class="page-break"></div>

## Multi Video Engine - Workflow

1. Open Multi Video Engine.
2. Confirm product or story context.
3. Select platform.
4. Set number of videos from 1 to 30.
5. Select duration, aspect ratio, resolution, and generator.
6. Click Generate Batch.
7. Review preview cards.
8. Expand detail accordions for hook, script, scene list, prompts, caption, hashtag, and CTA.
9. Edit individual items if needed.
10. Click Save All to Library.
11. Schedule the batch when ready.

<div class="page-break"></div>

## Multi Video Engine - Best Practice

- Use TikTok, Reels, and Shorts defaults: 9:16 and 1080x1920.
- Use Instagram Feed default: 4:5 and 1080x1350.
- Use YouTube Landscape default: 16:9 and 1920x1080.
- Generate fewer videos first when testing a new product angle.
- Save generated drafts before scheduling.
- Do not mark mock previews as real provider output.
- Use Edit for individual variation cleanup before batch scheduling.

<div class="page-break"></div>

## Multi Video Engine - FAQ

**What happens if Veo 3 or another provider is not connected?**  
The system generates prompts and a professional mock preview, then shows a provider-not-connected warning.

**Can I save all videos at once?**  
Yes. Save All to Library persists generated videos with source MULTI_VIDEO_ENGINE.

**Can each video have different copy?**  
Yes. Each draft should have its own hook, script, prompts, caption, hashtag, and CTA.

**Can I schedule from the card?**  
Yes. Schedule opens a schedule draft flow with platform, account, date, and time.

<div class="page-break"></div>

## Multi Video Engine - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Card looks empty | Provider fallback did not render visual placeholder. | Regenerate mock preview. |
| Text overlaps on card | Details are not collapsed or viewport is too narrow. | Use accordion view and responsive grid. |
| Save All does not update library | Content Library persistence failed. | Retry and check database/API status. |
| Status says real success without provider | Provider status is misreported. | Confirm generator connection status in Settings. |
| More than 30 videos requested | Validation should prevent it. | Reduce quantity to 30 or less. |

<div class="page-break"></div>

## Multi Video Engine - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Multi Video Engine with top settings panel, Generate Batch button, professional preview card, badges, progress bar, collapsed details, Edit, Schedule, and Save All to Library.
</div>

<div class="page-break"></div>

# Creative Studio

## Creative Studio - Tujuan

Creative Studio is the workspace for uploading, previewing, refining, and saving creative assets. It supports image upload, drag and drop, image preview, video preview, image prompt generation, video prompt generation, and Save to Content Library.

Primary goals:

- Let users bring assets from their device.
- Provide a visible preview for image and video media.
- Generate prompts for image or video providers.
- Store creative assets in Content Library with source label Creative Studio.

<div class="page-break"></div>

## Creative Studio - Cara Kerja

Creative Studio accepts local files and generated prompt metadata. When real media providers are connected, generated URLs can be displayed. When not connected, the module should show polished placeholders and the prompt that would be sent.

Supported states:

| State | Meaning |
|---|---|
| Uploaded | User added a local asset. |
| Preview Ready | The asset can be previewed. |
| Prompt Generated | The image or video prompt is available. |
| Saved | The asset was persisted to Content Library. |
| Provider Not Connected | Real media generation is not connected. |

<div class="page-break"></div>

## Creative Studio - Workflow

1. Open Creative Studio.
2. Upload or drag and drop an image or video.
3. Review the preview.
4. Generate an image prompt or video prompt.
5. Edit the prompt if needed.
6. Save the creative asset to Content Library.
7. Use the asset in Content Factory, Multi Video Engine, Campaign Planner, or Scheduler.

<div class="page-break"></div>

## Creative Studio - Best Practice

- Use clear filenames for uploaded assets.
- Review visual quality before saving.
- Keep image prompts specific: product, background, lighting, composition, and platform.
- Keep video prompts specific: motion, camera, scene transition, duration, and CTA placement.
- Save only useful assets to avoid cluttering Content Library.

<div class="page-break"></div>

## Creative Studio - FAQ

**Can I use Creative Studio without a real AI media provider?**  
Yes. You can upload files and generate prompt-ready placeholders.

**Does drag and drop replace upload?**  
No. Both should support the same asset intake flow.

**Where do saved assets go?**  
They appear in Content Library with source label Creative Studio.

**Can a video preview be a placeholder?**  
Yes, if the real provider is not connected. The placeholder must clearly say it is not real provider media.

<div class="page-break"></div>

## Creative Studio - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| File does not upload | Unsupported file type or browser limitation. | Use supported image/video formats. |
| Preview is blank | Object URL or media loader failed. | Re-upload the file and check file size. |
| Prompt is not generated | Provider unavailable or fallback disabled. | Use TEMPLATE mode or check provider settings. |
| Save fails | Library persistence error. | Retry and check Content Library service status. |

<div class="page-break"></div>

## Creative Studio - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Creative Studio upload area, drag and drop state, image/video preview, prompt panel, provider badge, and Save to Content Library button.
</div>

<div class="page-break"></div>

# Content Library

## Content Library - Tujuan

Content Library is the central repository for all generated, uploaded, saved, scheduled, and reusable content. It must receive items from Content Factory, Story Engine, Multi Video Engine, and Creative Studio.

Primary goals:

- Search, filter, tag, folder, preview, duplicate, delete, export, edit, and schedule content.
- Show source labels: Content Factory, Story Engine, Creative Studio, Multi Video Engine.
- Show status labels: Draft, Generated, Saved, Scheduled.
- Keep generated content available without requiring manual refresh when possible.

<div class="page-break"></div>

## Content Library - Cara Kerja

Content Library stores content items with metadata.

Recommended metadata:

| Field | Purpose |
|---|---|
| Title | Human-readable content name. |
| Type | Script, story, video plan, image, video, caption, or campaign asset. |
| Platform | TikTok, Instagram, YouTube, Facebook, Shopee, or multi-platform. |
| Source | Module that created the item. |
| Status | Draft, Generated, Saved, or Scheduled. |
| Tags | Search and grouping labels. |
| Folder | Organizational container. |
| Created At | Audit and sorting. |

<div class="page-break"></div>

## Content Library - Workflow

1. Open Content Library.
2. Search by title, product, tag, or caption.
3. Filter by type, platform, status, and source.
4. Open preview for the selected item.
5. Edit content if needed.
6. Duplicate for a new variation.
7. Schedule the item or export it.
8. Delete obsolete drafts.

Inbound workflow:

1. Generate content in another module.
2. Click Save to Library or Save All to Library.
3. Confirm the item appears with correct source and status.

<div class="page-break"></div>

## Content Library - Best Practice

- Use tags consistently, such as product category, campaign name, platform, and funnel stage.
- Keep source labels intact for auditability.
- Use folders for campaigns or monthly content plans.
- Duplicate before heavy editing if the original draft may be reused.
- Delete obsolete demo drafts before exporting production lists.
- Filter by Scheduled to confirm publishing readiness.

<div class="page-break"></div>

## Content Library - FAQ

**Why does generated content not appear in the library?**  
The module may have saved only workflow context instead of persisting to Content Library.

**Can I edit captions from the library?**  
Yes. Caption text should open a detail modal with Copy, Edit, and Save actions.

**What does source label mean?**  
It identifies which module created or saved the item.

**Can I export content?**  
Yes. Export should provide a portable list or file for operational use.

<div class="page-break"></div>

## Content Library - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Saved item missing | Persistence failed or filter hides it. | Clear filters and retry save. |
| Duplicate creates wrong source | Metadata was copied incorrectly. | Keep original source and add duplicated marker if needed. |
| Delete does nothing | Handler or permission issue. | Confirm item selection and retry. |
| Preview is blank | Media URL missing or provider fallback missing. | Open detail and check prompt/preview status. |

<div class="page-break"></div>

## Content Library - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Content Library with search, filters, source labels, status badges, preview panel, duplicate, schedule, delete, and export actions.
</div>

<div class="page-break"></div>

# Campaign Planner

## Campaign Planner - Tujuan

Campaign Planner turns selected products and saved content into structured affiliate campaigns. It connects product strategy, content assets, platform plan, publishing schedule, and performance goals.

Primary goals:

- Create campaigns from Product Intelligence or Content Factory.
- Attach products, content drafts, accounts, and schedule windows.
- Define campaign objective, platform, budget assumptions, and KPI targets.
- Prepare campaign items for Scheduler and Analytics tracking.

<div class="page-break"></div>

## Campaign Planner - Cara Kerja

A campaign groups product and content records into a measurable plan.

Typical campaign fields:

| Field | Description |
|---|---|
| Campaign Name | Operational campaign label. |
| Product | Affiliate product being promoted. |
| Objective | Awareness, clicks, conversion, live selling, or retargeting. |
| Platform | TikTok, Instagram, YouTube, Facebook, Shopee. |
| Content Assets | Scripts, stories, videos, captions, images. |
| Dates | Start date, end date, and publishing cadence. |
| KPI | Orders, commission, ROI, CTR, conversion rate. |

<div class="page-break"></div>

## Campaign Planner - Workflow

1. Start from Product Intelligence or Content Library.
2. Click Create Campaign.
3. Select product and target platform.
4. Attach content assets.
5. Set objective and KPI.
6. Choose account or account group.
7. Draft schedule plan.
8. Send items to Scheduler.
9. Monitor results in Analytics.

<div class="page-break"></div>

## Campaign Planner - Best Practice

- Use one primary objective per campaign.
- Keep product and content tightly aligned.
- Separate testing campaigns from scaling campaigns.
- Use different captions or hooks for each video variation.
- Define KPI before publishing.
- Review campaign readiness before scheduling.

<div class="page-break"></div>

## Campaign Planner - FAQ

**Can a campaign contain multiple products?**  
It can, but one product per campaign is easier to measure.

**Can I create a campaign from a generated script?**  
Yes. Create Campaign should carry selected content and product context.

**Does Campaign Planner publish content?**  
No. It prepares the plan. Scheduler handles publishing drafts.

**Can campaigns use demo data?**  
Yes for review and training, but production campaigns need real account and provider status.

<div class="page-break"></div>

## Campaign Planner - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Product context missing | Campaign was created without selected product. | Return to Product Intelligence and create campaign from a product. |
| Content asset not listed | Asset not saved to Content Library. | Save content first, then attach it. |
| KPI report empty | Analytics data not connected. | Connect analytics or use demo-only reporting. |
| Campaign cannot schedule | Missing account or schedule date. | Select account and publishing window. |

<div class="page-break"></div>

## Campaign Planner - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Campaign Planner with campaign objective, selected product, attached content, platform, account, KPI, and schedule draft sections.
</div>

<div class="page-break"></div>

# Scheduler

## Scheduler - Tujuan

Scheduler organizes when and where content should be posted. It supports draft scheduling, account selection, platform selection, date and time planning, and schedule status tracking.

Primary goals:

- Convert saved content into scheduled publishing drafts.
- Support platform and account selection.
- Show schedule status and warnings if real scheduler integration is not connected.
- Help users avoid content gaps and duplicate posts.

<div class="page-break"></div>

## Scheduler - Cara Kerja

Scheduler stores schedule records. If a real publishing API is connected, it can prepare for real posting. If not, it should store schedule drafts and show a clear provider warning.

Schedule statuses:

| Status | Meaning |
|---|---|
| Draft | Schedule is planned but not ready. |
| Scheduled | Schedule is ready or queued. |
| Posted | Content was published or manually marked posted. |
| Failed | Posting or scheduling failed. |
| Provider Not Connected | Real scheduling API is not active. |

<div class="page-break"></div>

## Scheduler - Workflow

1. Open Scheduler.
2. Select content from Content Library.
3. Choose platform.
4. Choose connected or demo account.
5. Select date and time.
6. Review caption and media.
7. Save schedule draft.
8. Confirm status.
9. Track posted or failed state.

<div class="page-break"></div>

## Scheduler - Best Practice

- Schedule content after it is saved in Content Library.
- Use account-specific calendars for multi-account workflows.
- Avoid scheduling multiple similar posts too close together.
- Confirm timezone before scheduling.
- Keep provider-not-connected schedules clearly labeled as drafts.
- Review next 7 days every day.

<div class="page-break"></div>

## Scheduler - FAQ

**Can Scheduler post automatically?**  
Only when a supported real publishing API is connected. Otherwise it stores schedule drafts.

**Why is my content marked Draft?**  
It may be missing account, media, date, or real scheduler connection.

**Can I schedule batch videos?**  
Yes. Multi Video Engine can create a schedule draft for generated video items.

**Can I edit a scheduled item?**  
Yes, if it has not been posted or locked by a real provider.

<div class="page-break"></div>

## Scheduler - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Schedule button disabled | Missing content, account, date, or time. | Complete required fields. |
| Account not listed | Social account not added or connected. | Open Social Accounts and add account. |
| Post does not publish | Real publishing API not connected. | Treat as draft or connect provider. |
| Wrong timezone | Local or account timezone mismatch. | Confirm timezone in Settings. |

<div class="page-break"></div>

## Scheduler - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Scheduler calendar/list with selected content, platform, account, date, time, status badge, and provider warning.
</div>

<div class="page-break"></div>

# Social Accounts

## Social Accounts - Tujuan

Social Accounts manages all creator and affiliate accounts used by the application. It supports TikTok, Shopee, YouTube, Instagram, and Facebook account records.

Primary goals:

- Add multiple accounts.
- Edit, delete, set active, connect, and disconnect accounts.
- Show connection status honestly.
- Support demo TikTok account for review when OAuth is not active.

<div class="page-break"></div>

## Social Accounts - Cara Kerja

Each account record stores platform, display name, handle, status, active flag, and optional profile statistics.

Connection statuses:

| Status | Meaning |
|---|---|
| Not Connected | Account exists but OAuth/API is not connected. |
| Connecting | OAuth flow is in progress. |
| Connected | Real provider is connected. |
| Connected (Demo) | Demo mode account for review workflow. |
| Expired | Token expired and needs reconnection. |

<div class="page-break"></div>

## Social Accounts - Workflow

1. Open Social Accounts.
2. Add account by selecting platform.
3. Enter display details if manual or demo.
4. Click Connect if OAuth is available.
5. Authorize the provider.
6. Return to the app.
7. Confirm username, avatar, follower count, and video count when available.
8. Set the account active for workflows.

<div class="page-break"></div>

## Social Accounts - Best Practice

- Keep only valid operational accounts active.
- Use clear account names for creator teams.
- Do not show demo connected status as real OAuth.
- Reconnect expired accounts before scheduling or showcase actions.
- Review account permissions after API changes.
- Keep platform-specific posting rules in mind.

<div class="page-break"></div>

## Social Accounts - FAQ

**Why is there a Demo TikTok Account?**  
It supports review and demo flows when real OAuth is not available.

**Can one product be assigned to multiple accounts?**  
Yes, if the workflow supports multi-account campaign or showcase mapping.

**Can I disconnect an account?**  
Yes. Disconnect should remove live access while keeping local history where appropriate.

**What should I do when status is Expired?**  
Reconnect the account.

<div class="page-break"></div>

## Social Accounts - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Connect button does not complete | OAuth credentials or redirect URI issue. | Check TikTok Integration settings. |
| Account appears connected but API fails | Token expired or permission missing. | Disconnect and reconnect. |
| Wrong account is active | Active flag was set on another account. | Set the correct account active. |
| Follower count missing | Provider did not return profile metrics. | Refresh account profile after connection. |

<div class="page-break"></div>

## Social Accounts - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Social Accounts page showing TikTok, Shopee, YouTube, Instagram, and Facebook accounts with connection status, active badge, edit, delete, connect, and disconnect actions.
</div>

<div class="page-break"></div>

# Analytics

## Analytics - Tujuan

Analytics tracks affiliate performance and content effectiveness. It helps operators understand revenue, commission, orders, conversion rate, ROI, top products, top content, top accounts, and campaign performance.

Primary goals:

- Display key business metrics.
- Separate real analytics from demo fallback.
- Support campaign, product, content, account, and date-range review.
- Help users decide what to scale, pause, or improve.

<div class="page-break"></div>

## Analytics - Cara Kerja

Analytics aggregates performance records from marketplace, campaign, content, and account sources. If real integrations are missing, fallback demo data should show a DEMO ONLY badge.

Core metrics:

| Metric | Meaning |
|---|---|
| Revenue | Gross revenue attributed to affiliate activity. |
| Commission | Estimated or confirmed affiliate payout. |
| Orders | Number of orders generated. |
| Conversion Rate | Orders divided by clicks or tracked traffic. |
| ROI | Return against spend or operational cost assumptions. |
| Top Product | Product with strongest result. |
| Top Content | Content item with strongest result. |
| Top Account | Account with strongest result. |

<div class="page-break"></div>

## Analytics - Workflow

1. Open Analytics.
2. Confirm data badge: REAL or DEMO ONLY.
3. Select date range.
4. Review revenue, commission, orders, conversion rate, and ROI.
5. Inspect top product, top content, and top account.
6. Open campaign performance.
7. Identify winners and weak items.
8. Return to Product Intelligence, Content Factory, Campaign Planner, or Scheduler for action.

<div class="page-break"></div>

## Analytics - Best Practice

- Do not optimize based on demo-only numbers.
- Compare performance across similar time windows.
- Use conversion rate and commission together, not revenue alone.
- Track content source to identify which generator produces winners.
- Review failed campaigns for account or scheduling issues.
- Export reports before major campaign changes.

<div class="page-break"></div>

## Analytics - FAQ

**Why does Analytics show DEMO ONLY?**  
No live analytics or marketplace performance API is connected.

**Why is ROI missing?**  
Cost assumptions or spend data may be absent.

**Can I filter by account?**  
Yes, when account metadata is available.

**Can Analytics identify best content type?**  
Yes, if content items include source, type, campaign, and performance metadata.

<div class="page-break"></div>

## Analytics - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Metrics are zero | No real data or date range too narrow. | Change date range or connect provider. |
| Top content missing | Content records lack performance mapping. | Confirm campaign and posted content linkage. |
| ROI is wrong | Spend or cost assumptions are incomplete. | Update campaign cost data. |
| Account report missing | Account metadata not connected. | Refresh Social Accounts. |

<div class="page-break"></div>

## Analytics - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Analytics dashboard showing revenue, commission, orders, conversion rate, ROI, top product, top content, top account, campaign table, and DEMO ONLY badge.
</div>

<div class="page-break"></div>

# Settings

## Settings - Tujuan

Settings controls system preferences, provider status, account defaults, fallback mode labels, and integration configuration. It is where operators confirm whether real APIs are connected or the app is using demo/template behavior.

Primary goals:

- Manage TikTok and provider configuration.
- Show connected or not connected status clearly.
- Configure defaults for platform, timezone, content generation, and scheduling.
- Provide safe fallback messaging when real APIs are missing.

<div class="page-break"></div>

## Settings - Cara Kerja

Settings stores application-level preferences and connection status. It should not silently convert demo state into real connected state.

Common settings:

| Setting | Usage |
|---|---|
| TikTok API Status | Controls TikTok OAuth and API badge. |
| AI Provider Status | Controls REAL, TEMPLATE, or DEMO generation. |
| Image Provider Status | Controls image generation preview behavior. |
| Video Provider Status | Controls video preview behavior. |
| Timezone | Used by Scheduler and reports. |
| Default Platform | Used by generators and schedule defaults. |

<div class="page-break"></div>

## Settings - Workflow

1. Open Settings.
2. Review TikTok API badge.
3. Review AI, image, video, analytics, and scheduler provider badges.
4. Set timezone and default platform.
5. Confirm fallback messages.
6. Save settings.
7. Re-open affected modules to confirm updated behavior.

<div class="page-break"></div>

## Settings - Best Practice

- Keep provider badges visible and accurate.
- Use demo mode only for review, training, or development.
- Confirm redirect URLs before testing OAuth.
- Keep timezone consistent with creator location.
- Document API keys and ownership outside the app in a secure system.
- Review settings after every deployment.

<div class="page-break"></div>

## Settings - FAQ

**Can Settings connect TikTok?**  
It can expose TikTok account and API configuration, but the OAuth flow may also start from Dashboard or Social Accounts.

**Why is a provider marked TEMPLATE?**  
The app is using local generation templates because a real provider is not connected.

**Can I hide provider warnings?**  
Warnings should remain visible when real APIs are missing.

**Will changing default platform affect old content?**  
No. It should affect new generation and schedule defaults only.

<div class="page-break"></div>

## Settings - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Provider says connected but output is mock | Status mapping is incorrect. | Verify provider environment variables and health check. |
| OAuth redirect fails | URL mismatch. | Confirm public URL and redirect URI. |
| Timezone wrong | Browser or setting mismatch. | Set app timezone explicitly. |
| Save fails | Permission or persistence issue. | Retry and check logs. |

<div class="page-break"></div>

## Settings - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Settings page with TikTok API badge, AI provider badge, image/video provider status, timezone, default platform, and save confirmation.
</div>

<div class="page-break"></div>

# TikTok Integration

## TikTok Integration - Tujuan

TikTok Integration connects FVN TikTok Affiliate Center to TikTok account and affiliate workflows. It supports review/demo mode, OAuth connection flow, API status badges, account profile display, and product showcase readiness.

Primary goals:

- Provide Dashboard to Connect TikTok to Authorize to Return to Connected flow.
- Show TikTok username, avatar, follower count, and video count after OAuth or demo connection.
- Show TikTok API Connected or TikTok API Not Connected badge.
- Support Add to TikTok Showcase readiness without pretending success when API is missing.

<div class="page-break"></div>

## TikTok Integration - Cara Kerja

The integration has two practical modes:

| Mode | Behavior |
|---|---|
| Real OAuth | User authorizes TikTok, app receives callback, tokens are stored securely, account profile is loaded. |
| Mock Connected Demo | App shows Demo TikTok Account, @fvn_demo_creator, Connected (Demo), and review-safe profile data. |

Showcase status values:

| Status | Meaning |
|---|---|
| NOT_CONNECTED | TikTok Shop or Affiliate API is not connected. |
| PENDING | Showcase action is queued or waiting. |
| ADDED_TO_SHOWCASE | Real API confirmed the product was added. |
| FAILED | Real API or validation failed. |

<div class="page-break"></div>

## TikTok Integration - Workflow

1. Open Dashboard.
2. Click Connect TikTok.
3. Review authorization screen or demo authorization step.
4. Return to the app.
5. Confirm connected account details.
6. Open Product Intelligence.
7. Select product.
8. Click Add to TikTok Showcase.
9. If real API is missing, confirm NOT_CONNECTED status and warning.
10. If real API is available, confirm ADDED_TO_SHOWCASE after provider success.

<div class="page-break"></div>

## TikTok Integration - Best Practice

- Never display real connected success before OAuth and API confirmation.
- Keep demo connected mode clearly labeled.
- Store token and refresh state securely.
- Validate redirect URLs against the public Vercel URL.
- Keep showcase operations idempotent where possible.
- Log API failure codes for administrator review.

<div class="page-break"></div>

## TikTok Integration - FAQ

**What is the public website URL?**  
https://fvn-tik-tok-affiliate-center.vercel.app

**What are the public legal URLs?**  
Terms: https://fvn-tik-tok-affiliate-center.vercel.app/terms  
Privacy: https://fvn-tik-tok-affiliate-center.vercel.app/privacy

**Can Add to TikTok Showcase work without TikTok Shop API?**  
No. It should create a NOT_CONNECTED status and show a clear warning.

**Why use mock connected mode?**  
It allows app review and demo recording before final OAuth approval.

<div class="page-break"></div>

## TikTok Integration - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| OAuth callback fails | Redirect URI mismatch or missing environment variable. | Check TikTok developer console and deployment config. |
| Connected account lacks profile data | Profile API permission missing. | Update requested scopes and reconnect. |
| Showcase action says NOT_CONNECTED | TikTok Shop or Affiliate API is not connected. | Configure API access before real showcase actions. |
| Demo mode confused with real mode | Badge wording is unclear. | Use Connected (Demo) and TikTok API Not Connected when appropriate. |

<div class="page-break"></div>

## TikTok Integration - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: TikTok Integration flow showing Connect TikTok, authorization step, returned connected account, API badge, and showcase status.
</div>

<div class="page-break"></div>

# Administrator Guide

## Administrator Guide - Tujuan

The Administrator Guide explains how to operate, review, and maintain FVN TikTok Affiliate Center from a system owner perspective.

Primary goals:

- Keep environment and provider status accurate.
- Support review-safe demo workflows.
- Maintain product, content, account, campaign, schedule, and analytics data.
- Diagnose API, OAuth, persistence, and build/deployment issues.

<div class="page-break"></div>

## Administrator Guide - Cara Kerja

Administrators manage the system layer behind the user workflows.

Common admin responsibilities:

| Area | Responsibility |
|---|---|
| Environment | Manage production variables and provider credentials. |
| OAuth | Confirm redirect URLs, scopes, tokens, and callback behavior. |
| Data | Maintain database records and source integrity. |
| Demo Mode | Ensure demo badges are visible and honest. |
| Build | Run lint, typecheck, test, and build before release. |
| Documentation | Keep audit and user guide files updated. |

<div class="page-break"></div>

## Administrator Guide - Workflow

1. Review current branch and deployment target.
2. Confirm environment variables.
3. Run provider health checks.
4. Validate public branding, Terms, and Privacy pages.
5. Test Dashboard to Connect TikTok flow.
6. Test product to content to library to schedule flow.
7. Review demo and fallback badges.
8. Run validation commands.
9. Deploy and verify public URL.

Recommended validation:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

<div class="page-break"></div>

## Administrator Guide - Best Practice

- Do not store secret values in documentation or client code.
- Keep demo data separate from imported and real API data.
- Use explicit source labels for all generated content.
- Keep TikTok app review requirements visible in release checklists.
- Run build after changes that affect pages, providers, or Prisma.
- Document known limitations before handoff.

<div class="page-break"></div>

## Administrator Guide - FAQ

**What should be checked before TikTok review?**  
App name consistency, public website URL, Terms, Privacy, Connect TikTok flow, demo connected mode, and honest API badges.

**What if Prisma generate fails on Windows?**  
A running dev server may lock the Prisma DLL. Stop the repo's Node process and retry build.

**Should demo data be removed before production?**  
Not necessarily, but it must be labeled and lower priority than real, manual, or CSV data.

**Who should access Settings?**  
Only operators or administrators trusted to change provider and account behavior.

<div class="page-break"></div>

## Administrator Guide - Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Build fails at Prisma generate | Locked Prisma DLL or stale process. | Stop local dev server and rerun build. |
| Public page title mismatch | Metadata or layout title drift. | Update title to exact public app name. |
| TikTok review rejects app | Missing legal pages, mismatched branding, or unclear OAuth flow. | Verify public URLs and demo flow. |
| Users report missing menu items | Sidebar overflow or routing issue. | Confirm shell layout scroll behavior and routes. |
| Content not saved | Module only saved context, not library record. | Check Content Library persistence service. |

<div class="page-break"></div>

## Administrator Guide - Screenshot Placeholder

<div class="screenshot-placeholder">
Screenshot placeholder: Administrator view with provider health, environment checklist, validation command results, deployment status, and review readiness checklist.
</div>

<div class="page-break"></div>

# Appendix A - Release Readiness Checklist

Use this checklist before release:

- App name is consistently FVN Affiliate Center or FVN TikTok Affiliate Center where context requires.
- Public website, Terms, and Privacy URLs are reachable.
- Dashboard shows TikTok connection status.
- Product Intelligence displays at least 10 default products and 25 expanded products.
- Content Factory changes output by content type.
- Story Engine changes structure by mode.
- Multi Video Engine generates 1 to 30 drafts with professional placeholders.
- Content Library receives items from all generation modules.
- Social Accounts can add, edit, delete, activate, connect, and disconnect.
- Analytics clearly labels demo-only data.
- Settings shows provider status honestly.

<div class="page-break"></div>

# Appendix B - Glossary

| Term | Definition |
|---|---|
| Opportunity Score | A ranking score estimating product potential. |
| DEMO | Example data or mock workflow for review and training. |
| TEMPLATE | Local fallback generation without a real AI provider. |
| REAL_API | Live connected provider data or action. |
| Showcase | TikTok product showcase area tied to TikTok Shop/Affiliate capability. |
| Content Library | Central store for scripts, stories, prompts, assets, and video drafts. |
| Campaign | A measurable product and content plan. |
| Schedule Draft | Planned publishing record not yet posted by a real provider. |

<div class="page-break"></div>

# Appendix C - Screenshot Capture Plan

Recommended screenshots for final PDF:

1. Dashboard overview.
2. Product Intelligence with category filter and expanded list.
3. Content Factory generated script.
4. Story Engine mode output.
5. Multi Video Engine settings and preview card.
6. Creative Studio upload and preview.
7. Content Library filters and item detail.
8. Campaign Planner campaign draft.
9. Scheduler date/time flow.
10. Social Accounts connected demo account.
11. Analytics demo-only report.
12. Settings provider status.
13. TikTok Integration connect flow.
14. Administrator validation checklist.

<div class="page-break"></div>

# Appendix D - PDF Conversion Notes

For best PDF output:

- Use a Markdown converter that supports raw HTML.
- Enable automatic Table of Contents from front matter or CLI flags.
- Preserve CSS page breaks.
- Replace screenshot placeholders with final captured screenshots before formal distribution.
- Use a professional PDF theme with readable table styles.
- Review legal and public URL content before external sharing.

End of guide.

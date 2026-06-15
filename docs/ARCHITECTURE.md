# Architecture Notes

FVN TikTok Affiliate Center is a standalone Next.js 14 application focused on TikTok affiliate workflows. It is separate from `D:\FVN\AI CLIPPER`.

## Folder Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: shared UI shell, cards, metrics, and settings UI.
- `src/lib`: environment, Prisma, AI provider, and utility helpers.
- `src/modules/affiliate`: product hunter, CSV import, product source labels, and workflow UI.
- `src/modules/scoring`: product scoring and recommendation labels.
- `src/modules/prompt-engine`: prompt templates, template fallback, provider selection, and content generation.
- `src/modules/content-library`: saved content draft list and detail workflows.
- `src/modules/campaign`: campaign planner and performance helpers.
- `src/modules/posting`: posting checklist, posted content helpers, and dashboard stats.
- `src/modules/posted-content`: posted content UI and manual performance input.
- `src/modules/analytics`: manual analytics calculations, dashboard, CSV export, and insights.
- `src/modules/action-plan`: simple daily action plan engine and UI panel.
- `src/modules/tiktok`: TikTok Login Kit OAuth helpers, diagnostics, and account status.
- `src/modules/tiktok-shop`: future official TikTok Shop API adapter placeholders.
- `prisma`: Prisma schema and seed script.
- `docs`: MVP docs, testing checklist, architecture notes, and roadmap.

## Main Modules

- Product Hunter stores products as `DEMO`, `MANUAL`, `CSV_IMPORT`, or `REAL_API`.
- Product Scoring calculates a 0-100 score and recommendation.
- Prompt Engine creates content packs using AI providers or Template Mode.
- Content Library saves generated drafts and supports edit, copy, duplicate, archive, and campaign creation.
- Posting Workflow supports manual checklist, manual upload tracking, posted video URL, and manual performance input.
- Campaign Planner creates 7-day or 14-day posting plans and manual performance tracking.
- Analytics uses only manual posted content performance data.
- Action Plan uses available products, drafts, campaigns, posted content, and analytics signals to recommend daily actions.

## Product Data Flow

1. User adds a product manually, imports CSV, or uses demo seed data.
2. Product is saved with source metadata.
3. Product scoring runs and stores score/recommendation.
4. Product appears in Product Hunter and can be selected for content generation.
5. Demo/manual/CSV data is never displayed as real TikTok Shop data.

## Prompt Engine Flow

1. User selects a product.
2. User selects content mode, target audience, tone, and duration.
3. If Gemini or OpenAI key exists, provider mode can be AI.
4. If provider key is missing or provider fails, Template Mode generates local content.
5. Generated content pack is saved to `ContentPack`.
6. Content Library reuses and edits saved drafts.

## Campaign Flow

1. User creates a 7-day or 14-day campaign from product or content draft.
2. Campaign stores daily plan JSON.
3. User manually inputs performance per campaign day.
4. Poor performance suggestions appear after enough data exists.
5. Posted content can be linked back to campaign.

## Manual Analytics Flow

1. User uploads video manually to TikTok.
2. User marks draft as posted and saves TikTok video URL.
3. User inputs views, likes, comments, shares, saves, clicks, orders, and revenue manually.
4. Analytics calculates CTR, conversion rate, engagement rate, revenue per order, and revenue per 1,000 views.
5. Best product, best content, and best campaign are selected from manual data.

## TikTok OAuth Flow

1. User clicks Connect TikTok.
2. App generates TikTok Login Kit authorization URL.
3. TikTok redirects to `/api/auth/tiktok/callback`.
4. App validates OAuth state.
5. App exchanges code at TikTok OAuth token endpoint.
6. App stores connection status and safe account placeholder data.
7. Login Kit account connection does not provide TikTok Shop product data by itself.

## Future TikTok Shop API Adapter

The `src/modules/tiktok-shop` module is reserved for an official TikTok Shop API integration if API access and scopes are approved later.

Future adapter responsibilities:

- Fetch real product data from official TikTok Shop API.
- Mark fetched products as `REAL_API`.
- Avoid scraping.
- Avoid showing API data unless credentials and official responses are valid.
- Keep manual/CSV/demo modes available as fallbacks.


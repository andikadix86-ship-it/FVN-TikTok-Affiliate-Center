# FVN Affiliate Center

FVN Affiliate Center is a creator commerce dashboard for affiliate product research, content planning, campaign management, and publishing workflow.

## Main Workflow

1. Add product manually or import CSV.
2. Score product opportunity.
3. Generate TikTok content pack.
4. Save draft content.
5. Prepare posting checklist.
6. Upload manually to TikTok.
7. Save posted video URL.
8. Input manual performance.
9. Review analytics.
10. Follow daily action plan.

## Features

- Dashboard: overview of products, drafts, posted content, analytics, and next actions.
- Rencana Hari Ini / Action Plan: simple daily recommendations based on available data.
- Produk Affiliate / Product Hunter: manual product input, CSV import, URL input, source badges, and scoring.
- Product Scoring: 0-100 score with beginner-friendly recommendation labels.
- CSV Import: validated product import from user CSV file.
- Manual Product Input: add products before TikTok Shop API is connected.
- Buat Konten / Prompt Engine: generate hooks, scripts, captions, hashtags, CTA, checklist, and campaign ideas.
- Draft Konten / Content Library: save, search, edit, copy, duplicate, archive, and reuse generated drafts.
- Rencana Posting / Campaign Planner: create 7-day or 14-day posting plans and input manual performance.
- Konten Terposting / Posted Content: save TikTok video URLs after manual upload and track performance.
- Analisa Affiliate / Simple Analytics: calculate views, clicks, orders, revenue, CTR, conversion rate, and engagement rate from manual data.
- Akun TikTok / TikTok OAuth Diagnostics: Login Kit readiness, environment status, and OAuth error display.
- Pengaturan / Status Panel: database, AI provider, TikTok OAuth, TikTok Shop API, product source, demo data, health check, and sample CSV.

## Data Sources

### DEMO DATA

Sample only, not from TikTok Shop. Demo products are for onboarding and UI testing.

### MANUAL DATA

Data entered by the user. Manual data should never be shown as official TikTok Shop data.

### CSV IMPORT

Data imported from the user's CSV file. CSV data should never be shown as official TikTok Shop data.

### REAL API DATA

Official API data, only if TikTok Shop API is connected later.

Important: never claim demo, manual, or CSV data as real TikTok Shop data.

## TikTok Integration

- TikTok Login Kit is for account connection.
- TikTok Shop API is separate from TikTok Login.
- Product Hunter does not automatically pull TikTok Shop products yet.
- TikTok auto-posting is not enabled in this MVP.
- Manual publishing workflow is used for safety and simplicity.
- The app does not scrape TikTok and does not fake TikTok analytics.
- All analytics come from manual performance input unless an official API is connected later.

## Environment Variables

Create `.env` locally and configure the same values in Vercel for production.

```env
DATABASE_URL=""
DIRECT_URL=""
NEXT_PUBLIC_APP_URL="https://fvn-affiliate-center.vercel.app"
NEXTAUTH_URL="https://fvn-affiliate-center.vercel.app"

TIKTOK_CLIENT_KEY=""
TIKTOK_CLIENT_SECRET=""
TIKTOK_REDIRECT_URI="https://fvn-affiliate-center.vercel.app/api/auth/tiktok/callback"
TIKTOK_OAUTH_PKCE_ENABLED="false"

TIKTOK_SHOP_APP_KEY=""
TIKTOK_SHOP_APP_SECRET=""
TIKTOK_SHOP_ACCESS_TOKEN=""
TIKTOK_SHOP_REGION="ID"

GEMINI_API_KEY=""
OPENAI_API_KEY=""
```

TikTok Web Login requires an HTTPS redirect URI. Use a Vercel deployment URL or ngrok HTTPS URL for local OAuth testing.

## Local Setup

```bat
cd /d D:\FVN\TIKTOK
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

Optional demo seed:

```bash
npm run prisma:seed
```

## Build And Test

```bash
npm run lint
npm run build
npm test
```

## Supabase Setup

Use a separate Supabase project/database for FVN Affiliate Center. Do not reuse the old AI Clipper database unless you are intentionally doing an isolated test and understand that table names, data shape, and migrations are different.

1. Open Supabase and create a new project for `FVN Affiliate Center`.
2. Wait until the new database is ready.
3. In Supabase Project Settings, open Database connection settings.
4. Copy the pooled PostgreSQL connection string into `DATABASE_URL`.
5. Copy the direct PostgreSQL connection string into `DIRECT_URL`.
6. Add both values to your local `.env` and Vercel environment variables.
7. Run Prisma migration from a trusted local or CI environment.
8. Keep database credentials out of Git.

Prisma setup commands:

```bash
npx prisma generate
npx prisma migrate dev
npm run build
```

Optional demo seed:

```bash
npm run prisma:seed
```

The seed script only creates demo products with `source=DEMO`.

## Vercel Deploy Guide

1. Push the project to GitHub.
2. Import the repo to Vercel.
3. Add all environment variables in Vercel Project Settings.
4. Deploy.
5. Redeploy after every environment variable update.
6. Open `/api/health`.
7. Open `/tiktok/oauth-test`.
8. Copy the production redirect URI:

```text
https://fvn-affiliate-center.vercel.app/api/auth/tiktok/callback
```

9. Add the redirect URI to TikTok Developer Portal Login Kit config.
10. Test the Connect TikTok button from the deployed HTTPS URL.

Vercel runs `npm install`, `postinstall` runs `prisma generate`, and the build script runs `prisma generate && next build`.

## Production Checklist

Before production testing:

- `DATABASE_URL`, `DIRECT_URL`, and `NEXT_PUBLIC_APP_URL` are configured in Vercel.
- `NEXT_PUBLIC_APP_URL` starts with `https://`.
- `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, and `TIKTOK_REDIRECT_URI` are configured in Vercel.
- `TIKTOK_REDIRECT_URI` starts with `https://` and has no query string or hash.
- `TIKTOK_OAUTH_PKCE_ENABLED` is set to `false` unless PKCE is intentionally enabled end to end.
- `/api/health` returns safe statuses only and does not expose secrets.
- `/tiktok/oauth-test` shows configured/missing status and safe OAuth errors.
- TikTok Shop API env is optional and the app stays in manual/CSV/demo mode until official API access is connected.

## TikTok OAuth Troubleshooting

- `code_challenge` error: Web Login Kit does not need PKCE by default. Keep `TIKTOK_OAUTH_PKCE_ENABLED="false"` unless PKCE is implemented end to end.
- `redirect_uri` mismatch: `TIKTOK_REDIRECT_URI` must exactly match TikTok Developer Portal.
- Missing client key or secret: configure `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET`, then redeploy.
- State mismatch: restart login from the app. The OAuth cookie may have expired or the callback came from a different browser/session.
- Localhost/http issue: TikTok Web Login requires HTTPS redirect URI.

## Beginner Usage Guide

1. Tambah produk lewat Produk Affiliate dengan input manual, CSV import, atau link produk.
2. Cek score produk dan label rekomendasi.
3. Buka Buat Konten untuk membuat hook, script, caption, hashtag, dan CTA keranjang kuning.
4. Simpan draft di Draft Konten.
5. Gunakan Checklist Posting sebelum upload manual ke TikTok.
6. Setelah upload, simpan URL video di Konten Terposting.
7. Input performa manual: views, likes, comments, shares, saves, clicks, orders, dan revenue.
8. Buka Analisa Affiliate untuk membaca performa.
9. Buka Rencana Hari Ini untuk melihat rekomendasi praktis berikutnya.

## Safety Notes

- Do not commit `.env` files or secrets.
- Do not claim a product is from TikTok Shop unless `source=REAL_API`.
- Do not promise guaranteed sales, guaranteed virality, or guaranteed income.
- Manual publishing means the user uploads to TikTok themselves.
- Manual analytics means the user inputs performance numbers themselves.

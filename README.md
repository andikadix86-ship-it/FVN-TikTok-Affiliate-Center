# FVN TikTok Affiliate Center

A standalone Next.js 14 MVP for beginner TikTok affiliate workflows.

## Focus

- Produk Affiliate
- Product Scoring
- Buat Konten / Prompt Engineer
- TikTok Account Connection
- Rencana Posting
- Pengaturan

## Getting Started

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000`.

## Database

The Prisma schema is ready for Supabase/PostgreSQL. Set `DATABASE_URL` and `DIRECT_URL`, then run:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Local Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Add Supabase/PostgreSQL values for `DATABASE_URL` and `DIRECT_URL`.
4. Run `npm run prisma:generate`.
5. Run `npm run prisma:migrate`.
6. Run `npm run prisma:seed` to add demo products.
7. Start the app with `npm run dev`.

## Supabase Setup

Create a Supabase project, copy the pooled connection string into `DATABASE_URL`, and copy the direct connection string into `DIRECT_URL`. Keep both values secret.

## Prisma Migrate

Use `npm run prisma:migrate` during local development. For production deploys, run Prisma migrations from a trusted environment before or during deployment.

## Seed Demo Data

Run `npm run prisma:seed`. The seed only creates demo products with `source=DEMO`.

## Vercel Deploy

Add these environment variables in Vercel:

```bash
DATABASE_URL=""
DIRECT_URL=""
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
TIKTOK_CLIENT_KEY=""
TIKTOK_CLIENT_SECRET=""
TIKTOK_REDIRECT_URI="https://your-vercel-domain.vercel.app/api/auth/tiktok/callback"
GEMINI_API_KEY=""
OPENAI_API_KEY=""
```

Run `npm run build` locally before deploying.

## Vercel Production Deploy Guide

1. Push this repository to GitHub.
2. Import the GitHub project into Vercel.
3. Add all production environment variables in Vercel Project Settings.
4. Redeploy after every environment variable update.
5. Copy the production callback URL:

```text
https://your-vercel-domain.vercel.app/api/auth/tiktok/callback
```

6. Add that callback URL to the TikTok Developer Portal Login Kit configuration.
7. Open `/api/health` on the deployed app and confirm:
   - `app` is `ok`
   - `database` is `connected`
   - `tiktokOAuth` is `configured`
8. Test the TikTok connect button from the deployed HTTPS URL.

Vercel runs `npm install`, then `postinstall` runs `prisma generate`. The build script also runs `prisma generate && next build`.

## TikTok Redirect URI Setup

TikTok Web Login requires an HTTPS redirect URI. Use your Vercel deployment URL or an ngrok HTTPS URL for local testing, then set the same value in TikTok Developer settings and `TIKTOK_REDIRECT_URI`.

## Troubleshooting TikTok Login

- `code_challenge` error: Web Login Kit does not need PKCE by default. Keep `TIKTOK_OAUTH_PKCE_ENABLED="false"` unless you intentionally implement PKCE end to end.
- `redirect_uri` mismatch: `TIKTOK_REDIRECT_URI` must exactly match the callback URL registered in TikTok Developer Portal.
- Missing `client_key`: add `TIKTOK_CLIENT_KEY` in Vercel env and redeploy.
- Missing `client_secret`: add `TIKTOK_CLIENT_SECRET` in Vercel env and redeploy. The app never shows the full secret in UI.
- State mismatch: restart the connection from the app. This usually means the OAuth cookie expired or the callback came from a different browser/session.
- Localhost/http problem: TikTok Web Login requires HTTPS redirect URI. Use Vercel preview/deploy URL or ngrok HTTPS.
- App not approved or scope not approved: Login Kit and optional profile/video scopes must be enabled in TikTok Developer Portal.
- `video.list` scope not approved: this MVP does not request `video.list` by default. Do not enable it unless TikTok approves the feature.

For MVP, TikTok Shop product data is still not automatic. TikTok account connection is different from TikTok Shop product API. Product Hunter can use DEMO DATA, MANUAL DATA, or CSV IMPORT until a real TikTok Shop API integration is approved and connected.

## Panduan Penggunaan untuk Pemula

1. Tambah produk lewat Produk Affiliate dengan input manual, CSV import, atau link produk.
2. Cek score produk dan label rekomendasi: Layak Promosi, Test Dulu, atau Hindari.
3. Buka Buat Konten untuk membuat hook, script, caption, hashtag, dan CTA keranjang kuning.
4. Buat campaign 7 hari atau 14 hari di Rencana Posting.
5. Input performa manual setiap hari: views, likes, comments, shares, clicks, orders, dan revenue.
6. Perbaiki konten berdasarkan saran AI atau Template Mode setelah minimal 5 hari data performa.

Catatan sumber data:

- DEMO DATA hanya contoh dan bukan data TikTok Shop asli.
- MANUAL DATA adalah data yang kamu input sendiri.
- CSV IMPORT adalah data dari file CSV kamu.
- REAL API DATA hanya digunakan jika integrasi API asli sudah connected.

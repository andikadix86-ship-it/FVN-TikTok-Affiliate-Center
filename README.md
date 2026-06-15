# FVN TikTok Affiliate Center

A standalone Next.js 14 MVP for beginner TikTok affiliate workflows.

## Focus

- Product Hunter
- Product Scoring
- Content Factory / Prompt Engineer
- TikTok Account Connection
- Campaign Planner
- Settings

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
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
TIKTOK_CLIENT_KEY=""
TIKTOK_CLIENT_SECRET=""
TIKTOK_REDIRECT_URI="https://your-domain.vercel.app/api/auth/tiktok/callback"
GEMINI_API_KEY=""
OPENAI_API_KEY=""
```

Run `npm run build` locally before deploying.

## TikTok Redirect URI Setup

TikTok Web Login requires an HTTPS redirect URI. Use your Vercel deployment URL or an ngrok HTTPS URL for local testing, then set the same value in TikTok Developer settings and `TIKTOK_REDIRECT_URI`.

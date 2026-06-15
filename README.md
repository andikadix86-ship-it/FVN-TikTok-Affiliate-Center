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
npm run dev
```

Open `http://localhost:3000`.

## Database

The Prisma schema is ready for Supabase/PostgreSQL. Set `DATABASE_URL` and `DIRECT_URL`, then run:

```bash
npm run prisma:generate
npm run prisma:migrate
```

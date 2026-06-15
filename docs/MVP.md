# TikTok Affiliate Center MVP

This project is intentionally standalone. It keeps the initial scope narrow: find products, score them, generate content prompts, connect TikTok, plan campaigns, and configure providers.

## Integrations

- TikTok Login Kit/OAuth route placeholders live in `src/modules/tiktok`.
- Gemini/OpenAI provider slots live in `src/lib/ai-providers.ts`.
- Prisma is configured for PostgreSQL/Supabase in `prisma/schema.prisma`.

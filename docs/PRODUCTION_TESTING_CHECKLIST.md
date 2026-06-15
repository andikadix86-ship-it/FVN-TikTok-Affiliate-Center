# Production Testing Checklist

Use this checklist on the Vercel production URL after deployment and environment variable setup.

## Production Readiness

- [ ] Vercel deployment succeeds.
- [ ] `postinstall` runs `prisma generate`.
- [ ] Build script runs `prisma generate && next build`.
- [ ] No secrets are committed.
- [ ] No `.env`, `.env.local`, `.env.production`, `.vercel`, `.next`, `node_modules`, or log files are committed.

## Manual Test Flow

- [ ] A. Open homepage.
- [ ] B. Open Dashboard.
- [ ] C. Open `/api/health`.
- [ ] D. Open `/tiktok/oauth-test`.
- [ ] E. Add manual product.
- [ ] F. Import CSV.
- [ ] G. Generate content pack.
- [ ] H. Save draft.
- [ ] I. Mark draft ready.
- [ ] J. Mark posted.
- [ ] K. Input TikTok video URL.
- [ ] L. Input manual performance.
- [ ] M. Create 7-day campaign.
- [ ] N. Check analytics.
- [ ] O. Check action plan.
- [ ] P. Clear demo data.
- [ ] Q. Confirm manual/CSV data not deleted.

## Health Check

`GET /api/health` should return safe status values only:

- [ ] `app`: `ok`
- [ ] `database`: `connected` or `error`
- [ ] `tiktokOAuth`: `configured`, `missing`, or `invalid`
- [ ] `tiktokShopApi`: `configured` or `missing`
- [ ] `aiProvider`: `configured` or `template_mode`
- [ ] `productSource`: `demo`, `manual`, `csv`, or `real_api`
- [ ] No database URL is shown.
- [ ] No API key is shown.
- [ ] No TikTok client secret is shown.
- [ ] No access token or refresh token is shown.

## TikTok OAuth Test

- [ ] TikTok Client Key shows configured/missing.
- [ ] TikTok Client Secret shows configured/missing, not the secret value.
- [ ] Redirect URI shows configured/missing/invalid.
- [ ] Redirect URI starts with `https://`.
- [ ] Redirect URI has no query string.
- [ ] Redirect URI has no hash.
- [ ] Login URL can be generated.
- [ ] No empty `code_challenge` is sent when PKCE is disabled.
- [ ] Last OAuth error is safe and redacted.

## Manual Data Honesty

- [ ] DEMO DATA is shown as `DEMO DATA - Bukan dari TikTok Shop`.
- [ ] MANUAL DATA is shown as `MANUAL DATA - Input user`.
- [ ] CSV IMPORT is shown as `CSV IMPORT - Dari file user`.
- [ ] REAL API DATA is only used for official API data.
- [ ] No demo/manual/CSV product is claimed as real TikTok Shop data.


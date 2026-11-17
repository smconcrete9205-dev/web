# SM Concrete Products

Next.js 14.2.35 (App Router) + TypeScript + Tailwind + Prisma 6.19.3. RCC precast concrete marketing/lead-gen site, admin panel at `/admin`, and an ERP module (Party + GST Invoices done; Payments, PO, E-way bill pending).

## Rules
- Keep replies short. Reply in casual Hinglish. Do not re-read README.md; this file is the summary.
- Do not upgrade Next or Prisma (pinned on purpose).
- Be honest about scope; do not overpromise on SEO or ranking.
- Lead generation is the real success metric, so favor lead-conversion work.

## Key files
- `src/lib/products.ts`: product data layer (Prisma), used by pages and admin
- `src/lib/leads.ts`: `saveLead()`, the lead persistence and ERP integration point
- `src/lib/settings.ts`: admin-editable contact info; `src/lib/constants.ts`: brand and seed defaults
- `src/lib/schema.ts`: JSON-LD; `src/lib/session.ts` + `src/middleware.ts`: admin auth (env user/pass, signed cookie)
- `src/app/(site)/`: public pages (all `force-dynamic`); `src/app/admin/`: admin panel
- `prisma/schema.prisma`: models

## Gotchas
- Deployed on Vercel: the DB must be hosted (README still says SQLite and is outdated). The build must not crash when `DATABASE_URL` is missing.
- Product image uploads write to `public/images/products/`, which is ephemeral on serverless. Use Blob or Cloudinary.
- Sample images are from Wikimedia and must be replaced with real photos before launch.
- Git: branch `main`, repo smconcrete9205-dev/web.

# SM Concrete Products — Website

Production-ready Next.js 14 (App Router) marketing + lead-generation site for
SM Concrete Products, a manufacturer of RCC precast concrete products, with a
built-in admin panel for managing products, leads, and contact settings.

## Tech Stack

- Next.js 14 (App Router, Server Components by default)
- TypeScript
- Tailwind CSS
- Prisma + SQLite — products, leads, and site settings (see [Admin Panel](#admin-panel--database))
- Native Next.js `sitemap.ts` / `robots.ts` (database-aware, generated at request time)
- next/image for all images

## Getting Started

```bash
npm install          # also runs `prisma generate` via postinstall
cp .env.example .env # then edit ADMIN_USERNAME / ADMIN_PASSWORD / SESSION_SECRET
npm run db:push       # creates the SQLite database from prisma/schema.prisma
npm run db:seed       # loads the 7 starter products + default contact settings
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, and
[http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel
(login with the `ADMIN_USERNAME`/`ADMIN_PASSWORD` you set in `.env`).

Set `NEXT_PUBLIC_SITE_URL` to your real domain before deploying — it's used
for canonical URLs, JSON-LD, and sitemap generation.

```bash
npm run build
npm start
```

## Admin Panel & Database

Everything that used to require editing code — products, contact details, and
viewing leads — is now managed at **`/admin`**, backed by a SQLite database
(via Prisma). Login is a single admin user configured through environment
variables (no separate user-management system, by design — see
[Auth notes](#admin-auth-notes) below).

| Section | URL | What it manages |
|---|---|---|
| Dashboard | `/admin` | Lead/product counts, recent leads |
| Products | `/admin/products` | Add / edit / delete products — name, description, specs, features, images, SEO |
| Leads | `/admin/leads` | Every quote/contact form submission, with a status (new/contacted/closed) |
| Settings | `/admin/settings` | Phone, WhatsApp number, email, address, Google Maps embed link |

Changes made in the admin panel appear on the live site **immediately** — the
public pages (`/`, `/products`, `/products/[slug]`, `/contact`, header,
footer) are rendered fresh on every request (`export const dynamic =
"force-dynamic"`) rather than cached at build time, specifically so
non-developers can manage content without a redeploy.

### Environment variables (required)

```bash
DATABASE_URL="file:./dev.db"        # SQLite file — see hosting note below
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-now        # plain env var — see auth notes below
SESSION_SECRET=<a long random string>   # e.g. `openssl rand -hex 32`
```

### Admin auth notes

Login is intentionally simple: a single username/password pair from
environment variables, and a signed session cookie (HMAC-SHA256 via the Web
Crypto API — see `src/lib/session.ts`) checked by `src/middleware.ts` on every
`/admin/*` request. There's no password hashing, no multi-user support, and no
rate limiting on the login form. This is enough for one internal admin user
during an MVP, but **before handing this to a client for real use**, consider:

- A real auth provider (NextAuth, Clerk) if you need multiple admin users or
  audit trails.
- Rate limiting / lockout on `/admin/login`.
- Rotating `SESSION_SECRET` and `ADMIN_PASSWORD` out of plain env vars into a
  secrets manager for production.

### Database hosting note

SQLite (a single `prisma/dev.db` file) is zero-config and perfect for
local development and any **self-hosted / VPS** deployment (the filesystem
persists between requests). It will **not** work on serverless platforms with
an ephemeral filesystem (Vercel, Netlify functions, etc.) — the database would
reset on every cold start/deploy. If you deploy there, switch the datasource
in `prisma/schema.prisma` to a hosted Postgres/MySQL database (Vercel
Postgres, Supabase, PlanetScale, Neon, ...) and update `DATABASE_URL` —
everything else (Prisma models, the admin panel, `src/lib/products.ts`) stays
the same since it all goes through Prisma.

The same constraint applies to **uploaded product images**
(`src/app/api/admin/upload/route.ts` writes into `public/images/products/`
on disk) — fine on a VPS, but wiped on every deploy on serverless platforms.
If you move there, swap that route for an upload to S3/Cloudinary/Vercel Blob
and return that URL instead of a local path.

### Resetting or re-seeding the database

`prisma/seed-data.ts` holds the original 7 starter products (used only for
the first `db:seed`; after that, edit products through `/admin/products`
instead). To wipe and start over:

```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

## Project Structure

```
src/
  app/
    layout.tsx                 Root layout: fonts, Organization JSON-LD (thin — no header/footer)
    (site)/                    Route group for all public marketing pages
      layout.tsx               Header, Footer, floating WhatsApp button (fetches live settings)
      page.tsx                 Home page
      about/page.tsx           About / company background
      products/page.tsx        Products listing
      products/[slug]/page.tsx Dedicated page per product (spec table, gallery, quote form, Product JSON-LD)
      contact/page.tsx         Contact form, WhatsApp, map, LocalBusiness JSON-LD
      blog/page.tsx            Placeholder resources/blog index (see "Adding blog content" below)
    admin/                     Admin panel (see Admin Panel section above)
      login/                   Login page + server action
      (protected)/             Dashboard, products, leads, settings — behind middleware auth
    api/leads/route.ts         POST endpoint the quote/contact forms submit to
  middleware.ts                Protects /admin/* — redirects to /admin/login if not authenticated
  components/                  UI building blocks (Header, Footer, QuoteRequestForm, etc.)
  lib/
    products.ts                ⭐ Product data access layer (Prisma-backed) — used by pages AND admin
    leads.ts                   ⭐ Lead persistence — the ERP integration point
    settings.ts                 Site settings (contact info) data access layer
    constants.ts                Static brand identity (name, tagline) + seed defaults for settings
    schema.ts                   JSON-LD structured data builders (Organization, Product, LocalBusiness, Breadcrumb)
    session.ts                  Signed admin session cookie (Web Crypto, works in Edge + Node runtimes)
    prisma.ts                   Prisma client singleton
prisma/
  schema.prisma                Product, Lead, SiteSettings models (SQLite)
  seed.ts / seed-data.ts       Initial data load (first `db:seed` run only)
public/
  images/                      Logo + sample images (see "Replacing the sample images" below)
```

## Adding or Editing a Product

Use **`/admin/products`** — no code changes needed. The form fields map onto
the same shape every page reads (`src/lib/products.ts`):

- **Specifications**: one per line, formatted as `Label: Value` (e.g. `IS
  Code Reference: IS 458`).
- **Images**: click "+ Upload Image" to upload a file directly from your
  computer (JPG/PNG/WEBP, up to 5MB) — it's saved into
  `public/images/products/` automatically (via `POST /api/admin/upload`,
  protected the same way as the rest of `/admin`) and added to the gallery.
  Fill in the alt text for each image after uploading; remove one with its
  "Remove" link.
- **Features / Applications / SEO Keywords**: one item per line.

The homepage grid, `/products` listing, sitemap, footer links, and the
`QuoteRequestForm` product dropdown all read from the same database table
automatically — adding, editing, or deleting a product there is the only
step.

### Replacing the sample images

`public/images/products/`, `public/images/hero.jpg`, and
`public/images/about.jpg` currently contain **real sample photos pulled from
Wikimedia Commons** (free-license stock/industrial photography) so the site
looks presentable for an MVP/client walkthrough instead of showing abstract
placeholder graphics. They are stand-ins, not photos of your actual factory
or products.

- These images are Creative Commons / public-domain licensed on Commons, but
  several require attribution (CC BY-SA) if kept on a **live, public** site.
  Before launching for real, either replace them with your own product
  photography (recommended) or add proper photographer/license credit.
- To replace: open the product in `/admin/products`, remove the sample
  image(s), and upload your real photos instead.
- `next.config.js` still allows local SVGs (`dangerouslyAllowSVG`) for the
  vector logo files (`logo.svg`, `logo-mark.svg`) — leave that as-is.

### Adding blog content

`src/app/(site)/blog/page.tsx` is a placeholder index. To publish real
articles, create `src/app/(site)/blog/[slug]/page.tsx` following the same
pattern as the product detail page: a content source (a database table like
products, or a simple config file) plus a dynamic route that reads from it.

## Lead Capture & Future ERP Integration

**This is the one file you'll touch to go live with your ERP:**
**`src/lib/leads.ts`**

- The `Lead` interface defines the flat, typed shape of every lead: `name`,
  `phone`, `product`, `quantity`, `message`, `sourcePage`, `timestamp`.
- `saveLead(leadData: Lead)` is called by `src/app/api/leads/route.ts` for
  every form submission (`<QuoteRequestForm />` on product pages, the
  homepage, and `/contact`). It currently logs to the console **and** saves
  the lead to the database, which is what makes it show up in
  `/admin/leads`.
- When your ERP API is ready, add a call to it alongside the database write
  (or instead of it) inside `saveLead` — the function signature stays the
  same, so no other file needs to change:

```ts
// src/lib/leads.ts, inside saveLead()
await fetch(process.env.ERP_LEADS_ENDPOINT!, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ERP_API_KEY}`,
  },
  body: JSON.stringify(leadData),
});
```

`QuoteRequestForm` is a single reusable client component
(`src/components/QuoteRequestForm.tsx`) used on every product page (with the
product pre-selected) and `/contact`. It receives the product list as a prop
from its parent Server Component (it can't query the database itself), and
submits via `fetch` to `/api/leads`, showing an inline success message — no
page reload.

## SEO Notes

- Every page sets a unique `title`/`description` via the Next.js Metadata
  API (`src/app/(site)/**/page.tsx`), pulling live SEO fields from the
  database for product pages.
- JSON-LD structured data: `Organization` (sitewide, in `layout.tsx`),
  `LocalBusiness` (home + contact), `Product` + `BreadcrumbList` (each
  product page). See `src/lib/schema.ts`.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and
  `/robots.txt` natively (Next's built-in metadata routes) — the sitemap
  queries the database directly, so every admin-added product appears
  immediately at request time, with no rebuild needed. (An earlier version of
  this project used `next-sitemap`, which crawls static build output — that
  approach silently broke once product pages became database-driven and
  dynamic, so it was replaced.) `/admin/*` is excluded from both.
- Public pages read from the database on every request
  (`force-dynamic`) so admin edits appear immediately — this trades a small
  amount of raw page-load performance for content freshness, which matters
  more once non-developers are editing content directly.
- The `/admin/*` section is excluded from indexing (`robots: { index:
  false }`) and from the sitemap.

## Known Dependency Notes

- This project pins `next@14.2.35` — the latest patched release on the 14.x
  line (per the request to build on "Next.js 14+"). A handful of `npm audit`
  advisories (an internal Server Function endpoint disclosure and a bundled
  PostCSS issue) are only fixed in Next 15/16, which is a breaking major
  upgrade outside this project's scope.
- Prisma is pinned to `6.19.3`. Prisma 7 removed the classic
  `datasource { url = env(...) }` config in schema files in favor of a
  driver-adapter model (`prisma.config.ts` + an adapter package) — a bigger
  architecture change than this project needs right now. Staying on the 6.x
  line keeps the standard, well-documented setup. Revisit this if/when you
  do a deliberate Prisma major-version upgrade.

## Company Info

Brand identity that rarely changes (company name, tagline, founding year,
business hours, social links) lives in `src/lib/constants.ts`. Contact
details that change more often (phone, email, WhatsApp number, address, map
link) are **admin-editable at `/admin/settings`** and stored in the database
— `constants.ts` only supplies their initial seed values.

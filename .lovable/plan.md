## Plan: Apply RO meta to 11 static pages + verify /ro live

### 1. Update 11 RO route files
Replace RU fallback strings with the provided RO copy in `head().meta`. Touch only `title`, `description`, `og:title` (mirror title), `og:description`. Leave `og:image`, `links` (hreflang), `scripts` (JSON-LD), loader, component, error/notFound untouched. Remove the `// TODO: RO meta` comments.

Files:
- `src/routes/ro.index.tsx` — already has RO title/description; align with new exact strings ("Și împreună spre Hristos" / Eldorado Tur copy)
- `src/routes/ro.about.tsx`
- `src/routes/ro.destinations.index.tsx`
- `src/routes/ro.catalog.tsx`
- `src/routes/ro.calendar.tsx`
- `src/routes/ro.with-priest.tsx`
- `src/routes/ro.blog.tsx`
- `src/routes/ro.contacts.tsx` (keep JSON-LD as-is)
- `src/routes/ro.public-offer.tsx`
- `src/routes/ro.privacy.tsx`
- `src/routes/ro.orthodox-calendar.tsx`

For each: set `name=author` to "Pelerin" where it currently says "Паломник" (consistency with RO title brand). All other fields unchanged.

### 2. Typecheck
Run `bunx tsc --noEmit`. Must be green.

### 3. Publish
Call `preview_ui--publish` to `path-with-care.lovable.app` with website_info_status=added_or_updated, summary noting RO meta updates on 11 static pages.

### 4. Live verification (production, view-source, no JS)
Poll until `/ro` returns 200 (curl with retry). Then verify:
- `curl -sI` status for: `/`, `/login`, `/admin`, `/destinations/bari`, `/blog`, `/ro`, `/ro/destinations/bari`, `/ro/blog`, `/ro/about`, `/ro/contacts` — all 200
- `curl -s /ro/destinations/bari` view-source contains: `<link rel="canonical" href=".../ro/destinations/bari">`, hreflang ru/ro/x-default alternates pointing at correct RU and RO URLs
- `curl -s /ro` shows RO `<title>` ("Pelerin – Și împreună spre Hristos") and `<html lang="ro">`
- `curl -s /ro/destinations/bari` shows Romanian body HTML
- `curl -s /sitemap.xml` includes both RU and RO entries with `xhtml:link` alternates
- RU pages unchanged (spot-check `/destinations/bari` title still RU)

For the RU↔RO switcher round-trip: confirmed via source by checking that `/ro` HTML contains an anchor to `/` (RU link) and `/` HTML contains an anchor to `/ro` in the Header (no JS needed to verify the href).

### 5. Report
List all 11 files changed, typecheck result, publish result, and per-URL live verification results (status + spot-checked head tags).

### Out of scope
- No code logic changes
- No component, hreflang helper, sitemap, or layout changes
- No new routes

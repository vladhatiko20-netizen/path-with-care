# Plan: fix mobile admin + publish clergy on the public page

## Problem 1 — mobile admin: no pencil/edit on the clergy row

On `/admin/clergy` the list is a wide `<table>` with the action buttons (pencil + trash) in the **last column**. On a narrow viewport the table overflows horizontally and the actions column is clipped off-screen, so on mobile there is no way to open a row for editing. Other admin lists (blog, pilgrimages) have the same pattern but the user hit it here first.

**Fix:** make the list responsive. On `sm` and up keep the current table. On mobile render a stacked card list with the same data and the same `Pencil` / `Trash2` controls clearly visible.

- File: `src/routes/_admin/admin.clergy.index.tsx`
  - Wrap current `<table>` in `<div class="hidden sm:block">`.
  - Add a `<div class="sm:hidden space-y-3">` list of cards. Each card shows: thumbnail (or `User` icon fallback), `name_ru`, `title_ru`, status badge, sort order, and a row with **Edit** (`Link` to `/admin/clergy/$id`) and **Delete** buttons sized for touch (min ~40px).
  - Keep all existing handlers / queries — pure presentation change.

No changes to other admin sections in this step (user only flagged clergy; we'll mirror the pattern there in a follow-up if they ask).

## Problem 2 — show published clergy on the public "Dialog with priest" page

Currently `src/page-views/WithPriestPage.tsx` renders a hardcoded `priests` array (3 entries, local image imports). We need to replace it with data from `public.clergy` where `is_published = true`, ordered by `sort_order, created_at`.

### Data layer
- New file `src/lib/clergy.functions.ts`:
  - `listPublishedClergy = createServerFn({ method: "GET" }).handler(...)` — public, no auth middleware. Uses `supabaseAdmin` loaded **inside** the handler (per server-fn import rules) to select only safe columns: `id, name_ru, name_ro, title_ru, title_ro, bio_ru, bio_ro, photo_url, sort_order` where `is_published = true` ordered by `sort_order asc, created_at asc`. Returns plain DTO array.
  - (Admin-elevated read is fine here even though RLS already permits anon read of published rows — keeps the public-route SSR path uniform with the rest of the site and avoids relying on anon grants.)

### Route loaders (RU + RO)
- `src/routes/with-priest.tsx` and `src/routes/ro.with-priest.tsx`: add a `loader` that primes a React Query cache entry via `context.queryClient.ensureQueryData(...)` with `queryKey: ["clergy", "published"]`.

### Page view
- `src/page-views/WithPriestPage.tsx`:
  - Remove the hardcoded `priests` array and the 3 local `team-priest*.jpg` imports.
  - `useSuspenseQuery` to read the list.
  - Render cards using DB fields. Per language pick `name_ru/ro`, `title_ru/ro`, `bio_ru/ro`. Use `photo_url` if present, else a neutral placeholder block with the `User` icon (no broken image).
  - Keep the rest of the page (hero, FAQ, contact form) unchanged.
  - Grid: keep `md:grid-cols-3` when >= 3, but render whatever count exists (1 priest shows centered single card, 2 priests show 2-up). Use `md:grid-cols-3` with `justify-items-center` and a `max-w-sm` on each card so a single card doesn't stretch full width.
  - Section heading stays as is. If the query returns `[]`, hide the entire priests section (don't show an empty grid).

### What is NOT in this step
- No changes to the homepage. (User can ask next; current homepage priest section is in `IndexPage.tsx` and uses different hardcoded data — keeping scope tight.)
- No edits to other admin list pages.
- No changes to the FAQ or contact form on the priest page.

## Files touched

- `src/routes/_admin/admin.clergy.index.tsx` — add mobile card layout
- `src/lib/clergy.functions.ts` — new public server fn
- `src/routes/with-priest.tsx` — add loader
- `src/routes/ro.with-priest.tsx` — add loader
- `src/page-views/WithPriestPage.tsx` — replace hardcoded list with DB-driven render

## Verification

- Typecheck green.
- Manual: `/admin/clergy` on mobile viewport shows edit/delete per row; tapping pencil opens the edit page.
- `/with-priest` and `/ro/with-priest` show the newly added priest in the correct language; if nothing is published, the priests block is hidden.

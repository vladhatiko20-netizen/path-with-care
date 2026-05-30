All changes live in the universal template (`src/routes/destinations.$slug.tsx`) and its data layer. `destinations.bari.tsx` stays untouched.

## 1. Short breadcrumb title

Add optional `short_title_ru` / `short_title_ro` to `destinations`.

- **Migration**: `ALTER TABLE public.destinations ADD COLUMN short_title_ru text, ADD COLUMN short_title_ro text;` (nullable, no GRANT/RLS change needed).
- **Server functions** (`src/lib/destinations.functions.ts`): add the two columns to `PublicDestination` and `getDestinationBySlug` select.
- **Admin schema** (`src/lib/admin.functions.ts`): add to `destSchema` as `z.string().max(120).nullable().optional()`.
- **Admin form** (`src/components/admin/DestinationForm.tsx`): add a RU/RO pair under the main title fields, label "Короткое название (для крошек)", helper text "Если пусто — используется первое слово полного названия. Пример: «Бари»."
- **Both admin routes**: include `short_title_ru` / `short_title_ro` in form initial values (null for new).
- **Universal route**: compute
  ```ts
  const shortTitle =
    pickL(destination.short_title_ru, destination.short_title_ro) ||
    (pickL(destination.title_ru, destination.title_ro) || "").split(/\s|[-–—]/)[0];
  ```
  Replace `{title}` in the breadcrumb `<li>` only with `{shortTitle}`. H1 / hero / SEO untouched.

## 2. Lightbox bottom captions

The DB column is `alt_ru`/`alt_ro` (admin already labels them "Подпись"). No DB change.

In `destinations.$slug.tsx`:
- Extend `galleryPhotos` slide objects with `description: pickL(g.alt_ru, g.alt_ro) ?? ""`.
- Install + register the `Captions` plugin from `yet-another-react-lightbox`:
  ```ts
  import Captions from "yet-another-react-lightbox/plugins/captions";
  import "yet-another-react-lightbox/plugins/captions.css";
  ```
  Pass `plugins={[Thumbnails, Captions]}` and `captions={{ descriptionTextAlign: "center", showToggle: false }}`. Captions plugin defaults render at the bottom; empty descriptions render nothing.
- The package is already installed (used for Thumbnails). No `bun add` needed.

## 3. "О поездке" inline ✦

- **Mobile block** (the standalone `<span>✦</span>` above the H2, lines ~340-349): remove the separate `<span>` and the section's `py-12`; inline the diamond inside the `<h2>`:
  ```tsx
  <h2 className="text-3xl text-foreground font-light mb-5">
    <span className="text-accent mr-2" aria-hidden="true">✦</span>
    {t("О поездке", "Despre pelerinaj")}
  </h2>
  ```
  Reduce the section padding (`py-12` → `pt-6 pb-12`) to remove the empty gap above.
- **Desktop block** (line ~303): same inline ✦ prefix for visual consistency across breakpoints.

## 4. Mobile shrine UX

In the shrines section (lines ~352-397):

- **Smooth-scroll on expand**: in `handleShrineClick`, when entering expanded state on mobile, defer with `requestAnimationFrame` and scroll the expanded panel into view:
  ```ts
  requestAnimationFrame(() => {
    const el = document.getElementById(`shrine-expand-${i}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  ```
  Give the expanded `<div>` `id={`shrine-expand-${i}`}`.
- **Tap-anywhere-to-collapse**: make the expanded panel a `<button type="button">` (or div with role=button + keydown) that calls `setShrineExpand(null)` on click. Keep its current styling. Add `cursor-pointer` and an `aria-label={t("Свернуть", "Restrânge")}`.
- The existing chevron on the trigger continues to flip via `aria-expanded`.

## Order of execution

1. Run migration (Step 1 — needs approval before code).
2. Batch edit: `destinations.functions.ts`, `admin.functions.ts`, `DestinationForm.tsx`, both admin destination routes, `destinations.$slug.tsx`.
3. Verify build is clean. Bari route untouched.

No publish.

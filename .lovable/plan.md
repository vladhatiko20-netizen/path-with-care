3 frontend-only tweaks. en dash only.

## TASK 1 — Admin lead detail (desktop only)
`src/routes/_admin/admin.leads.$id.tsx`, mobile untouched:
- Header: `mb-6` → `mb-6 md:mb-2`
- Message `<div>` (`mb-8 md:mb-0`): add `md:-mt-6`
- `<h2>Сообщение от посетителя</h2>`: `mb-2` → `mb-2 md:mb-1`

Fixed bottom actions panel, `md:pb-24`, grid columns/gap untouched.

## TASK 2 — Drop cap
**`src/styles.css`** — add inside `@layer utilities`:
```css
.dropcap::first-letter,
.blog-body > p:first-child::first-letter,
.blog-body > p:first-of-type::first-letter {
  font-family: var(--font-serif);
  float: left;
  font-size: 3.2em;
  line-height: 0.9;
  padding: 0.05em 0.08em 0 0;
  margin-right: 0.06em;
  color: var(--color-accent);
  font-weight: 500;
}
```
`line-height: 0.9` keeps diacritics (Î Â Ș Ț Ă) clear. Token-based color, no hex.

**`src/page-views/DestinationSlugPage.tsx`** — add `dropcap` class to both intro `<p>` render sites (desktop hero + mobile hero). Cards / FAQ / shrines untouched.

**`src/page-views/BlogPostPage.tsx`** — wrapper `className="prose-blog"` → `className="prose-blog blog-body"`. CSS rule targets only the first direct child if it is a `<p>`; leading `<h2>`/`<img>` gets no drop cap.

## TASK 3 — Strictly future trips (corrected)
Same rule on both pages: a trip with `start_date === today` is hidden.

**`src/page-views/CalendarPage.tsx`** — in the existing `for (const trip of trips)` loop, before computing the month key:
```ts
const todayIso = new Date().toISOString().slice(0, 10);
for (const trip of trips) {
  if (trip.start_date <= todayIso) continue; // hide today and earlier
  // existing grouping unchanged
}
```
No slice/limit. Existing sort/group preserved.

**`src/page-views/IndexPage.tsx`** — in the "Ближайшие поездки" block, change the comparison operator:
```ts
.filter(p => p.start_date > todayIso) // was >= todayIso
```
Keep existing `.slice(0, 8)` and sort.

`/admin/pilgrimages` not touched — admin still sees all past trips.

## Files
- `src/routes/_admin/admin.leads.$id.tsx`
- `src/styles.css`
- `src/page-views/DestinationSlugPage.tsx`
- `src/page-views/BlogPostPage.tsx`
- `src/page-views/CalendarPage.tsx`
- `src/page-views/IndexPage.tsx`

No schema, no deps, no server-function changes. Mobile lead layout untouched. Admin pages untouched.

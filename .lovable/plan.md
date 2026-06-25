## Findings

- **Dropcap** still present in `src/styles.css` (the `.dropcap::first-letter` rule) and applied at two sites in `src/page-views/DestinationSlugPage.tsx` (L432 desktop, L476 mobile). `BlogPostPage.tsx` already has no dropcap class. No `blog-body` references remain.
- **Blog cards on home** (`IndexPage.tsx` L353–389) are wrapped in a single outer `<Link to="/blog">`. Each `<li>` is plain text prefixed with `–` and currently navigates to the blog list, not to the article.
- **Dash character** before each blog item (L375) is `–` = en dash **U+2013** (not the forbidden em dash). Nothing to remove on that front; it just needs to be replaced by the rhombus per Task 3.
- **Rhombus on destination Hero** is rendered as: `<span className="text-accent mr-2" aria-hidden="true">✦</span>` (DestinationSlugPage L429, L473). Same glyph, same `text-accent` token. Will reuse verbatim.

## Plan

### Task 1 — remove drop cap entirely
- `src/styles.css`: delete the whole `.dropcap::first-letter { ... }` block inside `@layer utilities`. No `.blog-body` selectors remain — nothing else to strip.
- `src/page-views/DestinationSlugPage.tsx`: remove the `dropcap ` token from both intro `<p>` classNames (L432 and L476), leaving all other classes intact.
- `src/page-views/BlogPostPage.tsx`: already clean — verify no `dropcap` token sneaks back. No edit needed unless grep finds one.
- Verify with `rg "dropcap|blog-body" src/` → must return zero matches.

### Task 2 — home blog cards link directly to each article
Nested `<Link>` is invalid, so the outer wrapper must be unlinked. Final shape of the BLOG TEASER block:
- Outer `<Link to="/blog">` becomes a plain `<div>` with the same grid classes; the `group` class moves to the image wrapper (so hover scale still works on the cover).
- The cover image becomes its own `<Link to={localize("/blog")} >` (still goes to list — image isn't an article card).
- Each `<li>` becomes a `<Link to={localize("/blog/$slug")} params={{ slug: post.slug }}>` matching exactly the pattern used in `BlogPage.tsx` L55 (`localize("/blog/$slug") as "/blog/$slug"`, `params={{ slug: p.slug }}`). Keep existing typography (`font-serif text-foreground/85 leading-snug border-b border-gold/20 pb-3 last:border-b-0`) and add a hover affordance (`hover:text-accent transition-colors`) consistent with other clickable items on the page.
- The "Все истории →" CTA becomes a `<Link to={localize("/blog")}>` (was a `<span>` inside the outer link).

No change to `BlogPage.tsx` itself.

### Task 3 — replace dash with rhombus before each blog item
Inside the per-post `<Link>`, replace the leading `– ` text node with the exact same span used on the destination Hero:

```tsx
<span className="text-accent mr-2" aria-hidden="true">✦</span>
{title}
```

Same glyph (`✦`), same `text-accent` color token, same `mr-2` spacing. No new icon, no new shade. Reported above: the current marker is U+2013 (en dash), not U+2014, so no forbidden character is involved.

### Verification
- `rg "dropcap|blog-body" src/` → 0 matches.
- `rg "U+2014" / em dash` not introduced (only U+2013 in source, and only as data, not as a UI marker on the blog list).
- Manually confirm in preview: home blog items each navigate to `/blog/<slug>` (and `/ro/blog/<slug>` under RO), with a ✦ marker matching the destination Hero rhombus.

No schema, dependency, or server-function changes.
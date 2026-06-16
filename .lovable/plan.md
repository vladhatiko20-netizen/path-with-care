
## Column-name confirmation

Live schema check on `blog_posts`: `excerpt_ru` / `excerpt_ro` (no `description_*` column). Fallback chain stays as originally planned.

## Migration — already applied

Ran successfully:

```sql
ALTER TABLE public.blog_posts
  ADD COLUMN seo_title_ru       text,
  ADD COLUMN seo_title_ro       text,
  ADD COLUMN seo_description_ru text,
  ADD COLUMN seo_description_ro text;
```

(Two pre-existing linter warnings — public-bucket listing and `has_role` SECURITY DEFINER — are unrelated to this change and out of scope per your constraints.)

## Code batch (needs build mode)

1. **`src/lib/admin.functions.ts`** — extend `blogSchema` with the four nullable optional fields (255 / 500 max, matching `destSchema`).

2. **`src/lib/blog.functions.ts`** — add the four columns to the detail `select()` and to `BlogPostFull`.

3. **`src/routes/blog_.$slug.tsx`** (RU `head()`):
   ```
   const baseTitle = post.seo_title_ru || post.title_ru;
   const desc      = post.seo_description_ru || post.excerpt_ru || post.title_ru;
   ```
   `title: \`${baseTitle} — Паломник\``, `ogTitle: baseTitle`.

4. **`src/routes/ro.blog_.$slug.tsx`** (RO `head()`):
   ```
   const baseTitle = post.seo_title_ro || post.title_ro || post.title_ru;
   const desc      = post.seo_description_ro || post.excerpt_ro || post.excerpt_ru || baseTitle;
   ```

5. **`src/routes/_admin/admin.blog.$id.tsx`** and **`admin.blog.new.tsx`** — pass the four new fields through `initial` (existing row values or `null`).

6. **`src/components/admin/BlogPostForm.tsx`**:
   - Extend `Initial` with the four fields.
   - Add a new `<section>` matching the destinations SEO block exactly: `<h2 className="font-serif text-xl border-b border-border pb-2">SEO</h2>`, 2-column grid, same labels ("SEO заголовок (RU/RO)", "SEO описание (RU/RO)"), `maxLength={255}` on titles, `maxLength={500}` on descriptions.
   - **Live character counter** under each field (your clarification 2). Small component:
     ```tsx
     function CharCounter({ value, recommended }: { value: string | null; recommended: number }) {
       const len = (value ?? "").length;
       const over = len > recommended;
       return (
         <p className={`mt-1 text-xs ${over ? "text-destructive" : "text-muted-foreground"}`}>
           {len} / {recommended} символов{over ? " — Google может обрезать" : ""}
         </p>
       );
     }
     ```
     Used with `recommended={60}` on titles, `recommended={160}` on descriptions. Counter updates as Anya types; goes red past the recommended limit with an inline explanation. Hard input cap stays 255 / 500.
   - Helper line below the section: "Если поля не заполнены — используются заголовок и краткое описание статьи."

7. **No `og_image` field** for blog (cover image serves as `og:image`, as you confirmed).

## Out of scope (unchanged)

Destinations form, pilgrimages form, RLS, alt-text for cover/body images.

Switch to build mode and I'll apply this batch.

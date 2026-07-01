## Part 1 — Footer (cosmetic, implement on approval)

**File:** `src/components/site/Footer.tsx`

1a. **Remove license line.** Delete the `<p>` block (lines ~73–78) containing «Лицензия: Министерство культуры Республики Молдова» / «Licență: Ministerul Culturii al Republicii Moldova». Keep the `BLESSING_BY` paragraph, the `© 2026 Eldorado Tur SRL` line, and the privacy link container.

1b. **Enlarge «Конфиденциальность» link.** The wrapper `<div className="mt-4 flex gap-4 text-xs text-muted-foreground">` uses `text-xs`. Change to `text-sm` to match sibling footer link sizes (e.g. the «Разделы» list). Position and `to={localize("/privacy")}` unchanged.

## Part 2 — Remove Hero on /contacts and /with-priest (awaiting approval)

The hero block currently holds the overline + h1. Replace it with a compact in-container header matching the `/privacy` pattern, so the h1 is preserved.

### `src/page-views/ContactsPage.tsx`
- Delete the entire `<section className="relative h-[46vh] ...">…</section>` (lines ~20–29) including the `<img src={heroImg} …/>`.
- Remove the now-unused `import heroImg from "@/assets/hero-contacts.jpg"` from the page view (route files keep theirs — see below).
- Insert a compact header at the top of the first content `<section>` (the `max-w-6xl` one), mirroring `/privacy`:
  ```tsx
  <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-12 pb-2">
    <p className="overline mb-5">{t("СВЯЗАТЬСЯ С НАМИ", "CONTACTAȚI-NE")}</p>
    <h1 className="font-serif text-3xl md:text-6xl font-light text-foreground leading-tight break-words">
      {t("Контакты", "Contacte")}
    </h1>
  </section>
  ```
  Existing contact-details + form sections stay exactly as they are (only their own top padding remains; no other content changes).

### `src/page-views/WithPriestPage.tsx`
- Delete the hero `<section className="relative h-[46vh] ...">…</section>` (lines ~34–43).
- Remove the unused `import heroImg from "@/assets/hero-priest.jpg"` from this file.
- Insert the same compact header above the priests section:
  ```tsx
  <section className="max-w-5xl mx-auto px-6 pt-12 md:pt-12 pb-2">
    <p className="overline mb-5">{t("ДУХОВНОЕ СОПРОВОЖДЕНИЕ", "ÎNDRUMARE DUHOVNICEASCĂ")}</p>
    <h1 className="font-serif text-3xl md:text-6xl font-light text-foreground leading-tight break-words">
      {t("Диалог со священником", "Dialog cu preotul")}
    </h1>
  </section>
  ```
- Clergy cards, FAQ, and the question form below — untouched.

### og:image preservation
The route files (`src/routes/contacts.tsx`, `ro.contacts.tsx`, `with-priest.tsx`, `ro.with-priest.tsx`) import `heroImg` and pass it to `buildPageMeta({ ogImage: heroImg })`. **Not touched.** Social-share previews continue to use the same image — only the on-page rendering is removed.

### Out of scope (confirm)
- No changes to any other page's hero (Index, Blog, About, Calendar, Destinations, Catalog all keep theirs).
- No copy changes; overline + h1 text preserved verbatim in both languages.
- No layout changes to clergy cards, contact details, map iframe, or contact form.

On approval I'll implement Part 1 + Part 2 together.

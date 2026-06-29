Wave D1 — Fill in real Privacy Policy text (RU + RO)

## Scope
Single file: `src/page-views/PrivacyPage.tsx`. Do not touch any other file.

## What to change
Replace the single placeholder `<p className="text-lg font-serif italic text-muted-foreground">` after the `<h1>` with the full privacy policy body, wired through the existing `t(ru, ro)` / `useLang()` mechanism.

## Content rules
- Insert both RU and RO texts exactly as provided — no paraphrasing, summarizing, translating, or shortening.
- Render each `##` section line as an `<h2>` subheading (use the page's existing heading style: `font-serif`, etc.).
- Render all lines under a `##` as `<p>` paragraphs.
- In the "Кто обрабатывает ваши данные" / "Cine prelucrează datele" block, keep the IDNO, address, phone, and email lines each on their own line (use `<br />` or separate `<p>` tags).
- Do NOT introduce any em-dash (U+2014). Use the existing short dashes as written.

## What to keep intact
- The `<h1>` heading text and its `text-3xl md:text-6xl` sizing.
- The `<section lang={lang}>` wrapper.
- The `PageShell` wrapper.
- The `overline` paragraph above the h1.

## Deliverable
After implementation, report: both RU and RO bodies are in place, confirm no em-dash was introduced, and confirm the contact block lines render separately.
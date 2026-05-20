## Fix: Restore Hero heading visibility on mobile

### Problem
The previous mobile optimization incorrectly applied `max-md:max-h-[250px] max-md:min-h-0` to the entire Hero `<section>` container, not just the background image. This caps the whole hero at 250px on mobile, causing the heading text to be cropped at the top.

### Fix
Remove the two mobile constraint classes from the Hero section in `src/routes/index.tsx`:

**Line 110** — change:
```
<section className="relative max-md:max-h-[250px] max-md:min-h-0 h-[58vh] ...">
```
to:
```
<section className="relative h-[58vh] ...">
```

This restores the previous mobile behavior where the hero section uses `h-[58vh]` with `min-h-[480px]`, giving the heading adequate vertical space. Desktop (`md:`) styles remain untouched. No other sections or styles are modified.
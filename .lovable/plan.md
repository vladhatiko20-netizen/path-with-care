## Goal

Before changing any caption logic again, find out *which* assumption is false on a real desktop browser:

1. Does `useIsDesktop()` actually return `true` when the lightbox opens?
2. Is the `lb-desktop` class actually present on the lightbox root DOM node?
3. Is the `Captions` plugin actually filtered out of the plugins array on desktop?
4. Is our `render.slideFooter` actually being invoked per slide?

Only after we have the answers do we touch CSS / JSX again.

## What I will add (temporary, behind a single flag)

All changes confined to `src/components/site/LightboxCaption.tsx`. No edits to pages or CSS yet.

1. **`useIsDesktop` logging** — log once per change:
   `console.log('[lb] useIsDesktop ->', match, 'mql.matches=', window.matchMedia('(min-width:768px)').matches)`.

2. **`useLightboxCaptionProps` logging** — log on every call:
   `console.log('[lb] captionProps branch =', isDesktop ? 'desktop' : 'mobile')`.

3. **`useLightboxPlugins` logging** — log the resulting plugin list length + whether Captions was filtered:
   `console.log('[lb] plugins isDesktop=', isDesktop, 'count=', result.length, 'capRemoved=', allPlugins.length !== result.length)`.

4. **`DesktopSlideFooter` logging** — log on mount + when width is applied:
   `console.log('[lb] slideFooter mounted, desc=', description.slice(0,40))`
   `console.log('[lb] slideFooter img width =', w)`.

5. **DOM probe** — inside `useLightboxCaptionProps`, when `isDesktop`, add a one-shot `useEffect` that on the next animation frame finds `.yarl__root` (or `.yarl__portal`) and logs:
   - its `className` (does it contain `lb-desktop`?)
   - whether `.yarl__slide_description` exists in the DOM
   - computed `display` of that node
   - computed `max-height` of the active `.yarl__slide_image`

## How user will report

Open the live site on a full-screen desktop browser, open the Bari gallery, open DevTools console, copy all `[lb] …` lines and paste them back. Those four numbers tell us unambiguously which step is broken:

- If `useIsDesktop -> false` → matchMedia / hydration bug → fix the hook.
- If `useIsDesktop -> true` but className on `.yarl__root` lacks `lb-desktop` → the Lightbox `className` prop is not being threaded the way we assumed → switch to a wrapper class on a parent / use `styles` API / portal-mount target.
- If class is present but `.yarl__slide_description` `display` is not `none` → CSS specificity / load-order problem → adjust selector.
- If `slideFooter mounted` never logs → `render.slideFooter` slot name is wrong for this version → use the correct slot.
- If `slideFooter img width = 0` consistently → ResizeObserver attaches before image, need a different anchor.

## Files touched

- `src/components/site/LightboxCaption.tsx` — diagnostics only.

No edits to `AboutPage.tsx`, `DestinationSlugPage.tsx`, or `styles.css` in this step.

## Next step (after logs)

Apply the *single* targeted fix indicated by the logs, then remove the diagnostics.

import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import type Lightbox from "yet-another-react-lightbox";

type LightboxProps = ComponentProps<typeof Lightbox>;
type CaptionProps = Partial<
  Pick<LightboxProps, "className" | "render" | "captions" | "styles" | "carousel">
>;

/**
 * Live matchMedia hook. Re-evaluates on viewport changes (resize, rotation),
 * so the desktop/mobile decision is never frozen at first paint.
 * SSR-safe: defaults to false until mounted.
 */
function useIsDesktop(query = "(min-width: 768px)") {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const update = () => {
      setMatch(mql.matches);
    };
    update();
    if (mql.addEventListener) mql.addEventListener("change", update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", update);
      else mql.removeListener(update);
    };
  }, [query]);
  return match;
}

/**
 * Desktop slideFooter: caption rendered in the black area below the photo,
 * with width bound to the live rendered width of the .yarl__slide_image via
 * ResizeObserver. Works for portrait + landscape automatically.
 */
function DesktopSlideFooter({ description }: { description: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const slide = node.closest(".yarl__slide");
    if (!slide) return;

    let img: HTMLImageElement | null = null;
    let ro: ResizeObserver | null = null;
    let raf = 0;
    let cancelled = false;

    const apply = () => {
      if (!img) return;
      const w = img.getBoundingClientRect().width;
      if (w > 0) {
        node.style.setProperty("--lb-img-w", `${Math.round(w)}px`);
      }
    };

    const attach = () => {
      if (cancelled) return;
      img =
        (slide.querySelector("img.yarl__slide_image") as HTMLImageElement | null) ??
        (slide.querySelector("img") as HTMLImageElement | null);
      if (!img) {
        raf = window.requestAnimationFrame(attach);
        return;
      }
      ro = new ResizeObserver(apply);
      ro.observe(img);
      if (img.complete) apply();
      else img.addEventListener("load", apply, { once: true });
    };
    attach();

    const onWin = () => apply();
    window.addEventListener("resize", onWin);
    window.addEventListener("orientationchange", onWin);

    return () => {
      cancelled = true;
      if (raf) window.cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", onWin);
      window.removeEventListener("orientationchange", onWin);
    };
  }, [description]);

  if (!description) return null;
  return (
    <div ref={ref} className="lb-desktop-caption">
      <p>{description}</p>
    </div>
  );
}

/**
 * Returns Lightbox props that move the caption below the image on desktop
 * (≥768px) while keeping the Captions overlay plugin on mobile.
 * Spread onto <Lightbox {...captionProps} />.
 */
export function useLightboxCaptionProps(): CaptionProps {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return {
      className: "lb-caption-below",
      // Make the slide a vertical stack: image on top, caption (slideFooter)
      // below in normal document flow. No absolute positioning -> no overlap.
      styles: {
        slide: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          paddingBottom: "24px",
        },
      },
      // Constrain image height through YARL's own image-prop channel so our
      // sizing isn't fighting library inline styles. Generous reservation so
      // long captions (e.g. St. Catherine's monastery, 4-5 lines) + the
      // thumbnails strip fit below the image without colliding.
      carousel: {
        imageProps: { style: { maxHeight: "calc(100vh - 320px)" } },
      },
      render: {
        slideFooter: ({ slide }) => {
          const desc = (slide as { description?: string }).description;
          return desc ? <DesktopSlideFooter description={desc} /> : null;
        },
      },
    };
  }
  return {
    className: "lb-caption-below",
    captions: { descriptionTextAlign: "center", showToggle: false },
  };
}

/**
 * Drops the Captions plugin on desktop (we render the caption ourselves via
 * slideFooter) and keeps it on mobile.
 */
export function useLightboxPlugins<T>(allPlugins: T[], captionsPlugin: T): T[] {
  const isDesktop = useIsDesktop();
  return isDesktop ? allPlugins.filter((p) => p !== captionsPlugin) : allPlugins;
}
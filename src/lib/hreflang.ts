import { SITE_ORIGIN } from "./constants";

export type Lang = "ru" | "ro";

/**
 * Builds canonical + RU/RO/x-default hreflang alternates for a RU path.
 * `pathRu` MUST be the RU-side path (e.g. "/", "/destinations/bari").
 * RO equivalent is "/ro" + pathRu (with "/" → "").
 */
export function buildHreflang(pathRu: string, lang: Lang) {
  const ru = `${SITE_ORIGIN}${pathRu}`;
  const ro = `${SITE_ORIGIN}/ro${pathRu === "/" ? "" : pathRu}`;
  const self = lang === "ru" ? ru : ro;
  return {
    canonical: { rel: "canonical", href: self } as const,
    alternates: [
      { rel: "alternate", hrefLang: "ru", href: ru },
      { rel: "alternate", hrefLang: "ro", href: ro },
      { rel: "alternate", hrefLang: "x-default", href: ru },
    ] as const,
  };
}

/** Convenience: returns `[canonical, ...alternates]` ready to spread into `links`. */
export function hreflangLinks(pathRu: string, lang: Lang) {
  const h = buildHreflang(pathRu, lang);
  return [h.canonical, ...h.alternates];
}
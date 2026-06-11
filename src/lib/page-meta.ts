import type { Lang } from "./hreflang";

/**
 * Meta entries accepted by TanStack Router's `head().meta` array.
 * Kept loose on purpose — TanStack accepts any object with string fields.
 */
export type MetaEntry = Record<string, string>;

export interface BuildPageMetaInput {
  lang: Lang;
  /** Full <title> string. */
  title: string;
  /** Meta description. Mirrored into og:description and twitter:description. */
  description: string;
  /** Optional og:title override. Defaults to `title`. Twitter mirrors og. */
  ogTitle?: string;
  /** Optional og:description override. Defaults to `description`. */
  ogDescription?: string;
  /** Optional image URL for og:image + twitter:image. */
  ogImage?: string;
  /** og:type. Defaults to "website". */
  ogType?: "website" | "article" | "product";
  /** twitter:card. Defaults to "summary_large_image" if ogImage is set, otherwise "summary". */
  twitterCard?: "summary" | "summary_large_image";
  /** Optional og:url (absolute). */
  ogUrl?: string;
}

/**
 * Single source of truth for per-page meta. Guarantees that twitter:* and og:*
 * never drift apart — twitter values are DERIVED from og values inside this
 * function, not duplicated by callers.
 *
 * Use in every route's `head().meta`. RU and RO routes call this with their
 * own `lang` and translated strings; the structure is identical.
 */
export function buildPageMeta(input: BuildPageMetaInput): MetaEntry[] {
  const {
    lang,
    title,
    description,
    ogTitle = title,
    ogDescription = description,
    ogImage,
    ogType = "website",
    twitterCard = ogImage ? "summary_large_image" : "summary",
    ogUrl,
  } = input;

  const author = lang === "ro" ? "Pelerin" : "Паломник";

  const meta: MetaEntry[] = [
    { title },
    { name: "description", content: description },
    { name: "author", content: author },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:type", content: ogType },
    { name: "twitter:card", content: twitterCard },
    // twitter MIRRORS og — derived from the same source, cannot drift.
    { name: "twitter:title", content: ogTitle },
    { name: "twitter:description", content: ogDescription },
  ];

  if (ogUrl) {
    meta.push({ property: "og:url", content: ogUrl });
  }
  if (ogImage) {
    meta.push({ property: "og:image", content: ogImage });
    meta.push({ name: "twitter:image", content: ogImage });
  }

  return meta;
}
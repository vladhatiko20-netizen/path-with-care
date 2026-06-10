import { useRouterState } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export const SITE = "https://path-with-care.lovable.app";

/** Strip a leading /ro segment from a path. Returns RU-equivalent path. */
export function stripRoPrefix(pathname: string): string {
  if (pathname === "/ro") return "/";
  if (pathname.startsWith("/ro/")) return pathname.slice(3);
  return pathname;
}

/** Prepend /ro to a RU-equivalent path. */
export function addRoPrefix(ruPath: string): string {
  if (ruPath === "/") return "/ro";
  return `/ro${ruPath}`;
}

/** Given the current pathname, return the equivalent path in the other language. */
export function toOtherLangPath(pathname: string): string {
  if (pathname === "/ro" || pathname.startsWith("/ro/")) return stripRoPrefix(pathname);
  return addRoPrefix(pathname);
}

/** Returns true when pathname is under the /ro/* subtree (or is exactly /ro). */
export function isRoPath(pathname: string): boolean {
  return pathname === "/ro" || pathname.startsWith("/ro/");
}

/**
 * Build hreflang + canonical link entries for a route.
 * @param ruPath RU-equivalent path (e.g. "/about", "/destinations/bari").
 * @param currentLang "ru" or "ro" — drives which URL becomes the self-referencing canonical.
 */
export function buildHreflang(ruPath: string, currentLang: "ru" | "ro") {
  const ruUrl = `${SITE}${ruPath === "/" ? "/" : ruPath}`;
  const roUrl = `${SITE}${addRoPrefix(ruPath)}`;
  const self = currentLang === "ru" ? ruUrl : roUrl;
  return [
    { rel: "canonical", href: self },
    { rel: "alternate", hreflang: "ru", href: ruUrl },
    { rel: "alternate", hreflang: "ro", href: roUrl },
    { rel: "alternate", hreflang: "x-default", href: ruUrl },
  ];
}

/**
 * Hook returning a localizer that prefixes RU paths with /ro when the user is
 * currently on a Romanian URL. RU users get the same path back unchanged.
 * Always derives from URL — never from in-memory state.
 */
export function useLocalizedTo(): (ruPath: string) => string {
  const { lang } = useLang();
  return (ruPath: string) => (lang === "ro" ? addRoPrefix(ruPath) : ruPath);
}

/** Returns the path equivalent in the *other* language for the current location. */
export function useOtherLangPath(): string {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return toOtherLangPath(pathname);
}

/** Returns the active language as derived from the URL — single source of truth. */
export function useUrlLang(): "ru" | "ro" {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return isRoPath(pathname) ? "ro" : "ru";
}
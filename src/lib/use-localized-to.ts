import { useRouterState } from "@tanstack/react-router";

/** True if the currently matched pathname is under `/ro`. */
export function useIsRo(): boolean {
  return useRouterState({
    select: (s) => s.location.pathname === "/ro" || s.location.pathname.startsWith("/ro/"),
  });
}

/**
 * Returns a function that maps a RU path to its localized equivalent
 * for the currently active language.
 *
 *   const localize = useLocalizedTo();
 *   <Link to={localize("/destinations")}>...</Link>
 */
export function useLocalizedTo(): (ruPath: string) => string {
  const isRo = useIsRo();
  return (ruPath: string) => {
    if (!isRo) return ruPath;
    if (ruPath === "/") return "/ro";
    return `/ro${ruPath}`;
  };
}

/** Strips a leading "/ro" prefix from the current pathname, returning the RU equivalent. */
export function stripRoPrefix(pathname: string): string {
  if (pathname === "/ro") return "/";
  if (pathname.startsWith("/ro/")) return pathname.slice(3);
  return pathname;
}
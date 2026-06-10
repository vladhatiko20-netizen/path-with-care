import { createContext, useContext, useEffect, type ReactNode } from "react";

export type Lang = "ru" | "ro";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (ru: string, ro: string) => string;
};

const LangContext = createContext<Ctx>({
  lang: "ru",
  setLang: () => {},
  t: (ru) => ru,
});

/**
 * Language is taken from the URL via the route layout (RU root provides "ru",
 * /ro layout provides "ro"). localStorage is NOT the source of truth — it only
 * persists the user's last manual click, never drives the first SSR render.
 */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      window.localStorage.setItem("palomnik-lang", lang);
    } catch {}
  }, [lang]);

  // setLang kept for API compatibility; the switcher uses URL navigation now.
  const setLang = (l: Lang) => {
    try {
      window.localStorage.setItem("palomnik-lang", l);
    } catch {}
  };

  const t = (ru: string, ro: string) => (lang === "ru" ? ru : ro);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

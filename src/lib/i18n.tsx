import { createContext, useContext, type ReactNode } from "react";

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
 * Language is determined by the route subtree, not by client state.
 * `/ro/*` routes wrap children in `<LangProvider lang="ro">`, everything
 * else inherits the default `lang="ru"` from the root. setLang is a no-op
 * kept for API compatibility — callers should navigate to switch language.
 */
export function LangProvider({ children, lang = "ru" }: { children: ReactNode; lang?: Lang }) {
  const t = (ru: string, ro: string) => (lang === "ru" ? ru : ro);
  return (
    <LangContext.Provider value={{ lang, setLang: () => {}, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);

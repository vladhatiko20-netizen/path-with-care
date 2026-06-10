import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("palomnik-lang");
      if (stored === "ru" || stored === "ro") setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("palomnik-lang", l);
      document.documentElement.lang = l;
    } catch {}
  };

  const t = (ru: string, ro: string) => (lang === "ru" ? ru : ro);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

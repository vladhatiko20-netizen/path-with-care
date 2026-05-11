import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", ru: "Главная", ro: "Acasă" },
    { to: "/destinations", ru: "Направления", ro: "Destinații" },
    { to: "/calendar", ru: "Календарь", ro: "Calendar" },
    { to: "/with-priest", ru: "Со священником", ro: "Cu preotul" },
    { to: "/blog", ru: "Блог", ro: "Blog" },
    { to: "/catalog", ru: "Атрибутика", ro: "Iconografie" },
    { to: "/about", ru: "О нас", ro: "Despre" },
    { to: "/contacts", ru: "Контакты", ro: "Contacte" },
  ] as const;

  return (
    <header className="bg-background border-b border-gold/30 sticky top-0 z-40 backdrop-blur-sm bg-background/95">
      {/* Top thin bar */}
      <div className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-[11px] text-muted-foreground">
          <a
            href="https://eldoradotur.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors tracking-wide"
          >
            {t("Подразделение Eldorado Tur ↗", "Diviziune Eldorado Tur ↗")}
          </a>
          <div className="flex items-center gap-3 font-serif text-xs">
            <button
              onClick={() => setLang("ru")}
              className={lang === "ru" ? "text-foreground gold-underline" : "hover:text-foreground transition-colors"}
              aria-label="Русский"
            >
              RU
            </button>
            <span className="text-border">·</span>
            <button
              onClick={() => setLang("ro")}
              className={lang === "ro" ? "text-foreground gold-underline" : "hover:text-foreground transition-colors"}
              aria-label="Română"
            >
              RO
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
        <Link to="/" className="flex flex-col leading-none group" aria-label="Home">
          <span className="font-serif text-2xl md:text-[28px] tracking-wide text-foreground">
            {t("Путь к Святыням", "Drum spre Sfinte Locuri")}
          </span>
          <span className="h-px w-12 bg-gold mt-1.5 group-hover:w-20 transition-all duration-500" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-serif text-[15px]">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground gold-underline" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {t(item.ru, item.ro)}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-foreground p-2"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden border-t border-border/50 bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1 font-serif">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-foreground/80 hover:text-foreground border-b border-border/30 last:border-0"
                activeProps={{ className: "text-foreground gold-underline" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {t(item.ru, item.ro)}
              </Link>
            ))}
            <a
              href="tel:+37368778676"
              className="py-3 mt-2 text-sm text-muted-foreground"
            >
              +373 68 77 86 76 — {t("Анна", "Anna")}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

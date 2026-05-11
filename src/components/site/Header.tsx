import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";
import thumbHome from "@/assets/menu-home.jpg";
import thumbDestinations from "@/assets/menu-destinations.jpg";
import thumbCalendar from "@/assets/menu-calendar.jpg";
import thumbPriest from "@/assets/menu-priest.jpg";
import thumbBlog from "@/assets/menu-blog.jpg";
import thumbCatalog from "@/assets/menu-catalog.jpg";
import thumbAbout from "@/assets/menu-about.jpg";
import thumbContacts from "@/assets/menu-contacts.jpg";

type NavItem = {
  to: string;
  ru: string;
  ro: string;
  thumb: string;
};

const navItems: NavItem[] = [
  { to: "/", ru: "Главная", ro: "Acasă", thumb: thumbHome },
  { to: "/destinations", ru: "Направления", ro: "Destinații", thumb: thumbDestinations },
  { to: "/calendar", ru: "Календарь поездок", ro: "Calendar", thumb: thumbCalendar },
  { to: "/with-priest", ru: "Диалог со священником", ro: "Dialog cu preotul", thumb: thumbPriest },
  { to: "/blog", ru: "Православный блог", ro: "Blog ortodox", thumb: thumbBlog },
  { to: "/catalog", ru: "Иконы и святыни", ro: "Icoane și obiecte sfinte", thumb: thumbCatalog },
  { to: "/about", ru: "О нас", ro: "Despre", thumb: thumbAbout },
  { to: "/contacts", ru: "Контакты", ro: "Contacte", thumb: thumbContacts },
];

export function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background border-b border-gold/30 sticky top-0 z-40 backdrop-blur-sm bg-background/95">
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
            >RU</button>
            <span className="text-border">·</span>
            <button
              onClick={() => setLang("ro")}
              className={lang === "ro" ? "text-foreground gold-underline" : "hover:text-foreground transition-colors"}
            >RO</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="Home"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span className="text-3xl md:text-4xl text-accent leading-none select-none" aria-hidden>☦</span>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-2xl md:text-[30px] tracking-[0.08em] text-foreground">
              {t("ПАЛОМНИК", "PELERIN")}
            </span>
            <span className="text-[11px] md:text-xs text-muted-foreground mt-1 font-serif italic tracking-wide">
              {t("Паломнические поездки из Кишинёва", "Pelerinaje din Chișinău")}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-serif text-[14px]">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-foreground/80 hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground gold-underline" }}
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

      {open && (
        <nav className="lg:hidden border-t border-border/50 bg-card max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain">
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col font-serif">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 py-4 px-3 border-b border-gold/20 last:border-0 hover:bg-secondary/50 transition-colors"
                activeProps={{ className: "bg-secondary/60" }}
              >
                <span className="flex-shrink-0 w-[60px] h-[60px] rounded-lg overflow-hidden bg-secondary border-2 border-gold/40 shadow-sm">
                  <img
                    src={item.thumb}
                    alt=""
                    loading="lazy"
                    width={60}
                    height={60}
                    className="w-full h-full object-cover"
                  />
                </span>
                <span className="font-serif text-foreground/90 text-[16px]">{t(item.ru, item.ro)}</span>
              </Link>
            ))}
            <a
              href="tel:+37368778676"
              className="flex items-center gap-4 py-4 px-3 mt-1 text-sm text-muted-foreground"
            >
              <span className="w-[60px] h-[60px] rounded-lg bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <Phone size={22} className="text-accent" />
              </span>
              +373 68 77 86 76 — {t("Анна", "Anna")}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

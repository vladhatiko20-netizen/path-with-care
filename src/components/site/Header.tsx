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
  { to: "/with-priest", ru: "Вопросы священнику", ro: "Întrebări preotului", thumb: thumbPriest },
  { to: "/blog", ru: "Блог", ro: "Blog", thumb: thumbBlog },
  { to: "/catalog", ru: "Святыни", ro: "Obiecte sfinte", thumb: thumbCatalog },
  { to: "/about", ru: "О нас", ro: "Despre", thumb: thumbAbout },
  { to: "/contacts", ru: "Контакты", ro: "Contacte", thumb: thumbContacts },
];

export function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background border-b border-gold/30 sticky top-0 z-40 backdrop-blur-sm bg-background/95">
      {/* Top bar — mobile only */}
      <div className="border-b border-border/40 lg:hidden">
        <div className="max-w-7xl mx-auto pl-3 pr-6 md:pl-2 md:pr-6 py-2 flex justify-between items-center text-[11px] text-muted-foreground">
          <a
            href="https://eldoradotur.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors tracking-wide text-[14px]"
          >
            {t("Eldorado Tur ↗", "Eldorado Tur ↗")}
          </a>
          <div className="flex items-center gap-2 font-serif">
            <button
              onClick={() => setLang("ru")}
              className={`px-3 py-1 rounded text-[15px] md:text-base font-medium tracking-wide transition-colors ${
                lang === "ru"
                  ? "bg-[#6b1f24] text-cream"
                  : "text-[#6b1f24] hover:bg-[#6b1f24]/10 border border-[#6b1f24]/40"
              }`}
            >RU</button>
            <button
              onClick={() => setLang("ro")}
              className={`px-3 py-1 rounded text-[15px] md:text-base font-medium tracking-wide transition-colors ${
                lang === "ro"
                  ? "bg-[#6b1f24] text-cream"
                  : "text-[#6b1f24] hover:bg-[#6b1f24]/10 border border-[#6b1f24]/40"
              }`}
            >RO</button>
          </div>
        </div>
      </div>

      <div className="pl-3 pr-3 lg:pl-8 lg:pr-0 py-4 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 group shrink-0"
          aria-label="Home"
          onClick={() => {
            setOpen(false);
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span className="text-3xl md:text-[3.75rem] text-accent leading-none select-none" aria-hidden>☦</span>
          <div className="flex flex-col leading-none items-center">
            <span className="font-serif font-semibold text-2xl md:text-[34px] tracking-[0.08em] text-foreground">
              {t("ПАЛОМНИК", "PELERIN")}
            </span>
            <span className="text-[15px] md:text-[17px] text-muted-foreground mt-1 font-serif italic tracking-wide text-center">
              {t("Путь к Святыням", "Cale spre sfinte locuri")}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 font-serif text-base xl:text-lg font-medium whitespace-nowrap">
          {navItems.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[#8a3a1f] hover:text-[#a04826] inline-block transition-all duration-300 ease-out hover:scale-105"
                activeProps={{ className: "text-[#a04826] gold-underline" }}
              >
                {t(item.ru, item.ro)}
              </Link>
          ))}
        </nav>

        <div className="hidden lg:flex flex-col items-end justify-between self-stretch pr-3">
          <div className="flex items-center gap-2 font-serif">
            <button
              onClick={() => setLang("ru")}
              className={`px-3 py-1 rounded text-[15px] font-medium tracking-wide transition-colors ${
                lang === "ru"
                  ? "bg-[#6b1f24] text-cream"
                  : "text-[#6b1f24] hover:bg-[#6b1f24]/10 border border-[#6b1f24]/40"
              }`}
            >RU</button>
            <button
              onClick={() => setLang("ro")}
              className={`px-3 py-1 rounded text-[15px] font-medium tracking-wide transition-colors ${
                lang === "ro"
                  ? "bg-[#6b1f24] text-cream"
                  : "text-[#6b1f24] hover:bg-[#6b1f24]/10 border border-[#6b1f24]/40"
              }`}
            >RO</button>
          </div>
          <a
            href="https://eldoradotur.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[17px] text-accent hover:text-accent/80 transition-colors tracking-wide font-serif italic mt-1"
          >
            Eldorado Tur ↗
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-foreground p-2"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/50 bg-card max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain animate-fade-in">
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

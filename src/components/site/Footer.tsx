import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useLocalizedTo } from "@/lib/use-localized-to";
import { BLESSING_BY } from "@/lib/constants";

export function Footer() {
  const { t } = useLang();
  const localize = useLocalizedTo();
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl text-accent" aria-hidden>☦</span>
            <h3 className="font-serif text-2xl tracking-[0.08em] text-foreground">
              {t("ПАЛОМНИК", "PELERIN")}
            </h3>
          </div>
          <p className="font-serif italic text-foreground/70 mb-3">
            {t("«И вместе ко Христу»", "„Și împreună spre Hristos”")}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("Подразделение SRL Eldorado Tur", "Diviziune SRL Eldorado Tur")}
          </p>
          <div className="mt-5 space-y-1.5 text-sm text-foreground/80">
            <p>bd. Dacia 20, of. 81, Chișinău</p>
            <p>
              <a href="tel:+37368778676" className="hover:text-gold transition-colors">+373 68 77 86 76 – {t("Анна", "Anna")}</a>
            </p>
            <p>
              <a href="tel:+37368787599" className="hover:text-gold transition-colors">+373 68 78 75 99 – {t("Наталья", "Natalia")}</a>
            </p>
            <p>
              <a href="mailto:palomnik.moldova@gmail.com" className="hover:text-gold transition-colors">
                palomnik.moldova@gmail.com
              </a>
            </p>
            <p>
              <a
                href="viber://chat?number=37368778676"
                className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
              >
                <MessageCircle className="w-4 h-4" style={{ color: "#7360F2" }} />
                Viber – {t("Анна", "Anna")}
              </a>
            </p>
          </div>
        </div>

        <div>
          <h4 className="overline mb-4">{t("Разделы", "Secțiuni")}</h4>
          <ul className="space-y-2 text-sm font-serif">
            <li><Link to={localize("/destinations") as "/destinations"} className="hover:text-gold transition-colors">{t("Направления", "Destinații")}</Link></li>
            <li><Link to={localize("/calendar") as "/calendar"} className="hover:text-gold transition-colors">{t("Календарь поездок", "Calendar de călătorii")}</Link></li>
            <li><Link to={localize("/with-priest") as "/with-priest"} className="hover:text-gold transition-colors">{t("Диалог со священником", "Dialog cu preotul")}</Link></li>
            <li><Link to={localize("/blog") as "/blog"} className="hover:text-gold transition-colors">{t("Блог", "Blog")}</Link></li>
            <li><Link to={localize("/catalog") as "/catalog"} className="hover:text-gold transition-colors">{t("Святыни", "Obiecte sfinte")}</Link></li>
            <li><Link to={localize("/about") as "/about"} className="hover:text-gold transition-colors">{t("О нас", "Despre")}</Link></li>
            <li><Link to={localize("/contacts") as "/contacts"} className="hover:text-gold transition-colors">{t("Контакты", "Contacte")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="overline mb-4">{t("Информация", "Informații")}</h4>
          {BLESSING_BY && (
            <p className="text-sm text-muted-foreground italic font-serif mb-3">
              {t(`По благословению ${BLESSING_BY}`, `Cu binecuvântarea ${BLESSING_BY}`)}
            </p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              "Лицензия: Министерство культуры Республики Молдова",
              "Licență: Ministerul Culturii al Republicii Moldova"
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-4">© 2026 Eldorado Tur SRL</p>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <Link to={localize("/privacy") as "/privacy"} className="hover:text-foreground">{t("Конфиденциальность", "Confidențialitate")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

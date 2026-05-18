import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-secondary mt-24 border-t border-border">
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
              <a href="tel:+37368778676" className="hover:text-gold transition-colors">+373 68 77 86 76</a>{" "}
              — {t("Анна", "Anna")}
            </p>
            <p>
              <a href="mailto:pilgrimage@eldoradotur.md" className="hover:text-gold transition-colors">
                pilgrimage@eldoradotur.md
              </a>
            </p>
          </div>
        </div>

        <div>
          <h4 className="overline mb-4">{t("Разделы", "Secțiuni")}</h4>
          <ul className="space-y-2 text-sm font-serif">
            <li><Link to="/destinations" className="hover:text-gold transition-colors">{t("Направления", "Destinații")}</Link></li>
            <li><Link to="/calendar" className="hover:text-gold transition-colors">{t("Календарь поездок", "Calendar de călătorii")}</Link></li>
            <li><Link to="/with-priest" className="hover:text-gold transition-colors">{t("Диалог со священником", "Dialog cu preotul")}</Link></li>
            <li><Link to="/blog" className="hover:text-gold transition-colors">{t("Блог", "Blog")}</Link></li>
            <li><Link to="/catalog" className="hover:text-gold transition-colors">{t("Святыни", "Obiecte sfinte")}</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">{t("О нас", "Despre")}</Link></li>
            <li><Link to="/contacts" className="hover:text-gold transition-colors">{t("Контакты", "Contacte")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="overline mb-4">{t("Информация", "Informații")}</h4>
          <p className="text-sm text-muted-foreground italic font-serif mb-3">
            {t("По благословению …", "Cu binecuvântarea …")}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t(
              "Лицензия: Министерство культуры Республики Молдова",
              "Licență: Ministerul Culturii al Republicii Moldova"
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-4">© 2026 Eldorado Tur SRL</p>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">{t("Конфиденциальность", "Confidențialitate")}</Link>
            <Link to="/public-offer" className="hover:text-foreground">{t("Публичная оферта", "Ofertă publică")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero-calendar.jpg";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Календарь поездок 2026 — Паломник" },
      { name: "description", content: "Полный календарь паломнических поездок на 2026 год по месяцам и направлениям." },
      { property: "og:title", content: "Календарь поездок 2026 — Паломник" },
      { property: "og:description", content: "Полный календарь паломнических поездок на 2026 год." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Page,
});

type Trip = { date: { ru: string; ro: string }; dest: { ru: string; ro: string }; dur: string; price: string; seats: string; urgent?: boolean };
type Month = { ru: string; ro: string; trips: Trip[] };

const months: Month[] = [
  { ru: "Январь 2026", ro: "Ianuarie 2026", trips: [] },
  { ru: "Февраль 2026", ro: "Februarie 2026", trips: [] },
  { ru: "Март 2026", ro: "Martie 2026", trips: [
    { date: { ru: "15 марта", ro: "15 martie" }, dest: { ru: "Бари + Корфу", ro: "Bari + Corfu" }, dur: "7", price: "€890", seats: "8" },
  ]},
  { ru: "Апрель 2026", ro: "Aprilie 2026", trips: [
    { date: { ru: "10 апреля", ro: "10 aprilie" }, dest: { ru: "Иерусалим (Страстная)", ro: "Ierusalim (Săpt. Patimilor)" }, dur: "10", price: "€1450", seats: "4", urgent: true },
  ]},
  { ru: "Май 2026", ro: "Mai 2026", trips: [
    { date: { ru: "5 мая", ro: "5 mai" }, dest: { ru: "Афон (мужчины)", ro: "Athos (bărbați)" }, dur: "6", price: "€920", seats: "5", urgent: true },
    { date: { ru: "20 мая", ro: "20 mai" }, dest: { ru: "Молдова — выходного дня", ro: "Moldova — weekend" }, dur: "2", price: "€60", seats: "20" },
  ]},
  { ru: "Июнь 2026", ro: "Iunie 2026", trips: [
    { date: { ru: "20 июня", ro: "20 iunie" }, dest: { ru: "Грузия", ro: "Georgia" }, dur: "7", price: "€680", seats: "12" },
  ]},
  { ru: "Июль 2026", ro: "Iulie 2026", trips: [
    { date: { ru: "5 июля", ro: "5 iulie" }, dest: { ru: "Румыния — Буковина", ro: "România — Bucovina" }, dur: "5", price: "€450", seats: "14" },
  ]},
  { ru: "Август 2026", ro: "August 2026", trips: [
    { date: { ru: "15 августа", ro: "15 august" }, dest: { ru: "Иерусалим (Успение)", ro: "Ierusalim (Adormirea)" }, dur: "9", price: "€1380", seats: "6", urgent: true },
  ]},
  { ru: "Сентябрь 2026", ro: "Septembrie 2026", trips: [
    { date: { ru: "10 сентября", ro: "10 septembrie" }, dest: { ru: "Румыния — монастыри", ro: "România — mănăstiri" }, dur: "5", price: "€450", seats: "14" },
  ]},
  { ru: "Октябрь 2026", ro: "Octombrie 2026", trips: [
    { date: { ru: "1 октября", ro: "1 octombrie" }, dest: { ru: "Корфу", ro: "Corfu" }, dur: "6", price: "€750", seats: "10" },
    { date: { ru: "20 октября", ro: "20 octombrie" }, dest: { ru: "Бари", ro: "Bari" }, dur: "5", price: "€780", seats: "12" },
  ]},
  { ru: "Ноябрь 2026", ro: "Noiembrie 2026", trips: [
    { date: { ru: "5 ноября", ro: "5 noiembrie" }, dest: { ru: "Молдова — выходного дня", ro: "Moldova — weekend" }, dur: "2", price: "€60", seats: "20" },
  ]},
  { ru: "Декабрь 2026", ro: "Decembrie 2026", trips: [
    { date: { ru: "5 декабря", ro: "5 decembrie" }, dest: { ru: "Бари (память Святителя)", ro: "Bari (Sf. Nicolae)" }, dur: "5", price: "€820", seats: "10" },
  ]},
];

function Page() {
  const { t, lang } = useLang();
  return (
    <PageShell>
      <section className="relative h-[40vh] md:h-[50vh] min-h-[320px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Православный календарь", "Calendar ortodox")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("РАСПИСАНИЕ 2026", "PROGRAM 2026")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Календарь поездок", "Calendar de călătorii")}
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 md:py-20">
        <p className="prose-warm text-base md:text-lg font-serif italic text-foreground/80 mb-10 max-w-3xl">
          {t(
            "Все паломнические поездки 2026 года по месяцам. Нажмите на строку, чтобы оставить заявку.",
            "Toate pelerinajele anului 2026 pe luni. Apăsați pe rând pentru a lăsa o cerere."
          )}
        </p>

        <div className="space-y-10">
          {months.map((m) => (
            <div key={m.ru}>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground font-light mb-4 pb-2 border-b border-gold/40">
                {lang === "ru" ? m.ru : m.ro}
              </h2>
              {m.trips.length === 0 ? (
                <p className="text-sm italic text-muted-foreground font-serif py-2">{t("Поездки уточняются.", "Călătorii în pregătire.")}</p>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full font-serif">
                    <tbody>
                      {m.trips.map((row, i) => (
                        <Link key={i} to="/contacts" className="contents">
                          <tr className="border-b border-gold/15 hover:bg-secondary/40 transition-colors cursor-pointer">
                            <td className="py-3 pr-3 text-accent text-lg leading-none align-middle w-8">☦</td>
                            <td className="py-3 pr-3 text-foreground/85 text-[15px] whitespace-nowrap">{row.date[lang]}</td>
                            <td className="py-3 pr-3 text-foreground text-[15px]">{row.dest[lang]}</td>
                            <td className="py-3 pr-3 text-foreground/70 text-[14px] hidden md:table-cell whitespace-nowrap">{row.dur} {t("дн.", "zile")}</td>
                            <td className="py-3 pr-3 text-gold font-medium text-[15px] whitespace-nowrap">{row.price}</td>
                            <td className={`py-3 italic text-sm whitespace-nowrap hidden sm:table-cell ${row.urgent ? "text-accent" : "text-muted-foreground"}`}>
                              {row.seats} {t("мест", "locuri")}
                            </td>
                          </tr>
                        </Link>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/contacts" className="inline-flex items-center px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md">
            {t("Оставить заявку", "Lasă o cerere")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

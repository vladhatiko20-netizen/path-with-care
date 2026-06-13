import { Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import { useLocalizedTo } from "@/lib/use-localized-to";
import heroImg from "@/assets/hero-calendar.jpg";
import { listPilgrimages, type PilgrimageSummary } from "@/lib/pilgrimages.functions";

export const pilgrimagesQueryOptions = () =>
  queryOptions({
    queryKey: ["pilgrimages-public"],
    queryFn: () => listPilgrimages(),
  });

const monthNames = {
  ru: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
  ro: ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],
};

function formatDateRange(start: string, end: string, lang: "ru" | "ro") {
  const s = new Date(start);
  const e = new Date(end);
  const sd = s.getDate();
  const ed = e.getDate();
  const sm = monthNames[lang][s.getMonth()].toLowerCase();
  const em = monthNames[lang][e.getMonth()].toLowerCase();
  if (s.getMonth() === e.getMonth()) return `${sd}–${ed} ${sm}`;
  return `${sd} ${sm} – ${ed} ${em}`;
}

function durationDays(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

export function Component() {
  const { t, lang } = useLang();
  const localize = useLocalizedTo();
  const navigate = useNavigate();
  const { data: trips } = useSuspenseQuery(pilgrimagesQueryOptions());

  // Group by year-month
  const grouped = new Map<string, { year: number; month: number; trips: PilgrimageSummary[] }>();
  for (const trip of trips) {
    const d = new Date(trip.start_date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!grouped.has(key)) grouped.set(key, { year: d.getFullYear(), month: d.getMonth(), trips: [] });
    grouped.get(key)!.trips.push(trip);
  }
  const months = Array.from(grouped.values()).sort((a, b) => a.year - b.year || a.month - b.month);

  return (
    <PageShell>
      <section className="relative h-[46vh] md:h-[62vh] min-h-[370px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Православный календарь", "Calendar ortodox")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("РАСПИСАНИЕ", "PROGRAM")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Календарь поездок", "Calendar de călătorii")}
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 md:py-10">
        <p className="prose-warm text-base md:text-lg font-serif italic text-foreground/80 mb-10 max-w-3xl">
          {t(
            "Все паломнические поездки по месяцам. Нажмите на строку, чтобы оставить заявку.",
            "Toate pelerinajele pe luni. Apăsați pe rând pentru a lăsa o cerere."
          )}
        </p>

        {months.length === 0 ? (
          <p className="text-center text-foreground/70 font-serif italic py-16">
            {t("Поездки скоро появятся.", "Călătoriile vor apărea în curând.")}
          </p>
        ) : (
          <div className="space-y-10">
            {months.map((m) => (
              <div key={`${m.year}-${m.month}`}>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground font-light mb-4 pb-2 border-b border-gold/40">
                  {monthNames[lang][m.month]} {m.year}
                </h2>
                <div className="overflow-x-auto md:-mx-6 md:px-6">
                  <table className="w-full font-serif">
                    <tbody>
                      {m.trips.map((row) => {
                        const hasLink = !!row.destination_slug;
                        const go = hasLink
                          ? () =>
                              navigate({
                                to: localize("/destinations/$slug") as "/destinations/$slug",
                                params: { slug: row.destination_slug! },
                                hash: "lead",
                              })
                          : undefined;
                        return (
                        <tr
                          key={row.id}
                          onClick={go}
                          role={hasLink ? "link" : undefined}
                          tabIndex={hasLink ? 0 : undefined}
                          onKeyDown={hasLink ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go!(); } } : undefined}
                          className={`border-b border-gold/15 transition-colors ${hasLink ? "hover:bg-secondary/40 cursor-pointer" : ""}`}
                        >
                          <td className="py-2.5 pr-1 md:py-3 md:pr-3 text-gold text-lg leading-none align-middle w-5 md:w-8">✦</td>
                          <td className="py-2.5 pr-2 md:py-3 md:pr-3 text-foreground/85 text-[15px] whitespace-nowrap">
                            {formatDateRange(row.start_date, row.end_date, lang)}
                          </td>
                          <td className="py-2.5 pr-2 md:py-3 md:pr-3 text-foreground text-[15px]">
                            {lang === "ru" ? row.destination_ru : row.destination_ro}
                          </td>
                          <td className="py-2.5 pr-2 md:py-3 md:pr-3 text-foreground/70 text-[14px] hidden md:table-cell whitespace-nowrap">
                            {durationDays(row.start_date, row.end_date)} {t("дн.", "zile")}
                          </td>
                          <td className="py-2.5 pr-2 md:py-3 md:pr-3 text-gold font-medium text-[15px] whitespace-nowrap">
                            {row.price_eur ? `€${row.price_eur}` : "—"}
                          </td>
                          <td className="py-2.5 pl-1 md:py-3 md:pl-0 text-right">
                            {hasLink && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  go!();
                                }}
                                className="px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-sm font-serif border border-gold/50 text-foreground hover:bg-gold/10 transition-colors rounded-sm cursor-pointer whitespace-nowrap"
                              >
                                {t("Подать заявку", "Depune cerere")}
                              </button>
                            )}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link to={localize("/destinations") as "/destinations"} className="inline-flex items-center px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md">
            {t("Смотреть направления", "Vezi destinațiile")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

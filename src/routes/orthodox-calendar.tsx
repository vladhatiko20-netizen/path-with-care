import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import { feasts, nextFeast, todayFeast, formatFeastDate } from "@/lib/orthodox-feasts";

export const Route = createFileRoute("/orthodox-calendar")({
  head: () => ({
    meta: [
      { title: "Православный календарь — Паломник" },
      { name: "description", content: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками." },
      { property: "og:title", content: "Православный календарь — Паломник" },
      { property: "og:description", content: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  const { lang } = useLang();
  const now = new Date();
  const todayStr = now.toLocaleDateString(lang === "ru" ? "ru-RU" : "ro-RO", {
    day: "numeric", month: "long", year: "numeric",
  });
  const feastToday = todayFeast(now);
  const feastNext = nextFeast(now);
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const upcoming = [...feasts]
    .sort((a, b) => a.month - b.month || a.day - b.day)
    .filter((f) => f.month > m || (f.month === m && f.day >= d))
    .slice(0, 8);
  return (
    <PageShell>
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-12">
        <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground mb-6 leading-tight">
          {t("Православный календарь", "Calendar ortodox")}
        </h1>
        <p className="font-serif italic text-xl text-foreground/85 mb-2">
          {t("Сегодня — ", "Astăzi — ")}<span className="text-gold">{todayStr}</span>
        </p>
        {feastToday && (
          <p className="font-serif text-foreground/85 mb-2">
            {t("Память сегодня: ", "Astăzi pomenim: ")}
            <span className="text-foreground">{lang === "ru" ? feastToday.ru : feastToday.ro}</span>
          </p>
        )}
        <p className="font-serif italic text-muted-foreground mb-10">
          {t("Ближайший праздник: ", "Următoarea sărbătoare: ")}
          <span className="text-foreground/85">
            {lang === "ru" ? feastNext.ru : feastNext.ro} ({formatFeastDate(feastNext, lang)})
          </span>
        </p>

        <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-5">
          {t("Ближайшие праздники", "Următoarele sărbători")}
        </h2>
        <ul className="divide-y divide-gold/20 border-y border-gold/20">
          {upcoming.map((f, i) => (
            <li key={i} className="flex items-baseline gap-3 py-3 font-serif">
              <span className="text-accent text-lg leading-none">☦</span>
              <span className="w-32 text-foreground/80">{formatFeastDate(f, lang)}</span>
              <span className={f.major ? "text-foreground" : "text-foreground/85"}>
                {lang === "ru" ? f.ru : f.ro}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-serif italic text-foreground/70 leading-relaxed">
          {t(
            "Многие наши поездки приурочены к церковным праздникам — Страстной седмице в Иерусалиме, перенесению мощей свт. Николая в Бари, Успению Богородицы. Если вас интересует поездка к конкретному празднику — напишите нам.",
            "Multe pelerinaje sunt legate de sărbătorile bisericești — Săptămâna Patimilor la Ierusalim, aducerea moaștelor Sf. Nicolae la Bari, Adormirea Maicii Domnului. Dacă vă interesează o călătorie la o anumită sărbătoare — scrieți-ne."
          )}
        </p>
      </section>
    </PageShell>
  );
}

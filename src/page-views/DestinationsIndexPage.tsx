import { Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero-destinations.jpg";
import { listPublicDestinations } from "@/lib/destinations.functions";

export const destinationsListQueryOptions = queryOptions({
  queryKey: ["destinations", "public-list"],
  queryFn: () => listPublicDestinations(),
});

export function Component() {
  const { t, lang } = useLang();
  const { data: items } = useSuspenseQuery(destinationsListQueryOptions);
  return (
    <PageShell>
      <section className="relative h-[46vh] md:h-[62vh] min-h-[370px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Дорога к монастырю", "Drum spre mănăstire")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("ВОСЕМЬ НАПРАВЛЕНИЙ", "OPT DESTINAȚII")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Куда мы ездим", "Unde călătorim")}
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-10">
        {items.length === 0 ? (
          <p className="text-center text-foreground/60 py-16">{t("Скоро здесь появятся направления.", "În curând vor apărea destinații.")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d) => {
              const title = lang === "ru" ? d.title_ru : d.title_ro;
              const desc = lang === "ru" ? d.description_ru : d.description_ro;
              const details = lang === "ru" ? d.intro_ru : d.intro_ro;
              const duration = lang === "ru" ? d.duration_ru : d.duration_ro;
              const price = d.price_from != null
                ? t(`от €${d.price_from}`, `de la €${d.price_from}`)
                : null;
              return (
                <Link
                  key={d.slug}
                  to="/destinations/$slug"
                  params={{ slug: d.slug }}
                  className="group block bg-card border border-gold/30 rounded-sm overflow-hidden md:hover:border-gold md:hover:shadow-[0_12px_30px_-15px_rgba(61,40,23,0.4)] md:hover:-translate-y-0.5 transition-all duration-200"
                >
                  {d.cover_image && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={d.cover_image} alt={title} loading="lazy" width={800} height={600} className="w-full h-full object-cover md:group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="font-serif text-xl text-foreground mb-1 leading-tight">{title}</h2>
                    {desc && <p className="text-sm text-foreground/65 leading-snug mb-3">{desc}</p>}
                    {details && <p className="text-sm text-foreground/75 italic font-serif leading-relaxed mb-4 line-clamp-3">{details}</p>}
                    {(duration || price) && (
                      <div className="flex items-center justify-between pt-3 border-t border-border/60">
                        <span className="text-xs text-muted-foreground font-serif">{duration ?? ""}</span>
                        {price && <span className="text-base text-gold font-serif font-medium">{price}</span>}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}

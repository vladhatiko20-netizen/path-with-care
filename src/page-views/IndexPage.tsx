import { Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { PageShell } from "@/components/site/PageShell";
import { useLocalizedTo } from "@/lib/use-localized-to";
import { BLESSING_BY } from "@/lib/constants";
import heroImg from "@/assets/hero-monastery.jpg";
import aboutPilgrimageImg from "@/assets/about-pilgrimage.jpg";
import blogHeroImg from "@/assets/hero-blog.jpg";
import { listBlogPosts } from "@/lib/blog.functions";
import { getCatalogPageData } from "@/lib/catalog.functions";
import { listPublicDestinations } from "@/lib/destinations.functions";
import { listPilgrimages } from "@/lib/pilgrimages.functions";
import { clergyQueryOptions } from "@/page-views/WithPriestPage";
import { User } from "lucide-react";

export const destinationsListQueryOptions = queryOptions({
  queryKey: ["destinations", "public-list"],
  queryFn: () => listPublicDestinations(),
});

export const upcomingPilgrimagesQueryOptions = queryOptions({
  queryKey: ["pilgrimages", "upcoming"],
  queryFn: () => listPilgrimages(),
});

export const catalogPageQueryOptions = queryOptions({
  queryKey: ["catalog-page"],
  queryFn: () => getCatalogPageData(),
});

const RU_MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const RO_MONTHS = ["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"];

function formatTripDate(iso: string, lang: "ru" | "ro") {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = (lang === "ru" ? RU_MONTHS : RO_MONTHS)[d.getUTCMonth()];
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

function formatTripDuration(start: string, end: string, lang: "ru" | "ro") {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const days = Math.max(1, Math.round(ms / 86400000) + 1);
  if (lang === "ru") {
    const mod10 = days % 10;
    const mod100 = days % 100;
    const word =
      mod10 === 1 && mod100 !== 11
        ? "день"
        : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
          ? "дня"
          : "дней";
    return `${days} ${word}`;
  }
  return days === 1 ? "1 zi" : days < 20 ? `${days} zile` : `${days} de zile`;
}

export function Component() {
  const { t, lang } = useLang();
  const localize = useLocalizedTo();
  const navigate = useNavigate();
  const { data: blogPosts } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => listBlogPosts(),
  });
  const { data: catalogPageData } = useQuery(catalogPageQueryOptions);
  const catalogHeroUrl = catalogPageData?.page?.hero_image_url ?? null;
  const catalogIntroFallbackRu =
    "Многие православные святыни и духовная литература трудно найти в Молдове. Мы привозим их из паломнических поездок – со Святой Земли, из Бари, с Корфу, с Афона. Если вас интересует определённая икона, книга или ладан – оставьте предзаказ, и мы поможем его привезти.";
  const catalogIntroFallbackRo =
    "Multe sanctuare ortodoxe și literatură duhovnicească sunt greu de găsit în Moldova. Le aducem din călătoriile de pelerinaj – din Țara Sfântă, din Bari, din Corfu, din Athos. Dacă vă interesează o anumită icoană, carte sau tămâie, lăsați o pre-comandă și vă vom ajuta să o aducem.";
  const catalogIntro =
    lang === "ru"
      ? (catalogPageData?.page?.intro_ru?.trim() || catalogIntroFallbackRu)
      : (catalogPageData?.page?.intro_ro?.trim() || catalogIntroFallbackRo);
  const { data: publishedDestinations } = useSuspenseQuery(destinationsListQueryOptions);
  const { data: allPilgrimages } = useSuspenseQuery(upcomingPilgrimagesQueryOptions);
  const { data: clergy } = useSuspenseQuery(clergyQueryOptions);
  const featuredPriest = clergy[0];
  const dbDestinations = publishedDestinations.filter((d) => !!d.cover_image);
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = allPilgrimages
    .filter((p) => p.start_date > todayIso)
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 8);
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative h-[58vh] md:h-[calc(100vh-75px)] md:min-h-[calc(100vh-75px)] min-h-[480px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={t("Православный храм с золотыми куполами", "Biserică ortodoxă cu cupole aurii")}
            className="w-full h-full object-cover object-center md:object-top"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center w-full">
          <p className="overline mb-4 md:mb-5 drop-shadow text-sm md:text-2xl">
            {t("ВЫЕЗД ИЗ КИШИНЁВА", "PLECARE DIN CHIȘINĂU")}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white font-light leading-[1.1] mb-5 drop-shadow-lg">
            {t(
              "Поездки к святым местам православного мира",
              "Călătorii către sfințeniile lumii ortodoxe"
            )}
          </h1>
          <p className="text-lg md:text-3xl text-white/95 max-w-2xl mx-auto leading-relaxed font-serif italic drop-shadow">
            {t(
              "Паломничество – это вдохновение христианской жизни",
              "Pelerinajul – inspirația vieții creștine"
            )}
          </p>
          <p className="text-base md:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed font-serif italic drop-shadow mt-2">
            {t(
              "– иеромонах Игнатий (Блинов)",
              "– ieromonahul Ignatie (Blinov)"
            )}
          </p>
          <div className="mt-7 md:mt-9 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Link
              to={localize("/destinations") as "/destinations"}
              className="inline-flex items-center px-6 md:px-7 py-3 bg-accent text-primary-foreground text-base md:text-lg font-serif tracking-wide hover:bg-accent/90 hover:scale-[1.03] transition-all duration-300 ease-out rounded-sm shadow-md"
            >
              {t("Посмотреть направления", "Vezi destinațiile")}
            </Link>
            <Link
              to={localize("/calendar") as "/calendar"}
              className="inline-flex items-center px-6 md:px-7 py-3 border border-white/80 text-white text-base md:text-lg font-serif tracking-wide hover:bg-white/10 hover:scale-[1.03] transition-all duration-300 ease-out rounded-sm backdrop-blur-sm"
            >
              {t("Ближайшие поездки", "Călătoriile apropiate")}
            </Link>
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="bg-secondary/60 pt-4 pb-6 md:pt-12 md:pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8 md:mb-10">
            <p className="overline mb-1 md:mb-3">{t("Направления", "Destinații")}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light">
              {t("Куда мы ездим", "Unde călătorim")}
            </h2>
          </div>

          {dbDestinations.length === 0 ? (
            <p className="text-center text-foreground/60 py-10">
              {t("Направления скоро появятся.", "Destinațiile vor apărea în curând.")}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dbDestinations.map((d) => {
                const title = lang === "ru" ? d.title_ru : d.title_ro;
                const caption =
                  (lang === "ru" ? d.card_text_ru : d.card_text_ro) ??
                  (lang === "ru" ? d.description_ru : d.description_ro) ??
                  "";
                const duration = lang === "ru" ? d.duration_ru : d.duration_ro;
                const price =
                  d.price_from != null ? t(`от €${d.price_from}`, `de la €${d.price_from}`) : null;
                return (
                  <Link
                    key={d.slug}
                    to={localize("/destinations/$slug") as "/destinations/$slug"}
                    params={{ slug: d.slug }}
                    className="group flex flex-col h-full bg-card border border-gold/30 rounded-sm overflow-hidden md:hover:border-gold md:hover:shadow-[0_12px_30px_-15px_rgba(61,40,23,0.4)] md:hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="aspect-[4/3] max-md:max-h-[250px] overflow-hidden">
                      <img
                        src={d.cover_image ?? ""}
                        alt={title}
                        loading="lazy"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover md:group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-serif text-lg text-foreground mb-1 leading-tight">
                        {title}
                      </h3>
                      {caption && (
                        <p className="text-sm text-foreground/65 leading-snug mb-3">{caption}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/60">
                        <span className="text-base font-semibold text-muted-foreground font-serif">{duration ?? ""}</span>
                        {price && (
                          <span className="text-base text-gold font-serif font-medium">{price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* UPCOMING TRIPS */}
      {upcoming.length > 0 && (
      <section className="bg-card/60 py-6 md:py-12 border-y border-border/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <p className="overline mb-2">{t("Расписание", "Program")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              {t("Ближайшие поездки", "Următoarele călătorii")}
            </h2>
          </div>

          <div className="overflow-x-auto md:-mx-6 md:px-6">
            <table className="w-full font-serif">
              <thead>
                <tr className="border-b border-gold/50 text-left">
                  <th className="py-2 pr-1 md:py-2.5 md:pr-3 text-[11px] md:text-sm uppercase tracking-widest text-muted-foreground font-medium w-5 md:w-8"></th>
                  <th className="py-2 pr-2 md:py-2.5 md:pr-3 text-[11px] md:text-sm uppercase tracking-widest text-muted-foreground font-medium">{t("Дата", "Data")}</th>
                  <th className="py-2 pr-2 md:py-2.5 md:pr-3 text-[11px] md:text-sm uppercase tracking-widest text-muted-foreground font-medium">{t("Направление", "Destinație")}</th>
                  <th className="py-2 pr-2 md:py-2.5 md:pr-3 text-[11px] md:text-sm uppercase tracking-widest text-muted-foreground font-medium hidden md:table-cell">{t("Длительность", "Durată")}</th>
                  <th className="py-2 pr-0 md:py-2.5 md:pr-3 text-[11px] md:text-sm uppercase tracking-widest text-muted-foreground font-medium text-right md:text-left">{t("Цена", "Preț")}</th>
                  <th className="py-2 md:py-2.5 text-[11px] md:text-sm uppercase tracking-widest text-muted-foreground font-medium hidden sm:table-cell">{t("Сопровождение", "Însoțire")}</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((row) => {
                  const hasLink = !!row.destination_slug;
                  const go = hasLink
                    ? () =>
                        navigate({
                          to: localize("/destinations/$slug") as "/destinations/$slug",
                          params: { slug: row.destination_slug! },
                        })
                    : undefined;
                  return (
                  <tr
                    key={row.id}
                    className={`border-b border-gold/15 transition-colors ${hasLink ? "hover:bg-secondary/40 cursor-pointer" : ""}`}
                    onClick={go}
                    role={hasLink ? "link" : undefined}
                    tabIndex={hasLink ? 0 : undefined}
                    onKeyDown={hasLink ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go!(); } } : undefined}
                  >
                    <td className="py-2 pr-1 md:py-2.5 md:pr-3 text-gold text-lg leading-none align-middle">✦</td>
                    <td className="py-2 pr-2 md:py-2.5 md:pr-3 text-foreground/85 text-[15px] md:text-base whitespace-nowrap">{formatTripDate(row.start_date, lang)}</td>
                    <td className="py-2 pr-2 md:py-2.5 md:pr-3 text-foreground text-[15px] md:text-base">
                      {lang === "ru" ? row.destination_ru : row.destination_ro}
                      <span className="md:hidden text-xs text-muted-foreground whitespace-nowrap"> · {formatTripDuration(row.start_date, row.end_date, lang)}</span>
                    </td>
                    <td className="py-2 pr-2 md:py-2.5 md:pr-3 text-foreground/70 text-[14px] md:text-base hidden md:table-cell">{formatTripDuration(row.start_date, row.end_date, lang)}</td>
                    <td className="py-2 pr-0 md:py-2.5 md:pr-3 text-gold font-medium text-[15px] md:text-base text-right md:text-left whitespace-nowrap">{row.price_eur != null ? `€${row.price_eur}` : ""}</td>
                    <td className="py-2 md:py-2.5 italic text-sm md:text-base hidden sm:table-cell text-muted-foreground">{row.with_priest ? t("Со священником", "Cu preot") : t("С сопровождающим", "Cu însoțitor")}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link
              to={localize("/calendar") as "/calendar"}
              className="inline-flex items-center px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 transition-colors rounded-sm shadow-md"
            >
              {t("Смотреть все поездки 2026", "Vezi toate călătoriile 2026")}
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* О ПАЛОМНИЧЕСТВЕ */}
      <section className="max-w-6xl mx-auto px-6 py-6 md:py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-md:max-h-[250px] overflow-hidden rounded-sm border border-gold/30 shadow-[0_8px_40px_-20px_rgba(61,40,23,0.35)]">
            <img
              src={aboutPilgrimageImg}
              alt={t("Иконы и свечи в храме", "Icoane și lumânări")}
              loading="lazy"
              width={1024}
              height={1280}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="overline mb-3">{t("О паломничестве", "Despre pelerinaj")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
              {t("Что такое паломничество?", "Ce este pelerinajul?")}
            </h2>
            <div className="space-y-4 text-foreground/85 leading-[1.8]">
              <p>{t(
                "Паломничеством называют путешествие к святым местам с молитвой и открытым сердцем. Туда, где присутствие Божие ощущается особенно глубоко; где жизнь святых угодников и верных последователей Христа связывает прошлое с настоящим; где веками не прерывается молитва и где Церковь бережно хранит живое свидетельство веры.",
                "Pelerinajul este o călătorie către locurile sfinte, făcută cu rugăciune și cu inima deschisă. Spre locurile unde prezența lui Dumnezeu se simte în chip deosebit de adânc; unde viața sfinților și a credincioșilor care L-au urmat pe Hristos unește trecutul cu prezentul; unde rugăciunea nu s-a întrerupt de veacuri și unde Biserica păstrează cu grijă mărturia vie a credinței."
              )}</p>
              <p>{t(
                "Мы продумываем каждую поездку так, чтобы у паломника было время без спешки и суеты побыть у древних святынь, помолиться, исповедаться и причаститься. Останавливаемся в местах, где сама земля хранит память о тех, кто шёл этим путём до нас. В нашем расписании предусмотрено время и для литургии, и для молитвы у раки, и просто для внутренней тишины, чтобы сердце верующего пребывало в спокойствии и благоговении.",
                "Gândim fiecare pelerinaj astfel încât omul să aibă timp, fără grabă și fără agitație, să stea la vechile sfințenii, să se roage, să se spovedească și să se împărtășească. Ne oprim în locuri unde însăși țărâna păstrează amintirea celor care au mers pe acest drum înaintea noastră. În program este prevăzut timp atât pentru Sfânta Liturghie, cât și pentru rugăciune la racla cu moaște, dar și pentru acea liniște lăuntrică în care inima credinciosului poate rămâne în pace și cu evlavie."
              )}</p>
              <p>{t(
                "Если для вас это первое паломничество, мы поможем со всем: от подготовки документов до того, как зажечь свечу у древней иконы.",
                "Dacă acesta este primul dumneavoastră pelerinaj, vă vom ajuta cu tot ce este nevoie: de la pregătirea actelor până la momentul în care veți aprinde o lumânare înaintea unei icoane vechi."
              )}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIEST CONVERSATION TEASER */}
      {featuredPriest && (
      <section className="py-6">
        <Link to={localize("/with-priest") as "/with-priest"} className="block max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center group">
          <div className="order-2 md:order-1">
            <p className="overline mb-3">{t("Беседы", "Conversații")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
              {t("Диалог со священником", "Dialog cu preotul")}
            </h2>
            <p className="font-serif text-lg text-accent italic mb-1">
              {lang === "ru" ? featuredPriest.name_ru : featuredPriest.name_ro}
            </p>
            {(featuredPriest.title_ru || featuredPriest.title_ro) && (
              <p className="text-sm text-foreground/70 italic font-serif mb-5">
                {lang === "ru" ? featuredPriest.title_ru : featuredPriest.title_ro}
              </p>
            )}
            <p className="text-foreground/80 leading-relaxed mb-6 max-w-prose">
              {t(
                "Вопросы о подготовке к паломничеству, исповеди, духовной жизни. Отвечают батюшки Кишинёва и духовники, сопровождающие наши группы.",
                "Întrebări despre pregătirea pentru pelerinaj, spovedanie, viața duhovnicească. Răspund preoții din Chișinău și duhovnicii care însoțesc grupurile."
              )}
            </p>
            <ul className="space-y-2 font-serif italic text-foreground/75 mb-7">
              <li>– {t("Как готовиться к паломничеству?", "Cum să te pregătești de pelerinaj?")}</li>
              <li>– {t("Нужно ли поститься перед поездкой?", "Trebuie să postim înainte de călătorie?")}</li>
              <li>– {t("Что взять с собой в Иерусалим?", "Ce să iei cu tine la Ierusalim?")}</li>
              <li>– {t("Как правильно прикладываться к мощам?", "Cum ne închinăm la moaște?")}</li>
            </ul>
            <span className="font-serif text-foreground gold-underline group-hover:text-gold transition-colors">
              {t("Перейти к беседам", "Treci la conversații")} →
            </span>
          </div>
          <div className="order-1 md:order-2 max-md:max-h-[320px] overflow-hidden rounded-sm border border-gold/30 shadow-[0_8px_40px_-20px_rgba(61,40,23,0.35)] bg-secondary/40 flex items-center justify-center">
            {featuredPriest.photo_url ? (
              <img
                src={featuredPriest.photo_url}
                alt={lang === "ru" ? featuredPriest.name_ru : featuredPriest.name_ro}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-24 h-24 text-muted-foreground" />
            )}
          </div>
        </Link>
      </section>
      )}

      {/* BLOG TEASER */}
      <section className="bg-secondary/50 py-6 md:py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <Link to={localize("/blog") as "/blog"} className="block group max-md:max-h-[250px] overflow-hidden rounded-sm border border-gold/30 shadow-[0_8px_40px_-20px_rgba(61,40,23,0.35)]">
            <img
              src="https://images.pexels.com/photos/10618234/pexels-photo-10618234.jpeg"
              alt={t("Истории паломников", "Povești de pelerini")}
              loading="lazy"
              width={1200}
              height={1200}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </Link>
          <div>
            <p className="overline mb-2">{t("Православный блог", "Blog ortodox")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
              {t("Истории паломников", "Povești de pelerini")}
            </h2>
            {blogPosts && blogPosts.length > 0 ? (
              <ul className="space-y-3 mb-7">
                {blogPosts.slice(0, 3).map((post) => (
                  <li key={post.slug} className="border-b border-gold/20 pb-3 last:border-b-0">
                    <Link
                      to={localize("/blog/$slug") as "/blog/$slug"}
                      params={{ slug: post.slug }}
                      className="block font-serif text-foreground/85 leading-snug hover:text-accent transition-colors"
                    >
                      <span className="text-accent mr-2" aria-hidden="true">✦</span>
                      {lang === "ru" ? post.title_ru : post.title_ro}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/60 font-serif italic mb-7">
                {t("Скоро здесь появятся новые истории.", "În curând vor apărea povești noi.")}
              </p>
            )}
            <Link
              to={localize("/blog") as "/blog"}
              className="font-serif text-foreground gold-underline hover:text-gold transition-colors"
            >
              {t("Все истории", "Toate poveștile")} →
            </Link>
          </div>
        </div>
      </section>

      {/* ICONS & RELICS */}
      <section className="bg-card/70 pt-0 pb-6 md:pb-20 border-t border-border/60">
        <Link to={localize("/catalog") as "/catalog"} className="block group">
        {catalogHeroUrl && (
          <div className="aspect-[16/7] max-md:max-h-[250px] w-full overflow-hidden md:hidden">
            <img
              src={catalogHeroUrl}
              alt={t("Иконы, ладан, духовная литература", "Icoane, tămâie, literatură")}
              loading="lazy"
              width={1600}
              height={900}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-16">
          <div className="md:grid md:grid-cols-2 md:gap-12 md:items-stretch">
            <div className="max-w-2xl md:max-w-none md:flex md:flex-col md:justify-center">
              <p className="overline mb-3">{t("По предзаказу", "La pre-comandă")}</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-5 leading-tight">
                {t("Иконы, ладан, духовная литература", "Icoane, tămâie, literatură duhovnicească")}
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-6">
                {catalogIntro}
              </p>
              <div className="hidden md:block">
                <span className="font-serif text-foreground gold-underline group-hover:text-gold transition-colors">
                  {t("Каталог", "Catalog")} →
                </span>
              </div>
            </div>
            {catalogHeroUrl && (
              <div className="hidden md:block">
                <img
                  src={catalogHeroUrl}
                  alt={t("Иконы, ладан, духовная литература", "Icoane, tămâie, literatură")}
                  loading="lazy"
                  width={1200}
                  height={1200}
                  className="w-full h-full max-h-[520px] object-cover rounded-sm border border-gold/30 shadow-[0_8px_40px_-20px_rgba(61,40,23,0.35)]"
                />
              </div>
            )}
          </div>
          <div className="mt-9 md:hidden">
            <span className="font-serif text-foreground gold-underline group-hover:text-gold transition-colors">
              {t("Каталог", "Catalog")} →
            </span>
          </div>
        </div>
        </Link>
      </section>

      {/* BLESSING */}
      {BLESSING_BY && (
        <section className="py-6 md:py-10">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="divider-gold overline mb-7">{t("С молитвой", "Cu rugăciune")}</p>
            <p className="font-serif italic text-2xl md:text-3xl text-foreground/85 leading-relaxed">
              {t(`По благословению ${BLESSING_BY}`, `Cu binecuvântarea ${BLESSING_BY}`)}
            </p>
          </div>
        </section>
      )}

      {/* TRUST BADGES */}
      <section className="bg-secondary/50 py-6 md:py-12 border-t border-border/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-card border border-gold/30 rounded-sm p-5 text-center">
              <div className="text-3xl mb-3">🕊️</div>
              <p className="font-serif text-foreground/85 leading-snug">
                {t("Духовное сопровождение в каждой поездке", "Însoțire duhovnicească în fiecare călătorie")}
              </p>
            </div>
            <div className="bg-card border border-gold/30 rounded-sm p-5 text-center">
              <div className="text-3xl mb-3">📜</div>
              <p className="font-serif text-foreground/85 leading-snug">
                {t("Лицензированное агентство (Минкультуры РМ)", "Agenție licențiată (Min. Culturii RM)")}
              </p>
            </div>
            <div className="bg-card border border-gold/30 rounded-sm p-5 text-center">
              <div className="text-3xl mb-3">💛</div>
              <p className="font-serif text-foreground/85 leading-snug">
                {t("Личное участие Анны", "Implicarea personală a Annei")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

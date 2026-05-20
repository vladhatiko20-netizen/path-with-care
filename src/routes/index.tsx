import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { PageShell } from "@/components/site/PageShell";
import heroImg from "@/assets/hero-monastery.jpg";
import aboutPilgrimageImg from "@/assets/about-pilgrimage.jpg";
import priestImg from "@/assets/orthodox-priest.jpg";
import catalogHeroImg from "@/assets/catalog-hero.jpg";
import blogHeroImg from "@/assets/hero-blog.jpg";
import jerusalemImg from "@/assets/dest-jerusalem.jpg";
import bariImg from "@/assets/dest-bari.jpg";
import corfuImg from "@/assets/dest-corfu.jpg";
import athosImg from "@/assets/dest-athos.jpg";
import georgiaImg from "@/assets/dest-georgia.jpg";
import romaniaImg from "@/assets/dest-romania.jpg";
import ukraineImg from "@/assets/dest-ukraine.jpg";
import moldovaImg from "@/assets/dest-moldova.jpg";
import { listBlogPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Паломник — Православные паломнические поездки из Кишинёва" },
      {
        name: "description",
        content:
          "Паломник — поездки к святыням православного мира из Кишинёва: Иерусалим, Бари, Корфу, Афон, Грузия, Румыния, Молдова. И вместе ко Христу.",
      },
      { property: "og:title", content: "Паломник — паломнические поездки из Кишинёва" },
      {
        property: "og:description",
        content: "И вместе ко Христу. Поездки к святым местам с духовным сопровождением.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: HomePage,
});

type Destination = {
  slug: string;
  ru: { title: string; desc: string; duration: string; price: string; notice?: string };
  ro: { title: string; desc: string; duration: string; price: string; notice?: string };
  img: string;
};

const destinations: Destination[] = [
  {
    slug: "jerusalem", img: jerusalemImg,
    ru: { title: "Иерусалим и Святая Земля", desc: "Гроб Господень, Гефсимания, Вифлеем, Назарет.", duration: "8–10 дней", price: "от €1200" },
    ro: { title: "Ierusalim și Țara Sfântă", desc: "Sfântul Mormânt, Ghetsimani, Betleem, Nazaret.", duration: "8–10 zile", price: "de la €1200" },
  },
  {
    slug: "bari", img: bariImg,
    ru: { title: "Бари — к мощам Святителя Николая", desc: "Поклонение мощам Святителя Николая Чудотворца.", duration: "5–7 дней", price: "от €750" },
    ro: { title: "Bari — la moaștele Sf. Nicolae", desc: "Închinare la moaștele Sfântului Nicolae.", duration: "5–7 zile", price: "de la €750" },
  },
  {
    slug: "corfu", img: corfuImg,
    ru: { title: "Корфу — к мощам Святителя Спиридона", desc: "Нетленные мощи Святителя Спиридона Тримифунтского.", duration: "5–7 дней", price: "от €700" },
    ro: { title: "Corfu — la moaștele Sf. Spiridon", desc: "Moaștele neputrede ale Sfântului Spiridon.", duration: "5–7 zile", price: "de la €700" },
  },
  {
    slug: "athos", img: athosImg,
    ru: { title: "Афон — Святая Гора", desc: "Поездка на Святую Гору Афон, оформление диамонитириона.", duration: "5–8 дней", price: "от €900", notice: "только для мужчин" },
    ro: { title: "Athos — Muntele Sfânt", desc: "Călătorie la Muntele Athos, asistență diamonitirion.", duration: "5–8 zile", price: "de la €900", notice: "doar pentru bărbați" },
  },
  {
    slug: "georgia", img: georgiaImg,
    ru: { title: "Грузия — святыни Грузинской Церкви", desc: "Мцхета, Светицховели, Бодбе, Давида Гареджи.", duration: "6–8 дней", price: "от €650" },
    ro: { title: "Georgia — sanctuarele georgiene", desc: "Mțheta, Svetițhoveli, Bodbe, David Gareja.", duration: "6–8 zile", price: "de la €650" },
  },
  {
    slug: "romania", img: romaniaImg,
    ru: { title: "Румыния — монастыри и святые отцы", desc: "Путна, Воронец, Сучевица. Места румынских старцев.", duration: "4–6 дней", price: "от €400" },
    ro: { title: "România — mănăstiri și părinți", desc: "Putna, Voroneț, Sucevița. Locuri ale stareților.", duration: "4–6 zile", price: "de la €400" },
  },
  {
    slug: "ukraine", img: ukraineImg,
    ru: { title: "Украина — Почаев и Киев", desc: "Святыни Почаевской Лавры и Киево-Печерской.", duration: "5–7 дней", price: "от €500", notice: "уточняйте даты" },
    ro: { title: "Ucraina — Poceaev și Kiev", desc: "Sanctuarele Lavrei de la Poceaev și Kiev.", duration: "5–7 zile", price: "de la €500", notice: "verificați datele" },
  },
  {
    slug: "moldova", img: moldovaImg,
    ru: { title: "Молдова — святыни родного края", desc: "Каприана, Куркь, Хынку, Сахарна.", duration: "1–2 дня", price: "от €30" },
    ro: { title: "Moldova — sanctuarele pământului natal", desc: "Căpriana, Curchi, Hâncu, Saharna.", duration: "1–2 zile", price: "de la €30" },
  },
];

const upcoming = [
  { date: { ru: "15 марта 2026", ro: "15 martie 2026" }, dest: { ru: "Бари + Корфу", ro: "Bari + Corfu" }, dur: { ru: "7 дней", ro: "7 zile" }, price: "€890", seats: { ru: "8 мест", ro: "8 locuri" }, urgent: false },
  { date: { ru: "10 апреля 2026", ro: "10 aprilie 2026" }, dest: { ru: "Иерусалим (Страстная)", ro: "Ierusalim (Săpt. Patimilor)" }, dur: { ru: "10 дней", ro: "10 zile" }, price: "€1450", seats: { ru: "4 места", ro: "4 locuri" }, urgent: true },
  { date: { ru: "5 мая 2026", ro: "5 mai 2026" }, dest: { ru: "Афон", ro: "Athos" }, dur: { ru: "6 дней (мужчины)", ro: "6 zile (bărbați)" }, price: "€920", seats: { ru: "5 мест", ro: "5 locuri" }, urgent: true },
  { date: { ru: "20 июня 2026", ro: "20 iunie 2026" }, dest: { ru: "Грузия", ro: "Georgia" }, dur: { ru: "7 дней", ro: "7 zile" }, price: "€680", seats: { ru: "12 мест", ro: "12 locuri" }, urgent: false },
  { date: { ru: "15 августа 2026", ro: "15 august 2026" }, dest: { ru: "Иерусалим (Успение)", ro: "Ierusalim (Adormirea)" }, dur: { ru: "9 дней", ro: "9 zile" }, price: "€1380", seats: { ru: "6 мест", ro: "6 locuri" }, urgent: true },
  { date: { ru: "10 сентября 2026", ro: "10 septembrie 2026" }, dest: { ru: "Румыния — монастыри", ro: "România — mănăstiri" }, dur: { ru: "5 дней", ro: "5 zile" }, price: "€450", seats: { ru: "14 мест", ro: "14 locuri" }, urgent: false },
  { date: { ru: "1 октября 2026", ro: "1 octombrie 2026" }, dest: { ru: "Корфу", ro: "Corfu" }, dur: { ru: "6 дней", ro: "6 zile" }, price: "€750", seats: { ru: "10 мест", ro: "10 locuri" }, urgent: false },
  { date: { ru: "5 ноября 2026", ro: "5 noiembrie 2026" }, dest: { ru: "Молдова — выходного дня", ro: "Moldova — weekend" }, dur: { ru: "2 дня", ro: "2 zile" }, price: "€60", seats: { ru: "20 мест", ro: "20 locuri" }, urgent: false },
];

function HomePage() {
  const { t, lang } = useLang();
  const { data: blogPosts } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => listBlogPosts(),
  });
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative max-md:max-h-[250px] max-md:min-h-0 h-[58vh] md:h-[calc(100vh-75px)] md:min-h-[calc(100vh-75px)] min-h-[480px] flex items-center overflow-hidden">
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
              "Pelerinajul – este inspirația vieții creștine"
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
              to="/destinations"
              className="inline-flex items-center px-6 md:px-7 py-3 bg-accent text-primary-foreground text-base md:text-lg font-serif tracking-wide hover:bg-accent/90 hover:scale-[1.03] transition-all duration-300 ease-out rounded-sm shadow-md"
            >
              {t("Посмотреть направления", "Vezi destinațiile")}
            </Link>
            <Link
              to="/calendar"
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destinations.map((d) => {
              const c = lang === "ru" ? d.ru : d.ro;
              return (
                <Link
                  key={d.slug}
                  to="/destinations"
                  className="group block bg-card border border-gold/30 rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_12px_30px_-15px_rgba(61,40,23,0.4)] hover:-translate-y-0.5 transition-all duration-500"
                >
                  <div className="aspect-[4/3] max-md:max-h-[250px] overflow-hidden">
                    <img
                      src={d.img}
                      alt={c.title}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1200ms]"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-foreground mb-1 leading-tight">
                      {c.title}
                    </h3>
                    {c.notice && (
                      <p className="text-[11px] italic text-accent mb-1 font-serif">— {c.notice}</p>
                    )}
                    <p className="text-sm text-foreground/65 leading-snug mb-3 line-clamp-2">{c.desc}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="text-xs text-muted-foreground font-serif">{c.duration}</span>
                      <span className="text-base text-gold font-serif font-medium">{c.price}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* UPCOMING TRIPS */}
      <section className="bg-card/60 py-6 md:py-12 border-y border-border/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <p className="overline mb-2">{t("Расписание", "Program")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              {t("Ближайшие поездки", "Următoarele călătorii")}
            </h2>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full font-serif">
              <thead>
                <tr className="border-b border-gold/50 text-left">
                  <th className="py-2.5 pr-3 text-[11px] uppercase tracking-widest text-muted-foreground font-medium w-8"></th>
                  <th className="py-2.5 pr-3 text-[11px] uppercase tracking-widest text-muted-foreground font-medium">{t("Дата", "Data")}</th>
                  <th className="py-2.5 pr-3 text-[11px] uppercase tracking-widest text-muted-foreground font-medium">{t("Направление", "Destinație")}</th>
                  <th className="py-2.5 pr-3 text-[11px] uppercase tracking-widest text-muted-foreground font-medium hidden md:table-cell">{t("Длительность", "Durată")}</th>
                  <th className="py-2.5 pr-3 text-[11px] uppercase tracking-widest text-muted-foreground font-medium">{t("Цена", "Preț")}</th>
                  <th className="py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground font-medium hidden sm:table-cell">{t("Места", "Locuri")}</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((row, i) => (
                  <tr key={i} className="border-b border-gold/15 hover:bg-secondary/40 transition-colors cursor-pointer">
                    <td className="py-2.5 pr-3 text-accent text-lg leading-none align-middle">☦</td>
                    <td className="py-2.5 pr-3 text-foreground/85 text-[15px]">{row.date[lang]}</td>
                    <td className="py-2.5 pr-3 text-foreground text-[15px]">{row.dest[lang]}</td>
                    <td className="py-2.5 pr-3 text-foreground/70 text-[14px] hidden md:table-cell">{row.dur[lang]}</td>
                    <td className="py-2.5 pr-3 text-gold font-medium text-[15px]">{row.price}</td>
                    <td className={`py-2.5 italic text-sm hidden sm:table-cell ${row.urgent ? "text-accent" : "text-muted-foreground"}`}>
                      {row.seats[lang]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/calendar"
              className="inline-flex items-center px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 transition-colors rounded-sm shadow-md"
            >
              {t("Смотреть все поездки 2026", "Vezi toate călătoriile 2026")}
            </Link>
          </div>
        </div>
      </section>

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
      <section className="py-6">
        <Link to="/with-priest" className="block max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center group">
          <div className="order-2 md:order-1">
            <p className="overline mb-3">{t("Беседы", "Conversații")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
              {t("Диалог со священником", "Dialog cu preotul")}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-6 max-w-prose">
              {t(
                "Вопросы о подготовке к паломничеству, исповеди, духовной жизни. Отвечают батюшки Кишинёва и духовники, сопровождающие наши группы.",
                "Întrebări despre pregătirea pentru pelerinaj, spovedanie, viața duhovnicească. Răspund preoți din Chișinău și duhovnicii care însoțesc grupurile."
              )}
            </p>
            <ul className="space-y-2 font-serif italic text-foreground/75 mb-7">
              <li>— {t("Как готовиться к паломничеству?", "Cum să te pregătești de pelerinaj?")}</li>
              <li>— {t("Нужно ли поститься перед поездкой?", "Trebuie să postim înainte de călătorie?")}</li>
              <li>— {t("Что взять с собой в Иерусалим?", "Ce să iei cu tine la Ierusalim?")}</li>
              <li>— {t("Как правильно прикладываться к мощам?", "Cum ne închinăm la moaște?")}</li>
            </ul>
            <span className="font-serif text-foreground gold-underline group-hover:text-gold transition-colors">
              {t("Перейти к беседам", "Treci la conversații")} →
            </span>
          </div>
          <div className="order-1 md:order-2 max-md:max-h-[250px] overflow-hidden rounded-sm border border-gold/30 shadow-[0_8px_40px_-20px_rgba(61,40,23,0.35)]">
            <img
              src={priestImg}
              alt=""
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </section>

      {/* BLOG TEASER */}
      <section className="bg-secondary/50 py-6 md:py-10">
        <Link to="/blog" className="block max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center group">
          <div className="max-md:max-h-[250px] overflow-hidden rounded-sm border border-gold/30 shadow-[0_8px_40px_-20px_rgba(61,40,23,0.35)]">
            <img
              src="https://images.pexels.com/photos/10618234/pexels-photo-10618234.jpeg"
              alt={t("Истории паломников", "Povești de pelerini")}
              loading="lazy"
              width={1200}
              height={1200}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="overline mb-2">{t("Православный блог", "Blog ortodox")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
              {t("Истории паломников", "Povești de pelerini")}
            </h2>
            {blogPosts && blogPosts.length > 0 ? (
              <ul className="space-y-3 mb-7">
                {blogPosts.slice(0, 3).map((post) => (
                  <li key={post.slug} className="font-serif text-foreground/85 leading-snug border-b border-gold/20 pb-3 last:border-b-0">
                    — {lang === "ru" ? post.title_ru : post.title_ro}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/60 font-serif italic mb-7">
                {t("Скоро здесь появятся новые истории.", "În curând vor apărea povești noi.")}
              </p>
            )}
            <span className="font-serif text-foreground gold-underline group-hover:text-gold transition-colors">
              {t("Все истории", "Toate poveștile")} →
            </span>
          </div>
        </Link>
      </section>

      {/* ICONS & RELICS */}
      <section className="bg-card/70 pt-0 pb-6 md:pb-20 border-t border-border/60">
        <Link to="/catalog" className="block group">
        <div className="aspect-[16/7] max-md:max-h-[250px] w-full overflow-hidden md:hidden">
          <img
            src={catalogHeroImg}
            alt={t("Иконы, ладан, духовная литература", "Icoane, tămâie, literatură")}
            loading="lazy"
            width={1600}
            height={900}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-16">
          <div className="md:grid md:grid-cols-2 md:gap-12 md:items-stretch">
            <div className="max-w-2xl md:max-w-none md:flex md:flex-col md:justify-center">
              <p className="overline mb-3">{t("По предзаказу", "La pre-comandă")}</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-5 leading-tight">
                {t("Иконы, ладан, духовная литература", "Icoane, tămâie, literatură duhovnicească")}
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-6">
                {t(
                  "Многие православные святыни и духовная литература трудно найти в Молдове. Мы привозим их из паломнических поездок — со Святой Земли, из Бари, с Корфу, с Афона. Если вас интересует определённая икона, книга или ладан — оставьте предзаказ, и мы поможем его привезти.",
                  "Multe sanctuare ortodoxe și literatură duhovnicească sunt greu de găsit în Moldova. Le aducem din călătoriile de pelerinaj — din Țara Sfântă, din Bari, din Corfu, din Athos. Dacă vă interesează o anumită icoană, carte sau tămâie — lăsați o pre-comandă și vă vom ajuta să o aducem."
                )}
              </p>
              <div className="hidden md:block">
                <span className="font-serif text-foreground gold-underline group-hover:text-gold transition-colors">
                  {t("Каталог", "Catalog")} →
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src={catalogHeroImg}
                alt={t("Иконы, ладан, духовная литература", "Icoane, tămâie, literatură")}
                loading="lazy"
                width={1200}
                height={1200}
                className="w-full h-full max-h-[520px] object-cover rounded-sm border border-gold/30 shadow-[0_8px_40px_-20px_rgba(61,40,23,0.35)]"
              />
            </div>
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
      <section className="py-6 md:py-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="divider-gold overline mb-7">{t("С молитвой", "Cu rugăciune")}</p>
          <p className="font-serif italic text-2xl md:text-3xl text-foreground/85 leading-relaxed">
            {t("По благословению ", "Cu binecuvântarea ")}
            <span className="text-muted-foreground">[…]</span>
          </p>
        </div>
      </section>

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

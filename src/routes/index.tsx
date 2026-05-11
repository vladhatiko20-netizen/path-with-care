import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { PageShell } from "@/components/site/PageShell";
import heroImg from "@/assets/hero-monastery.jpg";
import bookImg from "@/assets/quiet-book.jpg";
import jerusalemImg from "@/assets/dest-jerusalem.jpg";
import bariImg from "@/assets/dest-bari.jpg";
import corfuImg from "@/assets/dest-corfu.jpg";
import athosImg from "@/assets/dest-athos.jpg";
import georgiaImg from "@/assets/dest-georgia.jpg";
import romaniaImg from "@/assets/dest-romania.jpg";
import ukraineImg from "@/assets/dest-ukraine.jpg";
import moldovaImg from "@/assets/dest-moldova.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Путь к Святыням — Православные паломнические поездки из Кишинёва" },
      {
        name: "description",
        content:
          "Авторские паломнические поездки из Кишинёва к православным святыням мира — Иерусалим, Бари, Корфу, Афон, Грузия, Румыния, Молдова. С молитвой и заботой.",
      },
      { property: "og:title", content: "Путь к Святыням — паломнические поездки из Кишинёва" },
      {
        property: "og:description",
        content:
          "Авторские паломнические поездки к православным святыням. Анна лично сопровождает группы.",
      },
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
    slug: "jerusalem",
    img: jerusalemImg,
    ru: {
      title: "Иерусалим и Святая Земля",
      desc: "Гроб Господень, Гефсимания, Вифлеем, Назарет. Поездки рассчитаны на полное прохождение святых мест Иерусалима и окрестностей. Анна была в Иерусалиме несколько раз и знает направление лично.",
      duration: "8–10 дней",
      price: "от €1200",
    },
    ro: {
      title: "Ierusalim și Țara Sfântă",
      desc: "Sfântul Mormânt, Ghetsimani, Betleem, Nazaret. Călătoriile parcurg locurile sfinte din Ierusalim și împrejurimi. Anna a fost de mai multe ori în Ierusalim și cunoaște personal direcția.",
      duration: "8–10 zile",
      price: "de la €1200",
    },
  },
  {
    slug: "bari",
    img: bariImg,
    ru: {
      title: "Бари — к мощам Святителя Николая",
      desc: "Поклонение мощам Святителя Николая Чудотворца в Бари. Часто совмещается с поездкой в Рим и Ватикан, либо с островом Корфу.",
      duration: "5–7 дней",
      price: "от €750",
    },
    ro: {
      title: "Bari — la moaștele Sfântului Nicolae",
      desc: "Închinare la moaștele Sfântului Nicolae făcătorul de minuni la Bari. Adesea combinată cu o vizită la Roma sau insula Corfu.",
      duration: "5–7 zile",
      price: "de la €750",
    },
  },
  {
    slug: "corfu",
    img: corfuImg,
    ru: {
      title: "Корфу — к мощам Святителя Спиридона",
      desc: "Поездка на остров Корфу, где почивают нетленные мощи Святителя Спиридона Тримифунтского. Анна была на Корфу неоднократно — направление родное.",
      duration: "5–7 дней",
      price: "от €700",
    },
    ro: {
      title: "Corfu — la moaștele Sfântului Spiridon",
      desc: "Călătorie pe insula Corfu, unde se odihnesc moaștele neputrede ale Sfântului Spiridon. Anna a fost de mai multe ori pe Corfu.",
      duration: "5–7 zile",
      price: "de la €700",
    },
  },
  {
    slug: "athos",
    img: athosImg,
    ru: {
      title: "Афон — Святая Гора",
      desc: "Поездка на Святую Гору Афон для мужчин. Помощь с оформлением диамонитириона, сопровождение до Уранополя. Программа составляется с учётом ваших пожеланий по монастырям.",
      duration: "5–8 дней",
      price: "от €900",
      notice: "только для мужчин",
    },
    ro: {
      title: "Athos — Muntele Sfânt",
      desc: "Călătorie la Muntele Athos pentru bărbați. Asistență la obținerea diamonitirionului, însoțire până la Ouranoupoli.",
      duration: "5–8 zile",
      price: "de la €900",
      notice: "doar pentru bărbați",
    },
  },
  {
    slug: "georgia",
    img: georgiaImg,
    ru: {
      title: "Грузия — святыни Грузинской Церкви",
      desc: "Мцхета, Светицховели, Бодбе с мощами святой Нино, монастырь Давида Гареджи. Поездки красивы в любое время года.",
      duration: "6–8 дней",
      price: "от €650",
    },
    ro: {
      title: "Georgia — sanctuarele georgiene",
      desc: "Mțheta, Svetițhoveli, Bodbe cu moaștele sfintei Nino, mănăstirea David Gareja. Frumoase în orice anotimp.",
      duration: "6–8 zile",
      price: "de la €650",
    },
  },
  {
    slug: "romania",
    img: romaniaImg,
    ru: {
      title: "Румыния — монастыри и святые отцы",
      desc: "Северная Молдавия и Буковина: монастыри Путна, Воронец, Сучевица. Поездка с остановками в местах, связанных со старцами Румынской Церкви.",
      duration: "4–6 дней",
      price: "от €400",
    },
    ro: {
      title: "România — mănăstiri și părinți",
      desc: "Bucovina: mănăstirile Putna, Voroneț, Sucevița. Cu opriri la locurile legate de stareții Bisericii Române.",
      duration: "4–6 zile",
      price: "de la €400",
    },
  },
  {
    slug: "ukraine",
    img: ukraineImg,
    ru: {
      title: "Украина — Почаев и Киево-Печерская Лавра",
      desc: "Святыни Почаевской Лавры и Киево-Печерской Лавры. Программа зависит от текущей ситуации — уточняйте у нас наличие поездок.",
      duration: "5–7 дней",
      price: "от €500",
      notice: "уточняйте даты",
    },
    ro: {
      title: "Ucraina — Poceaev și Lavra Pecerska",
      desc: "Sanctuarele Lavrei de la Poceaev și Kiev. Programul depinde de situație — verificați datele.",
      duration: "5–7 zile",
      price: "de la €500",
      notice: "verificați datele",
    },
  },
  {
    slug: "moldova",
    img: moldovaImg,
    ru: {
      title: "Молдова — святыни родного края",
      desc: "Монастыри Молдовы для тех, кто хочет начать паломнический путь близко к дому: Каприана, Куркь, Хынку, Сахарна. Однодневные и двухдневные поездки.",
      duration: "1–2 дня",
      price: "от €30",
    },
    ro: {
      title: "Moldova — sanctuarele pământului natal",
      desc: "Mănăstirile Moldovei: Căpriana, Curchi, Hâncu, Saharna. Călătorii de o zi sau două.",
      duration: "1–2 zile",
      price: "de la €30",
    },
  },
];

const upcoming = [
  { date: { ru: "15 марта 2026", ro: "15 martie 2026" }, dest: { ru: "Бари + Корфу", ro: "Bari + Corfu" }, dur: { ru: "7 дней", ro: "7 zile" }, price: "€890", seats: { ru: "8 мест", ro: "8 locuri" } },
  { date: { ru: "10 апреля 2026", ro: "10 aprilie 2026" }, dest: { ru: "Иерусалим (Страстная)", ro: "Ierusalim (Săpt. Patimilor)" }, dur: { ru: "10 дней", ro: "10 zile" }, price: "€1450", seats: { ru: "4 места", ro: "4 locuri" } },
  { date: { ru: "5 мая 2026", ro: "5 mai 2026" }, dest: { ru: "Афон", ro: "Athos" }, dur: { ru: "6 дней (мужчины)", ro: "6 zile (bărbați)" }, price: "€920", seats: { ru: "5 мест", ro: "5 locuri" } },
  { date: { ru: "20 июня 2026", ro: "20 iunie 2026" }, dest: { ru: "Грузия", ro: "Georgia" }, dur: { ru: "7 дней", ro: "7 zile" }, price: "€680", seats: { ru: "12 мест", ro: "12 locuri" } },
  { date: { ru: "15 августа 2026", ro: "15 august 2026" }, dest: { ru: "Иерусалим (Успение)", ro: "Ierusalim (Adormirea)" }, dur: { ru: "9 дней", ro: "9 zile" }, price: "€1380", seats: { ru: "6 мест", ro: "6 locuri" } },
  { date: { ru: "10 сентября 2026", ro: "10 septembrie 2026" }, dest: { ru: "Румыния — монастыри", ro: "România — mănăstiri" }, dur: { ru: "5 дней", ro: "5 zile" }, price: "€450", seats: { ru: "14 мест", ro: "14 locuri" } },
  { date: { ru: "1 октября 2026", ro: "1 octombrie 2026" }, dest: { ru: "Корфу", ro: "Corfu" }, dur: { ru: "6 дней", ro: "6 zile" }, price: "€750", seats: { ru: "10 мест", ro: "10 locuri" } },
  { date: { ru: "5 ноября 2026", ro: "5 noiembrie 2026" }, dest: { ru: "Молдова — выходного дня", ro: "Moldova — weekend" }, dur: { ru: "2 дня", ro: "2 zile" }, price: "€60", seats: { ru: "20 мест", ro: "20 locuri" } },
];

const blogTeasers = [
  { ru: "Афон глазами того, кто впервые там", ro: "Athos prin ochii unui pelerin la prima vizită" },
  { ru: "Иерусалим в Страстную: что я увидел", ro: "Ierusalim în Săptămâna Patimilor" },
  { ru: "Грузинские монастыри — тихий разговор с Богом", ro: "Mănăstirile Georgiei — o conversație tăcută" },
];

const catalogTeasers = [
  { ru: "Икона Святителя Николая (Бари)", ro: "Icoana Sf. Nicolae (Bari)" },
  { ru: "Ладан Афонский (Карея)", ro: "Tămâie de Athos (Karyes)" },
  { ru: "«Старец Силуан Афонский» (книга)", ro: "„Stareţul Siluan Athonitul” (carte)" },
  { ru: "Иерусалимская иконка-подвеска", ro: "Iconiță-pandantiv din Ierusalim" },
];

function HomePage() {
  const { t, lang } = useLang();
  const today = new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover opacity-30"
            width={1600}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-28 md:pt-32 md:pb-36 text-center">
          <p className="overline mb-6">
            {t("ПАЛОМНИЧЕСКИЕ ПОЕЗДКИ ИЗ КИШИНЁВА", "PELERINAJE DIN CHIȘINĂU")}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-foreground font-light leading-[1.05] mb-7">
            {t("К святым местам —", "Spre Locurile Sfinte —")}
            <br />
            <em className="italic text-[0.95em] text-foreground/90">
              {t("с молитвой и заботой", "cu rugăciune și grijă")}
            </em>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-serif italic">
            {t(
              "Авторские поездки к православным святыням мира. Анна Плотник лично сопровождает группы и заботится о каждом паломнике.",
              "Călătorii personalizate la sanctuarele ortodoxe ale lumii. Anna Plotnik însoțește personal grupurile și are grijă de fiecare pelerin."
            )}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              to="/destinations"
              className="inline-flex items-center px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 transition-colors rounded-sm"
            >
              {t("Посмотреть направления", "Vezi destinațiile")}
            </Link>
            <Link
              to="/calendar"
              className="text-foreground gold-underline font-serif text-sm tracking-wide hover:text-gold transition-colors"
            >
              {t("Календарь поездок", "Calendar de călătorii")}
            </Link>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-[1fr_280px] gap-12 items-start">
          <div className="prose-warm">
            <p className="overline mb-4">{t("Здравствуйте", "Bun venit")}</p>
            <p className="text-xl md:text-2xl font-serif italic text-foreground/90 leading-[1.7]">
              {t(
                "Меня зовут Анна. Я организую паломнические поездки уже несколько лет — езжу сама в Иерусалим, в Бари, на Корфу. Этот сайт — попытка собрать опыт и поделиться им.",
                "Mă numesc Anna. Organizez pelerinaje de câțiva ani — merg eu însămi la Ierusalim, la Bari, pe Corfu. Acest site este o încercare de a aduna experiența și a o împărtăși."
              )}
            </p>
            <p className="mt-6 text-base md:text-lg leading-[1.85] text-foreground/80">
              {t(
                "Каждая поездка готовится с заботой: программа, духовное сопровождение, размещение рядом со святынями, неспешный темп. Если у вас возникнут вопросы — пишите или звоните, я отвечаю лично.",
                "Fiecare călătorie este pregătită cu grijă: programul, însoțirea duhovnicească, cazarea lângă sanctuare, ritmul liniștit. Dacă aveți întrebări — scrieți sau sunați, răspund personal."
              )}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="aspect-[4/5] bg-secondary border border-gold/30 rounded-sm overflow-hidden flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-serif italic px-6 text-center">
                {t("Фотография Анны", "Fotografia Annei")}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground font-serif italic text-center">
              {t("Анна Плотник", "Anna Plotnik")}
            </p>
          </div>
        </div>
      </section>

      {/* DIRECTIONS */}
      <section className="bg-secondary/60 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="overline mb-3">{t("Направления", "Destinații")}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-4">
              {t("Куда мы ездим", "Unde călătorim")}
            </h2>
            <p className="text-muted-foreground font-serif italic max-w-xl mx-auto">
              {t(
                "Восемь направлений, к которым мы готовим группы в 2026 году",
                "Opt destinații pentru care pregătim grupuri în 2026"
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-7">
            {destinations.map((d) => {
              const c = lang === "ru" ? d.ru : d.ro;
              return (
                <article
                  key={d.slug}
                  className="bg-card border border-gold/30 rounded-sm overflow-hidden group hover:border-gold/70 transition-all duration-500"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={d.img}
                      alt={c.title}
                      loading="lazy"
                      width={1024}
                      height={640}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms]"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="font-serif text-2xl text-foreground mb-3 leading-tight">
                      {c.title}
                    </h3>
                    {c.notice && (
                      <p className="text-xs italic text-accent mb-3 font-serif">— {c.notice}</p>
                    )}
                    <p className="text-foreground/75 leading-relaxed mb-5">{c.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border/60">
                      <p className="text-sm text-muted-foreground font-serif">
                        {c.duration} <span className="text-gold mx-1">·</span> {c.price}
                      </p>
                      <Link
                        to="/destinations"
                        className="text-sm font-serif text-foreground gold-underline hover:text-gold transition-colors"
                      >
                        {t("Подробнее", "Detalii")} →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLESSING / TRUST */}
      <section className="py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="divider-gold overline mb-8">{t("С молитвой", "Cu rugăciune")}</p>
          <p className="font-serif italic text-2xl md:text-3xl text-foreground/85 leading-relaxed mb-10">
            {t(
              "По благословению ",
              "Cu binecuvântarea "
            )}
            <span className="text-muted-foreground">[…]</span>
          </p>
          <div className="grid sm:grid-cols-3 gap-8 mt-12 text-left sm:text-center">
            <div>
              <div className="text-3xl mb-3">🕊️</div>
              <p className="font-serif text-foreground/90 leading-relaxed">
                {t(
                  "Духовное сопровождение в каждой поездке",
                  "Însoțire duhovnicească la fiecare călătorie"
                )}
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">📜</div>
              <p className="font-serif text-foreground/90 leading-relaxed">
                {t(
                  "Лицензированное агентство (Минкультуры РМ)",
                  "Agenție licențiată (Min. Culturii RM)"
                )}
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">💛</div>
              <p className="font-serif text-foreground/90 leading-relaxed">
                {t("Личное участие Анны — она едет с группой", "Anna însoțește personal grupul")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING TRIPS */}
      <section className="bg-card/60 py-20 md:py-24 border-y border-border/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-10">
            <p className="overline mb-3">{t("Расписание", "Program")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
              {t("Ближайшие поездки", "Următoarele călătorii")}
            </h2>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full font-serif">
              <thead>
                <tr className="border-b border-gold/40 text-left">
                  <th className="py-4 pr-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">{t("Дата", "Data")}</th>
                  <th className="py-4 pr-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">{t("Направление", "Destinație")}</th>
                  <th className="py-4 pr-4 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden md:table-cell">{t("Длительность", "Durată")}</th>
                  <th className="py-4 pr-4 text-xs uppercase tracking-widest text-muted-foreground font-medium">{t("Цена", "Preț")}</th>
                  <th className="py-4 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden sm:table-cell">{t("Места", "Locuri")}</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-secondary/40 transition-colors cursor-pointer"
                  >
                    <td className="py-4 pr-4 text-foreground/85">{row.date[lang]}</td>
                    <td className="py-4 pr-4 text-foreground">{row.dest[lang]}</td>
                    <td className="py-4 pr-4 text-foreground/70 hidden md:table-cell">{row.dur[lang]}</td>
                    <td className="py-4 pr-4 text-gold font-medium">{row.price}</td>
                    <td className="py-4 text-muted-foreground italic text-sm hidden sm:table-cell">{row.seats[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/calendar"
              className="inline-block font-serif text-foreground gold-underline hover:text-gold transition-colors"
            >
              {t("Все поездки 2026 года", "Toate călătoriile 2026")} →
            </Link>
          </div>
        </div>
      </section>

      {/* PRIEST CONVERSATION TEASER */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <p className="overline mb-3">{t("Беседы", "Conversații")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
              {t("Разговор со священником", "Conversație cu preotul")}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-7 max-w-prose">
              {t(
                "Вопросы о подготовке к паломничеству, исповеди, духовной жизни. Отвечают батюшки Кишинёва и духовники, сопровождающие наши группы.",
                "Întrebări despre pregătirea pentru pelerinaj, spovedanie, viața duhovnicească. Răspund preoți din Chișinău și duhovnicii care însoțesc grupurile."
              )}
            </p>
            <ul className="space-y-2.5 font-serif italic text-foreground/75 mb-8">
              <li>— {t("Как готовиться к паломничеству?", "Cum să te pregătești de pelerinaj?")}</li>
              <li>— {t("Нужно ли поститься перед поездкой?", "Trebuie să postim înainte de călătorie?")}</li>
              <li>— {t("Что взять с собой в Иерусалим?", "Ce să iei cu tine la Ierusalim?")}</li>
              <li>— {t("Как правильно прикладываться к мощам?", "Cum ne închinăm la moaște?")}</li>
            </ul>
            <Link
              to="/with-priest"
              className="font-serif text-foreground gold-underline hover:text-gold transition-colors"
            >
              {t("Перейти к беседам", "Treci la conversații")} →
            </Link>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={bookImg}
              alt=""
              loading="lazy"
              width={1024}
              height={600}
              className="w-full h-auto rounded-sm border border-gold/30 shadow-[0_8px_40px_-20px_rgba(61,40,23,0.35)]"
            />
          </div>
        </div>
      </section>

      {/* BLOG TEASER */}
      <section className="bg-secondary/50 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="overline mb-3">{t("Блог", "Blog")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
              {t("Истории паломников", "Povești de pelerini")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {blogTeasers.map((post, i) => (
              <article key={i} className="bg-card border border-gold/30 p-7 rounded-sm">
                <p className="overline text-[10px] mb-4">
                  {t("История", "Poveste")} · {i + 1}
                </p>
                <h3 className="font-serif text-xl text-foreground mb-4 leading-snug min-h-[3.5rem]">
                  {t(post.ru, post.ro)}
                </h3>
                <Link
                  to="/blog"
                  className="text-sm font-serif text-foreground gold-underline hover:text-gold transition-colors"
                >
                  {t("Читать", "Citește")} →
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/blog"
              className="font-serif text-foreground gold-underline hover:text-gold transition-colors"
            >
              {t("Все истории", "Toate poveștile")} →
            </Link>
          </div>
        </div>
      </section>

      {/* ORTHODOX CALENDAR TEASER */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="overline mb-4">{t("Календарь", "Calendar")}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-7">
            {t("Православный календарь", "Calendar ortodox")}
          </h2>
          <p className="font-serif italic text-xl text-foreground/85 leading-relaxed mb-3">
            {t("Сегодня — ", "Astăzi — ")}
            <span className="text-gold">{today}</span>
          </p>
          <p className="font-serif italic text-muted-foreground mb-8">
            {t(
              "Ближайший праздник: Введение во храм Пресвятой Богородицы (4 декабря)",
              "Următoarea sărbătoare: Intrarea în Biserică a Maicii Domnului (4 decembrie)"
            )}
          </p>
          <Link
            to="/orthodox-calendar"
            className="font-serif text-foreground gold-underline hover:text-gold transition-colors"
          >
            {t("Посмотреть весь календарь", "Vezi calendarul complet")} →
          </Link>
        </div>
      </section>

      {/* CATALOG TEASER */}
      <section className="bg-card/70 py-20 md:py-24 border-t border-border/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 max-w-2xl">
            <p className="overline mb-3">{t("По предзаказу", "La pre-comandă")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-5">
              {t("Иконы, ладан, литература", "Icoane, tămâie, literatură")}
            </h2>
            <p className="text-foreground/75 leading-relaxed font-serif italic">
              {t(
                "Анна привозит из своих поездок иконы, ладан, духовную литературу. Если что-то из этого вас интересует — можно оставить предзаказ, и мы свяжемся, когда товар будет в Кишинёве.",
                "Anna aduce din călătorii icoane, tămâie, literatură duhovnicească. Dacă vă interesează ceva — puteți lăsa o pre-comandă, iar noi vă contactăm când articolul ajunge în Chișinău."
              )}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {catalogTeasers.map((item, i) => (
              <div
                key={i}
                className="bg-background border border-gold/30 p-6 rounded-sm aspect-[4/5] flex flex-col justify-between"
              >
                <div className="flex-1 flex items-center justify-center text-5xl text-gold/60 font-serif">
                  ☩
                </div>
                <div>
                  <p className="font-serif text-foreground leading-snug mb-2">
                    {t(item.ru, item.ro)}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {t("по предзаказу", "la pre-comandă")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              to="/catalog"
              className="font-serif text-foreground gold-underline hover:text-gold transition-colors"
            >
              {t("Каталог", "Catalog")} →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

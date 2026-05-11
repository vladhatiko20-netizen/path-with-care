import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import annaHero from "@/assets/anna-hero.jpg";
import annaJerusalem from "@/assets/anna-jerusalem.jpg";
import annaCorfu from "@/assets/anna-corfu.jpg";
import annaBari from "@/assets/anna-bari.jpg";
import annaGeorgia from "@/assets/anna-georgia.jpg";
import annaAthos from "@/assets/anna-athos.jpg";
import annaRomania from "@/assets/anna-romania.jpg";
import priest1 from "@/assets/team-priest1.jpg";
import priest2 from "@/assets/team-priest2.jpg";
import natalia from "@/assets/team-natalia.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О нас — Паломник" },
      { name: "description", content: "Анна Плотник — путешественница и паломница. Подразделение SRL Eldorado Tur." },
      { property: "og:title", content: "О нас — Паломник" },
      { property: "og:description", content: "Анна Плотник — путешественница и паломница." },
      { property: "og:image", content: annaHero },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, lang } = useLang();

  const gallery = [
    { img: annaJerusalem, ru: "Иерусалим, 2024 — у Гроба Господня", ro: "Ierusalim, 2024 — la Sfântul Mormânt" },
    { img: annaCorfu, ru: "Корфу — у мощей Святителя Спиридона", ro: "Corfu — la moaștele Sf. Spiridon" },
    { img: annaBari, ru: "Бари — у мощей Святителя Николая", ro: "Bari — la moaștele Sf. Nicolae" },
    { img: annaGeorgia, ru: "Грузия — Мцхета, Светицховели", ro: "Georgia — Mțheta, Svetițhoveli" },
    { img: annaAthos, ru: "Афон — Уранополь, перед паломничеством", ro: "Athos — Ouranopoli, înainte de pelerinaj" },
    { img: annaRomania, ru: "Румыния — монастырь Путна", ro: "România — mănăstirea Putna" },
  ];

  const team = [
    { img: natalia, ru: { name: "Наталия", role: "Менеджер групп, координация поездок" }, ro: { name: "Natalia", role: "Manager grupuri, coordonare călătorii" } },
    { img: priest1, ru: { name: "Отец Иоанн", role: "Сопровождает паломнические группы" }, ro: { name: "Părintele Ioan", role: "Însoțește grupurile de pelerini" } },
    { img: priest2, ru: { name: "Отец Серафим", role: "Духовник, беседы со священником" }, ro: { name: "Părintele Serafim", role: "Duhovnic, dialog cu preotul" } },
  ];

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative">
        <div className="grid md:grid-cols-2 gap-0 items-stretch">
          <div className="aspect-[4/3] md:aspect-auto md:min-h-[520px] overflow-hidden">
            <img
              src={annaHero}
              alt={t("Анна Плотник", "Anna Plotnik")}
              width={1600}
              height={1024}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-card flex items-center px-6 md:px-12 py-14 md:py-20">
            <div>
              <p className="overline mb-4">{t("О нас", "Despre noi")}</p>
              <h1 className="font-serif text-3xl md:text-[44px] lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
                {t("Анна Плотник — путешественница и паломница", "Anna Plotnik — călătoare și pelerină")}
              </h1>
              <p className="font-serif italic text-lg text-foreground/80 leading-relaxed">
                {t(
                  "Здравствуйте. Меня зовут Анна. Здесь — несколько слов о нашем общем деле.",
                  "Bună ziua. Mă numesc Anna. Aici — câteva cuvinte despre lucrarea noastră comună."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center text-2xl text-gold py-8" aria-hidden>☦</div>

      {/* PERSONAL ADDRESS */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="space-y-5 text-foreground/85 text-[17px] leading-[1.85]">
          <p>{t(
            "Я Анна. Уже несколько лет я организую поездки к святым местам. Сама бываю в Иерусалиме, на Корфу, в Бари. Мне дорого это служение — помогать людям прийти к святыням, помолиться, вернуться домой с тихой радостью в сердце.",
            "Sunt Anna. De câțiva ani organizez călătorii la locurile sfinte. Eu însămi merg la Ierusalim, pe Corfu, la Bari. Această slujire îmi este dragă — să ajut oamenii să ajungă la sanctuare, să se roage, să se întoarcă acasă cu o bucurie liniștită în inimă."
          )}</p>
          <p>{t(
            "Этот сайт — продолжение работы нашего туристического агентства Eldorado Tur, но с фокусом на паломничество. Здесь — поездки, которые я готовлю с особенным вниманием. Здесь — люди, которые сопровождают группы: батюшки, экскурсоводы, паломники со стажем.",
            "Acest site este o continuare a activității agenției noastre Eldorado Tur, dar cu accent pe pelerinaj. Aici sunt călătoriile pe care le pregătesc cu o atenție deosebită. Aici sunt oamenii care însoțesc grupurile: preoți, ghizi, pelerini cu experiență."
          )}</p>
          <p>{t(
            "Если у вас есть вопросы — звоните, пишите. Я отвечу лично.",
            "Dacă aveți întrebări — sunați, scrieți. Vă voi răspunde personal."
          )}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 font-serif">
          <a href="tel:+37368778676" className="inline-flex items-center px-6 py-2.5 bg-accent text-primary-foreground hover:bg-accent/90 transition-colors rounded-sm text-sm tracking-wide">
            +373 68 77 86 76
          </a>
          <a href="mailto:pilgrimage@eldoradotur.md" className="inline-flex items-center px-6 py-2.5 border border-gold text-foreground hover:bg-secondary transition-colors rounded-sm text-sm tracking-wide">
            pilgrimage@eldoradotur.md
          </a>
        </div>
      </section>

      <div className="text-center text-2xl text-gold pb-4" aria-hidden>☦</div>

      {/* GALLERY */}
      <section className="bg-secondary/50 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="overline mb-3">{t("Из поездок", "Din călătorii")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              {t("Святые места, в которых я была", "Locurile sfinte unde am fost")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gallery.map((g, i) => (
              <figure key={i} className="bg-card border border-gold/30 rounded-sm overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={g.img} alt={t(g.ru, g.ro)} loading="lazy" width={800} height={600} className="w-full h-full object-cover" />
                </div>
                <figcaption className="p-3 text-sm font-serif italic text-foreground/75 text-center">
                  {t(g.ru, g.ro)}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground italic font-serif">
            {t("Личные фотографии Анны будут добавлены в ближайшее время.", "Fotografiile personale ale Annei vor fi adăugate în curând.")}
          </p>
        </div>
      </section>

      {/* VIDEO */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="overline mb-3">{t("Видео", "Video")}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6">
            {t("Видеоприветствие Анны", "Mesaj video de la Anna")}
          </h2>
          <div className="aspect-video bg-card border border-dashed border-gold/50 rounded-sm flex items-center justify-center">
            <p className="font-serif italic text-muted-foreground">
              {t("Видеоприветствие — будет добавлено", "Mesaj video — va fi adăugat")}
            </p>
          </div>
        </div>
      </section>

      <div className="text-center text-2xl text-gold pb-4" aria-hidden>☦</div>

      {/* ELDORADO LINK */}
      <section className="bg-card/70 border-y border-border/60 py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="overline mb-3">{t("Часть агентства", "Parte din agenție")}</p>
          <p className="text-foreground/85 leading-relaxed mb-6 font-serif text-lg">
            {t(
              "Сайт «Паломник» — направление туристического агентства SRL Eldorado Tur. Лицензия Министерства культуры РМ. Работаем с 2015 года.",
              "Site-ul „Pelerin” este o direcție a agenției turistice SRL Eldorado Tur. Licență a Ministerului Culturii al RM. Activăm din 2015."
            )}
          </p>
          <a
            href="https://eldoradotur.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-7 py-3 border border-gold text-foreground hover:bg-secondary transition-colors rounded-sm font-serif text-sm tracking-wide"
          >
            {t("Узнать больше об агентстве", "Aflați mai multe despre agenție")} ↗
          </a>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 text-center">
            <p className="overline mb-3">{t("Команда", "Echipa")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              {t("Кто сопровождает поездки", "Cine însoțește călătoriile")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Anna card */}
            <article className="bg-card border border-gold/30 rounded-sm overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={annaHero} alt="Anna" loading="lazy" width={640} height={800} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-foreground">{t("Анна Плотник", "Anna Plotnik")}</h3>
                <p className="text-sm text-muted-foreground italic font-serif mt-1">
                  {t("Организатор поездок", "Organizator de călătorii")}
                </p>
              </div>
            </article>
            {team.map((m, i) => {
              const c = lang === "ru" ? m.ru : m.ro;
              return (
                <article key={i} className="bg-card border border-gold/30 rounded-sm overflow-hidden">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={m.img} alt={c.name} loading="lazy" width={640} height={800} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-foreground">{c.name}</h3>
                    <p className="text-sm text-muted-foreground italic font-serif mt-1">{c.role}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground italic font-serif">
            {t("Имена и фотографии священников будут уточнены перед каждой поездкой.", "Numele și fotografiile preoților vor fi confirmate înainte de fiecare călătorie.")}
          </p>
        </div>
      </section>

      {/* COMPANY DETAILS */}
      <section className="bg-secondary/60 py-12 border-t border-border/60">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-foreground/75 font-serif leading-relaxed">
          <p className="text-foreground font-medium">SRL Eldorado Tur · IDNO 1015600011157</p>
          <p>bd. Dacia 20, of. 81, Chișinău, MD2060</p>
          <p className="mt-3">
            <a href="tel:+37368778676" className="hover:text-gold transition-colors">+373 68 77 86 76</a>
            <span className="mx-2 text-border">·</span>
            <a href="mailto:pilgrimage@eldoradotur.md" className="hover:text-gold transition-colors">pilgrimage@eldoradotur.md</a>
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            <Link to="/contacts" className="hover:text-foreground gold-underline">{t("Связаться с нами", "Contactați-ne")}</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

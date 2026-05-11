import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero-destinations.jpg";
import jerusalemImg from "@/assets/dest-jerusalem.jpg";
import bariImg from "@/assets/dest-bari.jpg";
import corfuImg from "@/assets/dest-corfu.jpg";
import athosImg from "@/assets/dest-athos.jpg";
import georgiaImg from "@/assets/dest-georgia.jpg";
import romaniaImg from "@/assets/dest-romania.jpg";
import ukraineImg from "@/assets/dest-ukraine.jpg";
import moldovaImg from "@/assets/dest-moldova.jpg";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Направления — Паломник" },
      { name: "description", content: "Восемь направлений к православным святыням мира из Кишинёва — Иерусалим, Бари, Корфу, Афон, Грузия, Румыния, Украина, Молдова." },
      { property: "og:title", content: "Направления — Паломник" },
      { property: "og:description", content: "Восемь направлений к православным святыням мира из Кишинёва." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Page,
});

type D = {
  slug: string;
  img: string;
  ru: { title: string; desc: string; details: string; duration: string; price: string; notice?: string };
  ro: { title: string; desc: string; details: string; duration: string; price: string; notice?: string };
};

const items: D[] = [
  { slug: "jerusalem", img: jerusalemImg,
    ru: { title: "Иерусалим и Святая Земля", desc: "Гроб Господень, Гефсимания, Вифлеем, Назарет.", details: "Литургия у Гроба Господня, Голгофа, гора Сион, Иордан, гора Елеон, Лавра св. Саввы Освященного.", duration: "8–10 дней", price: "от €1200" },
    ro: { title: "Ierusalim și Țara Sfântă", desc: "Sfântul Mormânt, Ghetsimani, Betleem, Nazaret.", details: "Liturghie la Sfântul Mormânt, Golgota, muntele Sion, Iordan, Lavra Sf. Sava.", duration: "8–10 zile", price: "de la €1200" } },
  { slug: "bari", img: bariImg,
    ru: { title: "Бари — к мощам Святителя Николая", desc: "Поклонение мощам Святителя Николая Чудотворца.", details: "Базилика св. Николая, спуск к мощам, акафист, поездка в Лоретто и Манопелло по выбору.", duration: "5–7 дней", price: "от €750" },
    ro: { title: "Bari — la moaștele Sf. Nicolae", desc: "Închinare la moaștele Sfântului Nicolae.", details: "Bazilica Sf. Nicolae, coborâre la moaște, acatist, posibilă vizită la Loreto și Manoppello.", duration: "5–7 zile", price: "de la €750" } },
  { slug: "corfu", img: corfuImg,
    ru: { title: "Корфу — к мощам Святителя Спиридона", desc: "Нетленные мощи Святителя Спиридона Тримифунтского.", details: "Храм св. Спиридона, литургия, прогулка по старому городу, монастырь Палеокастрица.", duration: "5–7 дней", price: "от €700" },
    ro: { title: "Corfu — la moaștele Sf. Spiridon", desc: "Moaștele neputrede ale Sfântului Spiridon.", details: "Biserica Sf. Spiridon, liturghie, mănăstirea Paleokastritsa.", duration: "5–7 zile", price: "de la €700" } },
  { slug: "athos", img: athosImg,
    ru: { title: "Афон — Святая Гора", desc: "Поездка на Святую Гору Афон, оформление диамонитириона.", details: "Великая Лавра, Ватопед, Хиландар, Иверон, Пантелеймонов монастырь. Помощь с диамонитирионом.", duration: "5–8 дней", price: "от €900", notice: "только для мужчин" },
    ro: { title: "Athos — Muntele Sfânt", desc: "Călătorie la Muntele Athos, asistență diamonitirion.", details: "Marea Lavră, Vatopedi, Hilandar, Iviron, Sf. Pantelimon.", duration: "5–8 zile", price: "de la €900", notice: "doar pentru bărbați" } },
  { slug: "georgia", img: georgiaImg,
    ru: { title: "Грузия — святыни Грузинской Церкви", desc: "Мцхета, Светицховели, Бодбе, Давида Гареджи.", details: "Светицховели — хитон Господень, Самтавро, Джвари, монастырь св. Нины в Бодбе, пещерный Давида Гареджи.", duration: "6–8 дней", price: "от €650" },
    ro: { title: "Georgia — sanctuarele georgiene", desc: "Mțheta, Svetițhoveli, Bodbe, David Gareja.", details: "Svetițhoveli, Samtavro, Jvari, mănăstirea Sf. Nina la Bodbe.", duration: "6–8 zile", price: "de la €650" } },
  { slug: "romania", img: romaniaImg,
    ru: { title: "Румыния — монастыри и святые отцы", desc: "Путна, Воронец, Сучевица. Места румынских старцев.", details: "Путна — гробница Стефана Великого, расписные монастыри Буковины, Сихастрия — место старца Клеопы.", duration: "4–6 дней", price: "от €400" },
    ro: { title: "România — mănăstiri și părinți", desc: "Putna, Voroneț, Sucevița. Locuri ale stareților.", details: "Putna — mormântul lui Ștefan cel Mare, mănăstirile pictate ale Bucovinei, Sihăstria.", duration: "4–6 zile", price: "de la €400" } },
  { slug: "ukraine", img: ukraineImg,
    ru: { title: "Украина — Почаев и Киев", desc: "Святыни Почаевской Лавры и Киево-Печерской.", details: "Почаевская Лавра, стопочка Божией Матери, Киево-Печерская Лавра, ближние и дальние пещеры.", duration: "5–7 дней", price: "от €500", notice: "уточняйте даты" },
    ro: { title: "Ucraina — Poceaev și Kiev", desc: "Sanctuarele Lavrei de la Poceaev și Kiev.", details: "Lavra Poceaev, Lavra Pecerska din Kiev, peșterile.", duration: "5–7 zile", price: "de la €500", notice: "verificați datele" } },
  { slug: "moldova", img: moldovaImg,
    ru: { title: "Молдова — святыни родного края", desc: "Каприана, Куркь, Хынку, Сахарна.", details: "Один-два дня — Каприана, Хынку, Куркь, скальный монастырь Сахарна, Цыпова.", duration: "1–2 дня", price: "от €30" },
    ro: { title: "Moldova — sanctuarele pământului natal", desc: "Căpriana, Curchi, Hâncu, Saharna.", details: "Căpriana, Hâncu, Curchi, mănăstirea rupestră Saharna, Țipova.", duration: "1–2 zile", price: "de la €30" } },
];

function Page() {
  const { t, lang } = useLang();
  return (
    <PageShell>
      <section className="relative h-[40vh] md:h-[50vh] min-h-[320px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Дорога к монастырю", "Drum spre mănăstire")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("ВОСЕМЬ НАПРАВЛЕНИЙ", "OPT DESTINAȚII")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Куда мы ездим", "Unde călătorim")}
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((d) => {
            const c = lang === "ru" ? d.ru : d.ro;
            return (
              <Link key={d.slug} to="/contacts" className="group block bg-card border border-gold/30 rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_12px_30px_-15px_rgba(61,40,23,0.4)] hover:-translate-y-0.5 transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={d.img} alt={c.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1200ms]" />
                </div>
                <div className="p-5">
                  <h2 className="font-serif text-xl text-foreground mb-1 leading-tight">{c.title}</h2>
                  {c.notice && <p className="text-xs italic text-accent mb-2 font-serif">— {c.notice}</p>}
                  <p className="text-sm text-foreground/65 leading-snug mb-3">{c.desc}</p>
                  <p className="text-sm text-foreground/75 italic font-serif leading-relaxed mb-4">{c.details}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <span className="text-xs text-muted-foreground font-serif">{c.duration}</span>
                    <span className="text-base text-gold font-serif font-medium">{c.price}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

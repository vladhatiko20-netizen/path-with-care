import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import { getDestinationBySlug } from "@/lib/destinations.functions";
import { listPilgrimages, type PilgrimageSummary } from "@/lib/pilgrimages.functions";
import { createLead } from "@/lib/leads.functions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImg from "@/assets/dest-bari.jpg";
import cryptImg from "@/assets/bari-crypt.jpg";
import interiorImg from "@/assets/bari-interior.jpg";

const PAGE_URL = "https://path-with-care.lovable.app/destinations/bari";
const TITLE_RU = "Бари — паломничество к мощам Святителя Николая Чудотворца";
const TITLE_RO = "Bari — pelerinaj la moaștele Sfântului Ierarh Nicolae";
const DESC_RU = "Паломническая поездка из Кишинёва в итальянский Бари — поклонение мощам Святителя Николая, акафист у крипты, программа на 5–7 дней.";
const DESC_RO = "Pelerinaj din Chișinău la Bari — închinare la moaștele Sfântului Nicolae, acatist la criptă, program de 5–7 zile.";

export const Route = createFileRoute("/destinations/bari")({
  loader: async () => {
    const [destination, pilgrimages] = await Promise.all([
      getDestinationBySlug({ data: { slug: "bari" } }),
      listPilgrimages(),
    ]);
    return { destination, pilgrimages };
  },
  head: ({ loaderData }) => {
    const price = loaderData?.destination?.price_from ?? 750;
    return {
      meta: [
        { title: TITLE_RU },
        { name: "description", content: DESC_RU },
        { property: "og:title", content: TITLE_RU },
        { property: "og:description", content: DESC_RU },
        { property: "og:type", content: "product" },
        { property: "og:url", content: PAGE_URL },
        { property: "og:image", content: heroImg },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: TITLE_RU },
        { name: "twitter:description", content: DESC_RU },
        { name: "twitter:image", content: heroImg },
      ],
      links: [{ rel: "canonical", href: PAGE_URL }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: TITLE_RU,
            description: DESC_RU,
            image: heroImg,
            touristType: "Orthodox Christian pilgrimage",
            provider: {
              "@type": "TravelAgency",
              name: "Паломник",
              url: "https://path-with-care.lovable.app",
              telephone: "+37368778676",
              email: "pilgrimage@eldoradotur.md",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: String(price),
              availability: "https://schema.org/InStock",
              url: PAGE_URL,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://path-with-care.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Направления", item: "https://path-with-care.lovable.app/destinations" },
              { "@type": "ListItem", position: 3, name: "Бари", item: PAGE_URL },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Страница не найдена</h1>
        <Link to="/destinations" className="text-accent hover:underline font-serif">К направлениям</Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center font-serif">
          <h1 className="text-3xl mb-3">Не удалось загрузить страницу</h1>
          <p className="text-foreground/70 mb-6">{error.message}</p>
          <button onClick={() => router.invalidate()} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm">
            Попробовать снова
          </button>
        </div>
      </PageShell>
    );
  },
  component: BariPage,
});

function BariPage() {
  const { destination, pilgrimages } = Route.useLoaderData();
  const { t, lang } = useLang();

  const title = destination ? (lang === "ru" ? destination.title_ru : destination.title_ro) : t("Бари", "Bari");
  const duration = destination ? (lang === "ru" ? destination.duration_ru : destination.duration_ro) : null;
  const groupSize = destination ? (lang === "ru" ? destination.group_size_ru : destination.group_size_ro) : null;
  const priceFrom = destination?.price_from ?? null;

  const bariDates = (pilgrimages ?? []).filter((p: PilgrimageSummary) => {
    const d = (p.destination_ru + " " + p.destination_ro).toLowerCase();
    return p.slug.toLowerCase().includes("bari") || d.includes("бари") || d.includes("bari");
  });

  return (
    <PageShell>
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="max-w-6xl mx-auto px-6 pt-6 text-[15px] font-serif text-foreground/70">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-accent">{t("Главная", "Acasă")}</Link></li>
          <li aria-hidden="true">→</li>
          <li><Link to="/destinations" className="hover:text-accent">{t("Направления", "Destinații")}</Link></li>
          <li aria-hidden="true">→</li>
          <li className="text-foreground">{t("Бари", "Bari")}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[64vh] min-h-[400px] flex items-end overflow-hidden mt-4">
        <img src={heroImg} alt={t("Базилика Святителя Николая в Бари", "Bazilica Sfântului Nicolae din Bari")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-16 w-full">
          <p className="overline text-white/90 mb-3">{t("ПАЛОМНИЧЕСТВО", "PELERINAJ")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">{title}</h1>
          <p className="mt-4 font-serif italic text-white/85 text-lg md:text-xl max-w-2xl">
            {t(
              "«Правило веры и образ кротости, воздержания учителя яви тя стаду твоему».",
              "„Îndreptător al credinței și chip al blândeții, învățător al înfrânării te-a arătat turmei tale”.",
            )}
          </p>
        </div>
      </section>

      {/* Info bar — from database */}
      <section className="bg-card border-y border-gold/30">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 font-serif text-center">
          <div>
            <p className="overline mb-1">{t("Длительность", "Durata")}</p>
            <p className="text-[17px] text-foreground">{duration ? `${duration}${t(" дней", " zile")}` : "—"}</p>
          </div>
          <div>
            <p className="overline mb-1">{t("Группа", "Grup")}</p>
            <p className="text-[17px] text-foreground">{groupSize ?? "—"}</p>
          </div>
          <div>
            <p className="overline mb-1">{t("Цена", "Preț")}</p>
            <p className="text-[17px] text-gold">{priceFrom ? `${t("от", "de la")} €${priceFrom}` : "—"}</p>
          </div>
          <div>
            <p className="overline mb-1">{t("Сопровождение", "Însoțire")}</p>
            <p className="text-[17px] text-foreground">{t("со священником", "cu preot")}</p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-6 py-12 md:py-16 font-serif">
        <h2 className="text-3xl md:text-4xl text-foreground font-light mb-5">{t("О поездке", "Despre pelerinaj")}</h2>
        <p className="text-[17px] md:text-lg text-foreground/85 leading-relaxed">
          {t(
            "Святитель Николай Чудотворец — один из самых почитаемых святых православного мира. Его мощи покоятся в Бари с 1087 года, и сюда стекаются паломники со всех концов земли. В нашей поездке вы пройдёте к мощам, услышите акафист, помолитесь у гробницы и увезёте с собою благодатное миро, истекающее от мощей.",
            "Sfântul Ierarh Nicolae este unul dintre cei mai cinstiți sfinți ai lumii ortodoxe. Moaștele sale se află în Bari din anul 1087, iar aici vin pelerini din toată lumea. În pelerinajul nostru veți coborî la moaște, veți asculta acatistul, vă veți ruga la mormânt și veți lua cu voi sfântul mir care izvorăște de la moaște.",
          )}
        </p>
      </section>

      {/* Святыни */}
      <section className="bg-secondary/40 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-8 text-center">{t("Главные святыни", "Sfintele moaște")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: cryptImg, ru: { t: "Крипта со святыми мощами", d: "Спуск в нижний храм к мраморной гробнице, где почивают мощи Святителя." }, ro: { t: "Cripta cu sfintele moaște", d: "Coborâre la biserica de jos, la mormântul de marmură unde se află moaștele." } },
              { img: interiorImg, ru: { t: "Икона Святителя Николая", d: "Особое моление перед чудотворным образом, акафист и помазание святым миром." }, ro: { t: "Icoana Sfântului Nicolae", d: "Rugăciune deosebită înaintea sfintei icoane, acatist și ungere cu sfântul mir." } },
              { img: heroImg, ru: { t: "Базилика Святителя", d: "Главное место паломничества — храм, в котором почивают мощи угодника Божия." }, ro: { t: "Bazilica Sfântului", d: "Locul principal de pelerinaj — biserica în care se află moaștele plăcutului lui Dumnezeu." } },
            ].map((s, i) => {
              const c = lang === "ru" ? s.ru : s.ro;
              return (
                <article key={i} className="bg-card border border-gold/30 rounded-sm overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={s.img} alt={c.t} loading="lazy" width={800} height={600} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 font-serif">
                    <h3 className="text-xl text-foreground mb-2 leading-tight">{c.t}</h3>
                    <p className="text-[17px] text-foreground/75 leading-relaxed">{c.d}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Программа */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Программа по дням", "Programul pe zile")}</h2>
        <Accordion type="single" collapsible className="font-serif">
          {[
            { ru: { t: "День 1 — Прибытие в Бари", d: "Перелёт из Кишинёва в Бари. Встреча в аэропорту, трансфер в гостиницу, размещение, вечерняя молитва." }, ro: { t: "Ziua 1 — Sosirea la Bari", d: "Zbor din Chișinău la Bari. Întâlnire la aeroport, transfer la hotel, cazare, rugăciune de seară." } },
            { ru: { t: "День 2 — Литургия у мощей", d: "Утренняя Литургия у мощей Святителя Николая, акафист, поклонение, помазание миром." }, ro: { t: "Ziua 2 — Liturghie la moaște", d: "Sfânta Liturghie la moaștele Sfântului Nicolae, acatist, închinare, ungere cu mir." } },
            { ru: { t: "День 3 — Город Бари", d: "Старый город, церкви Бари, морская набережная, свободное время." }, ro: { t: "Ziua 3 — Orașul Bari", d: "Orașul vechi, bisericile din Bari, faleza mării, timp liber." } },
            { ru: { t: "День 4–6 — По выбору группы", d: "По договорённости — поездки в Лоретто, Манопелло, Монте-Гаргано." }, ro: { t: "Ziua 4–6 — La alegerea grupului", d: "Posibile excursii la Loreto, Manoppello, Monte Sant'Angelo." } },
            { ru: { t: "Последний день — Отъезд", d: "Прощальный молебен у мощей, трансфер в аэропорт, перелёт домой." }, ro: { t: "Ultima zi — Plecarea", d: "Tedeum de despărțire la moaște, transfer la aeroport, zbor acasă." } },
          ].map((d, i) => {
            const c = lang === "ru" ? d.ru : d.ro;
            return (
              <AccordionItem key={i} value={`d${i}`} className="border-gold/30">
                <AccordionTrigger className="text-[17px] md:text-lg text-foreground hover:text-accent">{c.t}</AccordionTrigger>
                <AccordionContent className="text-[17px] text-foreground/80 leading-relaxed">{c.d}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Включено / не включено */}
      <section className="bg-secondary/40 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 font-serif">
          <div>
            <h2 className="text-2xl md:text-3xl text-foreground font-light mb-4">{t("Что включено", "Ce este inclus")}</h2>
            <ul className="space-y-2 text-[17px] text-foreground/85 leading-relaxed">
              {[
                t("Авиаперелёт Кишинёв – Бари – Кишинёв", "Zbor Chișinău – Bari – Chișinău"),
                t("Проживание в гостинице 3*–4* с завтраками", "Cazare la hotel 3*–4* cu mic dejun"),
                t("Все трансферы и переезды по программе", "Toate transferurile și deplasările conform programului"),
                t("Сопровождение священника", "Însoțire de preot"),
                t("Православный гид-переводчик", "Ghid ortodox traducător"),
                t("Молебны и акафисты у святынь", "Tedeumuri și acatiste la sfintele moaște"),
                t("Медицинская страховка", "Asigurare medicală"),
              ].map((x, i) => (
                <li key={i} className="flex gap-2"><span className="text-gold">✦</span><span>{x}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl text-foreground font-light mb-4">{t("Не включено", "Nu este inclus")}</h2>
            <ul className="space-y-2 text-[17px] text-foreground/85 leading-relaxed">
              {[
                t("Личные расходы", "Cheltuieli personale"),
                t("Обеды и ужины", "Prânzurile și cinele"),
                t("Дополнительные экскурсии вне программы", "Excursii suplimentare în afara programului"),
                t("Чаевые гидам и водителям", "Bacșișurile ghizilor și șoferilor"),
              ].map((x, i) => (
                <li key={i} className="flex gap-2"><span className="text-foreground/40">·</span><span>{x}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ближайшие даты */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Ближайшие даты", "Datele apropiate")}</h2>
        {bariDates.length === 0 ? (
          <p className="font-serif italic text-[17px] text-foreground/70">
            {t("Даты уточняются. Свяжитесь с нами — подскажем ближайшую поездку.", "Datele se precizează. Contactați-ne — vă vom informa despre cel mai apropiat pelerinaj.")}
          </p>
        ) : (
          <ul className="space-y-3 font-serif">
            {bariDates.map((p: PilgrimageSummary) => (
              <li key={p.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-card border border-gold/30 rounded-sm px-5 py-4">
                <div>
                  <p className="text-[17px] text-foreground">{lang === "ru" ? p.title_ru : p.title_ro}</p>
                  <p className="text-sm text-foreground/65">
                    {new Date(p.start_date).toLocaleDateString(lang === "ru" ? "ru-RU" : "ro-RO")} — {new Date(p.end_date).toLocaleDateString(lang === "ru" ? "ru-RU" : "ro-RO")}
                    {!p.with_priest && <span className="ml-2 italic">({t("без священника", "fără preot")})</span>}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {p.price_eur && <span className="text-gold text-[17px]">€{p.price_eur}</span>}
                  <Link to="/calendar" className="text-accent hover:underline text-sm">{t("подробнее", "detalii")}</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Вопросы и ответы", "Întrebări și răspunsuri")}</h2>
          <Accordion type="single" collapsible className="font-serif">
            {[
              { ru: { q: "Нужна ли виза?", a: "Бари в Италии — для въезда необходима шенгенская виза. Помогаем с оформлением документов." }, ro: { q: "Este nevoie de viză?", a: "Bari este în Italia — este necesară viză Schengen. Vă ajutăm cu documentele." } },
              { ru: { q: "Можно ли с детьми?", a: "Да, дети от 7 лет с родителями приветствуются. Программа адаптируется под возраст." }, ro: { q: "Se poate cu copiii?", a: "Da, copiii de la 7 ani sunt bineveniți împreună cu părinții. Programul se adaptează vârstei." } },
              { ru: { q: "Будет ли возможность исповеди и причастия?", a: "Да, в поездке участвует православный священник, проводятся исповедь и Литургия у мощей." }, ro: { q: "Va fi posibilă spovedania și împărtășania?", a: "Da, în pelerinaj participă un preot ortodox, se săvârșesc spovedania și Sfânta Liturghie la moaște." } },
              { ru: { q: "Какое миро от мощей и можно ли его взять?", a: "Из мощей Святителя истекает благоуханное миро. Каждому паломнику передаётся флакончик с миром." }, ro: { q: "Ce este mirul de la moaște și pot lua acasă?", a: "Din moaștele Sfântului izvorăște mir bine mirositor. Fiecărui pelerin i se oferă un flacon cu mir." } },
              { ru: { q: "Какая физическая нагрузка в поездке?", a: "Поездка спокойная: переходы небольшие, много молитвенного времени. Подходит и для пожилых." }, ro: { q: "Cât de obositor este pelerinajul?", a: "Pelerinajul este liniștit: deplasări scurte, mult timp de rugăciune. Potrivit și pentru vârstnici." } },
              { ru: { q: "Как оплатить поездку?", a: "Бронирование — задаток, окончательный расчёт — за две недели до выезда. Только в офисе." }, ro: { q: "Cum se achită pelerinajul?", a: "Rezervare cu avans, plata finală cu două săptămâni înainte de plecare. Doar la birou." } },
            ].map((f, i) => {
              const c = lang === "ru" ? f.ru : f.ro;
              return (
                <AccordionItem key={i} value={`f${i}`} className="border-gold/30">
                  <AccordionTrigger className="text-[17px] md:text-lg text-foreground hover:text-accent text-left">{c.q}</AccordionTrigger>
                  <AccordionContent className="text-[17px] text-foreground/80 leading-relaxed">{c.a}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Lead form */}
      <LeadForm />

      {/* Contacts */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16 font-serif text-center">
        <h2 className="text-3xl md:text-4xl text-foreground font-light mb-4">{t("Связаться напрямую", "Contact direct")}</h2>
        <p className="text-[17px] text-foreground/80 mb-2">Анна: <a href="tel:+37368778676" className="text-accent hover:underline">+373 68 77 86 76</a></p>
        <p className="text-[17px] text-foreground/80 mb-2">Наталья: <a href="tel:+37368787599" className="text-accent hover:underline">+373 68 78 75 99</a></p>
        <p className="text-[17px] text-foreground/80">
          <a href="mailto:pilgrimage@eldoradotur.md" className="text-accent hover:underline">pilgrimage@eldoradotur.md</a>
        </p>
      </section>
    </PageShell>
  );
}

function LeadForm() {
  const { t } = useLang();
  const submit = useServerFn(createLead);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (form.name.trim().length < 1) {
      toast.error(t("Введите имя", "Introduceți numele"));
      return;
    }
    if (!/^[+\d\s()\-]{5,30}$/.test(form.phone.trim())) {
      toast.error(t("Проверьте номер телефона", "Verificați numărul de telefon"));
      return;
    }
    setSending(true);
    try {
      await submit({ data: { ...form, source: "bari" } });
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
      toast.success(t("Заявка отправлена", "Cererea a fost trimisă"));
    } catch (err) {
      toast.error(t("Не удалось отправить. Попробуйте позже.", "Nu s-a putut trimite. Încercați mai târziu."));
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="lead" className="bg-card border-y border-gold/30 py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-3">{t("Оставить заявку", "Lăsați o cerere")}</h2>
        <p className="font-serif italic text-foreground/70 mb-8 text-[17px]">
          {t("Свяжемся с вами в ближайший рабочий день.", "Vă vom contacta în prima zi lucrătoare.")}
        </p>
        {sent ? (
          <div className="p-5 bg-background border border-gold/40 rounded-sm font-serif italic text-[17px] text-foreground/85">
            {t("Спасибо! Ваша заявка получена.", "Mulțumim! Cererea dvs. a fost primită.")}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 font-serif">
            <input required maxLength={100} placeholder={t("Имя", "Nume")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[17px] focus:outline-none focus:border-gold" />
            <input required maxLength={30} placeholder={t("Телефон", "Telefon")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[17px] focus:outline-none focus:border-gold" />
            <input type="email" maxLength={255} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[17px] focus:outline-none focus:border-gold" />
            <textarea maxLength={2000} rows={5} placeholder={t("Сообщение (необязательно)", "Mesaj (opțional)")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-sm text-[17px] focus:outline-none focus:border-gold resize-none" />
            <button type="submit" disabled={sending} className="px-7 py-3 bg-accent text-primary-foreground text-[15px] font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md disabled:opacity-60">
              {sending ? t("Отправка…", "Se trimite…") : t("Отправить заявку", "Trimiteți cererea")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock, Users, Euro, Church,
  CheckCircle2, Minus,
  Calendar, HelpCircle,
  User, Phone, Mail, MessageSquare, Send,
} from "lucide-react";
import heroImg from "@/assets/dest-bari.jpg";
import cryptImg from "@/assets/bari-crypt.jpg";
import interiorImg from "@/assets/bari-interior.jpg";
import gallery1 from "@/assets/bari/gallery-1.jpg";
import gallery2 from "@/assets/bari/gallery-2.jpg";
import gallery3 from "@/assets/bari/gallery-3.jpg";
import gallery4 from "@/assets/bari/gallery-4.jpg";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { X } from "lucide-react";

const ViberIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8v1a8 8 0 0 1-8 8h-1l-4 3v-3.2A8 8 0 0 1 3 12v-1Z" />
    <path d="M9 9.5c0-.6.4-1 1-1h.6c.4 0 .8.3.9.7l.4 1.4c.1.4 0 .8-.3 1l-.6.5a6 6 0 0 0 2.9 2.9l.5-.6c.2-.3.6-.4 1-.3l1.4.4c.4.1.7.5.7.9v.6c0 .6-.4 1-1 1A7.5 7.5 0 0 1 9 9.5Z" />
  </svg>
);

const PAGE_URL = "https://path-with-care.lovable.app/destinations/bari";
const TITLE_RU = "Бари – паломничество к мощам Святителя Николая Чудотворца";
const TITLE_RO = "Bari – pelerinaj la moaștele Sfântului Ierarh Nicolae";
const DESC_RU = "Паломническая поездка из Кишинёва в итальянский Бари – поклонение мощам Святителя Николая, акафист у крипты, программа на 5–7 дней.";
const DESC_RO = "Pelerinaj din Chișinău la Bari – închinare la moaștele Sfântului Nicolae, acatist la criptă, program de 5–7 zile.";

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

function formatDateRange(start: string, end: string, lang: "ru" | "ro") {
  const locale = lang === "ru" ? "ru-RU" : "ro-RO";
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const sameYear = s.getFullYear() === e.getFullYear();
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "long" });
  const yearFmt = new Intl.DateTimeFormat(locale, { year: "numeric" });
  if (sameMonth) {
    return `${s.getDate()}–${e.getDate()} ${monthFmt.format(e)} ${yearFmt.format(e)}`;
  }
  if (sameYear) {
    return `${s.getDate()} ${monthFmt.format(s)} – ${e.getDate()} ${monthFmt.format(e)} ${yearFmt.format(e)}`;
  }
  return `${s.toLocaleDateString(locale)} – ${e.toLocaleDateString(locale)}`;
}

function BariPage() {
  const { destination, pilgrimages } = Route.useLoaderData();
  const { t, lang } = useLang();
  const [prefill, setPrefill] = useState<string>("");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [shrineModal, setShrineModal] = useState<number | null>(null);
  const [shrineExpand, setShrineExpand] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  const galleryPhotos = [
    { src: gallery1, alt: t("Базилика Святителя Николая в Бари", "Bazilica Sfântului Nicolae din Bari") },
    { src: gallery2, alt: t("Православный храм", "Biserică ortodoxă") },
    { src: gallery3, alt: t("Свечи и молитва", "Lumânări și rugăciune") },
    { src: gallery4, alt: t("Паломники в храме", "Pelerini în biserică") },
  ];
  const openLightbox = (i: number) => setLightbox({ open: true, index: i });

  function handleShrineClick(i: number) {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      setShrineModal(i);
    } else {
      setShrineExpand((cur) => (cur === i ? null : i));
    }
  }

  const title = destination ? (lang === "ru" ? destination.title_ru : destination.title_ro) : t("Бари", "Bari");
  const duration = destination ? (lang === "ru" ? destination.duration_ru : destination.duration_ro) : null;
  const groupSize = destination ? (lang === "ru" ? destination.group_size_ru : destination.group_size_ro) : null;
  const priceFrom = destination?.price_from ?? null;

  const bariDates = (pilgrimages ?? []).filter((p: PilgrimageSummary) => {
    const d = (p.destination_ru + " " + p.destination_ro).toLowerCase();
    return p.slug.toLowerCase().includes("bari") || d.includes("бари") || d.includes("bari");
  });

  function selectDate(p: PilgrimageSummary) {
    const dates = formatDateRange(p.start_date, p.end_date, lang);
    const msg = lang === "ru"
      ? `Интересует поездка в Бари – ${dates}`
      : `Mă interesează pelerinajul la Bari – ${dates}`;
    setPrefill(msg);
    if (typeof window !== "undefined") {
      const el = document.getElementById("lead");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <PageShell>
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="max-w-6xl mx-auto px-6 pt-6 text-[15px] md:text-base font-serif text-foreground/70">
        <ol className="flex flex-wrap items-center justify-center gap-2 min-h-[40px]">
          <li><Link to="/" className="hover:text-accent">{t("Главная", "Acasă")}</Link></li>
          <li aria-hidden="true">→</li>
          <li><Link to="/destinations" className="hover:text-accent">{t("Направления", "Destinații")}</Link></li>
          <li aria-hidden="true">→</li>
          <li className="text-foreground">{t("Бари", "Bari")}</li>
        </ol>
      </nav>

      {/* Hero — mobile: full-bleed overlay */}
      <section className="md:hidden relative h-[50vh] min-h-[400px] flex items-end overflow-hidden mt-4">
        <img src={heroImg} alt={t("Базилика Святителя Николая в Бари", "Bazilica Sfântului Nicolae din Bari")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 w-full">
          <h1 className="font-serif text-4xl text-white font-light leading-tight drop-shadow-lg">{title}</h1>
          <p className="mt-4 font-serif italic text-white/85 text-lg max-w-2xl">
            {t(
              "«Николай Чудотворец – скорый помощник всем, с верою к нему притекающим, в скорбях и нуждах заступник, в болезнях целитель, в опасностях избавитель.»",
              "„Nicolae Făcătorul de Minuni este un ajutor grabnic pentru toți cei ce aleargă cu credință la el, apărător în necazuri și nevoi, tămăduitor în boli, izbăvitor în primejdii.”",
            )}
          </p>
          <p className="mt-2 font-serif italic text-white/70 text-sm">
            {t(
              "– Святитель Димитрий Ростовский. Жития святых.",
              "– Sfântul Dimitrie al Rostovului. Viețile Sfinților.",
            )}
          </p>
        </div>
      </section>

      {/* Gallery — mobile horizontal scroll strip */}
      <section className="md:hidden bg-background py-6">
        <div className="flex gap-3 overflow-x-auto px-6 snap-x snap-mandatory scrollbar-none">
          {galleryPhotos.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openLightbox(i)}
              className="relative shrink-0 w-[70vw] aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-gold/30 snap-start cursor-zoom-in"
              aria-label={t("Открыть фото", "Deschide fotografia")}
            >
              <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* Hero — desktop: square image + side preview */}
      <section className="hidden md:block mt-4 bg-background">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 pl-[5mm] pr-6">
          <div className="relative aspect-[5/4] overflow-hidden flex items-end rounded-sm">
            <img src={heroImg} alt={t("Базилика Святителя Николая в Бари", "Bazilica Sfântului Nicolae din Bari")} className="absolute inset-0 w-full h-full object-cover" width={1200} height={960} />
            {/* Darker gradient since image is smaller */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/85" />
            <div className="relative z-10 px-6 pb-6 w-full">
              <h1 className="font-serif text-3xl lg:text-[2.75rem] text-white font-light leading-tight drop-shadow-lg">{title}</h1>
              <p className="mt-3 font-serif italic text-white/85 text-sm lg:text-[15px]">
                {t(
                  "«Николай Чудотворец – скорый помощник всем, с верою к нему притекающим, в скорбях и нуждах заступник, в болезнях целитель, в опасностях избавитель.»",
                  "„Nicolae Făcătorul de Minuni este un ajutor grabnic pentru toți cei ce aleargă cu credință la el, apărător în necazuri și nevoi, tămăduitor în boli, izbăvitor în primejdii.”",
                )}
              </p>
              <p className="mt-1 font-serif italic text-white/70 text-xs lg:text-[13px]">
                {t(
                  "– Святитель Димитрий Ростовский. Жития святых.",
                  "– Sfântul Dimitrie al Rostovului. Viețile Sfinților.",
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-start font-serif">
            {/* Gallery — desktop 2×2 thumbnails */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {galleryPhotos.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => openLightbox(i)}
                  className="relative aspect-square overflow-hidden rounded-sm ring-1 ring-gold/30 hover:ring-gold transition-all duration-200 cursor-zoom-in group"
                  aria-label={t("Открыть фото", "Deschide fotografia")}
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
            <h2 className="text-3xl lg:text-4xl text-foreground font-light mb-4">{t("О поездке", "Despre pelerinaj")}</h2>
            {/* TODO: replace with real preview text (first 3–4 sentences of "О поездке") */}
            <p className="text-[17px] lg:text-[18px] text-foreground/85 leading-relaxed">
              {t(
                "Святитель Николай Чудотворец – один из самых почитаемых святых православного мира. Его мощи покоятся в Бари с 1087 года, и сюда стекаются паломники со всех концов земли. В нашей поездке вы пройдёте к мощам, услышите акафист, помолитесь у гробницы.",
                "Sfântul Ierarh Nicolae este unul dintre cei mai cinstiți sfinți ai lumii ortodoxe. Moaștele sale se află în Bari din anul 1087, iar aici vin pelerini din toată lumea. În pelerinajul nostru veți coborî la moaște, veți asculta acatistul, vă veți ruga la mormânt.",
              )}
            </p>
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              className="mt-6 self-start inline-flex items-center gap-2 text-accent hover:text-accent/80 font-serif text-[17px] border-b border-accent/40 hover:border-accent pb-0.5 transition-colors"
            >
              {t("Читать подробнее →", "Citește mai mult →")}
            </button>
          </div>
        </div>
      </section>

      {/* About modal — desktop "О поездке" full text */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl md:text-3xl font-light">
              {t("О поездке", "Despre pelerinaj")}
            </DialogTitle>
          </DialogHeader>
          {/* TODO: replace with full "О поездке" text provided later */}
          <div className="font-serif text-[17px] leading-relaxed text-foreground/85 space-y-4 max-h-[70vh] overflow-y-auto">
            <p>
              {t(
                "Святитель Николай Чудотворец – один из самых почитаемых святых православного мира. Его мощи покоятся в Бари с 1087 года, и сюда стекаются паломники со всех концов земли.",
                "Sfântul Ierarh Nicolae este unul dintre cei mai cinstiți sfinți ai lumii ortodoxe. Moaștele sale se află în Bari din anul 1087, iar aici vin pelerini din toată lumea.",
              )}
            </p>
            <p>
              {t(
                "В нашей поездке вы пройдёте к мощам, услышите акафист, помолитесь у гробницы и увезёте с собою благодатное миро, истекающее от мощей.",
                "În pelerinajul nostru veți coborî la moaște, veți asculta acatistul, vă veți ruga la mormânt și veți lua cu voi sfântul mir care izvorăște de la moaște.",
              )}
            </p>
            <p className="italic text-foreground/60">
              {t("(Полный текст будет добавлен позже.)", "(Textul complet va fi adăugat ulterior.)")}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info bar — from database */}
      <section className="bg-card border-y border-gold/30">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 font-serif text-center">
          <div className="flex flex-col items-center gap-1">
            <Clock className="w-[22px] h-[22px] text-gold mb-1" aria-hidden="true" />
            <p className="overline text-[11px]">{t("Длительность", "Durata")}</p>
            <p className="text-[18px] md:text-[20px] text-foreground">{duration ? `${duration}${t(" дней", " zile")}` : "–"}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Users className="w-[22px] h-[22px] text-gold mb-1" aria-hidden="true" />
            <p className="overline text-[11px]">{t("Группа", "Grup")}</p>
            <p className="text-[18px] md:text-[20px] text-foreground">{groupSize ?? "–"}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Euro className="w-[22px] h-[22px] text-gold mb-1" aria-hidden="true" />
            <p className="overline text-[11px]">{t("Цена", "Preț")}</p>
            <p className="text-[18px] md:text-[20px] text-gold">{priceFrom ? `${t("от", "de la")} €${priceFrom}` : "–"}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Church className="w-[22px] h-[22px] text-gold mb-1" aria-hidden="true" />
            <p className="overline text-[11px]">{t("Сопровождение", "Însoțire")}</p>
            <p className="text-[18px] md:text-[20px] text-foreground">{t("со священником", "cu preot")}</p>
          </div>
        </div>
      </section>

      {/* Intro — mobile only (desktop shows it next to hero image) */}
      <section className="md:hidden bg-background font-serif">
        <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl text-foreground font-light mb-5">{t("О поездке", "Despre pelerinaj")}</h2>
        <p className="text-[17px] md:text-[18px] text-foreground/85 leading-relaxed border-l-4 border-accent/60 pl-5 md:pl-6 py-2">
          {t(
            "Святитель Николай Чудотворец – один из самых почитаемых святых православного мира. Его мощи покоятся в Бари с 1087 года, и сюда стекаются паломники со всех концов земли. В нашей поездке вы пройдёте к мощам, услышите акафист, помолитесь у гробницы и увезёте с собою благодатное миро, истекающее от мощей.",
            "Sfântul Ierarh Nicolae este unul dintre cei mai cinstiți sfinți ai lumii ortodoxe. Moaștele sale se află în Bari din anul 1087, iar aici vin pelerini din toată lumea. În pelerinajul nostru veți coborî la moaște, veți asculta acatistul, vă veți ruga la mormânt și veți lua cu voi sfântul mir care izvorăște de la moaște.",
          )}
        </p>
        </div>
      </section>

      {/* Святыни */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-8 text-center">{t("Главные святыни", "Sfintele moaște")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              { img: cryptImg, ru: { t: "Крипта со святыми мощами", d: "Спуск в нижний храм к мраморной гробнице, где почивают мощи Святителя." }, ro: { t: "Cripta cu sfintele moaște", d: "Coborâre la biserica de jos, la mormântul de marmură unde se află moaștele." } },
              { img: interiorImg, ru: { t: "Икона Святителя Николая", d: "Особое моление перед чудотворным образом, акафист и помазание святым миром." }, ro: { t: "Icoana Sfântului Nicolae", d: "Rugăciune deosebită înaintea sfintei icoane, acatist și ungere cu sfântul mir." } },
              { img: heroImg, ru: { t: "Базилика Святителя", d: "Главное место паломничества – храм, в котором почивают мощи угодника Божия." }, ro: { t: "Bazilica Sfântului", d: "Locul principal de pelerinaj – biserica în care se află moaștele plăcutului lui Dumnezeu." } },
            ]).map((s, i) => {
              const c = lang === "ru" ? s.ru : s.ro;
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => handleShrineClick(i)}
                    aria-expanded={shrineExpand === i}
                    className="w-full text-left bg-card border border-gold/30 rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_8px_24px_-15px_rgba(61,40,23,0.4)] transition-all duration-300 block"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={s.img} alt={c.t} loading="lazy" width={800} height={600} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 font-serif">
                      <h3 className="text-xl text-foreground mb-2 leading-tight">{c.t}</h3>
                      <p className="text-[17px] text-foreground/75 leading-relaxed">{c.d}</p>
                    </div>
                  </button>
                  {/* Mobile-only inline expansion */}
                  {shrineExpand === i && (
                    <div className="md:hidden mt-3 bg-card border border-gold/30 rounded-sm p-5 font-serif text-[17px] text-foreground/85 leading-relaxed animate-fade-in">
                      {/* TODO: replace with full shrine description provided later */}
                      <p>{c.d}</p>
                      <p className="mt-3 italic text-foreground/60">
                        {t("(Полный текст будет добавлен позже.)", "(Textul complet va fi adăugat ulterior.)")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Desktop shrine modal */}
      <Dialog open={shrineModal !== null} onOpenChange={(o) => !o && setShrineModal(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          {shrineModal !== null && (() => {
            const list = [
              { img: cryptImg, ru: { t: "Крипта со святыми мощами", d: "Спуск в нижний храм к мраморной гробнице, где почивают мощи Святителя." }, ro: { t: "Cripta cu sfintele moaște", d: "Coborâre la biserica de jos, la mormântul de marmură unde se află moaștele." } },
              { img: interiorImg, ru: { t: "Икона Святителя Николая", d: "Особое моление перед чудотворным образом, акафист и помазание святым миром." }, ro: { t: "Icoana Sfântului Nicolae", d: "Rugăciune deosebită înaintea sfintei icoane, acatist și ungere cu sfântul mir." } },
              { img: heroImg, ru: { t: "Базилика Святителя", d: "Главное место паломничества – храм, в котором почивают мощи угодника Божия." }, ro: { t: "Bazilica Sfântului", d: "Locul principal de pelerinaj – biserica în care se află moaștele plăcutului lui Dumnezeu." } },
            ];
            const s = list[shrineModal];
            const c = lang === "ru" ? s.ru : s.ro;
            return (
              <div className="grid md:grid-cols-2 max-h-[85vh]">
                <div className="aspect-square md:aspect-auto overflow-hidden bg-secondary">
                  <img src={s.img} alt={c.t} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 md:p-10 font-serif overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl md:text-3xl font-light text-left mb-4">{c.t}</DialogTitle>
                  </DialogHeader>
                  {/* TODO: replace with full shrine description provided later */}
                  <div className="text-[17px] md:text-[20px] leading-relaxed text-foreground/85 space-y-4">
                    <p>{c.d}</p>
                    <p className="italic text-foreground/60">
                      {t("(Полный текст будет добавлен позже.)", "(Textul complet va fi adăugat ulterior.)")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Программа */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Программа по дням", "Programul pe zile")}</h2>
        <Accordion type="single" collapsible className="font-serif">
          {[
            { ru: { t: "День 1 – Прибытие в Бари", d: "Перелёт из Кишинёва в Бари. Встреча в аэропорту, трансфер в гостиницу, размещение, вечерняя молитва." }, ro: { t: "Ziua 1 – Sosirea la Bari", d: "Zbor din Chișinău la Bari. Întâlnire la aeroport, transfer la hotel, cazare, rugăciune de seară." } },
            { ru: { t: "День 2 – Литургия у мощей", d: "Утренняя Литургия у мощей Святителя Николая, акафист, поклонение, помазание миром." }, ro: { t: "Ziua 2 – Liturghie la moaște", d: "Sfânta Liturghie la moaștele Sfântului Nicolae, acatist, închinare, ungere cu mir." } },
            { ru: { t: "День 3 – Город Бари", d: "Старый город, церкви Бари, морская набережная, свободное время." }, ro: { t: "Ziua 3 – Orașul Bari", d: "Orașul vechi, bisericile din Bari, faleza mării, timp liber." } },
            { ru: { t: "День 4–6 – По выбору группы", d: "По договорённости – поездки в Лоретто, Манопелло, Монте-Гаргано." }, ro: { t: "Ziua 4–6 – La alegerea grupului", d: "Posibile excursii la Loreto, Manoppello, Monte Sant'Angelo." } },
            { ru: { t: "Последний день – Отъезд", d: "Прощальный молебен у мощей, трансфер в аэропорт, перелёт домой." }, ro: { t: "Ultima zi – Plecarea", d: "Tedeum de despărțire la moaște, transfer la aeroport, zbor acasă." } },
          ].map((d, i) => {
            const c = lang === "ru" ? d.ru : d.ro;
            return (
              <AccordionItem key={i} value={`d${i}`} className="border-gold/30">
                <AccordionTrigger className="text-[17px] md:text-[21px] text-foreground hover:text-accent text-left [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-accent">
                  <span className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-primary-foreground text-sm font-serif shrink-0">{i + 1}</span>
                    <span>{c.t}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[16px] md:text-[20px] text-foreground/80 leading-relaxed pl-11">{c.d}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        </div>
      </section>

      {/* Включено / не включено */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:pl-16 lg:pl-24 grid md:grid-cols-2 gap-10 font-serif">
          <div>
            <h2 className="inline-block text-2xl md:text-[2.6rem] text-foreground font-light mb-4 border-b-2 border-olive pb-1">{t("Что включено", "Ce este inclus")}</h2>
            <ul className="space-y-3 text-[16px] md:text-[20px] text-foreground/85 leading-relaxed">
              {[
                t("Авиаперелёт Кишинёв – Бари – Кишинёв", "Zbor Chișinău – Bari – Chișinău"),
                t("Проживание в гостинице 3*–4* с завтраками", "Cazare la hotel 3*–4* cu mic dejun"),
                t("Все трансферы и переезды по программе", "Toate transferurile și deplasările conform programului"),
                t("Сопровождение священника", "Însoțire de preot"),
                t("Православный гид-переводчик", "Ghid ortodox traducător"),
                t("Молебны и акафисты у святынь", "Tedeumuri și acatiste la sfintele moaște"),
                t("Медицинская страховка", "Asigurare medicală"),
              ].map((x, i) => (
                <li key={i} className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-olive shrink-0 mt-1" aria-hidden="true" /><span>{x}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="inline-block text-2xl md:text-[2.6rem] text-foreground font-light mb-4 border-b-2 border-[#b53d2e] pb-1">{t("Не включено", "Nu este inclus")}</h2>
            <ul className="space-y-3 text-[16px] md:text-[20px] text-foreground/85 leading-relaxed">
              {[
                t("Личные расходы", "Cheltuieli personale"),
                t("Обеды и ужины", "Prânzurile și cinele"),
                t("Дополнительные экскурсии вне программы", "Excursii suplimentare în afara programului"),
                t("Чаевые гидам и водителям", "Bacșișurile ghizilor și șoferilor"),
              ].map((x, i) => (
                <li key={i} className="flex gap-3 items-start"><Minus className="w-5 h-5 md:w-6 md:h-6 text-[#b53d2e] shrink-0 mt-1" aria-hidden="true" /><span>{x}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ближайшие даты */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Ближайшие даты", "Datele apropiate")}</h2>
        {bariDates.length === 0 ? (
          <p className="font-serif italic text-[17px] text-foreground/70">
            {t("Даты уточняются. Свяжитесь с нами – подскажем ближайшую поездку.", "Datele se precizează. Contactați-ne – vă vom informa despre cel mai apropiat pelerinaj.")}
          </p>
        ) : (
          <ul className="space-y-3 font-serif">
            {bariDates.map((p: PilgrimageSummary) => (
              <li
                key={p.id}
                onClick={() => selectDate(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectDate(p); } }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-gold/30 rounded-sm px-6 py-5 cursor-pointer hover:border-gold hover:shadow-[0_8px_24px_-15px_rgba(61,40,23,0.4)] transition-all duration-300"
              >
                <div>
                  <p className="text-[17px] md:text-[24px] text-foreground">{lang === "ru" ? p.title_ru : p.title_ro}</p>
                  <p className="text-[17px] md:text-[21px] text-foreground/65 mt-1">
                    <Calendar className="w-4 h-4 text-gold inline mr-2 -mt-0.5" aria-hidden="true" />
                    {formatDateRange(p.start_date, p.end_date, lang)}
                    {!p.with_priest && <span className="ml-2 italic">({t("без священника", "fără preot")})</span>}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  {p.price_eur && (
                    <span className="text-gold text-[17px] md:text-[24px] font-medium inline-flex items-center">
                      <Euro className="w-4 h-4 mr-1" aria-hidden="true" />{p.price_eur}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); selectDate(p); }}
                    className="w-full sm:w-auto px-5 py-2 bg-accent text-primary-foreground text-[16px] md:text-[18px] font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-sm"
                  >
                    {t("Хочу поехать", "Vreau să merg")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Вопросы и ответы", "Întrebări și răspunsuri")}</h2>
          <Accordion type="single" collapsible className="font-serif md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-2">
            {([
              {
                ru: {
                  q: "Нужна ли виза?",
                  a: (
                    <div className="space-y-3">
                      <p>Зависит от вашего гражданства:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Граждане Молдовы – виза не нужна (безвизовый режим с ЕС)</li>
                        <li>Граждане Украины – виза не нужна (безвизовый режим с ЕС)</li>
                        <li>Граждане Румынии и других стран ЕС – виза не нужна</li>
                        <li>Граждане России – требуется шенгенская виза</li>
                        <li>Граждане Беларуси – требуется шенгенская виза</li>
                      </ul>
                      <p>Если у вас другое гражданство – свяжитесь с нами, поможем разобраться.</p>
                    </div>
                  ),
                },
                ro: {
                  q: "Este nevoie de viză?",
                  a: (
                    <div className="space-y-3">
                      <p>Depinde de cetățenia dumneavoastră:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Cetățenii Moldovei – fără viză (regim liberalizat cu UE)</li>
                        <li>Cetățenii Ucrainei – fără viză (regim liberalizat cu UE)</li>
                        <li>Cetățenii României și ai altor țări UE – fără viză</li>
                        <li>Cetățenii Rusiei – necesită viză Schengen</li>
                        <li>Cetățenii Belarusului – necesită viză Schengen</li>
                      </ul>
                      <p>Dacă aveți altă cetățenie – contactați-ne, vă vom ajuta.</p>
                    </div>
                  ),
                },
              },
              { ru: { q: "Можно ли с детьми?", a: "Да, дети от 7 лет с родителями приветствуются. Программа адаптируется под возраст." }, ro: { q: "Se poate cu copiii?", a: "Da, copiii de la 7 ani sunt bineveniți împreună cu părinții. Programul se adaptează vârstei." } },
              { ru: { q: "Будет ли возможность исповеди и причастия?", a: "Да, в поездке участвует православный священник, проводятся исповедь и Литургия у мощей." }, ro: { q: "Va fi posibilă spovedania și împărtășania?", a: "Da, în pelerinaj participă un preot ortodox, se săvârșesc spovedania și Sfânta Liturghie la moaște." } },
              { ru: { q: "Какое миро от мощей и можно ли его взять?", a: "Из мощей Святителя истекает благоуханное миро. Каждому паломнику передаётся флакончик с миром." }, ro: { q: "Ce este mirul de la moaște și pot lua acasă?", a: "Din moaștele Sfântului izvorăște mir bine mirositor. Fiecărui pelerin i se oferă un flacon cu mir." } },
              { ru: { q: "Какая физическая нагрузка в поездке?", a: "Поездка спокойная: переходы небольшие, много молитвенного времени. Подходит и для пожилых." }, ro: { q: "Cât de obositor este pelerinajul?", a: "Pelerinajul este liniștit: deplasări scurte, mult timp de rugăciune. Potrivit și pentru vârstnici." } },
              { ru: { q: "Как оплатить поездку?", a: "Бронирование – задаток, окончательный расчёт – за две недели до выезда. Только в офисе." }, ro: { q: "Cum se achită pelerinajul?", a: "Rezervare cu avans, plata finală cu două săptămâni înainte de plecare. Doar la birou." } },
            ] as Array<{ ru: { q: string; a: ReactNode }; ro: { q: string; a: ReactNode } }>).map((f, i) => {
              const c = lang === "ru" ? f.ru : f.ro;
              return (
                <AccordionItem key={i} value={`f${i}`} className="border-gold/30 py-1">
                  <AccordionTrigger className="text-[17px] md:text-[20px] text-foreground hover:text-accent text-left [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-accent">
                    <span className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{c.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[16px] md:text-[19px] text-foreground/80 leading-relaxed pl-8">{c.a}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Lead form */}
      <LeadForm prefill={prefill} onPrefillConsumed={() => setPrefill("")} />
    </PageShell>
  );
}

function LeadForm({ prefill, onPrefillConsumed }: { prefill: string; onPrefillConsumed: () => void }) {
  const { t } = useLang();
  const submit = useServerFn(createLead);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Apply prefill from external trigger
  if (prefill && form.message !== prefill) {
    setForm((f) => ({ ...f, message: prefill }));
    onPrefillConsumed();
  }

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
    <section id="lead" className="bg-secondary py-12 md:py-16 scroll-mt-24 border-t border-gold/30">
      <div className="hidden md:block max-w-6xl mx-auto px-6 mb-10">
        <h2 className="font-serif text-3xl md:text-5xl text-foreground font-light text-center">
          {t("Принять участие в паломничестве", "Participați la pelerinaj")}
        </h2>
      </div>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.2fr_1fr] md:gap-12 md:items-start">
        <div>
        <h2 className="md:hidden font-serif text-3xl text-foreground font-light mb-8">{t("Оставить заявку", "Lăsați o cerere")}</h2>
        <h2 className="hidden md:block font-serif md:text-2xl text-muted-foreground font-light mb-6">{t("Вариант 1: Оставить заявку", "Varianta 1: Lăsați o cerere")}</h2>
        {sent ? (
          <div className="p-5 bg-background border border-gold/40 rounded-sm font-serif italic text-[17px] text-foreground/85">
            {t("Спасибо! Ваша заявка получена.", "Mulțumim! Cererea dvs. a fost primită.")}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 font-serif">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input required maxLength={100} placeholder={t("Имя", "Nume")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm text-[16px] md:text-[18px] focus:outline-none focus:border-gold" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input required maxLength={30} placeholder={t("Телефон", "Telefon")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm text-[16px] md:text-[18px] focus:outline-none focus:border-gold" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input type="email" maxLength={255} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm text-[16px] md:text-[18px] focus:outline-none focus:border-gold" />
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <textarea maxLength={2000} rows={5} placeholder={t("Сообщение (необязательно)", "Mesaj (opțional)")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm text-[16px] md:text-[18px] focus:outline-none focus:border-gold resize-none" />
            </div>
            <button type="submit" disabled={sending} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-accent text-primary-foreground text-[17px] md:text-[20px] font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md disabled:opacity-60">
              {sending ? t("Отправка…", "Se trimite…") : t("Отправить заявку", "Trimiteți cererea")}
              {!sending && <Send className="w-4 h-4" aria-hidden="true" />}
            </button>
          </form>
        )}
        {/* Mobile-only contacts (desktop shows them in right column) */}
        <div className="md:hidden mt-12">
          <ContactsBlock desktop={false} />
        </div>
        </div>
        {/* Right column — direct contacts (desktop only) */}
        <div className="hidden md:block pl-4 lg:pl-8">
          <ContactsBlock desktop={true} />
        </div>
      </div>
    </section>
  );
}

function ContactsBlock({ desktop = false }: { desktop?: boolean }) {
  const { t } = useLang();
  const people = [
    { name: t("Анна", "Anna"), tel: "+37368778676", display: "+373 68 77 86 76", viber: "%2B37368778676" },
    { name: t("Наталья", "Natalia"), tel: "+37368787599", display: "+373 68 78 75 99", viber: "%2B37368787599" },
  ];

  if (desktop) {
    return (
      <div className="font-serif">
        <h3 className="font-serif md:text-2xl text-muted-foreground font-light mb-6">
          {t("Вариант 2: Связаться напрямую", "Varianta 2: Contactați-ne direct")}
        </h3>
        <div className="space-y-4">
          {people.map((p) => (
            <div
              key={p.tel}
              className="flex items-center w-full bg-card rounded-sm border border-border/40 border-l-2 border-l-gold text-[18px] overflow-hidden"
            >
              <a
                href={`tel:${p.tel}`}
                className="flex items-center flex-1 py-3 pl-4 pr-2 hover:bg-gold/5 transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center mr-3 shrink-0">
                  <Phone className="w-4 h-4 text-accent" aria-hidden="true" />
                </span>
                <span className="text-foreground">{p.name}</span>
                <span className="mx-3 text-muted-foreground">·</span>
                <span className="text-accent">{p.display}</span>
              </a>
              <a
                href={`viber://chat?number=${p.viber}`}
                className="mr-3 inline-flex items-center px-2.5 py-1 rounded-sm text-[14px] hover:opacity-80 shrink-0"
                style={{ backgroundColor: "rgba(115,96,242,0.10)", color: "#7360F2" }}
                aria-label={`Viber ${p.name}`}
              >
                <ViberIcon className="w-[14px] h-[14px] mr-1.5" />
                Viber
              </a>
            </div>
          ))}
          <a
            href="mailto:pilgrimage@eldoradotur.md"
            className="flex items-center w-full py-3 pl-4 pr-4 bg-card rounded-sm border border-border/40 border-l-2 border-l-gold hover:bg-gold/5 transition-colors text-[18px]"
          >
            <span className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center mr-3 shrink-0">
              <Mail className="w-4 h-4 text-accent" aria-hidden="true" />
            </span>
            <span className="text-accent">pilgrimage@eldoradotur.md</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="font-serif">
      <h3 className="text-3xl md:text-4xl text-foreground font-light mb-8">
        {t("Связаться напрямую", "Contactați-ne direct")}
      </h3>
      {people.map((p) => (
        <div key={p.tel} className="mb-6">
          <a href={`tel:${p.tel}`} className="flex items-center text-[18px] md:text-[20px] text-foreground hover:text-accent">
            <Phone className="w-[18px] h-[18px] text-accent mr-2" aria-hidden="true" />
            {p.name}
          </a>
          <a href={`tel:${p.tel}`} className="block text-[18px] md:text-[20px] text-accent hover:underline mt-1 pl-[26px]">
            {p.display}
          </a>
          <a
            href={`viber://chat?number=${p.viber}`}
            className="inline-flex items-center text-[16px] mt-1 pl-[26px] hover:underline"
            style={{ color: "#7360F2" }}
          >
            <ViberIcon className="w-[18px] h-[18px] mr-2" />
            Viber
          </a>
        </div>
      ))}
      <a
        href="mailto:pilgrimage@eldoradotur.md"
        className="inline-flex items-center text-[18px] md:text-[20px] text-accent hover:underline"
      >
        <Mail className="w-[18px] h-[18px] text-accent mr-2" aria-hidden="true" />
        pilgrimage@eldoradotur.md
      </a>
    </div>
  );
}
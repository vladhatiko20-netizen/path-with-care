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

const ViberIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M11.4 0C9.473.028 5.333.344 3.018 2.467 1.297 4.187.69 6.71.625 9.835.563 12.96.484 18.818 6.131 20.41h.005l-.004 2.426s-.038.983.61 1.183c.78.245 1.24-.5 1.986-1.302.41-.44.975-1.086 1.402-1.58 3.864.326 6.832-.418 7.17-.528.778-.253 5.18-.886 5.892-7.668.732-6.987-.351-11.401-2.309-13.391-.59-.581-2.971-2.317-8.282-2.341 0 0-.395-.025-1.046-.025zm.067 1.697c.55-.002.886.024.886.024 4.494.018 6.648 1.345 7.148 1.829 1.654 1.638 2.503 5.622 1.879 11.45-.598 5.66-3.96 6.02-4.608 6.229-.276.09-2.86.726-6.106.514 0 0-2.42 2.926-3.175 3.687-.117.123-.255.17-.349.146-.131-.033-.167-.19-.165-.417l.014-4.018c-.001 0-.005 0 0 0-4.778-1.328-4.499-7.184-4.444-10.275.055-3.09.563-5.625 2.235-7.27 1.892-1.59 5.418-1.886 6.685-1.899zm.443 2.486a.499.499 0 100 .998c1.66 0 3.043.541 4.108 1.59 1.064 1.046 1.617 2.485 1.652 4.355a.5.5 0 10.998-.019c-.038-2.099-.682-3.819-1.95-5.07-1.27-1.25-3.04-1.864-4.81-1.864zm.063 1.527a.5.5 0 100 1c2.108 0 4.116 1.946 4.116 4.165a.5.5 0 101 0c0-2.81-2.426-5.165-5.116-5.165zm.116 1.612a.5.5 0 00-.103.992c1.561.326 2.291 1.07 2.523 2.708a.5.5 0 10.99-.14c-.273-1.93-1.32-3.046-3.31-3.55zM7.34 7.717a1.4 1.4 0 00-.51.067h-.014c-.4.115-.764.347-1.146.701-.495.477-.967 1.058-1.328 1.694-.343.605-.526 1.2-.604 1.766a.7.7 0 00.061.41l.005.004c.227.624.7 1.273 1.435 1.978.706.673 1.504 1.288 2.302 1.91l.008.005c1.013.819 2.16 1.595 3.444 2.296 1.222.668 2.659 1.327 4.296 1.85h.014c.476.146.91.219 1.342.219a3.21 3.21 0 002.272-.962c.014-.014.024-.023.038-.038.45-.553.683-1.166.683-1.78v-.034c-.005-.572-.247-1.124-.81-1.534-1.265-.927-2.622-1.51-3.918-2.297-.871-.524-1.715.072-1.945.32-.97.97-.788.83-2.65-.225-1.819-1.026-2.96-1.97-3.722-3.39-.539-1-.43-1.55-.014-2.169.243-.36.628-.66.81-1.124.187-.464.16-1.058-.34-1.692-.61-.776-1.39-1.395-2.149-2.024-.42-.347-.842-.578-1.282-.673a3.42 3.42 0 00-.279-.06zm.077.99h.005c.196 0 .346.038.5.071.276.06.598.247.92.51.683.567 1.402 1.144 1.92 1.802.34.43.357.701.272.91-.065.16-.42.51-.658.864-.5.745-.711 1.756.045 3.165.886 1.651 2.255 2.708 4.158 3.781 1.851 1.046 2.626 1.448 4.066.01.181-.182 1.04-.901 1.616-.535 1.301.79 2.633 1.354 3.764 2.184.347.253.51.595.51.989.005.434-.169.91-.5 1.31a2.2 2.2 0 01-1.561.66c-.305 0-.625-.057-1.034-.181-1.575-.51-2.965-1.146-4.15-1.793-1.21-.66-2.305-1.405-3.265-2.184l-.005-.004c-.778-.61-1.529-1.196-2.184-1.823-.703-.673-1.107-1.243-1.27-1.66-.005-.014-.013-.024-.018-.038l-.005-.014c.061-.444.21-.92.495-1.418.316-.557.74-1.084 1.193-1.522.276-.262.547-.428.79-.499.094-.027.18-.04.255-.04z" />
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
          <div className="flex flex-col justify-center font-serif">
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

      {/* Contacts */}
      <section className="bg-background py-12 md:py-16 font-serif">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 md:gap-12 md:items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl text-foreground font-light mb-4">{t("Связаться напрямую", "Contact direct")}</h2>
            <p className="text-[16px] md:text-[20px] text-foreground/80 mb-3">
              <Phone className="w-[18px] h-[18px] text-accent inline mr-2 -mt-0.5" aria-hidden="true" />
              Анна: <a href="tel:+37368778676" className="text-accent hover:underline">+373 68 77 86 76</a>
              <span className="ml-2 text-foreground/60">· Viber</span>
            </p>
            <p className="text-[16px] md:text-[20px] text-foreground/80 mb-3">
              <Phone className="w-[18px] h-[18px] text-accent inline mr-2 -mt-0.5" aria-hidden="true" />
              Наталья: <a href="tel:+37368787599" className="text-accent hover:underline">+373 68 78 75 99</a>
              <span className="ml-2 text-foreground/60">· Viber</span>
            </p>
            <p className="text-[16px] md:text-[20px] text-foreground/80">
              <Mail className="w-[18px] h-[18px] text-accent inline mr-2 -mt-0.5" aria-hidden="true" />
              <a href="mailto:pilgrimage@eldoradotur.md" className="text-accent hover:underline">pilgrimage@eldoradotur.md</a>
            </p>
          </div>
          {/* TODO: replace with final invitation copy */}
          <div className="hidden md:block">
            <p className="font-serif italic text-[20px] lg:text-[22px] text-foreground/85 leading-relaxed border-l-2 border-gold/60 pl-6">
              {t(
                "Если хотите обсудить поездку лично — позвоните или напишите нам в Viber. Ответим в рабочие часы.",
                "Dacă doriți să discutați personal despre pelerinaj — sunați sau scrieți-ne pe Viber. Răspundem în orele de lucru.",
              )}
            </p>
          </div>
        </div>
      </section>
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
    <section id="lead" className="bg-secondary py-12 md:py-16 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.2fr_1fr] md:gap-12 md:items-start">
        <div>
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
        </div>
        {/* Right column — tagline (desktop only) */}
        <div className="hidden md:flex flex-col items-start justify-center pl-4 lg:pl-8">
          <p className="font-serif text-3xl lg:text-[2.5rem] text-foreground font-light leading-tight">
            {t("Свяжемся с вами в течение 24 часов", "Vă contactăm în 24 de ore")}
          </p>
          <span aria-hidden="true" className="mt-6 text-gold text-3xl">✦</span>
        </div>
      </div>
    </section>
  );
}
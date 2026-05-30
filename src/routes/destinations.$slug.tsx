import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import {
  getDestinationBySlug,
  listGalleryByDestinationSlug,
  listShrinesByDestinationSlug,
  listProgramByDestinationSlug,
  listInclusionsByDestinationSlug,
  listFaqByDestinationSlug,
  type PublicGalleryImage,
  type PublicShrine,
  type PublicProgramDay,
  type PublicInclusion,
  type PublicFaq,
} from "@/lib/destinations.functions";
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
  Calendar,
  User, Phone, Mail, MessageSquare, Send,
  ChevronDown,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";

const SITE = "https://path-with-care.lovable.app";

export const Route = createFileRoute("/destinations/$slug")({
  loader: async ({ params }) => {
    const destination = await getDestinationBySlug({ data: { slug: params.slug } });
    if (!destination) throw notFound();
    const [pilgrimages, gallery, shrines, program, inclusions, faq] = await Promise.all([
      listPilgrimages(),
      listGalleryByDestinationSlug({ data: { slug: params.slug } }),
      listShrinesByDestinationSlug({ data: { slug: params.slug } }),
      listProgramByDestinationSlug({ data: { slug: params.slug } }),
      listInclusionsByDestinationSlug({ data: { slug: params.slug } }),
      listFaqByDestinationSlug({ data: { slug: params.slug } }),
    ]);
    return { destination, pilgrimages, gallery, shrines, program, inclusions, faq };
  },
  head: ({ loaderData, params }) => {
    const d = loaderData?.destination;
    if (!d) return {};
    const title = d.seo_title_ru || d.title_ru;
    const desc = d.seo_description_ru || d.description_ru || "";
    const url = `${SITE}/destinations/${params.slug}`;
    const img = d.og_image || d.cover_image || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(img ? [{ property: "og:image", content: img }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(img ? [{ name: "twitter:image", content: img }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
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
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center font-serif">
          <h1 className="text-3xl mb-3">Не удалось загрузить страницу</h1>
          <p className="text-foreground/70 mb-6">{error.message}</p>
          <button
            onClick={() => { reset(); router.invalidate(); }}
            className="px-5 py-2 bg-accent text-primary-foreground rounded-sm"
          >
            Попробовать снова
          </button>
        </div>
      </PageShell>
    );
  },
  component: DestinationPage,
});

function formatDateRange(start: string, end: string, lang: "ru" | "ro") {
  const locale = lang === "ru" ? "ru-RU" : "ro-RO";
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const sameYear = s.getFullYear() === e.getFullYear();
  const monthFmt = new Intl.DateTimeFormat(locale, { month: "long" });
  const yearFmt = new Intl.DateTimeFormat(locale, { year: "numeric" });
  if (sameMonth) return `${s.getDate()}–${e.getDate()} ${monthFmt.format(e)} ${yearFmt.format(e)}`;
  if (sameYear) return `${s.getDate()} ${monthFmt.format(s)} – ${e.getDate()} ${monthFmt.format(e)} ${yearFmt.format(e)}`;
  return `${s.toLocaleDateString(locale)} – ${e.toLocaleDateString(locale)}`;
}

function DestinationPage() {
  const { destination, pilgrimages, gallery, shrines, program, inclusions, faq } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const { t, lang } = useLang();
  const [prefill, setPrefill] = useState<string>("");
  const [shrineModal, setShrineModal] = useState<number | null>(null);
  const [shrineExpand, setShrineExpand] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  const pickL = <R, O>(ru: R, ro: O): R | O => (lang === "ru" ? ru : ro);

  const title = pickL(destination.title_ru, destination.title_ro);
  const shortTitle =
    pickL(destination.short_title_ru, destination.short_title_ro) ||
    (pickL(destination.title_ru, destination.title_ro) || "").split(/[\s\-–—]+/)[0];
  const intro = pickL(destination.intro_ru, destination.intro_ro) || pickL(destination.description_ru, destination.description_ro);
  const heroQuote = pickL(destination.hero_quote_ru, destination.hero_quote_ro);
  const heroQuoteAuthor = pickL(destination.hero_quote_author_ru, destination.hero_quote_author_ro);
  const duration = pickL(destination.duration_ru, destination.duration_ro);
  const groupSize = pickL(destination.group_size_ru, destination.group_size_ro);
  const notice = pickL(destination.notice_ru, destination.notice_ro);
  const priceFrom = destination.price_from;
  const heroImg = destination.cover_image;
  const accompaniment = pickL(destination.accompaniment_ru, destination.accompaniment_ro) || t("со священником", "cu preot");

  const galleryPhotos = ((gallery ?? []) as PublicGalleryImage[]).map((g) => ({
    src: g.image_url,
    alt: (lang === "ru" ? g.alt_ru : g.alt_ro) ?? g.alt_ru ?? g.alt_ro ?? "",
    description: ((lang === "ru" ? g.alt_ru : g.alt_ro) ?? "") || "",
    author: g.author,
    license: g.license,
  }));

  const attributionParts = Array.from(
    new Set(
      galleryPhotos
        .map((p) => {
          const a = (p.author ?? "").trim();
          const l = (p.license ?? "").trim();
          if (!a && !l) return "";
          if (a && l) return `${a} — ${l}`;
          return a || l;
        })
        .filter(Boolean),
    ),
  );
  const attributionText = attributionParts.length
    ? t(`Фото: ${attributionParts.join("; ")}`, `Foto: ${attributionParts.join("; ")}`)
    : null;

  const openLightbox = (i: number) => setLightbox({ open: true, index: i });

  const shrinesList = (shrines ?? []) as PublicShrine[];
  function handleShrineClick(i: number) {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      setShrineModal(i);
    } else {
      setShrineExpand((cur) => {
        const next = cur === i ? null : i;
        if (next !== null && typeof window !== "undefined") {
          requestAnimationFrame(() => {
            const el = document.getElementById(`shrine-expand-${next}`);
            el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          });
        }
        return next;
      });
    }
  }

  const programDays = (program ?? []) as PublicProgramDay[];
  const included = ((inclusions ?? []) as PublicInclusion[]).filter((i) => i.kind === "included");
  const excluded = ((inclusions ?? []) as PublicInclusion[]).filter((i) => i.kind === "excluded");
  const faqList = (faq ?? []) as PublicFaq[];

  const slugLower = slug.toLowerCase();
  const titleLower = (destination.title_ru + " " + destination.title_ro).toLowerCase();
  const dates = ((pilgrimages ?? []) as PilgrimageSummary[]).filter((p) => {
    const d = (p.destination_ru + " " + p.destination_ro).toLowerCase();
    return p.slug.toLowerCase().includes(slugLower) || d.includes(slugLower) || (titleLower && d.includes(titleLower.split(" ")[0]));
  });

  function selectDate(p: PilgrimageSummary) {
    const range = formatDateRange(p.start_date, p.end_date, lang);
    const msg = lang === "ru"
      ? `Интересует поездка – ${title} – ${range}`
      : `Mă interesează pelerinajul – ${title} – ${range}`;
    setPrefill(msg);
    if (typeof window !== "undefined") {
      const el = document.getElementById("lead");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <PageShell>
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="max-w-6xl mx-auto px-6 pt-2 text-[15px] md:text-base font-serif text-foreground/70">
        <ol className="flex flex-wrap items-center justify-center gap-2 min-h-[40px]">
          <li><Link to="/" className="hover:text-accent">{t("Главная", "Acasă")}</Link></li>
          <li aria-hidden="true">→</li>
          <li><Link to="/destinations" className="hover:text-accent">{t("Направления", "Destinații")}</Link></li>
          <li aria-hidden="true">→</li>
          <li className="text-foreground">{shortTitle}</li>
        </ol>
      </nav>

      {/* Hero — mobile */}
      {heroImg && (
        <section className="md:hidden relative h-[50vh] min-h-[400px] flex items-end overflow-hidden mt-4">
          <img src={heroImg} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/75" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 w-full">
            <h1 className="font-serif text-4xl text-white font-light leading-tight drop-shadow-lg">{title}</h1>
            {heroQuote && (
              <p className="mt-4 font-serif italic text-white/85 text-lg max-w-2xl">{heroQuote}</p>
            )}
            {heroQuoteAuthor && (
              <p className="mt-2 font-serif italic text-white/70 text-sm">– {heroQuoteAuthor}</p>
            )}
          </div>
        </section>
      )}
      {!heroImg && (
        <section className="md:hidden px-6 pt-6">
          <h1 className="font-serif text-4xl text-foreground font-light leading-tight">{title}</h1>
        </section>
      )}

      {/* Gallery — mobile strip */}
      {galleryPhotos.length > 0 && (
        <section className="md:hidden bg-background py-6">
          <div className="flex gap-3 overflow-x-auto px-6 snap-x snap-mandatory scrollbar-none">
            {galleryPhotos.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(i)}
                className="relative shrink-0 w-[45vw] aspect-square overflow-hidden rounded-sm ring-1 ring-gold/30 snap-start cursor-zoom-in"
                aria-label={t("Открыть фото", "Deschide fotografia")}
              >
                <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {attributionText && (
            <p className="px-6 mt-2 text-[11px] text-foreground/50 font-serif italic">{attributionText}</p>
          )}
        </section>
      )}

      {/* Hero — desktop */}
      <section className="hidden md:block mt-4 bg-background">
        <div className="max-w-6xl mx-auto pl-[5mm] pr-6">
          {heroImg && (
            <div className="md:float-left md:w-[calc(50%-1rem)] md:mr-8 md:mb-6 relative aspect-[5/4] overflow-hidden flex items-end rounded-sm">
              <img src={heroImg} alt={title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/85" />
              <div className="relative z-10 px-6 pb-6 w-full">
                <h1 className="font-serif text-3xl lg:text-[2.75rem] text-white font-light leading-tight drop-shadow-lg">{title}</h1>
                {heroQuote && (
                  <p className="mt-3 font-serif italic text-white/85 text-sm lg:text-[15px]">{heroQuote}</p>
                )}
                {heroQuoteAuthor && (
                  <p className="mt-1 font-serif italic text-white/70 text-xs lg:text-[13px]">– {heroQuoteAuthor}</p>
                )}
              </div>
            </div>
          )}
          <div className="font-serif">
            {galleryPhotos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-6 max-w-[70%]">
                {galleryPhotos.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="relative aspect-square overflow-hidden rounded-sm ring-1 ring-gold/30 hover:ring-gold transition-all duration-200 cursor-zoom-in group"
                    aria-label={t("Открыть фото", "Deschide fotografia")}
                  >
                    <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  </button>
                ))}
              </div>
            )}
            {attributionText && (
              <p className="-mt-4 mb-6 text-[11px] text-foreground/50 font-serif italic max-w-[70%]">{attributionText}</p>
            )}
            {intro && (
              <>
                <h2 className="text-3xl lg:text-4xl text-foreground font-light mb-4">
                  <span className="text-accent mr-2" aria-hidden="true">✦</span>
                  {t("О поездке", "Despre pelerinaj")}
                </h2>
                <p className="text-[17px] lg:text-[18px] text-foreground/85 leading-relaxed whitespace-pre-line">{intro}</p>
              </>
            )}
          </div>
          <div className="clear-both" />
        </div>
      </section>

      {/* Info bar */}
      {(duration || groupSize || priceFrom) && (
        <section className="bg-card border-y border-gold/30">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 font-serif text-center">
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-[22px] h-[22px] text-gold mb-1" aria-hidden="true" />
              <p className="overline text-[11px]">{t("Длительность", "Durata")}</p>
              <p className="text-[18px] md:text-[20px] text-foreground">{duration || "–"}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users className="w-[22px] h-[22px] text-gold mb-1" aria-hidden="true" />
              <p className="overline text-[11px]">{t("Группа", "Grup")}</p>
              <p className="text-[18px] md:text-[20px] text-foreground">{groupSize || "–"}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Euro className="w-[22px] h-[22px] text-gold mb-1" aria-hidden="true" />
              <p className="overline text-[11px]">{t("Цена", "Preț")}</p>
              <p className="text-[18px] md:text-[20px] text-gold">{priceFrom ? `${t("от", "de la")} €${priceFrom}` : "–"}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Church className="w-[22px] h-[22px] text-gold mb-1" aria-hidden="true" />
              <p className="overline text-[11px]">{t("Сопровождение", "Însoțire")}</p>
              <p className="text-[18px] md:text-[20px] text-foreground">{accompaniment}</p>
            </div>
          </div>
        </section>
      )}

      {/* Intro — mobile only */}
      {intro && (
        <section className="md:hidden bg-background font-serif">
          <div className="max-w-3xl mx-auto px-6 pt-6 pb-12">
            <h2 className="text-3xl text-foreground font-light mb-5">
              <span className="text-accent mr-2" aria-hidden="true">✦</span>
              {t("О поездке", "Despre pelerinaj")}
            </h2>
            <p className="text-[17px] text-foreground/85 leading-relaxed whitespace-pre-line">{intro}</p>
          </div>
        </section>
      )}

      {/* Святыни */}
      {shrinesList.length > 0 && (
        <section className="bg-secondary py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-8 text-center">{t("Главные святыни", "Sfintele moaște")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shrinesList.map((s, i) => {
                const stitle = pickL(s.title_ru, s.title_ro);
                const sshort = pickL(s.short_ru, s.short_ro);
                return (
                  <div key={s.id} id={`shrine-card-${i}`}>
                    <button
                      type="button"
                      onClick={() => handleShrineClick(i)}
                      aria-expanded={shrineExpand === i}
                      className="w-full text-left bg-card border border-gold/30 rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_8px_24px_-15px_rgba(61,40,23,0.4)] transition-all duration-300 block"
                    >
                      {s.image_url && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={s.image_url} alt={stitle} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5 font-serif">
                        <h3 className="text-xl text-foreground mb-2 leading-tight flex items-center justify-between gap-2">
                          <span>{stitle}</span>
                          <ChevronDown
                            className={`md:hidden w-5 h-5 text-accent shrink-0 transition-transform duration-200 ${shrineExpand === i ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </h3>
                        {sshort && (
                          <p className="text-[17px] text-foreground/75 leading-relaxed">{sshort}</p>
                        )}
                      </div>
                    </button>
                    {shrineExpand === i && (
                      <button
                        type="button"
                        id={`shrine-expand-${i}`}
                        onClick={() => setShrineExpand(null)}
                        aria-label={t("Свернуть", "Restrânge")}
                        className="md:hidden mt-3 w-full text-left bg-card border border-gold/30 rounded-sm p-5 font-serif text-[17px] text-foreground/85 leading-relaxed animate-fade-in whitespace-pre-line cursor-pointer hover:border-gold transition-colors"
                      >
                        {pickL(s.full_ru, s.full_ro) || sshort}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Desktop shrine modal */}
      <Dialog open={shrineModal !== null} onOpenChange={(o) => !o && setShrineModal(null)}>
        <DialogContent className="max-w-[90vw] w-[90vw] p-0 overflow-hidden">
          {shrineModal !== null && shrinesList[shrineModal] && (() => {
            const s = shrinesList[shrineModal];
            const stitle = pickL(s.title_ru, s.title_ro);
            const sfull = pickL(s.full_ru, s.full_ro) || pickL(s.short_ru, s.short_ro);
            return (
              <div className="grid md:grid-cols-2 max-h-[90vh]">
                <div className="aspect-square md:aspect-auto overflow-hidden bg-secondary">
                  {s.image_url && <img src={s.image_url} alt={stitle} className="w-full h-full object-cover" />}
                </div>
                <div className="p-8 md:p-10 font-serif overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl md:text-3xl font-light text-left mb-4">{stitle}</DialogTitle>
                  </DialogHeader>
                  <div className="text-[17px] md:text-[20px] leading-relaxed text-foreground/85 space-y-4 whitespace-pre-line">
                    {sfull}
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Программа */}
      {programDays.length > 0 && (
        <section className="bg-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Программа по дням", "Programul pe zile")}</h2>
            <Accordion type="single" collapsible className="font-serif">
              {programDays.map((d, i) => {
                const label = pickL(d.day_label_ru, d.day_label_ro);
                const dtitle = pickL(d.title_ru, d.title_ro);
                const ddesc = pickL(d.description_ru, d.description_ro);
                const heading = label ? `${label} – ${dtitle}` : dtitle;
                return (
                  <AccordionItem key={d.id} value={`d${i}`} className="border-gold/30">
                    <AccordionTrigger className="text-[17px] md:text-[21px] text-foreground hover:text-accent text-left [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-accent">
                      <span className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-primary-foreground text-sm font-serif shrink-0">{i + 1}</span>
                        <span>{heading}</span>
                      </span>
                    </AccordionTrigger>
                    {ddesc && (
                      <AccordionContent className="text-[16px] md:text-[20px] text-foreground/80 leading-relaxed pl-11 whitespace-pre-line">{ddesc}</AccordionContent>
                    )}
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </section>
      )}

      {/* Включено / не включено */}
      {(included.length > 0 || excluded.length > 0) && (
        <section className="bg-secondary py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 md:pl-16 lg:pl-24 grid md:grid-cols-2 gap-10 font-serif">
            {included.length > 0 && (
              <div>
                <h2 className="inline-block text-2xl md:text-[2.6rem] text-foreground font-light mb-4 border-b-2 border-olive pb-1">{t("Что включено", "Ce este inclus")}</h2>
                <ul className="space-y-3 text-[16px] md:text-[20px] text-foreground/85 leading-relaxed">
                  {included.map((x) => (
                    <li key={x.id} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-olive shrink-0 mt-1" aria-hidden="true" />
                      <span>{pickL(x.text_ru, x.text_ro)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {excluded.length > 0 && (
              <div>
                <h2 className="inline-block text-2xl md:text-[2.6rem] text-foreground font-light mb-4 border-b-2 border-[#b53d2e] pb-1">{t("Не включено", "Nu este inclus")}</h2>
                <ul className="space-y-3 text-[16px] md:text-[20px] text-foreground/85 leading-relaxed">
                  {excluded.map((x) => (
                    <li key={x.id} className="flex gap-3 items-start">
                      <Minus className="w-5 h-5 md:w-6 md:h-6 text-[#b53d2e] shrink-0 mt-1" aria-hidden="true" />
                      <span>{pickL(x.text_ru, x.text_ro)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Notice */}
      {notice && (
        <section className="bg-background py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="border-l-4 border-gold bg-card/50 px-5 py-4 font-serif italic text-[17px] text-foreground/80 leading-relaxed whitespace-pre-line">
              {notice}
            </div>
          </div>
        </section>
      )}

      {/* Ближайшие даты */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Ближайшие даты", "Datele apropiate")}</h2>
          {dates.length === 0 ? (
            <p className="font-serif italic text-[17px] text-foreground/70">
              {t("Даты уточняются. Свяжитесь с нами – подскажем ближайшую поездку.", "Datele se precizează. Contactați-ne – vă vom informa despre cel mai apropiat pelerinaj.")}
            </p>
          ) : (
            <ul className="space-y-3 font-serif">
              {dates.map((p) => (
                <li
                  key={p.id}
                  onClick={() => selectDate(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectDate(p); } }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-gold/30 rounded-sm px-6 py-5 cursor-pointer hover:border-gold transition-all duration-300"
                >
                  <div>
                    <p className="text-[17px] md:text-[24px] text-foreground">{pickL(p.title_ru, p.title_ro)}</p>
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
      {faqList.length > 0 && (
        <section className="bg-secondary py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-6">{t("Вопросы и ответы", "Întrebări și răspunsuri")}</h2>
            <Accordion type="single" collapsible className="font-serif md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-2">
              {faqList.map((q, i) => (
                <AccordionItem key={q.id} value={`q${i}`} className="border-gold/30">
                  <AccordionTrigger className="text-[16px] md:text-[19px] text-foreground hover:text-accent text-left [&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-accent">
                    {pickL(q.question_ru, q.question_ro)}
                  </AccordionTrigger>
                  {(q.answer_ru || q.answer_ro) && (
                    <AccordionContent className="text-[15px] md:text-[18px] text-foreground/80 leading-relaxed whitespace-pre-line">
                      {pickL(q.answer_ru, q.answer_ro)}
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Lead form */}
      <LeadForm slug={slug} prefill={prefill} onPrefillConsumed={() => setPrefill("")} />

      {/* Lightbox */}
      {galleryPhotos.length > 0 && (
        <Lightbox
          open={lightbox.open}
          index={lightbox.index}
          close={() => setLightbox({ open: false, index: 0 })}
          slides={galleryPhotos.map((p) => ({ src: p.src, alt: p.alt, description: p.description }))}
          plugins={[Thumbnails, Captions]}
          captions={{ descriptionTextAlign: "center", showToggle: false }}
        />
      )}
    </PageShell>
  );
}

const ViberIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8v1a8 8 0 0 1-8 8h-1l-4 3v-3.2A8 8 0 0 1 3 12v-1Z" />
    <path d="M9 9.5c0-.6.4-1 1-1h.6c.4 0 .8.3.9.7l.4 1.4c.1.4 0 .8-.3 1l-.6.5a6 6 0 0 0 2.9 2.9l.5-.6c.2-.3.6-.4 1-.3l1.4.4c.4.1.7.5.7.9v.6c0 .6-.4 1-1 1A7.5 7.5 0 0 1 9 9.5Z" />
  </svg>
);

function LeadForm({ slug, prefill, onPrefillConsumed }: { slug: string; prefill: string; onPrefillConsumed: () => void }) {
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
      await submit({ data: { ...form, source: `destination:${slug}` } });
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
            href="mailto:palomnik.moldova@gmail.com"
            className="flex items-center w-full py-3 pl-4 pr-4 bg-card rounded-sm border border-border/40 border-l-2 border-l-gold hover:bg-gold/5 transition-colors text-[18px]"
          >
            <span className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center mr-3 shrink-0">
              <Mail className="w-4 h-4 text-accent" aria-hidden="true" />
            </span>
            <span className="text-accent">palomnik.moldova@gmail.com</span>
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
        href="mailto:palomnik.moldova@gmail.com"
        className="inline-flex items-center text-[18px] md:text-[20px] text-accent hover:underline"
      >
        <Mail className="w-[18px] h-[18px] text-accent mr-2" aria-hidden="true" />
        palomnik.moldova@gmail.com
      </a>
    </div>
  );
}
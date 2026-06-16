import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import { useLocalizedTo } from "@/lib/use-localized-to";
import { getAboutPageData } from "@/lib/about.functions";
import { listPublishedClergy } from "@/lib/clergy.functions";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useLightboxCaptionProps, useLightboxPlugins } from "@/components/site/LightboxCaption";

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch { /* ignore */ }
  return null;
}

export function Component() {
  const { t, lang } = useLang();
  const localize = useLocalizedTo();
  const captionProps = useLightboxCaptionProps();
  const lightboxPlugins = useLightboxPlugins([Thumbnails, Captions, Zoom], Captions);

  const getAbout = useServerFn(getAboutPageData);
  const getClergy = useServerFn(listPublishedClergy);
  const { data: about } = useQuery({ queryKey: ["about-page"], queryFn: () => getAbout() });
  const { data: clergy } = useQuery({ queryKey: ["clergy-published"], queryFn: () => getClergy() });

  const page = about?.page ?? null;
  const gallery = about?.gallery ?? [];
  const team = about?.team ?? [];
  const clergyList = clergy ?? [];

  const heroPhoto = page?.hero_photo_url || null;
  const heroTitle = (lang === "ru" ? page?.hero_title_ru : page?.hero_title_ro)
    || t("Анна Плотник – путешественница и паломница", "Anna Plotnik – călătoare și pelerină");
  const introText = (lang === "ru" ? page?.intro_text_ru : page?.intro_text_ro) || "";
  const introParagraphs = introText.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const videoEmbed = page?.video_url ? youtubeEmbed(page.video_url) : null;

  const visibleTeam = team.filter((m) => m.photo_url);
  const visibleClergy = clergyList.filter((c) => c.photo_url);

  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const galleryPhotos = gallery.map((g) => {
    const cap = (lang === "ru" ? g.caption_ru : g.caption_ro) ?? "";
    return { src: g.image_url, alt: cap, description: cap };
  });
  const openLightbox = (i: number) => setLightbox({ open: true, index: i });

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative">
        <div className="grid md:grid-cols-2 gap-0 items-stretch">
          <div className="aspect-[4/3] md:aspect-auto md:min-h-[520px] overflow-hidden">
            {heroPhoto && (
              <img
                src={heroPhoto}
                alt={t("Анна Плотник", "Anna Plotnik")}
                width={1600}
                height={1024}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="bg-card flex md:items-start px-6 md:px-10 pt-4 pb-10 md:pt-8 md:pb-8">
            <div className="w-full">
              <h1 className="font-serif text-3xl md:text-[28px] lg:text-[32px] font-light text-foreground leading-[1.15] mb-3 md:mb-5">
                {heroTitle}
              </h1>
              {/* Desktop-only: intro + contacts inside the right hero column */}
              <div className="hidden md:block">
                {introParagraphs.length > 0 && (
                  <div className="space-y-3 text-foreground/85 text-[18px] leading-[1.7]">
                    {introParagraphs.map((p, i) => (<p key={i}>{p}</p>))}
                  </div>
                )}
                <div className="mt-5 flex flex-wrap gap-3 font-serif">
                  <a href="tel:+37368778676" className="inline-flex items-center px-5 py-2 bg-accent text-primary-foreground hover:bg-accent/90 transition-colors rounded-sm text-sm tracking-wide">
                    +373 68 77 86 76
                  </a>
                  <a href="mailto:palomnik.moldova@gmail.com" className="inline-flex items-center px-5 py-2 border border-gold text-foreground hover:bg-secondary transition-colors rounded-sm text-sm tracking-wide">
                    palomnik.moldova@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAL ADDRESS — mobile only (desktop shows it inside hero right column) */}
      <section className="md:hidden max-w-3xl mx-auto px-6 pb-16">
        {introParagraphs.length > 0 && (
          <div className="space-y-5 text-foreground/85 text-[17px] leading-[1.85]">
            {introParagraphs.map((p, i) => (<p key={i}>{p}</p>))}
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-4 font-serif">
          <a href="tel:+37368778676" className="inline-flex items-center px-6 py-2.5 bg-accent text-primary-foreground hover:bg-accent/90 transition-colors rounded-sm text-sm tracking-wide">
            +373 68 77 86 76
          </a>
          <a href="mailto:palomnik.moldova@gmail.com" className="inline-flex items-center px-6 py-2.5 border border-gold text-foreground hover:bg-secondary transition-colors rounded-sm text-sm tracking-wide">
            palomnik.moldova@gmail.com
          </a>
        </div>
      </section>

      {/* GALLERY */}
      {gallery.length > 0 && (
      <section className="bg-secondary/50 py-12 md:py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              {t("Моя фотогалерея", "Galeria mea foto")}
            </h2>
          </div>
          {/* Mobile: horizontal strip */}
          <div className="md:hidden -mx-6">
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
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-4 gap-2 max-w-[70%] mx-auto">
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
        </div>
        <Lightbox
          open={lightbox.open}
          index={lightbox.index}
          close={() => setLightbox({ open: false, index: 0 })}
          slides={galleryPhotos.map((p) => ({ src: p.src, alt: p.alt, description: p.description }))}
          plugins={lightboxPlugins}
          {...captionProps}
        />
      </section>
      )}

      {/* VIDEO */}
      {videoEmbed && (
      <section className="py-12 md:py-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="overline mb-3">{t("Видео", "Video")}</p>
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6">
            {t("Видеоприветствие Анны", "Mesaj video de la Anna")}
          </h2>
          <div className="aspect-video bg-card border border-gold/30 rounded-sm overflow-hidden">
            <iframe
              src={videoEmbed}
              title={t("Видеоприветствие Анны", "Mesaj video de la Anna")}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
      )}

      {/* ELDORADO LINK */}
      <section className="bg-card/70 border-y border-border/60 py-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="overline mb-3">{t("Часть агентства", "Parte din agenție")}</p>
          <p className="text-foreground/85 leading-relaxed mb-6 font-serif text-lg">
            {t(
              "Сайт «Паломник» – направление туристического агентства SRL Eldorado Tur. Лицензия Министерства культуры РМ. Работаем с 2015 года.",
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
      {(visibleTeam.length > 0 || visibleClergy.length > 0) && (
      <section className="py-12 md:py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 text-center">
            <p className="overline mb-3">{t("Команда", "Echipa")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
              {t("Кто сопровождает поездки", "Cine însoțește călătoriile")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleTeam.map((m) => {
              const name = lang === "ru" ? m.name_ru : m.name_ro;
              const role = lang === "ru" ? m.role_ru : m.role_ro;
              return (
                <article key={m.id} className="bg-card border border-gold/30 rounded-sm overflow-hidden">
                  <div className="aspect-[4/5] overflow-hidden bg-secondary">
                    <img src={m.photo_url!} alt={name} loading="lazy" width={640} height={800} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-foreground">{name}</h3>
                    {role && <p className="text-sm text-muted-foreground italic font-serif mt-1">{role}</p>}
                  </div>
                </article>
              );
            })}
            {visibleClergy.map((c) => {
              const name = lang === "ru" ? c.name_ru : c.name_ro;
              const role = lang === "ru" ? c.title_ru : c.title_ro;
              return (
                <article key={c.id} className="bg-card border border-gold/30 rounded-sm overflow-hidden">
                  <div className="aspect-[4/5] overflow-hidden bg-secondary">
                    <img src={c.photo_url!} alt={name} loading="lazy" width={640} height={800} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-foreground">{name}</h3>
                    {role && <p className="text-sm text-muted-foreground italic font-serif mt-1">{role}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* COMPANY DETAILS */}
      <section className="bg-secondary/60 py-12 border-t border-border/60">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-foreground/75 font-serif leading-relaxed">
          <p className="text-foreground font-medium">SRL Eldorado Tur · IDNO 1015600011157</p>
          <p>bd. Dacia 20, of. 81, Chișinău, MD2060</p>
          <p className="mt-3">
            <a href="tel:+37368778676" className="hover:text-gold transition-colors">+373 68 77 86 76</a>
            <span className="mx-2 text-border">·</span>
            <a href="mailto:palomnik.moldova@gmail.com" className="hover:text-gold transition-colors">palomnik.moldova@gmail.com</a>
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            <Link to={localize("/contacts") as "/contacts"} className="hover:text-foreground gold-underline">{t("Связаться с нами", "Contactați-ne")}</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

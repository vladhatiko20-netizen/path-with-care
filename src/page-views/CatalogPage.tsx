import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, ImageIcon, Send, User, Phone, Mail, MessageSquare } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import { createLead } from "@/lib/leads.functions";
import {
  getCatalogPageData,
  type CatalogCategory,
  type CatalogItem,
  type CatalogPage,
} from "@/lib/catalog.functions";

const DEFAULTS = {
  hero_overline_ru: "Святыни со святых мест",
  hero_overline_ro: "Sfințenii de la locuri sfinte",
  hero_title_ru: "Иконы и святыни",
  hero_title_ro: "Icoane și obiecte sfinte",
  intro_ru: "",
  intro_ro: "",
  empty_state_ru: "Не нашли что искали? Напишите – может быть, привезём из ближайшей поездки.",
  empty_state_ro: "Nu ați găsit ce căutați? Scrieți-ne – poate aducem din următorul pelerinaj.",
  form_title_ru: "Заявка на святыню",
  form_title_ro: "Cerere pentru o sfințenie",
  form_subtitle_ru: "",
  form_subtitle_ro: "",
  form_success_title_ru: "Заявка принята",
  form_success_title_ro: "Cererea a fost primită",
  form_success_text_ru: "Анна свяжется с вами в ближайшее время.",
  form_success_text_ro: "Anna vă va contacta în cel mai scurt timp.",
  card_caption_ru: "привезём из поездки",
  card_caption_ro: "aducem din pelerinaj",
};

function pick(lang: "ru" | "ro", ru: string | null | undefined, ro: string | null | undefined, fallbackRu: string, fallbackRo: string): string {
  if (lang === "ru") return (ru && ru.trim()) || fallbackRu;
  return (ro && ro.trim()) || fallbackRo;
}

export function Component() {
  const { t, lang } = useLang();
  const fetchData = useServerFn(getCatalogPageData);
  const { data, isLoading } = useQuery({
    queryKey: ["catalog-page"],
    queryFn: () => fetchData(),
  });

  const page: CatalogPage | null = data?.page ?? null;
  const items: CatalogItem[] = data?.items ?? [];

  const categories: CatalogCategory[] = page?.categories ?? [];
  const [cat, setCat] = useState<string>("all");
  const [order, setOrder] = useState<CatalogItem | null>(null);

  const visible = useMemo(
    () => (cat === "all" ? items : items.filter((i) => i.category === cat)),
    [items, cat],
  );

  const heroOverline = pick(lang, page?.hero_overline_ru, page?.hero_overline_ro, DEFAULTS.hero_overline_ru, DEFAULTS.hero_overline_ro);
  const heroTitle = pick(lang, page?.hero_title_ru, page?.hero_title_ro, DEFAULTS.hero_title_ru, DEFAULTS.hero_title_ro);
  const intro = pick(lang, page?.intro_ru, page?.intro_ro, DEFAULTS.intro_ru, DEFAULTS.intro_ro);
  const emptyState = pick(lang, page?.empty_state_ru, page?.empty_state_ro, DEFAULTS.empty_state_ru, DEFAULTS.empty_state_ro);
  const formTitle = pick(lang, page?.form_title_ru, page?.form_title_ro, DEFAULTS.form_title_ru, DEFAULTS.form_title_ro);
  const formSubtitle = pick(lang, page?.form_subtitle_ru, page?.form_subtitle_ro, DEFAULTS.form_subtitle_ru, DEFAULTS.form_subtitle_ro);
  const cardCaption = pick(lang, page?.card_caption_ru, page?.card_caption_ro, DEFAULTS.card_caption_ru, DEFAULTS.card_caption_ro);
  const successTitle = pick(lang, page?.form_success_title_ru, page?.form_success_title_ro, DEFAULTS.form_success_title_ru, DEFAULTS.form_success_title_ro);
  const successText = pick(lang, page?.form_success_text_ru, page?.form_success_text_ro, DEFAULTS.form_success_text_ru, DEFAULTS.form_success_text_ro);

  const allLabel = t("Все", "Toate");

  return (
    <PageShell>
      <section className="relative h-[46vh] md:h-[62vh] min-h-[370px] flex items-end overflow-hidden bg-secondary">
        {page?.hero_image_url && (
          <img
            src={page.hero_image_url}
            alt={heroTitle}
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-14 w-full">
          {heroOverline && <p className="overline text-white/90 mb-3">{heroOverline.toUpperCase()}</p>}
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {heroTitle}
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-10">
        {intro && (
          <p className="prose-warm text-base md:text-lg font-serif italic text-foreground/85 mb-10 max-w-3xl leading-[1.85]">
            {intro}
          </p>
        )}

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-gold/30">
            <button
              onClick={() => setCat("all")}
              className={`px-4 py-2 text-sm font-serif rounded-sm border transition-colors ${cat === "all" ? "bg-accent text-primary-foreground border-accent" : "border-gold/40 text-foreground hover:bg-secondary"}`}
            >
              {allLabel}
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`px-4 py-2 text-sm font-serif rounded-sm border transition-colors ${cat === c.key ? "bg-accent text-primary-foreground border-accent" : "border-gold/40 text-foreground hover:bg-secondary"}`}
              >
                {lang === "ru" ? c.label_ru : c.label_ro}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className="text-foreground/60 italic font-serif">{t("Загрузка…", "Se încarcă…")}</p>
        ) : visible.length === 0 ? (
          <p className="text-foreground/70 italic font-serif">
            {t("В этой категории пока пусто.", "Această categorie este goală deocamdată.")}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visible.map((it) => (
              <button
                key={it.id}
                onClick={() => setOrder(it)}
                className="group text-left bg-card border border-gold/30 rounded-sm overflow-hidden hover:border-gold hover:-translate-y-0.5 transition-all duration-500"
              >
                <div className="aspect-square overflow-hidden bg-secondary flex items-center justify-center">
                  {it.image_url ? (
                    <img
                      src={it.image_url}
                      alt={lang === "ru" ? it.title_ru : it.title_ro}
                      loading="lazy"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1200ms]"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-foreground/20" aria-hidden="true" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base text-foreground mb-1 leading-tight">
                    {lang === "ru" ? it.title_ru : it.title_ro}
                  </h3>
                  <p className="text-xs italic text-accent font-serif">{cardCaption}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="mt-12 text-center text-foreground/75 italic font-serif text-base md:text-lg max-w-2xl mx-auto leading-[1.85]">
          {emptyState}
        </p>
      </section>

      <CatalogLeadForm
        title={formTitle}
        subtitle={formSubtitle}
        successTitle={successTitle}
        successText={successText}
        source="catalog"
      />

      {order && (
        <ItemOrderModal
          item={order}
          onClose={() => setOrder(null)}
          successTitle={successTitle}
          successText={successText}
          cardCaption={cardCaption}
        />
      )}
    </PageShell>
  );
}

function CatalogLeadForm({
  title,
  subtitle,
  successTitle,
  successText,
  source,
  initialMessage,
}: {
  title: string;
  subtitle: string;
  successTitle: string;
  successText: string;
  source: string;
  initialMessage?: string;
}) {
  const { t } = useLang();
  const submit = useServerFn(createLead);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: initialMessage ?? "",
    website: "", // honeypot
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    // Honeypot — bots that fill the hidden field get a silent success.
    if (form.website.trim().length > 0) {
      setSent(true);
      return;
    }
    if (form.name.trim().length < 1) {
      toast.error(t("Введите имя", "Introduceți numele"));
      return;
    }
    setSending(true);
    try {
      await submit({
        data: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          source,
        },
      });
      setSent(true);
      toast.success(t("Заявка отправлена", "Cererea a fost trimisă"));
    } catch (err) {
      console.error(err);
      toast.error(t("Не удалось отправить. Попробуйте позже.", "Nu s-a putut trimite. Încercați mai târziu."));
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="catalog-order" className="bg-secondary py-12 md:py-16 scroll-mt-24 border-t border-gold/30">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-3 text-center">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-foreground/75 italic font-serif mb-8 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {sent ? (
          <div className="p-6 bg-[#d1fae5] border border-[#10b981] rounded-sm text-[#065f46] font-serif flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-[#10b981] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-lg md:text-xl mb-1">{successTitle}</h3>
              <p className="text-sm md:text-base leading-relaxed opacity-90">{successText}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 font-serif">
            {/* Honeypot — hidden from users, visible to naive bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                required
                maxLength={100}
                placeholder={t("Имя", "Nume")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm text-[16px] md:text-[18px] focus:outline-none focus:border-gold md:focus:ring-2 md:focus:ring-accent/25"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                maxLength={30}
                placeholder={t("Телефон", "Telefon")}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm text-[16px] md:text-[18px] focus:outline-none focus:border-gold md:focus:ring-2 md:focus:ring-accent/25"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <input
                type="email"
                maxLength={255}
                placeholder={t("Email (необязательно)", "Email (opțional)")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm text-[16px] md:text-[18px] focus:outline-none focus:border-gold md:focus:ring-2 md:focus:ring-accent/25"
              />
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <textarea
                required
                maxLength={2000}
                rows={5}
                placeholder={t(
                  "Что хотели бы получить? Опишите подробнее.",
                  "Ce ați dori să primiți? Descrieți mai în detaliu.",
                )}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-sm text-[16px] md:text-[18px] focus:outline-none focus:border-gold md:focus:ring-2 md:focus:ring-accent/25 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-accent text-primary-foreground text-[17px] md:text-[20px] font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md disabled:opacity-60"
            >
              {sending ? t("Отправка…", "Se trimite…") : t("Отправить заявку", "Trimiteți cererea")}
              {!sending && <Send className="w-4 h-4" aria-hidden="true" />}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function ItemOrderModal({
  item,
  onClose,
  successTitle,
  successText,
  cardCaption,
}: {
  item: CatalogItem;
  onClose: () => void;
  successTitle: string;
  successText: string;
  cardCaption: string;
}) {
  const { t, lang } = useLang();
  const submit = useServerFn(createLead);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const title = lang === "ru" ? item.title_ru : item.title_ro;
  const description = lang === "ru" ? item.description_ru : item.description_ro;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (form.website.trim().length > 0) {
      setSent(true);
      return;
    }
    if (form.name.trim().length < 1) {
      toast.error(t("Введите имя", "Introduceți numele"));
      return;
    }
    setSending(true);
    try {
      const prefix = `${item.title_ru} / ${item.title_ro}\n\n`;
      await submit({
        data: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: prefix + form.message,
          source: `catalog:${item.slug}`,
        },
      });
      setSent(true);
      toast.success(t("Заявка отправлена", "Cererea a fost trimisă"));
    } catch (err) {
      console.error(err);
      toast.error(t("Не удалось отправить. Попробуйте позже.", "Nu s-a putut trimite. Încercați mai târziu."));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-background border border-gold/40 rounded-sm max-w-md w-full p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="overline mb-2">{cardCaption.toUpperCase()}</p>
        <h3 className="font-serif text-2xl text-foreground mb-3">{title}</h3>
        {description && description.trim().length > 0 && (
          <p className="text-sm text-foreground/75 font-serif italic mb-5 leading-relaxed">{description}</p>
        )}
        {sent ? (
          <div className="p-4 bg-[#d1fae5] border border-[#10b981] rounded-sm text-[#065f46] font-serif">
            <p className="font-semibold mb-1">{successTitle}</p>
            <p className="text-sm opacity-90">{successText}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-4 py-2 border border-[#10b981]/40 rounded-sm text-sm"
            >
              {t("Закрыть", "Închideți")}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
            <input
              required
              maxLength={100}
              placeholder={t("Имя", "Nume")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold"
            />
            <input
              maxLength={30}
              placeholder={t("Телефон", "Telefon")}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold"
            />
            <input
              type="email"
              maxLength={255}
              placeholder="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold"
            />
            <textarea
              maxLength={500}
              rows={3}
              placeholder={t("Сообщение", "Mesaj")}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold resize-none"
            />
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={sending}
                className="flex-1 px-5 py-2.5 bg-accent text-primary-foreground text-sm font-serif rounded-sm disabled:opacity-60"
              >
                {t("Оставить заявку", "Trimiteți cererea")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gold/40 text-foreground text-sm font-serif rounded-sm"
              >
                {t("Отмена", "Anulează")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
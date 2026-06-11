import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/catalog-hero.jpg";
import iNikolay from "@/assets/cat-nikolay.jpg";
import iJer from "@/assets/cat-jerusalem.jpg";
import iLadan from "@/assets/cat-ladan.jpg";
import iBook from "@/assets/cat-book.jpg";

type Cat = "icons" | "incense" | "books" | "other";
type Item = { img: string; cat: Cat; ru: string; ro: string };

const items: Item[] = [
  { img: iNikolay, cat: "icons", ru: "Икона Святителя Николая (Бари)", ro: "Icoana Sf. Nicolae (Bari)" },
  { img: iNikolay, cat: "icons", ru: "Икона Святителя Спиридона (Корфу)", ro: "Icoana Sf. Spiridon (Corfu)" },
  { img: iJer, cat: "icons", ru: "Икона Иерусалимской Божией Матери", ro: "Icoana Maicii Domnului din Ierusalim" },
  { img: iLadan, cat: "incense", ru: "Афонский ладан", ro: "Tămâie de Athos" },
  { img: iLadan, cat: "incense", ru: "Свечи восковые иерусалимские", ro: "Lumânări de ceară din Ierusalim" },
  { img: iLadan, cat: "incense", ru: "Чётки афонские", ro: "Mătănii de Athos" },
  { img: iBook, cat: "books", ru: "«Старец Силуан Афонский»", ro: "„Stareţul Siluan Athonitul”" },
  { img: iBook, cat: "books", ru: "«Откровенные рассказы странника»", ro: "„Pelerinul rus”" },
  { img: iBook, cat: "books", ru: "«Невидимая брань» — преп. Никодим", ro: "„Războiul nevăzut” — Sf. Nicodim" },
  { img: iJer, cat: "other", ru: "Крестик нательный (Бари)", ro: "Cruciuliță de gât (Bari)" },
  { img: iJer, cat: "other", ru: "Иконка-подвеска Иерусалимская", ro: "Iconiță-pandantiv Ierusalim" },
  { img: iJer, cat: "other", ru: "Поясок «Живый в помощи»", ro: "Brâuleț „Cel ce locuiește”" },
];

export function Component() {
  const { t, lang } = useLang();
  const [cat, setCat] = useState<"all" | Cat>("all");
  const [order, setOrder] = useState<Item | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const cats: { key: "all" | Cat; ru: string; ro: string }[] = [
    { key: "all", ru: "Все", ro: "Toate" },
    { key: "icons", ru: "Иконы", ro: "Icoane" },
    { key: "incense", ru: "Ладан и свечи", ro: "Tămâie și lumânări" },
    { key: "books", ru: "Книги", ro: "Cărți" },
    { key: "other", ru: "Прочее", ro: "Diverse" },
  ];

  const visible = cat === "all" ? items : items.filter((i) => i.cat === cat);

  return (
    <PageShell>
      <section className="relative h-[46vh] md:h-[62vh] min-h-[370px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Иконы и святыни", "Icoane și obiecte sfinte")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("ПО ПРЕДЗАКАЗУ", "LA PRE-COMANDĂ")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Иконы и святыни", "Icoane și obiecte sfinte")}
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-10">
        <p className="prose-warm text-base md:text-lg font-serif italic text-foreground/85 mb-10 max-w-3xl leading-[1.85]">
          {t(
            "Многие православные святыни и духовная литература трудно найти в Молдове, особенно — со святых мест. Если вы хотели бы получить определённую икону, книгу или другую святыню — оставьте предзаказ. Анна привозит их из своих паломнических поездок.",
            "Multe icoane și cărți duhovnicești sunt greu de găsit în Moldova, mai ales — direct de la locurile sfinte. Dacă doriți o icoană sau o carte anume — lăsați o pre-comandă. Anna le aduce din pelerinajele sale."
          )}
        </p>

        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-gold/30">
          {cats.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={`px-4 py-2 text-sm font-serif rounded-sm border transition-colors ${cat === c.key ? "bg-accent text-primary-foreground border-accent" : "border-gold/40 text-foreground hover:bg-secondary"}`}>
              {lang === "ru" ? c.ru : c.ro}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {visible.map((it, i) => (
            <button key={i} onClick={() => { setOrder(it); setSent(false); }} className="group text-left bg-card border border-gold/30 rounded-sm overflow-hidden hover:border-gold hover:-translate-y-0.5 transition-all duration-500">
              <div className="aspect-square overflow-hidden">
                <img src={it.img} alt={lang === "ru" ? it.ru : it.ro} loading="lazy" width={500} height={500} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1200ms]" />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base text-foreground mb-1 leading-tight">{lang === "ru" ? it.ru : it.ro}</h3>
                <p className="text-xs italic text-accent font-serif">{t("по предзаказу", "la pre-comandă")}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-12 text-center text-foreground/75 italic font-serif text-base md:text-lg max-w-2xl mx-auto leading-[1.85]">
          {t(
            "Не нашли что искали? Напишите — может быть мы привезём из следующей поездки.",
            "Nu ați găsit ce căutați? Scrieți-ne — poate aducem din următoarea călătorie."
          )}
        </p>
      </section>

      {order && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setOrder(null)}>
          <div className="bg-background border border-gold/40 rounded-sm max-w-md w-full p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <p className="overline mb-2">{t("Предзаказ", "Pre-comandă")}</p>
            <h3 className="font-serif text-2xl text-foreground mb-5">{lang === "ru" ? order.ru : order.ro}</h3>
            {sent ? (
              <p className="text-foreground/85 italic font-serif">{t("Спасибо, предзаказ принят. Анна свяжется с вами.", "Mulțumim, pre-comanda a fost primită.")}</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3">
                <input required maxLength={100} placeholder={t("Имя", "Nume")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
                <input required maxLength={30} placeholder={t("Телефон", "Telefon")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
                <input type="email" maxLength={255} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
                <textarea maxLength={500} rows={3} placeholder={t("Сообщение", "Mesaj")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold resize-none" />
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 px-5 py-2.5 bg-accent text-primary-foreground text-sm font-serif rounded-sm">{t("Оставить предзаказ", "Pre-comandă")}</button>
                  <button type="button" onClick={() => setOrder(null)} className="px-5 py-2.5 border border-gold/40 text-foreground text-sm font-serif rounded-sm">{t("Отмена", "Anulează")}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}

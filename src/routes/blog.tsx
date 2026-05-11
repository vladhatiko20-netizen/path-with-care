import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero-blog.jpg";
import imgAthos from "@/assets/dest-athos.jpg";
import imgJerusalem from "@/assets/dest-jerusalem.jpg";
import imgGeorgia from "@/assets/dest-georgia.jpg";
import imgFirst from "@/assets/about-pilgrimage.jpg";
import imgNikolay from "@/assets/cat-nikolay.jpg";
import imgCalendar from "@/assets/menu-calendar.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Православный блог — Паломник" },
      { name: "description", content: "Истории паломников, практические советы, рассказы о святых местах." },
      { property: "og:title", content: "Православный блог — Паломник" },
      { property: "og:description", content: "Истории паломников и рассказы о святых местах." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Page,
});

const posts = [
  { img: imgAthos, date: "12.02.2026", ru: { title: "Афон глазами того, кто впервые там", excerpt: "Тишина, литургия в три часа ночи, и понимание того, что Святая Гора живёт молитвой уже тысячу лет." }, ro: { title: "Athos prin ochii unui pelerin la prima vizită", excerpt: "Liniște, liturghie la trei dimineața, și înțelegerea că Muntele Sfânt trăiește prin rugăciune de o mie de ani." } },
  { img: imgJerusalem, date: "05.04.2026", ru: { title: "Иерусалим в Страстную седмицу", excerpt: "Как идут дни от Лазаревой субботы до Пасхи в Святом Граде. Личный опыт — без громких слов." }, ro: { title: "Ierusalim în Săptămâna Patimilor", excerpt: "Cum trec zilele de la Sâmbăta lui Lazăr până la Paști în Cetatea Sfântă." } },
  { img: imgGeorgia, date: "20.06.2026", ru: { title: "Грузинские монастыри — разговор с Богом", excerpt: "Светицховели, Бодбе, Давида Гареджи — три места, где время становится другим." }, ro: { title: "Mănăstirile Georgiei — dialog cu Dumnezeu", excerpt: "Svetițhoveli, Bodbe, David Gareja — trei locuri unde timpul curge altfel." } },
  { img: imgFirst, date: "10.01.2026", ru: { title: "Как готовиться к первому паломничеству", excerpt: "Самое важное — не суета сборов, а внутренняя готовность. Несколько простых советов." }, ro: { title: "Cum să te pregătești pentru primul pelerinaj", excerpt: "Cel mai important — pregătirea interioară. Câteva sfaturi simple." } },
  { img: imgNikolay, date: "18.12.2025", ru: { title: "Святитель Николай — заступник путешествующих", excerpt: "Почему именно к нему едут в Бари из всех уголков мира уже почти тысячу лет." }, ro: { title: "Sf. Nicolae — ocrotitorul călătorilor", excerpt: "De ce la el se merge la Bari din toate colțurile lumii." } },
  { img: imgCalendar, date: "01.01.2026", ru: { title: "Православный календарь: значимые даты 2026", excerpt: "Пасха, двунадесятые праздники, посты — и как они связаны с нашими поездками." }, ro: { title: "Calendar ortodox: datele importante 2026", excerpt: "Paștele, marile sărbători, posturi — și legătura cu călătoriile noastre." } },
];

function Page() {
  const { t, lang } = useLang();
  return (
    <PageShell>
      <section className="relative h-[40vh] md:h-[50vh] min-h-[320px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Открытая молитвенная книга", "Carte de rugăciuni")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("ИСТОРИИ И СОВЕТЫ", "POVEȘTI ȘI SFATURI")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Православный блог", "Blog ortodox")}
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => {
            const c = lang === "ru" ? p.ru : p.ro;
            return (
              <article key={i} className="group bg-card border border-gold/30 rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_12px_30px_-15px_rgba(61,40,23,0.4)] hover:-translate-y-0.5 transition-all duration-500">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p.img} alt={c.title} loading="lazy" width={800} height={500} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1200ms]" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground font-serif tracking-wider mb-2">{p.date}</p>
                  <h2 className="font-serif text-xl text-foreground mb-2 leading-tight">{c.title}</h2>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">{c.excerpt}</p>
                  <span className="text-sm text-accent font-serif italic group-hover:underline">
                    {t("Читать →", "Citește →")}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero-priest.jpg";
import p1 from "@/assets/team-priest1.jpg";
import p2 from "@/assets/team-priest2.jpg";
import p3 from "@/assets/team-priest3.jpg";

export const Route = createFileRoute("/with-priest")({
  head: () => ({
    meta: [
      { title: "Диалог со священником — Паломник" },
      { name: "description", content: "Беседы со священниками, сопровождающими наши паломнические группы. Часто задаваемые вопросы и форма для личного вопроса." },
      { property: "og:title", content: "Диалог со священником — Паломник" },
      { property: "og:description", content: "Беседы со священниками, сопровождающими паломников." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Page,
});

const priests = [
  { img: p1, ru: { name: "Отец Михаил", place: "храм свв. Константина и Елены, Кишинёв", desc: "Сопровождает группы в Иерусалим и Грецию более десяти лет." },
    ro: { name: "Părintele Mihail", place: "biserica Sf. Constantin și Elena, Chișinău", desc: "Însoțește grupuri în Ierusalim și Grecia de peste zece ani." } },
  { img: p2, ru: { name: "Отец Андрей", place: "монастырь Куркь", desc: "Духовник многих паломников из Молдовы. Поездки в Бари, Афон, Грузию." },
    ro: { name: "Părintele Andrei", place: "mănăstirea Curchi", desc: "Duhovnicul multor pelerini din Moldova. Călătorii la Bari, Athos, Georgia." } },
  { img: p3, ru: { name: "Отец Иоанн", place: "известный батюшка Кишинёва", desc: "Сопровождает паломников в Святую Землю и на Корфу. Беседы и исповедь в дороге." },
    ro: { name: "Părintele Ioan", place: "preot cunoscut din Chișinău", desc: "Însoțește pelerinii în Țara Sfântă și la Corfu." } },
];

const faq = [
  { ru: { q: "Как готовиться к паломничеству?", a: "Готовиться лучше всего исповедью и причастием перед поездкой, чтением утренних и вечерних молитв, чтением о святынях, к которым едете. Душа должна быть спокойна и открыта." },
    ro: { q: "Cum să mă pregătesc pentru pelerinaj?", a: "Cea mai bună pregătire este spovedania și împărtășania înainte de plecare, rugăciunile de dimineață și seară, lectura despre sanctuarele unde mergeți." } },
  { ru: { q: "Нужно ли поститься перед поездкой?", a: "Если поездка попадает на пост — соблюдаем общий пост Церкви. В обычные дни — по благословению духовника. Перед причастием — обязательный евхаристический пост." },
    ro: { q: "Trebuie să postesc înainte de călătorie?", a: "Dacă pelerinajul cade în post — ținem postul general al Bisericii. În rest — după binecuvântarea duhovnicului." } },
  { ru: { q: "Что взять с собой в Иерусалим?", a: "Удобную скромную одежду (плечи и колени закрыты, для женщин — платок), удобную обувь, личные вещи, святую воду в малой бутылке, свои крестильные крестики и иконки для освящения." },
    ro: { q: "Ce să iau cu mine în Ierusalim?", a: "Haine modeste comode (umeri și genunchi acoperiți, pentru femei — basma), încălțăminte comodă, cruciulițe și iconițe personale pentru sfințire." } },
  { ru: { q: "Как правильно прикладываться к мощам?", a: "Перекреститесь дважды, поклонитесь, поцелуйте — край раки или мощи, не лик святого на иконе. Перекреститесь третий раз. Не торопитесь и не загораживайте других." },
    ro: { q: "Cum să mă închin corect la moaște?", a: "Faceți semnul crucii de două ori, plecați-vă, sărutați marginea raclei sau moaștele, apoi încă o cruce. Fără grabă." } },
  { ru: { q: "Можно ли участвовать невоцерковлённому человеку?", a: "Да. Многие приходят в Церковь именно через паломничество. Священник в группе всегда готов поговорить, ответить на вопросы, помочь подготовиться к первой исповеди." },
    ro: { q: "Pot participa dacă nu sunt încă apropiat de Biserică?", a: "Da. Mulți vin în Biserică tocmai prin pelerinaj. Preotul din grup este oricând gata să vorbească și să vă ajute." } },
  { ru: { q: "Что нужно знать о церковной этике?", a: "В храме — тишина, скромная одежда, не фотографируйте людей и службу без разрешения. Свечи ставят с молитвой. Не проходите между престолом и иконостасом." },
    ro: { q: "Ce trebuie să știu despre eticheta bisericească?", a: "În biserică — liniște, haine modeste, fără fotografii ale slujbei. Lumânările se aprind cu rugăciune." } },
];

function Page() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [sent, setSent] = useState(false);
  return (
    <PageShell>
      <section className="relative h-[46vh] md:h-[62vh] min-h-[370px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Священник в молитве", "Preot în rugăciune")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("ДУХОВНОЕ СОПРОВОЖДЕНИЕ", "ÎNDRUMARE DUHOVNICEASCĂ")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Диалог со священником", "Dialog cu preotul")}
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 md:py-10">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-10">
          {t("Священники, сопровождающие наши группы", "Preoții care însoțesc grupurile noastre")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {priests.map((p, i) => {
            const c = lang === "ru" ? p.ru : p.ro;
            return (
              <div key={i} className="bg-card border border-gold/30 rounded-sm overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.img} alt={c.name} loading="lazy" width={800} height={1000} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-foreground mb-1">{c.name}</h3>
                  <p className="text-sm text-accent italic font-serif mb-3">{c.place}</p>
                  <p className="text-sm text-foreground/75 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/60 py-10 md:py-10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-10">
            {t("Часто задаваемые вопросы", "Întrebări frecvente")}
          </h2>
          <div className="space-y-6">
            {faq.map((f, i) => {
              const c = lang === "ru" ? f.ru : f.ro;
              return (
                <details key={i} className="group bg-card border border-gold/30 rounded-sm p-5">
                  <summary className="cursor-pointer font-serif text-lg text-foreground list-none flex items-start gap-3">
                    <span className="text-accent shrink-0">☦</span>
                    <span>{c.q}</span>
                  </summary>
                  <p className="mt-4 pl-7 text-foreground/80 leading-[1.8]">{c.a}</p>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-10 md:py-10">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-3">
          {t("Задать вопрос", "Pune o întrebare")}
        </h2>
        <p className="text-foreground/70 italic font-serif mb-8">
          {t("Священник ответит лично на ваш email.", "Preotul va răspunde personal la e-mailul dumneavoastră.")}
        </p>
        {sent ? (
          <div className="p-5 bg-card border border-gold/40 rounded-sm text-foreground/85 font-serif italic">
            {t("Спасибо, ваш вопрос отправлен.", "Mulțumim, întrebarea a fost trimisă.")}
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <input required maxLength={100} placeholder={t("Имя", "Nume")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
            <input required type="email" maxLength={255} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
            <textarea required maxLength={1000} rows={5} placeholder={t("Ваш вопрос", "Întrebarea dumneavoastră")} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold resize-none" />
            <button type="submit" className="px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md">
              {t("Отправить", "Trimite")}
            </button>
          </form>
        )}
      </section>
    </PageShell>
  );
}

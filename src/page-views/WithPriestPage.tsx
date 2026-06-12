import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { User } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero-priest.jpg";
import { listPublishedClergy } from "@/lib/clergy.functions";
import { createLead } from "@/lib/leads.functions";

export const clergyQueryOptions = queryOptions({
  queryKey: ["clergy", "published"],
  queryFn: () => listPublishedClergy(),
});

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

export function Component() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const submit = useServerFn(createLead);
  const { data: priests } = useSuspenseQuery(clergyQueryOptions);
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

      {priests.length > 0 && (
      <section className="max-w-5xl mx-auto px-6 py-10 md:py-10">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-10">
          {t("Священники, сопровождающие наши группы", "Preoții care însoțesc grupurile noastre")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 justify-items-center">
          {priests.map((p, i) => {
            const name = lang === "ru" ? p.name_ru : p.name_ro;
            const place = lang === "ru" ? p.title_ru : p.title_ro;
            const desc = lang === "ru" ? p.bio_ru : p.bio_ro;
            return (
              <div key={p.id ?? i} className="bg-card border border-gold/30 rounded-sm overflow-hidden w-full max-w-sm">
                <div className="aspect-[4/5] overflow-hidden bg-secondary/40 flex items-center justify-center">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={name} loading="lazy" width={800} height={1000} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-foreground mb-1">{name}</h3>
                  {place && <p className="text-sm text-accent italic font-serif mb-3">{place}</p>}
                  {desc && <p className="text-sm text-foreground/75 leading-relaxed">{desc}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      )}

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
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (sending) return;
              setSending(true);
              try {
                await submit({
                  data: {
                    name: form.name,
                    email: form.email,
                    message: form.question,
                    source: "with-priest",
                  },
                });
                setSent(true);
                toast.success(t("Вопрос отправлен", "Întrebarea a fost trimisă"));
              } catch (err) {
                console.error(err);
                toast.error(t("Не удалось отправить. Попробуйте позже.", "Nu s-a putut trimite. Încercați mai târziu."));
              } finally {
                setSending(false);
              }
            }}
            className="space-y-4"
          >
            <input required maxLength={100} placeholder={t("Имя", "Nume")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
            <input required type="email" maxLength={255} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
            <textarea required maxLength={1000} rows={5} placeholder={t("Ваш вопрос", "Întrebarea dumneavoastră")} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold resize-none" />
            <button type="submit" disabled={sending} className="px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md disabled:opacity-60">
              {sending ? t("Отправляем…", "Se trimite…") : t("Отправить", "Trimite")}
            </button>
          </form>
        )}
      </section>
    </PageShell>
  );
}

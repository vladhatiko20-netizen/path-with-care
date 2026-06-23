import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { User, CheckCircle } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero-priest.jpg";
import { listPublishedClergy } from "@/lib/clergy.functions";
import { createLead } from "@/lib/leads.functions";
import { listPublishedPriestFaq } from "@/lib/priest-faq.functions";
import { VoiceInput } from "@/components/voice/VoiceInput";

export const clergyQueryOptions = queryOptions({
  queryKey: ["clergy", "published"],
  queryFn: () => listPublishedClergy(),
});

export const priestFaqQueryOptions = queryOptions({
  queryKey: ["priest-faq", "published"],
  queryFn: () => listPublishedPriestFaq(),
});

export function Component() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", question: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const submit = useServerFn(createLead);
  const { data: priests } = useSuspenseQuery(clergyQueryOptions);
  const { data: faq } = useSuspenseQuery(priestFaqQueryOptions);
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

      {faq.length > 0 && (
      <section className="bg-secondary/60 py-10 md:py-10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-10">
            {t("Часто задаваемые вопросы", "Întrebări frecvente")}
          </h2>
          <div className="space-y-6">
            {faq.map((f) => {
              const q = lang === "ru" ? f.question_ru : (f.question_ro || f.question_ru);
              const a = lang === "ru" ? f.answer_ru : (f.answer_ro || f.answer_ru);
              const authorName = lang === "ru" ? f.author_name_ru : (f.author_name_ro || f.author_name_ru);
              const authorTitle = lang === "ru" ? f.author_title_ru : (f.author_title_ro || f.author_title_ru);
              const attribution = authorName
                ? (authorTitle ? `${authorTitle}, ${authorName}` : authorName)
                : null;
              return (
                <details key={f.id} className="group bg-card border border-gold/30 rounded-sm p-5">
                  <summary className="cursor-pointer font-serif text-lg text-foreground list-none flex items-start gap-3">
                    <span className="text-accent shrink-0">☦</span>
                    <span>{q}</span>
                  </summary>
                  <p className="mt-4 pl-7 text-foreground/80 leading-[1.8] whitespace-pre-wrap">{a}</p>
                  {attribution && (
                    <p className="mt-3 pl-7 text-sm text-accent italic font-serif">{attribution}</p>
                  )}
                </details>
              );
            })}
          </div>
        </div>
      </section>
      )}

      <section className="max-w-2xl mx-auto px-6 py-10 md:py-10">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-3">
          {t("Задать вопрос", "Pune o întrebare")}
        </h2>
        <p className="text-foreground/70 italic font-serif mb-8">
          {t(
            "Мы передадим ваш вопрос священнику. Ответ придёт на ваш email, а самые частые вопросы мы публикуем на сайте.",
            "Vom transmite întrebarea preotului. Răspunsul va veni pe e-mail, iar cele mai frecvente întrebări le publicăm pe site."
          )}
        </p>
        {sent ? (
          <div className="p-6 bg-[#d1fae5] border border-[#10b981] rounded-sm text-[#065f46] font-serif flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-[#10b981] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-lg md:text-xl mb-1">
                {t("Вопрос отправлен", "Întrebarea a fost trimisă")}
              </h3>
              <p className="text-sm md:text-base leading-relaxed opacity-90">
                {t("Ответ придёт на ваш email в ближайшее время.", "Răspunsul va veni pe e-mail în cel mai scurt timp.")}
              </p>
            </div>
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
                    phone: form.phone,
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
            <input required maxLength={100} placeholder={t("Имя", "Nume")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold md:transition-colors md:hover:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25" />
            <input required type="email" maxLength={255} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold md:transition-colors md:hover:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25" />
            <input maxLength={30} placeholder={t("Телефон (необязательно)", "Telefon (opțional)")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold md:transition-colors md:hover:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25" />
            <div className="relative">
              <textarea required maxLength={1000} rows={5} placeholder={t("Ваш вопрос", "Întrebarea dumneavoastră")} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full pl-4 pr-14 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold md:transition-colors md:hover:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25 resize-none" />
              <div className="absolute bottom-3 right-3">
                <VoiceInput
                  size="sm"
                  onTranscript={(txt) =>
                    setForm((f) => ({
                      ...f,
                      question: f.question.trim() ? `${f.question.trim()} ${txt}` : txt,
                    }))
                  }
                />
              </div>
            </div>
            <button type="submit" disabled={sending} className="px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md disabled:opacity-60">
              {sending ? t("Отправляем…", "Se trimite…") : t("Отправить", "Trimite")}
            </button>
          </form>
        )}
      </section>
    </PageShell>
  );
}

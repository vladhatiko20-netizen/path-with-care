import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { createLead } from "@/lib/leads.functions";
import { VoiceInput } from "@/components/voice/VoiceInput";

export function Component() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const submit = useServerFn(createLead);
  return (
    <PageShell>
      <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-12 pb-2">
        <p className="overline mb-5">{t("СВЯЗАТЬСЯ С НАМИ", "CONTACTAȚI-NE")}</p>
        <h1 className="font-serif text-3xl md:text-6xl font-light text-foreground leading-tight break-words">
          {t("Контакты", "Contacte")}
        </h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-10">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6 font-serif">
            <div>
              <p className="overline mb-2">{t("Адрес", "Adresă")}</p>
              <p className="text-lg text-foreground leading-relaxed">бд. Дачия 20, оф. 81<br/>Кишинёв, MD2060</p>
            </div>
            <div>
              <p className="overline mb-2">{t("Телефоны", "Telefoane")}</p>
              <p className="text-lg text-foreground">
                <a href="tel:+37368778676" className="text-accent hover:underline">Анна: +373 68 77 86 76</a>
              </p>
              <p className="text-lg text-foreground">
                <a href="tel:+37368787599" className="text-accent hover:underline">Наталья: +373 68 78 75 99</a>
              </p>
            </div>
            <div>
              <p className="overline mb-2">Email</p>
              <a href="mailto:palomnik.moldova@gmail.com" className="text-lg text-accent hover:underline">palomnik.moldova@gmail.com</a>
            </div>
            <div>
              <p className="overline mb-2">Viber</p>
              <a
                href="viber://chat?number=37368778676"
                className="inline-flex items-center gap-2 text-lg text-accent hover:underline"
              >
                <MessageCircle className="w-5 h-5" style={{ color: "#7360F2" }} />
                +373 68 77 86 76 – {t("Анна", "Anna")}
              </a>
            </div>
            <div>
              <p className="overline mb-2">{t("Часы работы", "Program")}</p>
              <p className="text-lg text-foreground">{t("Пн–Пт: 9:00–18:00", "Lu–Vi: 9:00–18:00")}</p>
              <p className="text-lg text-foreground">{t("Сб: 10:00–15:00", "Sâ: 10:00–15:00")}</p>
            </div>
          </div>

          <div>
            <div className="aspect-[4/3] rounded-sm overflow-hidden border border-gold/30">
              <iframe
                title="Google Maps – бд. Дачия 20, Кишинёв"
                src="https://www.google.com/maps?q=Bulevardul+Dacia+20,+Chi%C8%99in%C4%83u,+Moldova&hl=ru&z=16&output=embed"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-10 md:py-10">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-3">
            {t("Написать нам", "Scrieți-ne")}
          </h2>
          <p className="text-foreground/70 italic font-serif mb-8">
            {t("Ответим в течение рабочего дня.", "Răspundem în ziua lucrătoare.")}
          </p>
          {sent ? (
            <div className="p-5 bg-card border border-gold/40 rounded-sm text-foreground/85 font-serif italic">
              {t("Спасибо, сообщение отправлено.", "Mulțumim, mesajul a fost trimis.")}
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
                      message: form.message,
                      source: "contacts",
                    },
                  });
                  setSent(true);
                  toast.success(t("Сообщение отправлено", "Mesajul a fost trimis"));
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
              <input maxLength={30} placeholder={t("Телефон", "Telefon")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold md:transition-colors md:hover:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25" />
              <input type="email" maxLength={255} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold md:transition-colors md:hover:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25" />
              <div className="relative">
                <textarea required maxLength={1000} rows={5} placeholder={t("Сообщение", "Mesaj")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full pl-4 pr-14 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold md:transition-colors md:hover:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25 resize-none" />
                <div className="absolute bottom-3 right-3">
                  <VoiceInput
                    size="sm"
                    onTranscript={(txt) =>
                      setForm((f) => ({
                        ...f,
                        message: f.message.trim() ? `${f.message.trim()} ${txt}` : txt,
                      }))
                    }
                  />
                </div>
              </div>
              <button type="submit" disabled={sending} className="px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md disabled:opacity-60">
                {t("Отправить", "Trimite")}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

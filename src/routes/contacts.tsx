import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero-contacts.jpg";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты — Паломник" },
      { name: "description", content: "Адрес офиса в Кишинёве, телефоны, электронная почта, часы работы и форма обратной связи." },
      { property: "og:title", content: "Контакты — Паломник" },
      { property: "og:description", content: "Свяжитесь с нами: бд. Дачия 20, оф. 81, Кишинёв." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <PageShell>
      <section className="relative h-[46vh] md:h-[62vh] min-h-[370px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Православный храм в Кишинёве", "Biserică ortodoxă în Chișinău")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("СВЯЗАТЬСЯ С НАМИ", "CONTACTAȚI-NE")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Контакты", "Contacte")}
          </h1>
        </div>
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
                Анна: <a href="tel:+37368778676" className="text-accent hover:underline">+373 68 77 86 76</a>
              </p>
              <p className="text-lg text-foreground">
                Наталья: <a href="tel:+37368787599" className="text-accent hover:underline">+373 68 78 75 99</a>
              </p>
            </div>
            <div>
              <p className="overline mb-2">Email</p>
              <a href="mailto:pilgrimage@eldoradotur.md" className="text-lg text-accent hover:underline">pilgrimage@eldoradotur.md</a>
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
                title="Google Maps"
                src="https://www.google.com/maps?q=bd.+Dacia+20,+Chisinau&output=embed"
                className="w-full h-full"
                loading="lazy"
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
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <input required maxLength={100} placeholder={t("Имя", "Nume")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
              <input required maxLength={30} placeholder={t("Телефон", "Telefon")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
              <input type="email" maxLength={255} placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold" />
              <textarea required maxLength={1000} rows={5} placeholder={t("Сообщение", "Mesaj")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-serif focus:outline-none focus:border-gold resize-none" />
              <button type="submit" className="px-7 py-3 bg-accent text-primary-foreground text-sm font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md">
                {t("Отправить", "Trimite")}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

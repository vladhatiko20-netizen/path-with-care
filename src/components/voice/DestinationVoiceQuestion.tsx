import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mic, Send } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { VoiceInput } from "./VoiceInput";
import { useVoiceCapability } from "./use-voice-capability";
import { createVoiceLead } from "@/lib/voice.functions";

type Props = { slug: string };

export function DestinationVoiceQuestion({ slug }: Props) {
  const { t } = useLang();
  const cap = useVoiceCapability();
  const submit = useServerFn(createVoiceLead);
  const [text, setText] = useState("");
  const [lang, setLang] = useState<"ru" | "ro" | null>(null);
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!cap.available) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (text.trim().length < 1) {
      toast.error(t("Сначала задайте вопрос голосом.", "Mai întâi puneți întrebarea prin voce."));
      return;
    }
    if (form.name.trim().length < 1) {
      toast.error(t("Введите имя", "Introduceți numele"));
      return;
    }
    const phoneOk = /^[+\d\s()\-]{5,30}$/.test(form.phone.trim());
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!phoneOk && !emailOk) {
      toast.error(
        t("Укажите телефон или email.", "Introduceți telefonul sau e-mailul."),
      );
      return;
    }
    setSending(true);
    try {
      await submit({
        data: {
          transcribed_text: text.trim(),
          destination_slug: slug,
          audio_path: audioPath,
          source_lang: lang,
          name: form.name.trim(),
          phone: phoneOk ? form.phone.trim() : "",
          email: emailOk ? form.email.trim() : "",
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
  }

  return (
    <section className="bg-background py-10 md:py-12 border-t border-gold/30">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground font-light mb-2">
          {t("Задать вопрос голосом", "Întreabă prin voce")}
        </h2>
        <p className="text-foreground/70 italic font-serif mb-6 text-sm md:text-base">
          {t(
            "Нажмите микрофон и задайте вопрос – мы перезвоним.",
            "Apăsați microfonul și puneți întrebarea – vă vom suna.",
          )}
        </p>

        {sent ? (
          <div className="p-5 bg-card border border-gold/40 rounded-sm text-foreground/85 font-serif italic">
            {t("Спасибо, ваш вопрос отправлен.", "Mulțumim, întrebarea a fost trimisă.")}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 font-serif">
            <div className="flex items-start gap-3">
              <VoiceInput
                size="md"
                saveAudio
                destinationSlug={slug}
                onTranscript={(txt, meta) => {
                  setText((prev) => (prev.trim() ? `${prev.trim()} ${txt}` : txt));
                  if (meta.lang) setLang(meta.lang);
                  if (meta.audioPath) setAudioPath(meta.audioPath);
                }}
                ariaLabel={t("Записать вопрос", "Înregistrează întrebarea")}
              />
              <textarea
                rows={4}
                maxLength={2000}
                placeholder={t(
                  "Ваш вопрос появится здесь после записи. Можно отредактировать.",
                  "Întrebarea va apărea aici după înregistrare. Puteți edita.",
                )}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-4 py-3 bg-card border border-border rounded-sm text-[16px] md:text-[17px] focus:outline-none focus:border-gold md:transition-colors md:hover:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25 resize-none"
              />
            </div>
            <input
              required
              maxLength={100}
              placeholder={t("Имя", "Nume")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-sm text-[16px] focus:outline-none focus:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25"
            />
            <input
              maxLength={30}
              placeholder={t("Телефон", "Telefon")}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-sm text-[16px] focus:outline-none focus:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25"
            />
            <input
              type="email"
              maxLength={255}
              placeholder="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-card border border-border rounded-sm text-[16px] focus:outline-none focus:border-gold md:focus:border-accent md:focus:ring-2 md:focus:ring-accent/25"
            />
            <p className="text-xs text-muted-foreground italic">
              {t(
                "Укажите телефон или email, чтобы мы могли ответить.",
                "Introduceți telefonul sau e-mailul pentru a putea răspunde.",
              )}
            </p>
            <button
              type="submit"
              disabled={sending || text.trim().length < 1}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary-foreground text-[16px] font-serif tracking-wide hover:bg-accent/90 rounded-sm shadow-md disabled:opacity-60"
            >
              {sending ? (
                t("Отправка…", "Se trimite…")
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {t("Отправить вопрос", "Trimite întrebarea")}
                </>
              )}
            </button>
            {!cap.saveAudio && (
              <p className="sr-only">
                <Mic className="inline w-3 h-3" /> audio-storage off
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
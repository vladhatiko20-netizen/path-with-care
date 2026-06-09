import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { adminSaveDestination } from "@/lib/admin.functions";
import { ImageUpload } from "./ImageUpload";
import { GalleryManager } from "./GalleryManager";
import { ShrinesManager } from "./ShrinesManager";
import { ProgramDaysManager } from "./ProgramDaysManager";
import { InclusionsManager } from "./InclusionsManager";
import { FaqManager } from "./FaqManager";

type Initial = {
  id?: string;
  slug: string;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  cover_image: string | null;
  duration_ru: string | null;
  duration_ro: string | null;
  price_from: number | null;
  group_size_ru: string | null;
  group_size_ro: string | null;
  program_ru: string | null;
  program_ro: string | null;
  hero_quote_ru: string | null;
  hero_quote_ro: string | null;
  hero_quote_author_ru: string | null;
  hero_quote_author_ro: string | null;
  intro_ru: string | null;
  intro_ro: string | null;
  notice_ru: string | null;
  notice_ro: string | null;
  seo_title_ru: string | null;
  seo_title_ro: string | null;
  seo_description_ru: string | null;
  seo_description_ro: string | null;
  og_image: string | null;
  accompaniment_ru: string | null;
  accompaniment_ro: string | null;
  short_title_ru: string | null;
  short_title_ro: string | null;
  card_text_ru: string | null;
  card_text_ro: string | null;
  sort_order?: number;
  is_published: boolean;
};

export function DestinationForm({ initial }: { initial: Initial }) {
  const save = useServerFn(adminSaveDestination);
  const navigate = useNavigate();
  const [form, setForm] = useState<Initial>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Initial>(k: K, v: Initial[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await save({ data: { ...form, price_from: form.price_from ?? null } });
      navigate({ to: "/admin/destinations" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-4xl">
      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Основное</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-serif mb-1">Название (RU) *</label>
            <input className={cls} value={form.title_ru} onChange={(e) => set("title_ru", e.target.value)} required maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Название (RO) *</label>
            <input className={cls} value={form.title_ro} onChange={(e) => set("title_ro", e.target.value)} required maxLength={500} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-serif mb-1">URL (slug) *</label>
            <input className={cls} value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} required pattern="[a-z0-9\-]+" maxLength={255} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Короткое название (для крошек, RU)</label>
            <input className={cls} value={form.short_title_ru ?? ""} onChange={(e) => set("short_title_ru", e.target.value || null)} maxLength={120} placeholder="Бари" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Короткое название (для крошек, RO)</label>
            <input className={cls} value={form.short_title_ro ?? ""} onChange={(e) => set("short_title_ro", e.target.value || null)} maxLength={120} placeholder="Bari" />
          </div>
          <p className="sm:col-span-2 text-xs text-muted-foreground -mt-2">Используется только в хлебных крошках. Если пусто — берётся первое слово полного названия.</p>
        </div>
        <ImageUpload
          value={form.cover_image}
          onChange={(url) => set("cover_image", url)}
          folder="destinations"
          label="Главное фото"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
          Опубликовать
        </label>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Параметры поездки</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-serif mb-1">Длительность (RU)</label>
            <input className={cls} value={form.duration_ru ?? ""} onChange={(e) => set("duration_ru", e.target.value || null)} maxLength={255} placeholder="5–7 дней" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Длительность (RO)</label>
            <input className={cls} value={form.duration_ro ?? ""} onChange={(e) => set("duration_ro", e.target.value || null)} maxLength={255} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Цена от (€)</label>
            <input type="number" className={cls} value={form.price_from ?? ""} onChange={(e) => set("price_from", e.target.value ? Number(e.target.value) : null)} min={0} max={1000000} step="0.01" />
          </div>
          <div />
          <div>
            <label className="block text-sm font-serif mb-1">Размер группы (RU)</label>
            <input className={cls} value={form.group_size_ru ?? ""} onChange={(e) => set("group_size_ru", e.target.value || null)} maxLength={255} placeholder="до 15 человек" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Размер группы (RO)</label>
            <input className={cls} value={form.group_size_ro ?? ""} onChange={(e) => set("group_size_ro", e.target.value || null)} maxLength={255} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Сопровождение (RU)</label>
            <input className={cls} value={form.accompaniment_ru ?? ""} onChange={(e) => set("accompaniment_ru", e.target.value || null)} maxLength={255} placeholder="со священником" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Сопровождение (RO)</label>
            <input className={cls} value={form.accompaniment_ro ?? ""} onChange={(e) => set("accompaniment_ro", e.target.value || null)} maxLength={255} placeholder="cu preot" />
          </div>
          <p className="sm:col-span-2 text-xs text-muted-foreground -mt-2">
            По умолчанию — со священником. Заполните, только если поездка отличается.
          </p>
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Краткое описание (RU)</label>
          <textarea className={cls} rows={4} value={form.description_ru ?? ""} onChange={(e) => set("description_ru", e.target.value || null)} maxLength={5000} />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Краткое описание (RO)</label>
          <textarea className={cls} rows={4} value={form.description_ro ?? ""} onChange={(e) => set("description_ro", e.target.value || null)} maxLength={5000} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Цитата в шапке (Hero)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-serif mb-1">Цитата (RU)</label>
            <textarea className={cls} rows={3} value={form.hero_quote_ru ?? ""} onChange={(e) => set("hero_quote_ru", e.target.value || null)} maxLength={2000} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Цитата (RO)</label>
            <textarea className={cls} rows={3} value={form.hero_quote_ro ?? ""} onChange={(e) => set("hero_quote_ro", e.target.value || null)} maxLength={2000} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Автор цитаты (RU)</label>
            <input className={cls} value={form.hero_quote_author_ru ?? ""} onChange={(e) => set("hero_quote_author_ru", e.target.value || null)} maxLength={255} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Автор цитаты (RO)</label>
            <input className={cls} value={form.hero_quote_author_ro ?? ""} onChange={(e) => set("hero_quote_author_ro", e.target.value || null)} maxLength={255} />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Вступление</h2>
        <div>
          <label className="block text-sm font-serif mb-1">Вступительный текст (RU)</label>
          <textarea className={cls} rows={6} value={form.intro_ru ?? ""} onChange={(e) => set("intro_ru", e.target.value || null)} maxLength={10000} />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Вступительный текст (RO)</label>
          <textarea className={cls} rows={6} value={form.intro_ro ?? ""} onChange={(e) => set("intro_ro", e.target.value || null)} maxLength={10000} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Святыни</h2>
        <ShrinesManager destinationSlug={form.slug} />
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Программа по дням</h2>
        <ProgramDaysManager destinationSlug={form.slug} />
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Включено / Не включено</h2>
        <InclusionsManager destinationSlug={form.slug} />
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Часто задаваемые вопросы</h2>
        <FaqManager destinationSlug={form.slug} />
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Важное примечание</h2>
        <div>
          <label className="block text-sm font-serif mb-1">Текст примечания (RU)</label>
          <textarea className={cls} rows={3} value={form.notice_ru ?? ""} onChange={(e) => set("notice_ru", e.target.value || null)} maxLength={5000} placeholder="Например: О программе и порядке посещения святынь" />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Текст примечания (RO)</label>
          <textarea className={cls} rows={3} value={form.notice_ro ?? ""} onChange={(e) => set("notice_ro", e.target.value || null)} maxLength={5000} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Фотогалерея</h2>
        <GalleryManager destinationSlug={form.slug} />
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">SEO</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-serif mb-1">SEO заголовок (RU)</label>
            <input className={cls} value={form.seo_title_ru ?? ""} onChange={(e) => set("seo_title_ru", e.target.value || null)} maxLength={255} placeholder="До 60 символов" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">SEO заголовок (RO)</label>
            <input className={cls} value={form.seo_title_ro ?? ""} onChange={(e) => set("seo_title_ro", e.target.value || null)} maxLength={255} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">SEO описание (RU)</label>
            <textarea className={cls} rows={3} value={form.seo_description_ru ?? ""} onChange={(e) => set("seo_description_ru", e.target.value || null)} maxLength={500} placeholder="До 160 символов" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">SEO описание (RO)</label>
            <textarea className={cls} rows={3} value={form.seo_description_ro ?? ""} onChange={(e) => set("seo_description_ro", e.target.value || null)} maxLength={500} />
          </div>
        </div>
        <ImageUpload
          value={form.og_image}
          onChange={(url) => set("og_image", url)}
          folder={`destinations/${form.slug || "shared"}/og`}
          label="Картинка для соцсетей (OG image)"
        />
        <p className="text-xs text-muted-foreground">
          Если поля не заполнены — будут использованы основное название, краткое описание и главное фото.
        </p>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
          {busy ? "Сохраняем…" : "Сохранить"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/destinations" })} className="px-5 py-2 border border-border rounded-sm font-serif">
          Отмена
        </button>
      </div>
    </form>
  );
}
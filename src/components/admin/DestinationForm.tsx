import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { adminSaveDestination } from "@/lib/admin.functions";
import { ImageUpload } from "./ImageUpload";
import { GalleryManager } from "./GalleryManager";

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
        <h2 className="font-serif text-xl border-b border-border pb-2">Программа по дням</h2>
        <div>
          <label className="block text-sm font-serif mb-1">Программа (RU)</label>
          <textarea className={cls} rows={10} value={form.program_ru ?? ""} onChange={(e) => set("program_ru", e.target.value || null)} maxLength={50000} />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Программа (RO)</label>
          <textarea className={cls} rows={10} value={form.program_ro ?? ""} onChange={(e) => set("program_ro", e.target.value || null)} maxLength={50000} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-xl border-b border-border pb-2">Фотогалерея</h2>
        <GalleryManager destinationSlug={form.slug} />
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
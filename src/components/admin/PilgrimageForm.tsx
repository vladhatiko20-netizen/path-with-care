import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminSavePilgrimage, adminListDestinations } from "@/lib/admin.functions";
import { ImageUpload } from "./ImageUpload";

type Initial = {
  id?: string;
  slug: string;
  start_date: string;
  end_date: string;
  destination_ru: string;
  destination_ro: string;
  destination_slug: string | null;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  cover_image: string | null;
  price_eur: number | null;
  with_priest: boolean;
  is_published: boolean;
};

export function PilgrimageForm({ initial }: { initial: Initial }) {
  const save = useServerFn(adminSavePilgrimage);
  const listDest = useServerFn(adminListDestinations);
  const { data: destinations } = useQuery({
    queryKey: ["admin-destinations-list"],
    queryFn: () => listDest(),
  });
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
      await save({ data: { ...form, cover_image: form.cover_image || null, price_eur: form.price_eur ?? null, destination_slug: form.destination_slug || null } });
      navigate({ to: "/admin/pilgrimages" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-4xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-serif mb-1">Slug *</label>
          <input className={cls} value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} required pattern="[a-z0-9\-]+" maxLength={255} />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Цена, €</label>
          <input type="number" className={cls} value={form.price_eur ?? ""} onChange={(e) => set("price_eur", e.target.value ? Number(e.target.value) : null)} min={0} max={1000000} step="0.01" />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Дата начала *</label>
          <input type="date" className={cls} value={form.start_date} onChange={(e) => set("start_date", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Дата окончания *</label>
          <input type="date" className={cls} value={form.end_date} onChange={(e) => set("end_date", e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Направление (RU) *</label>
          <input className={cls} value={form.destination_ru} onChange={(e) => set("destination_ru", e.target.value)} required maxLength={500} />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Направление (RO) *</label>
          <input className={cls} value={form.destination_ro} onChange={(e) => set("destination_ro", e.target.value)} required maxLength={500} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-serif mb-1">Направление (каталог)</label>
          <select
            className={cls}
            value={form.destination_slug ?? ""}
            onChange={(e) => set("destination_slug", e.target.value || null)}
          >
            <option value="">— не выбрано —</option>
            {(destinations ?? []).map((d) => (
              <option key={d.slug} value={d.slug}>{d.title_ru}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">Связывает поездку с карточкой направления — клик по строке в календаре ведёт на /destinations/{`{slug}`}.</p>
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Название (RU) *</label>
          <input className={cls} value={form.title_ru} onChange={(e) => set("title_ru", e.target.value)} required maxLength={500} />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Название (RO) *</label>
          <input className={cls} value={form.title_ro} onChange={(e) => set("title_ro", e.target.value)} required maxLength={500} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-serif mb-1">Описание (RU)</label>
        <textarea className={cls} rows={4} value={form.description_ru ?? ""} onChange={(e) => set("description_ru", e.target.value || null)} maxLength={5000} />
      </div>
      <div>
        <label className="block text-sm font-serif mb-1">Описание (RO)</label>
        <textarea className={cls} rows={4} value={form.description_ro ?? ""} onChange={(e) => set("description_ro", e.target.value || null)} maxLength={5000} />
      </div>

      <ImageUpload
        value={form.cover_image}
        onChange={(url) => set("cover_image", url)}
        folder="pilgrimages"
        label="Обложка паломничества"
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.with_priest} onChange={(e) => set("with_priest", e.target.checked)} />
          Со священником
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
          Опубликовать
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
          {busy ? "Сохраняем…" : "Сохранить"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/pilgrimages" })} className="px-5 py-2 border border-border rounded-sm font-serif">
          Отмена
        </button>
      </div>
    </form>
  );
}

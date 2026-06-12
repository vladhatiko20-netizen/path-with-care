import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { adminSaveClergy } from "@/lib/admin.functions";
import { ImageUpload } from "./ImageUpload";

type Initial = {
  id?: string;
  name_ru: string;
  name_ro: string;
  title_ru: string | null;
  title_ro: string | null;
  bio_ru: string | null;
  bio_ro: string | null;
  photo_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export function ClergyForm({ initial }: { initial: Initial }) {
  const save = useServerFn(adminSaveClergy);
  const navigate = useNavigate();
  const [form, setForm] = useState<Initial>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"ru" | "ro">("ru");

  function set<K extends keyof Initial>(k: K, v: Initial[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await save({
        data: {
          ...form,
          title_ru: form.title_ru || null,
          title_ro: form.title_ro || null,
          bio_ru: form.bio_ru || null,
          bio_ro: form.bio_ro || null,
          photo_url: form.photo_url || null,
        },
      });
      navigate({ to: "/admin/clergy" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-3xl">
      <ImageUpload
        value={form.photo_url}
        onChange={(url) => set("photo_url", url)}
        folder="clergy"
        label="Фото"
      />

      <div className="flex gap-2 border-b border-border">
        {(["ru", "ro"] as const).map((l) => (
          <button type="button" key={l} onClick={() => setTab(l)}
            className={`px-4 py-2 font-serif text-sm border-b-2 -mb-px ${tab === l ? "border-accent text-accent" : "border-transparent text-muted-foreground"}`}>
            {l === "ru" ? "Русский" : "Română"}
          </button>
        ))}
      </div>

      {tab === "ru" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-1">Имя (RU) *</label>
            <input className={cls} value={form.name_ru} onChange={(e) => set("name_ru", e.target.value)} required maxLength={255} placeholder="Иеромонах Игнатий (Блинов)" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Сан / место служения (RU)</label>
            <input className={cls} value={form.title_ru ?? ""} onChange={(e) => set("title_ru", e.target.value)} maxLength={500} placeholder="храм свв. Константина и Елены, Кишинёв" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Биография (RU)</label>
            <textarea className={cls} rows={5} value={form.bio_ru ?? ""} onChange={(e) => set("bio_ru", e.target.value)} maxLength={5000} placeholder="2–4 предложения о священнике." />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-1">Имя (RO) *</label>
            <input className={cls} value={form.name_ro} onChange={(e) => set("name_ro", e.target.value)} required maxLength={255} placeholder="Părintele Ignatie (Blinov)" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Sanul / locul slujirii (RO)</label>
            <input className={cls} value={form.title_ro ?? ""} onChange={(e) => set("title_ro", e.target.value)} maxLength={500} placeholder="biserica Sf. Constantin și Elena, Chișinău" />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Biografie (RO)</label>
            <textarea className={cls} rows={5} value={form.bio_ro ?? ""} onChange={(e) => set("bio_ro", e.target.value)} maxLength={5000} placeholder="2–4 propoziții despre preot." />
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-serif mb-1">Порядок сортировки</label>
          <input type="number" min={0} max={100000} className={cls}
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value) || 0)} />
          <p className="text-xs text-muted-foreground mt-1">Чем меньше число, тем выше в списке.</p>
        </div>
        <label className="flex items-end gap-2 text-sm pb-2">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
          Опубликовать на сайте
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
          {busy ? "Сохраняем…" : "Сохранить"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/clergy" })} className="px-5 py-2 border border-border rounded-sm font-serif">
          Отмена
        </button>
      </div>
    </form>
  );
}
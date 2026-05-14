import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { adminSaveBlogPost } from "@/lib/admin.functions";
import { RichEditor } from "./RichEditor";

type Initial = {
  id?: string;
  slug: string;
  published_at: string;
  cover_image: string | null;
  title_ru: string;
  title_ro: string;
  excerpt_ru: string | null;
  excerpt_ro: string | null;
  body_ru: string | null;
  body_ro: string | null;
  is_published: boolean;
};

export function BlogPostForm({ initial }: { initial: Initial }) {
  const save = useServerFn(adminSaveBlogPost);
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
      await save({ data: { ...form, cover_image: form.cover_image || null } });
      navigate({ to: "/admin/blog" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-4xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-serif mb-1">Slug (URL) *</label>
          <input className={cls} value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} required pattern="[a-z0-9\-]+" maxLength={255} />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Дата публикации *</label>
          <input type="date" className={cls} value={form.published_at} onChange={(e) => set("published_at", e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-serif mb-1">Обложка (ключ изображения или URL)</label>
        <input className={cls} value={form.cover_image ?? ""} onChange={(e) => set("cover_image", e.target.value || null)}
          placeholder="например: about-pilgrimage или https://..." maxLength={500} />
        <p className="text-xs text-muted-foreground mt-1">Доступные ключи: about-pilgrimage, dest-athos, dest-jerusalem, dest-georgia, cat-nikolay, menu-calendar, hero-blog</p>
      </div>

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
            <label className="block text-sm font-serif mb-1">Заголовок (RU) *</label>
            <input className={cls} value={form.title_ru} onChange={(e) => set("title_ru", e.target.value)} required maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Краткое описание (RU)</label>
            <textarea className={cls} rows={2} value={form.excerpt_ru ?? ""} onChange={(e) => set("excerpt_ru", e.target.value || null)} maxLength={1000} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Текст (RU)</label>
            <RichEditor value={form.body_ru ?? ""} onChange={(html) => set("body_ru", html)} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-1">Заголовок (RO) *</label>
            <input className={cls} value={form.title_ro} onChange={(e) => set("title_ro", e.target.value)} required maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Краткое описание (RO)</label>
            <textarea className={cls} rows={2} value={form.excerpt_ro ?? ""} onChange={(e) => set("excerpt_ro", e.target.value || null)} maxLength={1000} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Текст (RO)</label>
            <RichEditor value={form.body_ro ?? ""} onChange={(html) => set("body_ro", html)} />
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
        Опубликовать
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
          {busy ? "Сохраняем…" : "Сохранить"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/blog" })} className="px-5 py-2 border border-border rounded-sm font-serif">
          Отмена
        </button>
      </div>
    </form>
  );
}

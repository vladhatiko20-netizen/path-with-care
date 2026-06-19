import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminSaveCatalogItem,
  adminGetCatalogPage,
} from "@/lib/admin.functions";
import { ImageUpload } from "./ImageUpload";

export type CatalogItemFormInitial = {
  id?: string;
  slug: string;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  category: string;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export function CatalogItemForm({ initial }: { initial: CatalogItemFormInitial }) {
  const save = useServerFn(adminSaveCatalogItem);
  const getPage = useServerFn(adminGetCatalogPage);
  const navigate = useNavigate();
  const [form, setForm] = useState<CatalogItemFormInitial>(initial);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"ru" | "ro">("ru");

  const { data: page } = useQuery({
    queryKey: ["admin-catalog-page"],
    queryFn: () => getPage(),
  });

  const categories: Array<{ key: string; label_ru: string; label_ro: string }> = Array.isArray(
    page?.categories,
  )
    ? (page!.categories as Array<{ key: string; label_ru: string; label_ro: string }>)
    : [];

  function set<K extends keyof CatalogItemFormInitial>(k: K, v: CatalogItemFormInitial[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const saved = await save({
        data: {
          ...(form.id ? { id: form.id } : {}),
          slug: form.slug.trim(),
          title_ru: form.title_ru.trim(),
          title_ro: form.title_ro.trim(),
          description_ru: form.description_ru?.trim() || null,
          description_ro: form.description_ro?.trim() || null,
          category: form.category.trim(),
          image_url: form.image_url || null,
          sort_order: form.sort_order,
          is_published: form.is_published,
        },
      });
      toast.success(form.id ? "Сохранено" : "Создано");
      if (!form.id && saved?.id) {
        navigate({ to: "/admin/catalog/$id", params: { id: saved.id } });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <ImageUpload
        value={form.image_url}
        onChange={(url) => set("image_url", url)}
        folder="catalog"
        label="Фото позиции"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-serif mb-1">Slug *</label>
          <input
            className={cls}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            pattern="[a-z0-9\-]+"
            required
            maxLength={100}
            placeholder="ikona-nikolay-bari"
          />
          <p className="text-xs text-muted-foreground mt-1">Только латиница, цифры и дефис. Уникален.</p>
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Категория *</label>
          <select
            className={cls}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
          >
            {categories.length === 0 && (
              <option value={form.category}>{form.category}</option>
            )}
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label_ru} / {c.label_ro} ({c.key})
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Категории редактируются в «Контент страницы».
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-serif mb-1">Порядок сортировки</label>
          <input
            type="number"
            className={cls}
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
            min={0}
            max={100000}
          />
          <p className="text-xs text-muted-foreground mt-1">Меньше число – выше в списке.</p>
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              className="w-4 h-4"
            />
            Опубликована
          </label>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border">
        {(["ru", "ro"] as const).map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => setTab(l)}
            className={`px-4 py-2 font-serif text-sm border-b-2 -mb-px ${tab === l ? "border-accent text-accent" : "border-transparent text-muted-foreground"}`}
          >
            {l === "ru" ? "Русский" : "Română"}
          </button>
        ))}
      </div>

      {tab === "ru" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-1">Название (RU) *</label>
            <input
              className={cls}
              value={form.title_ru}
              onChange={(e) => set("title_ru", e.target.value)}
              maxLength={300}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Описание (RU)</label>
            <textarea
              className={cls}
              rows={5}
              value={form.description_ru ?? ""}
              onChange={(e) => set("description_ru", e.target.value)}
              maxLength={3000}
              placeholder="Откуда привезено, размер, материал…"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Показывается в окне заявки. Без длинных тире – используйте дефис или среднее тире.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-1">Titlu (RO) *</label>
            <input
              className={cls}
              value={form.title_ro}
              onChange={(e) => set("title_ro", e.target.value)}
              maxLength={300}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Descriere (RO)</label>
            <textarea
              className={cls}
              rows={5}
              value={form.description_ro ?? ""}
              onChange={(e) => set("description_ro", e.target.value)}
              maxLength={3000}
            />
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50"
        >
          {busy ? "Сохраняем…" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { adminUpsertCatalogPage } from "@/lib/admin.functions";
import { ImageUpload } from "./ImageUpload";

type Category = { key: string; label_ru: string; label_ro: string; sort: number };

export type CatalogPageFormInitial = {
  hero_image_url: string | null;
  hero_overline_ru: string | null;
  hero_overline_ro: string | null;
  hero_title_ru: string | null;
  hero_title_ro: string | null;
  intro_ru: string | null;
  intro_ro: string | null;
  empty_state_ru: string | null;
  empty_state_ro: string | null;
  form_title_ru: string | null;
  form_title_ro: string | null;
  form_subtitle_ru: string | null;
  form_subtitle_ro: string | null;
  form_success_title_ru: string | null;
  form_success_title_ro: string | null;
  form_success_text_ru: string | null;
  form_success_text_ro: string | null;
  card_caption_ru: string | null;
  card_caption_ro: string | null;
  categories: Category[];
};

export function CatalogPageForm({ initial }: { initial: CatalogPageFormInitial }) {
  const save = useServerFn(adminUpsertCatalogPage);
  const [form, setForm] = useState<CatalogPageFormInitial>(initial);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"ru" | "ro">("ru");

  function set<K extends keyof CatalogPageFormInitial>(k: K, v: CatalogPageFormInitial[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function updateCategory(idx: number, patch: Partial<Category>) {
    setForm((f) => ({
      ...f,
      categories: f.categories.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));
  }

  function moveCategory(idx: number, dir: -1 | 1) {
    setForm((f) => {
      const arr = [...f.categories];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return f;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...f, categories: arr.map((c, i) => ({ ...c, sort: (i + 1) * 10 })) };
    });
  }

  function removeCategory(idx: number) {
    setForm((f) => ({ ...f, categories: f.categories.filter((_, i) => i !== idx) }));
  }

  function addCategory() {
    setForm((f) => ({
      ...f,
      categories: [
        ...f.categories,
        { key: "", label_ru: "", label_ro: "", sort: (f.categories.length + 1) * 10 },
      ],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    // Validate categories
    for (const c of form.categories) {
      if (!/^[a-z0-9-]+$/.test(c.key)) {
        toast.error(`Ключ категории «${c.key}» некорректен (только a-z, 0-9, -)`);
        return;
      }
      if (!c.label_ru.trim() || !c.label_ro.trim()) {
        toast.error("Заполните названия категорий на RU и RO");
        return;
      }
    }
    const keys = new Set<string>();
    for (const c of form.categories) {
      if (keys.has(c.key)) {
        toast.error(`Дубликат ключа категории: ${c.key}`);
        return;
      }
      keys.add(c.key);
    }

    setBusy(true);
    try {
      await save({
        data: {
          hero_image_url: form.hero_image_url || null,
          hero_overline_ru: form.hero_overline_ru || null,
          hero_overline_ro: form.hero_overline_ro || null,
          hero_title_ru: form.hero_title_ru || null,
          hero_title_ro: form.hero_title_ro || null,
          intro_ru: form.intro_ru || null,
          intro_ro: form.intro_ro || null,
          empty_state_ru: form.empty_state_ru || null,
          empty_state_ro: form.empty_state_ro || null,
          form_title_ru: form.form_title_ru || null,
          form_title_ro: form.form_title_ro || null,
          form_subtitle_ru: form.form_subtitle_ru || null,
          form_subtitle_ro: form.form_subtitle_ro || null,
          form_success_title_ru: form.form_success_title_ru || null,
          form_success_title_ro: form.form_success_title_ro || null,
          form_success_text_ru: form.form_success_text_ru || null,
          form_success_text_ro: form.form_success_text_ro || null,
          card_caption_ru: form.card_caption_ru || null,
          card_caption_ro: form.card_caption_ro || null,
          categories: form.categories.map((c, i) => ({
            key: c.key.trim(),
            label_ru: c.label_ru.trim(),
            label_ro: c.label_ro.trim(),
            sort: typeof c.sort === "number" ? c.sort : (i + 1) * 10,
          })),
        },
      });
      toast.success("Сохранено");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-3xl">
      <ImageUpload
        value={form.hero_image_url}
        onChange={(url) => set("hero_image_url", url)}
        folder="catalog"
        label="Фото-обложка (hero)"
      />

      <div>
        <h3 className="font-serif text-lg mb-3">Подпись под карточками</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-serif mb-1">RU</label>
            <input
              className={cls}
              value={form.card_caption_ru ?? ""}
              onChange={(e) => set("card_caption_ru", e.target.value)}
              maxLength={100}
              placeholder="привезём из поездки"
            />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">RO</label>
            <input
              className={cls}
              value={form.card_caption_ro ?? ""}
              onChange={(e) => set("card_caption_ro", e.target.value)}
              maxLength={100}
              placeholder="aducem din pelerinaj"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-lg mb-3">Категории-фильтры</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Ключ используется в позициях каталога. Изменение ключа не переименовывает категорию в существующих позициях – придётся обновить позиции вручную.
        </p>
        <div className="space-y-2">
          {form.categories.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-2 items-center">
              <input
                className={cls}
                placeholder="key"
                value={c.key}
                onChange={(e) => updateCategory(i, { key: e.target.value.toLowerCase() })}
                maxLength={50}
              />
              <input
                className={cls}
                placeholder="Название RU"
                value={c.label_ru}
                onChange={(e) => updateCategory(i, { label_ru: e.target.value })}
                maxLength={100}
              />
              <input
                className={cls}
                placeholder="Titlu RO"
                value={c.label_ro}
                onChange={(e) => updateCategory(i, { label_ro: e.target.value })}
                maxLength={100}
              />
              <button type="button" onClick={() => moveCategory(i, -1)} className="p-2 border border-border rounded-sm" aria-label="Выше">
                <ArrowUp className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => moveCategory(i, 1)} className="p-2 border border-border rounded-sm" aria-label="Ниже">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => removeCategory(i)} className="p-2 border border-border rounded-sm text-destructive" aria-label="Удалить">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCategory}
          className="mt-3 inline-flex items-center gap-2 px-3 py-2 border border-border rounded-sm text-sm font-serif"
        >
          <Plus className="w-4 h-4" /> Добавить категорию
        </button>
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
        <LangFields
          cls={cls}
          overline={form.hero_overline_ru ?? ""}
          setOverline={(v) => set("hero_overline_ru", v)}
          title={form.hero_title_ru ?? ""}
          setTitle={(v) => set("hero_title_ru", v)}
          intro={form.intro_ru ?? ""}
          setIntro={(v) => set("intro_ru", v)}
          emptyState={form.empty_state_ru ?? ""}
          setEmptyState={(v) => set("empty_state_ru", v)}
          formTitle={form.form_title_ru ?? ""}
          setFormTitle={(v) => set("form_title_ru", v)}
          formSubtitle={form.form_subtitle_ru ?? ""}
          setFormSubtitle={(v) => set("form_subtitle_ru", v)}
          successTitle={form.form_success_title_ru ?? ""}
          setSuccessTitle={(v) => set("form_success_title_ru", v)}
          successText={form.form_success_text_ru ?? ""}
          setSuccessText={(v) => set("form_success_text_ru", v)}
        />
      ) : (
        <LangFields
          cls={cls}
          overline={form.hero_overline_ro ?? ""}
          setOverline={(v) => set("hero_overline_ro", v)}
          title={form.hero_title_ro ?? ""}
          setTitle={(v) => set("hero_title_ro", v)}
          intro={form.intro_ro ?? ""}
          setIntro={(v) => set("intro_ro", v)}
          emptyState={form.empty_state_ro ?? ""}
          setEmptyState={(v) => set("empty_state_ro", v)}
          formTitle={form.form_title_ro ?? ""}
          setFormTitle={(v) => set("form_title_ro", v)}
          formSubtitle={form.form_subtitle_ro ?? ""}
          setFormSubtitle={(v) => set("form_subtitle_ro", v)}
          successTitle={form.form_success_title_ro ?? ""}
          setSuccessTitle={(v) => set("form_success_title_ro", v)}
          successText={form.form_success_text_ro ?? ""}
          setSuccessText={(v) => set("form_success_text_ro", v)}
        />
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

function LangFields(props: {
  cls: string;
  overline: string; setOverline: (v: string) => void;
  title: string; setTitle: (v: string) => void;
  intro: string; setIntro: (v: string) => void;
  emptyState: string; setEmptyState: (v: string) => void;
  formTitle: string; setFormTitle: (v: string) => void;
  formSubtitle: string; setFormSubtitle: (v: string) => void;
  successTitle: string; setSuccessTitle: (v: string) => void;
  successText: string; setSuccessText: (v: string) => void;
}) {
  const { cls } = props;
  return (
    <div className="space-y-4">
      <Field label="Hero-оверлайн (надпись над заголовком)" hint="Без слов «предзаказ». Например: «Святыни со святых мест».">
        <input className={cls} value={props.overline} onChange={(e) => props.setOverline(e.target.value)} maxLength={200} />
      </Field>
      <Field label="Hero-заголовок">
        <input className={cls} value={props.title} onChange={(e) => props.setTitle(e.target.value)} maxLength={300} />
      </Field>
      <Field label="Вступительный текст" hint="Абзац под героем. Без длинных тире.">
        <textarea className={cls} rows={5} value={props.intro} onChange={(e) => props.setIntro(e.target.value)} maxLength={5000} />
      </Field>
      <Field label="Текст «Не нашли что искали»" hint="Показывается под сеткой позиций.">
        <textarea className={cls} rows={3} value={props.emptyState} onChange={(e) => props.setEmptyState(e.target.value)} maxLength={1000} />
      </Field>
      <Field label="Заголовок формы заявки">
        <input className={cls} value={props.formTitle} onChange={(e) => props.setFormTitle(e.target.value)} maxLength={300} />
      </Field>
      <Field label="Подзаголовок формы (необязательно)">
        <textarea className={cls} rows={2} value={props.formSubtitle} onChange={(e) => props.setFormSubtitle(e.target.value)} maxLength={1000} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Success: заголовок">
          <input className={cls} value={props.successTitle} onChange={(e) => props.setSuccessTitle(e.target.value)} maxLength={300} />
        </Field>
        <Field label="Success: текст">
          <input className={cls} value={props.successText} onChange={(e) => props.setSuccessText(e.target.value)} maxLength={1000} />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-serif mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
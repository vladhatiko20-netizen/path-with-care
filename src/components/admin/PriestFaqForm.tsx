import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { adminSavePriestFaq } from "@/lib/admin.functions";

type Initial = {
  id?: string;
  question_ru: string;
  question_ro: string;
  answer_ru: string;
  answer_ro: string;
  author_name_ru: string | null;
  author_name_ro: string | null;
  author_title_ru: string | null;
  author_title_ro: string | null;
  sort_order: number;
  is_published: boolean;
};

export function PriestFaqForm({ initial }: { initial: Initial }) {
  const save = useServerFn(adminSavePriestFaq);
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
          author_name_ru: form.author_name_ru || null,
          author_name_ro: form.author_name_ro || null,
          author_title_ru: form.author_title_ru || null,
          author_title_ro: form.author_title_ro || null,
        },
      });
      navigate({ to: "/admin/priest-faq" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-3xl">
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
            <label className="block text-sm font-serif mb-1">Вопрос (RU) *</label>
            <textarea className={cls} rows={2} value={form.question_ru} onChange={(e) => set("question_ru", e.target.value)} required maxLength={2000} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Ответ (RU) *</label>
            <textarea className={cls} rows={8} value={form.answer_ru} onChange={(e) => set("answer_ru", e.target.value)} required maxLength={10000} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-serif mb-1">Имя автора (RU)</label>
              <input className={cls} value={form.author_name_ru ?? ""} onChange={(e) => set("author_name_ru", e.target.value)} maxLength={255} placeholder="Иеромонах Игнатий (Блинов)" />
            </div>
            <div>
              <label className="block text-sm font-serif mb-1">Сан / место (RU)</label>
              <input className={cls} value={form.author_title_ru ?? ""} onChange={(e) => set("author_title_ru", e.target.value)} maxLength={500} placeholder="храм свв. Константина и Елены, Кишинёв" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-1">Întrebare (RO)</label>
            <textarea className={cls} rows={2} value={form.question_ro} onChange={(e) => set("question_ro", e.target.value)} maxLength={2000} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Răspuns (RO)</label>
            <textarea className={cls} rows={8} value={form.answer_ro} onChange={(e) => set("answer_ro", e.target.value)} maxLength={10000} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-serif mb-1">Numele autorului (RO)</label>
              <input className={cls} value={form.author_name_ro ?? ""} onChange={(e) => set("author_name_ro", e.target.value)} maxLength={255} placeholder="Părintele Ignatie (Blinov)" />
            </div>
            <div>
              <label className="block text-sm font-serif mb-1">Sanul / locul (RO)</label>
              <input className={cls} value={form.author_title_ro ?? ""} onChange={(e) => set("author_title_ro", e.target.value)} maxLength={500} placeholder="biserica Sf. Constantin și Elena, Chișinău" />
            </div>
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
        <button type="button" onClick={() => navigate({ to: "/admin/priest-faq" })} className="px-5 py-2 border border-border rounded-sm font-serif">
          Отмена
        </button>
      </div>
    </form>
  );
}
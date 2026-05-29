import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListFaq,
  adminSaveFaq,
  adminDeleteFaq,
  adminReorderFaq,
} from "@/lib/admin.functions";

type Row = {
  id: string;
  destination_slug: string;
  question_ru: string;
  question_ro: string;
  answer_ru: string | null;
  answer_ro: string | null;
  sort_order: number;
};

export function FaqManager({ destinationSlug }: { destinationSlug: string }) {
  const listFn = useServerFn(adminListFaq);
  const saveFn = useServerFn(adminSaveFaq);
  const deleteFn = useServerFn(adminDeleteFaq);
  const reorderFn = useServerFn(adminReorderFaq);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function reload() {
    try {
      const data = await listFn({ data: { destination_slug: destinationSlug } });
      setRows(data as Row[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки FAQ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!destinationSlug) { setLoading(false); return; }
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationSlug]);

  if (!destinationSlug) return <p className="text-sm text-muted-foreground">Сначала сохраните направление.</p>;
  if (loading) return <p className="text-sm text-muted-foreground">Загрузка…</p>;

  async function handleAdd() {
    setAdding(true);
    try {
      await saveFn({
        data: {
          destination_slug: destinationSlug,
          question_ru: "Новый вопрос",
          question_ro: "Întrebare nouă",
          answer_ru: null, answer_ro: null,
        },
      });
      toast.success("Вопрос добавлен");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setAdding(false);
    }
  }

  async function handleSave(row: Row) {
    setBusyId(row.id);
    try {
      await saveFn({
        data: {
          id: row.id,
          destination_slug: row.destination_slug,
          question_ru: row.question_ru,
          question_ro: row.question_ro,
          answer_ru: row.answer_ru,
          answer_ro: row.answer_ro,
        },
      });
      toast.success("Сохранено");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить этот вопрос?")) return;
    setBusyId(id);
    try {
      await deleteFn({ data: { id } });
      toast.success("Удалено");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusyId(null);
    }
  }

  async function move(idx: number, dir: -1 | 1) {
    const next = [...rows];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setRows(next);
    try {
      await reorderFn({ data: { items: next.map((r, i) => ({ id: r.id, sort_order: i + 1 })) } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
      reload();
    }
  }

  function update(id: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <div className="space-y-4">
      <button type="button" onClick={handleAdd} disabled={adding} className="px-4 py-2 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50">
        {adding ? "Добавляем…" : "+ Добавить вопрос"}
      </button>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет вопросов.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, idx) => (
            <div key={row.id} className="border border-border rounded-sm p-3 space-y-2">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif mb-1">Вопрос (RU) *</label>
                  <input className={cls} value={row.question_ru} onChange={(e) => update(row.id, { question_ru: e.target.value })} maxLength={1000} />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Вопрос (RO) *</label>
                  <input className={cls} value={row.question_ro} onChange={(e) => update(row.id, { question_ro: e.target.value })} maxLength={1000} />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Ответ (RU)</label>
                  <textarea className={cls} rows={4} value={row.answer_ru ?? ""} onChange={(e) => update(row.id, { answer_ru: e.target.value || null })} maxLength={10000} />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Ответ (RO)</label>
                  <textarea className={cls} rows={4} value={row.answer_ro ?? ""} onChange={(e) => update(row.id, { answer_ro: e.target.value || null })} maxLength={10000} />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button type="button" disabled={busyId === row.id} onClick={() => handleSave(row)} className="px-3 py-1 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50">Сохранить</button>
                <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif disabled:opacity-30">↑</button>
                <button type="button" disabled={idx === rows.length - 1} onClick={() => move(idx, 1)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif disabled:opacity-30">↓</button>
                <button type="button" disabled={busyId === row.id} onClick={() => handleDelete(row.id)} className="px-3 py-1 border border-destructive text-destructive rounded-sm text-sm font-serif disabled:opacity-50 ml-auto">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListProgramDays,
  adminSaveProgramDay,
  adminDeleteProgramDay,
  adminReorderProgramDays,
} from "@/lib/admin.functions";

type Row = {
  id: string;
  destination_slug: string;
  day_label_ru: string | null;
  day_label_ro: string | null;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  sort_order: number;
};

export function ProgramDaysManager({ destinationSlug }: { destinationSlug: string }) {
  const listFn = useServerFn(adminListProgramDays);
  const saveFn = useServerFn(adminSaveProgramDay);
  const deleteFn = useServerFn(adminDeleteProgramDay);
  const reorderFn = useServerFn(adminReorderProgramDays);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function reload() {
    try {
      const data = await listFn({ data: { destination_slug: destinationSlug } });
      setRows(data as Row[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки программы");
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
      const n = rows.length + 1;
      await saveFn({
        data: {
          destination_slug: destinationSlug,
          day_label_ru: `День ${n}`,
          day_label_ro: `Ziua ${n}`,
          title_ru: "Новый день",
          title_ro: "Zi nouă",
          description_ru: null, description_ro: null,
        },
      });
      toast.success("День добавлен");
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
          day_label_ru: row.day_label_ru,
          day_label_ro: row.day_label_ro,
          title_ru: row.title_ru,
          title_ro: row.title_ro,
          description_ru: row.description_ru,
          description_ro: row.description_ro,
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
    if (!confirm("Удалить этот день программы?")) return;
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
    <div className="space-y-6">
      <button type="button" onClick={handleAdd} disabled={adding} className="px-4 py-2 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50">
        {adding ? "Добавляем…" : "+ Добавить день"}
      </button>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет дней в программе.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, idx) => (
            <div key={row.id} className="border border-border rounded-sm p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif mb-1">Метка дня (RU)</label>
                  <input className={cls} value={row.day_label_ru ?? ""} onChange={(e) => update(row.id, { day_label_ru: e.target.value || null })} maxLength={100} placeholder="День 1 / Дни 1–2" />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Метка дня (RO)</label>
                  <input className={cls} value={row.day_label_ro ?? ""} onChange={(e) => update(row.id, { day_label_ro: e.target.value || null })} maxLength={100} />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Заголовок (RU) *</label>
                  <input className={cls} value={row.title_ru} onChange={(e) => update(row.id, { title_ru: e.target.value })} maxLength={500} />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Заголовок (RO) *</label>
                  <input className={cls} value={row.title_ro} onChange={(e) => update(row.id, { title_ro: e.target.value })} maxLength={500} />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Описание (RU)</label>
                  <textarea className={cls} rows={4} value={row.description_ru ?? ""} onChange={(e) => update(row.id, { description_ru: e.target.value || null })} maxLength={20000} />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Описание (RO)</label>
                  <textarea className={cls} rows={4} value={row.description_ro ?? ""} onChange={(e) => update(row.id, { description_ro: e.target.value || null })} maxLength={20000} />
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
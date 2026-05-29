import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListShrines,
  adminSaveShrine,
  adminDeleteShrine,
  adminReorderShrines,
} from "@/lib/admin.functions";
import { ImageUpload } from "./ImageUpload";

type Row = {
  id: string;
  destination_slug: string;
  image_url: string | null;
  title_ru: string;
  title_ro: string;
  short_ru: string | null;
  short_ro: string | null;
  full_ru: string | null;
  full_ro: string | null;
  sort_order: number;
};

export function ShrinesManager({ destinationSlug }: { destinationSlug: string }) {
  const listFn = useServerFn(adminListShrines);
  const saveFn = useServerFn(adminSaveShrine);
  const deleteFn = useServerFn(adminDeleteShrine);
  const reorderFn = useServerFn(adminReorderShrines);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function reload() {
    try {
      const data = await listFn({ data: { destination_slug: destinationSlug } });
      setRows(data as Row[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки святынь");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!destinationSlug) { setLoading(false); return; }
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationSlug]);

  if (!destinationSlug) {
    return <p className="text-sm text-muted-foreground">Сначала сохраните направление.</p>;
  }
  if (loading) return <p className="text-sm text-muted-foreground">Загрузка…</p>;

  async function handleAdd() {
    setAdding(true);
    try {
      await saveFn({
        data: {
          destination_slug: destinationSlug,
          image_url: null,
          title_ru: "Новая святыня",
          title_ro: "Sfinție nouă",
          short_ru: null, short_ro: null,
          full_ru: null, full_ro: null,
        },
      });
      toast.success("Святыня добавлена");
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
          image_url: row.image_url,
          title_ru: row.title_ru,
          title_ro: row.title_ro,
          short_ru: row.short_ru,
          short_ro: row.short_ro,
          full_ru: row.full_ru,
          full_ro: row.full_ro,
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
    if (!confirm("Удалить эту святыню?")) return;
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
      <button
        type="button"
        onClick={handleAdd}
        disabled={adding}
        className="px-4 py-2 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50"
      >
        {adding ? "Добавляем…" : "+ Добавить святыню"}
      </button>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет святынь.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, idx) => (
            <div key={row.id} className="border border-border rounded-sm p-4 space-y-4">
              <ImageUpload
                value={row.image_url}
                onChange={(url) => update(row.id, { image_url: url })}
                folder={`destinations/${destinationSlug}/shrines`}
                label="Фото"
              />
              <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif mb-1">Название (RU) *</label>
                    <input className={cls} value={row.title_ru} onChange={(e) => update(row.id, { title_ru: e.target.value })} maxLength={500} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Название (RO) *</label>
                    <input className={cls} value={row.title_ro} onChange={(e) => update(row.id, { title_ro: e.target.value })} maxLength={500} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Краткое описание (RU)</label>
                    <textarea className={cls} rows={2} value={row.short_ru ?? ""} onChange={(e) => update(row.id, { short_ru: e.target.value || null })} maxLength={2000} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Краткое описание (RO)</label>
                    <textarea className={cls} rows={2} value={row.short_ro ?? ""} onChange={(e) => update(row.id, { short_ro: e.target.value || null })} maxLength={2000} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Полный текст (RU)</label>
                    <textarea className={cls} rows={5} value={row.full_ru ?? ""} onChange={(e) => update(row.id, { full_ru: e.target.value || null })} maxLength={20000} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Полный текст (RO)</label>
                    <textarea className={cls} rows={5} value={row.full_ro ?? ""} onChange={(e) => update(row.id, { full_ro: e.target.value || null })} maxLength={20000} />
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
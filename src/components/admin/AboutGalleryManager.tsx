import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListAboutGallery,
  adminSaveAboutGalleryItem,
  adminDeleteAboutGalleryItem,
  adminReorderAboutGallery,
} from "@/lib/about.functions";
import { ImageUpload } from "./ImageUpload";

type Row = {
  id: string;
  image_url: string;
  caption_ru: string | null;
  caption_ro: string | null;
  sort_order: number;
};

export function AboutGalleryManager() {
  const listFn = useServerFn(adminListAboutGallery);
  const saveFn = useServerFn(adminSaveAboutGalleryItem);
  const deleteFn = useServerFn(adminDeleteAboutGalleryItem);
  const reorderFn = useServerFn(adminReorderAboutGallery);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reload() {
    try {
      const data = await listFn();
      setRows(data as Row[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Загрузка…</p>;

  async function handleNewUpload(url: string | null) {
    if (!url) return;
    try {
      await saveFn({ data: { image_url: url, caption_ru: null, caption_ro: null } });
      toast.success("Фото добавлено");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  }

  async function handleSaveRow(row: Row) {
    setBusyId(row.id);
    try {
      await saveFn({
        data: {
          id: row.id,
          image_url: row.image_url,
          caption_ru: row.caption_ru ?? null,
          caption_ro: row.caption_ro ?? null,
          sort_order: row.sort_order,
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
    if (!confirm("Удалить это фото?")) return;
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
      <ImageUpload value={null} onChange={handleNewUpload} folder="about-gallery" label="Добавить фото в галерею" />

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет фото.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, idx) => (
            <div key={row.id} className="border border-border rounded-sm p-4 flex gap-4">
              <img src={row.image_url} alt="" className="w-32 h-32 object-cover rounded-sm border border-border flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif mb-1">Подпись (RU)</label>
                    <input className={cls} value={row.caption_ru ?? ""} onChange={(e) => update(row.id, { caption_ru: e.target.value })} maxLength={500} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Подпись (RO)</label>
                    <input className={cls} value={row.caption_ro ?? ""} onChange={(e) => update(row.id, { caption_ro: e.target.value })} maxLength={500} />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button type="button" disabled={busyId === row.id} onClick={() => handleSaveRow(row)} className="px-3 py-1 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50">Сохранить</button>
                  <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif disabled:opacity-30">↑</button>
                  <button type="button" disabled={idx === rows.length - 1} onClick={() => move(idx, 1)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif disabled:opacity-30">↓</button>
                  <button type="button" disabled={busyId === row.id} onClick={() => handleDelete(row.id)} className="px-3 py-1 border border-destructive text-destructive rounded-sm text-sm font-serif disabled:opacity-50 ml-auto">Удалить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
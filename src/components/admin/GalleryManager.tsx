import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListGallery,
  adminSaveGalleryImage,
  adminDeleteGalleryImage,
  adminReorderGallery,
} from "@/lib/admin.functions";
import { ImageUpload } from "./ImageUpload";

type GalleryRow = {
  id: string;
  destination_slug: string;
  image_url: string;
  alt_ru: string | null;
  alt_ro: string | null;
  author: string | null;
  license: string | null;
  source_url: string | null;
  sort_order: number;
};

export function GalleryManager({ destinationSlug }: { destinationSlug: string }) {
  const listFn = useServerFn(adminListGallery);
  const saveFn = useServerFn(adminSaveGalleryImage);
  const deleteFn = useServerFn(adminDeleteGalleryImage);
  const reorderFn = useServerFn(adminReorderGallery);

  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reload() {
    try {
      const data = await listFn({ data: { destination_slug: destinationSlug } });
      setRows(data as GalleryRow[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки галереи");
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
    return (
      <p className="text-sm text-muted-foreground">
        Сначала сохраните направление, чтобы добавлять фото в галерею.
      </p>
    );
  }

  if (loading) return <p className="text-sm text-muted-foreground">Загрузка…</p>;

  async function handleNewUpload(url: string | null) {
    if (!url) return;
    try {
      await saveFn({
        data: {
          destination_slug: destinationSlug,
          image_url: url,
          alt_ru: null, alt_ro: null,
          author: null, license: null, source_url: null,
        },
      });
      toast.success("Фото добавлено");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  }

  async function handleSaveRow(row: GalleryRow) {
    setBusyId(row.id);
    try {
      await saveFn({
        data: {
          id: row.id,
          destination_slug: row.destination_slug,
          image_url: row.image_url,
          alt_ru: row.alt_ru ?? null,
          alt_ro: row.alt_ro ?? null,
          author: row.author ?? null,
          license: row.license ?? null,
          source_url: row.source_url ?? null,
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
    if (!confirm("Удалить это фото из галереи?")) return;
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
      await reorderFn({
        data: { items: next.map((r, i) => ({ id: r.id, sort_order: i + 1 })) },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
      reload();
    }
  }

  function update(id: string, patch: Partial<GalleryRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <div className="space-y-6">
      <ImageUpload
        value={null}
        onChange={handleNewUpload}
        folder={`destinations-gallery/${destinationSlug}`}
        label="Добавить фото в галерею"
      />

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет фото в галерее.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, idx) => (
            <div key={row.id} className="border border-border rounded-sm p-4">
              <div className="grid gap-4 md:grid-cols-[8rem_minmax(0,1fr)]">
                <img src={row.image_url} alt="" className="w-32 h-32 object-cover rounded-sm border border-border flex-shrink-0" />
                <div className="min-w-0 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif mb-1">Подпись (RU)</label>
                    <input className={cls} value={row.alt_ru ?? ""} onChange={(e) => update(row.id, { alt_ru: e.target.value })} maxLength={500} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Подпись (RO)</label>
                    <input className={cls} value={row.alt_ro ?? ""} onChange={(e) => update(row.id, { alt_ro: e.target.value })} maxLength={500} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Автор (если требуется)</label>
                    <input className={cls} value={row.author ?? ""} onChange={(e) => update(row.id, { author: e.target.value })} maxLength={200} />
                  </div>
                  <div>
                    <label className="block text-xs font-serif mb-1">Лицензия</label>
                    <input className={cls} value={row.license ?? ""} onChange={(e) => update(row.id, { license: e.target.value })} maxLength={200} placeholder="CC BY-SA 4.0" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-serif mb-1">Ссылка на источник</label>
                    <input className={cls} value={row.source_url ?? ""} onChange={(e) => update(row.id, { source_url: e.target.value })} maxLength={1000} />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button type="button" disabled={busyId === row.id} onClick={() => handleSaveRow(row)} className="px-3 py-1 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50">
                    Сохранить
                  </button>
                  <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif disabled:opacity-30">
                    ↑
                  </button>
                  <button type="button" disabled={idx === rows.length - 1} onClick={() => move(idx, 1)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif disabled:opacity-30">
                    ↓
                  </button>
                  <button type="button" disabled={busyId === row.id} onClick={() => handleDelete(row.id)} className="px-3 py-1 border border-destructive text-destructive rounded-sm text-sm font-serif disabled:opacity-50 ml-auto">
                    Удалить
                  </button>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Поля «Автор» и «Лицензия» заполняйте только для фото из внешних источников.
        Для собственных фото оставляйте их пустыми – подпись о лицензии под галереей
        тогда не показывается.
      </p>
    </div>
  );
}
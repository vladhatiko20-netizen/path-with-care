import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListAboutTeam,
  adminSaveAboutTeam,
  adminDeleteAboutTeam,
} from "@/lib/about.functions";
import { ImageUpload } from "./ImageUpload";

type Row = {
  id: string;
  name_ru: string;
  name_ro: string;
  role_ru: string | null;
  role_ro: string | null;
  photo_url: string | null;
  sort_order: number;
  is_published: boolean;
};

type Draft = Omit<Row, "id"> & { id?: string };

export function AboutTeamManager() {
  const listFn = useServerFn(adminListAboutTeam);
  const saveFn = useServerFn(adminSaveAboutTeam);
  const deleteFn = useServerFn(adminDeleteAboutTeam);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

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

  function update(id: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function handleSaveRow(row: Row) {
    setBusyId(row.id);
    try {
      await saveFn({
        data: {
          id: row.id,
          name_ru: row.name_ru,
          name_ro: row.name_ro,
          role_ru: row.role_ru ?? null,
          role_ro: row.role_ro ?? null,
          photo_url: row.photo_url ?? null,
          sort_order: row.sort_order,
          is_published: row.is_published,
        },
      });
      toast.success("Сохранено");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Удалить «${name}»?`)) return;
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

  async function handleSaveDraft() {
    if (!draft) return;
    if (!draft.name_ru.trim() || !draft.name_ro.trim()) {
      toast.error("Имя (RU и RO) обязательны");
      return;
    }
    try {
      await saveFn({
        data: {
          name_ru: draft.name_ru,
          name_ro: draft.name_ro,
          role_ru: draft.role_ru || null,
          role_ro: draft.role_ro || null,
          photo_url: draft.photo_url || null,
          sort_order: draft.sort_order,
          is_published: draft.is_published,
        },
      });
      toast.success("Добавлено");
      setDraft(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  function renderEditor(
    val: { name_ru: string; name_ro: string; role_ru: string | null; role_ro: string | null; photo_url: string | null; sort_order: number; is_published: boolean },
    onPhoto: (url: string | null) => void,
    onField: <K extends keyof typeof val>(k: K, v: (typeof val)[K]) => void,
    actions: React.ReactNode,
  ) {
    return (
      <div className="border border-border rounded-sm p-4 space-y-3">
        <div className="grid gap-4 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
          <div className="min-w-0">
            <ImageUpload value={val.photo_url} onChange={onPhoto} folder="about-team" label="Фото" />
          </div>
          <div className="min-w-0 grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-serif mb-1">Имя (RU) *</label>
              <input className={cls} value={val.name_ru} onChange={(e) => onField("name_ru", e.target.value)} maxLength={255} />
            </div>
            <div>
              <label className="block text-xs font-serif mb-1">Имя (RO) *</label>
              <input className={cls} value={val.name_ro} onChange={(e) => onField("name_ro", e.target.value)} maxLength={255} />
            </div>
            <div>
              <label className="block text-xs font-serif mb-1">Роль (RU)</label>
              <input className={cls} value={val.role_ru ?? ""} onChange={(e) => onField("role_ru", e.target.value)} maxLength={500} />
            </div>
            <div>
              <label className="block text-xs font-serif mb-1">Роль (RO)</label>
              <input className={cls} value={val.role_ro ?? ""} onChange={(e) => onField("role_ro", e.target.value)} maxLength={500} />
            </div>
            <div>
              <label className="block text-xs font-serif mb-1">Порядок</label>
              <input type="number" min={0} className={cls} value={val.sort_order}
                onChange={(e) => onField("sort_order", Number(e.target.value) || 0)} />
            </div>
            <label className="flex items-center gap-2 text-sm mt-6">
              <input type="checkbox" checked={val.is_published} onChange={(e) => onField("is_published", e.target.checked)} />
              Опубликовать
            </label>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">{actions}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.length === 0 && !draft && (
        <p className="text-sm text-muted-foreground">Пока нет участников.</p>
      )}

      {rows.map((row) => renderEditor(
        row,
        (url) => update(row.id, { photo_url: url }),
        (k, v) => update(row.id, { [k]: v } as Partial<Row>),
        <>
          <button type="button" disabled={busyId === row.id} onClick={() => handleSaveRow(row)} className="px-3 py-1 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50">Сохранить</button>
          <button type="button" disabled={busyId === row.id} onClick={() => handleDelete(row.id, row.name_ru)} className="px-3 py-1 border border-destructive text-destructive rounded-sm text-sm font-serif disabled:opacity-50 ml-auto">Удалить</button>
        </>,
      ))}

      {draft && renderEditor(
        draft,
        (url) => setDraft({ ...draft, photo_url: url }),
        (k, v) => setDraft({ ...draft, [k]: v }),
        <>
          <button type="button" onClick={handleSaveDraft} className="px-3 py-1 bg-accent text-primary-foreground rounded-sm text-sm font-serif">Добавить</button>
          <button type="button" onClick={() => setDraft(null)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif">Отмена</button>
        </>,
      )}

      {!draft && (
        <button
          type="button"
          onClick={() => setDraft({
            name_ru: "", name_ro: "", role_ru: "", role_ro: "",
            photo_url: null, sort_order: (rows.at(-1)?.sort_order ?? 0) + 1, is_published: true,
          })}
          className="px-4 py-2 border border-border rounded-sm font-serif text-sm"
        >
          + Добавить участника
        </button>
      )}
    </div>
  );
}
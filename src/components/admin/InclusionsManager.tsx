import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListInclusions,
  adminSaveInclusion,
  adminDeleteInclusion,
  adminReorderInclusions,
} from "@/lib/admin.functions";

type Kind = "included" | "excluded";
type Row = {
  id: string;
  destination_slug: string;
  kind: Kind;
  text_ru: string;
  text_ro: string;
  sort_order: number;
};

export function InclusionsManager({ destinationSlug }: { destinationSlug: string }) {
  const listFn = useServerFn(adminListInclusions);
  const saveFn = useServerFn(adminSaveInclusion);
  const deleteFn = useServerFn(adminDeleteInclusion);
  const reorderFn = useServerFn(adminReorderInclusions);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<Kind>("included");

  async function reload() {
    try {
      const data = await listFn({ data: { destination_slug: destinationSlug } });
      setRows(data as Row[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!destinationSlug) { setLoading(false); return; }
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationSlug]);

  const visible = useMemo(() => rows.filter((r) => r.kind === tab), [rows, tab]);

  if (!destinationSlug) return <p className="text-sm text-muted-foreground">Сначала сохраните направление.</p>;
  if (loading) return <p className="text-sm text-muted-foreground">Загрузка…</p>;

  async function handleAdd() {
    try {
      await saveFn({
        data: {
          destination_slug: destinationSlug,
          kind: tab,
          text_ru: tab === "included" ? "Новый пункт" : "Новое исключение",
          text_ro: tab === "included" ? "Element nou" : "Excludere nouă",
        },
      });
      toast.success("Добавлено");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
    }
  }

  async function handleSave(row: Row) {
    setBusyId(row.id);
    try {
      await saveFn({
        data: {
          id: row.id,
          destination_slug: row.destination_slug,
          kind: row.kind,
          text_ru: row.text_ru,
          text_ro: row.text_ro,
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
    if (!confirm("Удалить этот пункт?")) return;
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
    const list = [...visible];
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    [list[idx], list[j]] = [list[j], list[idx]];
    // Merge back into rows (keep other kind untouched)
    const others = rows.filter((r) => r.kind !== tab);
    const merged = [...others, ...list];
    setRows(merged);
    try {
      await reorderFn({ data: { items: list.map((r, i) => ({ id: r.id, sort_order: i + 1 })) } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка");
      reload();
    }
  }

  function update(id: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";
  const tabCls = (active: boolean) =>
    `px-4 py-2 text-sm font-serif border-b-2 ${active ? "border-accent text-foreground" : "border-transparent text-muted-foreground"}`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-border">
        <button type="button" onClick={() => setTab("included")} className={tabCls(tab === "included")}>Включено</button>
        <button type="button" onClick={() => setTab("excluded")} className={tabCls(tab === "excluded")}>Не включено</button>
      </div>

      <button type="button" onClick={handleAdd} className="px-4 py-2 bg-accent text-primary-foreground rounded-sm text-sm font-serif">
        + Добавить пункт
      </button>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока нет пунктов.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((row, idx) => (
            <div key={row.id} className="border border-border rounded-sm p-3 space-y-2">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif mb-1">Текст (RU) *</label>
                  <input className={cls} value={row.text_ru} onChange={(e) => update(row.id, { text_ru: e.target.value })} maxLength={1000} />
                </div>
                <div>
                  <label className="block text-xs font-serif mb-1">Текст (RO) *</label>
                  <input className={cls} value={row.text_ro} onChange={(e) => update(row.id, { text_ro: e.target.value })} maxLength={1000} />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button type="button" disabled={busyId === row.id} onClick={() => handleSave(row)} className="px-3 py-1 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50">Сохранить</button>
                <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif disabled:opacity-30">↑</button>
                <button type="button" disabled={idx === visible.length - 1} onClick={() => move(idx, 1)} className="px-3 py-1 border border-border rounded-sm text-sm font-serif disabled:opacity-30">↓</button>
                <button type="button" disabled={busyId === row.id} onClick={() => handleDelete(row.id)} className="px-3 py-1 border border-destructive text-destructive rounded-sm text-sm font-serif disabled:opacity-50 ml-auto">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminListPilgrimages,
  adminDeletePilgrimage,
  adminSetPilgrimagePublished,
} from "@/lib/admin.functions";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin/admin/pilgrimages/")({
  component: Page,
});

function Page() {
  const list = useServerFn(adminListPilgrimages);
  const del = useServerFn(adminDeletePilgrimage);
  const setPublished = useServerFn(adminSetPilgrimagePublished);
  const router = useRouter();
  const queryClient = useQueryClient();
  const queryKey = ["admin-pilgrimages"] as const;
  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => list(),
  });

  const todayIso = new Date().toISOString().slice(0, 10);
  function timeStatus(start: string, end: string) {
    if (end < todayIso) return { label: "Завершена", cls: "bg-muted text-muted-foreground border-border" };
    if (start <= todayIso && todayIso <= end) return { label: "Проходит сейчас", cls: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "Запланирована", cls: "bg-green-100 text-green-800 border-green-200" };
  }

  type Row = NonNullable<typeof data>[number];
  const toggle = useMutation({
    mutationFn: (vars: { id: string; is_published: boolean }) =>
      setPublished({ data: vars }),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<Row[]>(queryKey);
      if (prev) {
        queryClient.setQueryData<Row[]>(
          queryKey,
          prev.map((r) => (r.id === vars.id ? { ...r, is_published: vars.is_published } : r)),
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);
      toast.error("Не удалось изменить видимость");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить поездку "${title}"?`)) return;
    await del({ data: { id } });
    await refetch();
    router.invalidate();
  }

  return (
    <div className="p-8 max-w-6xl">
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(0.85); }
        }
        .pulse-dot { animation: pulse-dot 1s ease-in-out infinite; }
      `}</style>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Календарь поездок</h1>
        <Link to="/admin/pilgrimages/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm font-serif text-sm">
          <Plus className="w-4 h-4" /> Новая поездка
        </Link>
      </div>

      {isLoading ? <p className="text-muted-foreground">Загрузка…</p> : (
        <div className="border border-border rounded-sm bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-serif">Даты</th>
                <th className="px-4 py-3 font-serif">Направление</th>
                <th className="px-4 py-3 font-serif">Цена</th>
                <th className="px-4 py-3 font-serif">Со священником</th>
                <th className="px-4 py-3 font-serif">Статус</th>
                <th className="px-4 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Пока нет поездок.</td></tr>
              )}
              {(data ?? []).map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 whitespace-nowrap">{p.start_date} → {p.end_date}</td>
                  <td className="px-4 py-3">{p.destination_ru}</td>
                  <td className="px-4 py-3">{p.price_eur ? `€${p.price_eur}` : "–"}</td>
                  <td className="px-4 py-3">{p.with_priest ? "Да" : "Нет"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {(() => {
                        const s = timeStatus(p.start_date, p.end_date);
                        return (
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-sm text-xs border", s.cls)}>
                            {s.label}
                          </span>
                        );
                      })()}
                    {p.destination_published === false ? (
                      <span
                        role="status"
                        aria-disabled="true"
                        title="Направление скрыто. Опубликуйте направление, чтобы эта дата появилась на сайте"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-sm text-xs min-h-[44px] cursor-not-allowed border bg-muted text-muted-foreground border-border"
                      >
                        <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-muted-foreground/60" />
                        <span>Скрыто (направление)</span>
                      </span>
                    ) : (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={p.is_published}
                      aria-label={p.is_published ? "Скрыть поездку" : "Опубликовать поездку"}
                      title={p.is_published ? "Нажмите, чтобы скрыть" : "Нажмите, чтобы опубликовать"}
                      onClick={() =>
                        toggle.mutate({ id: p.id, is_published: !p.is_published })
                      }
                      disabled={toggle.isPending && toggle.variables?.id === p.id}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-2 rounded-sm text-xs min-h-[44px] cursor-pointer border transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                        p.is_published
                          ? "bg-green-100 text-green-800 border-green-200 [@media(hover:hover)]:hover:bg-green-200"
                          : "bg-muted text-muted-foreground border-border [@media(hover:hover)]:hover:bg-muted/70",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "w-2.5 h-2.5 rounded-full pulse-dot",
                          p.is_published ? "bg-green-500" : "bg-rose-500",
                        )}
                      />
                      <span>{p.is_published ? "Активна" : "Скрыта"}</span>
                    </button>
                    )}
                    </div>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to="/admin/pilgrimages/$id" params={{ id: p.id }} className="p-1.5 hover:bg-secondary rounded-sm">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.title_ru)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

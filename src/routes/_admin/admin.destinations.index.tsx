import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminListDestinations,
  adminDeleteDestination,
  adminSetDestinationPublished,
} from "@/lib/admin.functions";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_admin/admin/destinations/")({
  component: Page,
});

function Page() {
  const list = useServerFn(adminListDestinations);
  const del = useServerFn(adminDeleteDestination);
  const setPublished = useServerFn(adminSetDestinationPublished);
  const router = useRouter();
  const queryClient = useQueryClient();
  const queryKey = ["admin-destinations"] as const;
  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => list(),
  });

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
    if (!confirm(`Удалить направление "${title}"?`)) return;
    await del({ data: { id } });
    await refetch();
    router.invalidate();
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex flex-col items-center gap-3 mb-6 md:flex-row md:justify-between">
        <h1 className="font-serif text-3xl text-center md:text-left">Направления</h1>
        <div className="flex flex-wrap justify-center gap-2">
          <Link to="/admin/destinations/import" className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-sm font-serif text-sm">
            <Upload className="w-4 h-4" /> Импорт из JSON
          </Link>
          <Link to="/admin/destinations/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm font-serif text-sm">
            <Plus className="w-4 h-4" /> Новое направление
          </Link>
        </div>
      </div>

      {isLoading ? <p className="text-muted-foreground">Загрузка…</p> : (
        <div className="border border-border rounded-sm bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-serif">Название (RU)</th>
                <th className="px-4 py-3 font-serif">Slug</th>
                <th className="px-4 py-3 font-serif">Цена от</th>
                <th className="px-4 py-3 font-serif">Статус</th>
                <th className="px-4 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Пока нет направлений.</td></tr>
              )}
              {(data ?? []).map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-4 py-3">{d.title_ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.slug}</td>
                  <td className="px-4 py-3">{d.price_from ? `€${d.price_from}` : "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={d.is_published}
                      aria-label={d.is_published ? "Скрыть направление" : "Опубликовать направление"}
                      onClick={() =>
                        toggle.mutate({ id: d.id, is_published: !d.is_published })
                      }
                      disabled={toggle.isPending && toggle.variables?.id === d.id}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-2 rounded-sm text-xs min-h-[44px] transition-colors disabled:opacity-60",
                        d.is_published
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-muted text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          d.is_published ? "bg-green-600" : "bg-muted-foreground/60",
                        )}
                      />
                      {d.is_published ? "Опубликовано" : "Скрыто"}
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to="/admin/destinations/$id" params={{ id: d.id }} className="p-1.5 hover:bg-secondary rounded-sm">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(d.id, d.title_ru)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-sm">
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
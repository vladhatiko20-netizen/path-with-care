import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListClergy, adminDeleteClergy } from "@/lib/admin.functions";
import { Plus, Pencil, Trash2, User } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/clergy/")({
  component: Page,
});

function Page() {
  const list = useServerFn(adminListClergy);
  const del = useServerFn(adminDeleteClergy);
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-clergy"],
    queryFn: () => list(),
  });

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Удалить запись "${name}"?`)) return;
    await del({ data: { id } });
    await refetch();
    router.invalidate();
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Священники</h1>
        <Link to="/admin/clergy/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm font-serif text-sm">
          <Plus className="w-4 h-4" /> Новая запись
        </Link>
      </div>

      {isLoading ? <p className="text-muted-foreground">Загрузка…</p> : (
        <div className="border border-border rounded-sm bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 w-16"></th>
                <th className="px-4 py-3 font-serif">Имя (RU)</th>
                <th className="px-4 py-3 font-serif">Сан / место</th>
                <th className="px-4 py-3 font-serif w-24">Порядок</th>
                <th className="px-4 py-3 font-serif w-32">Статус</th>
                <th className="px-4 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Пока нет записей.</td></tr>
              )}
              {(data ?? []).map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    {c.photo_url ? (
                      <img src={c.photo_url} alt="" className="w-10 h-10 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{c.name_ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.title_ru ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${c.is_published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {c.is_published ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to="/admin/clergy/$id" params={{ id: c.id }} className="p-1.5 hover:bg-secondary rounded-sm" title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(c.id, c.name_ru)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-sm" title="Удалить">
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